package api

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"github.com/koala/atlas/api-gateway/internal/config"
	"github.com/koala/atlas/api-gateway/internal/module/greeting"
	"github.com/koala/atlas/api-gateway/internal/ratelimit"
)

// Server runs the two HTTP listeners of the gateway process:
//
//   - the check listener, which Traefik's ForwardAuth middleware calls for
//     every request (the rate-limit check at the edge), and
//   - the gateway listener, which serves the modular monolith's protected
//     module endpoints after the check passes.
type Server struct {
	check   *http.Server
	gateway *http.Server
	logger  *slog.Logger
}

// NewServer wires the routing for both listeners.
func NewServer(cfg config.Config, limiter *ratelimit.Limiter, logger *slog.Logger) *Server {
	auth := NewAuthHandler(limiter, logger)
	greet := greeting.New()

	checkMux := http.NewServeMux()
	checkMux.Handle("/auth", auth)
	checkMux.Handle("/healthz", healthHandler())

	gatewayMux := http.NewServeMux()
	gatewayMux.Handle("/api/v1/greet", recoverMiddleware(greet, logger))
	gatewayMux.Handle("/healthz", healthHandler())

	return &Server{
		check:   newHTTPServer(cfg.CheckAddr, checkMux),
		gateway: newHTTPServer(cfg.GatewayAddr, gatewayMux),
		logger:  logger,
	}
}

// Start begins serving on both listeners. It returns once both are serving.
func (s *Server) Start() error {
	errCh := make(chan error, 2)
	go func() { errCh <- s.check.ListenAndServe() }()
	go func() { errCh <- s.gateway.ListenAndServe() }()

	// Treat early failure of either listener as fatal.
	select {
	case err := <-errCh:
		return err
	case <-time.After(50 * time.Millisecond):
		return nil
	}
}

// Shutdown gracefully stops both listeners.
func (s *Server) Shutdown(ctx context.Context) error {
	var firstErr error
	if err := s.gateway.Shutdown(ctx); err != nil && firstErr == nil {
		firstErr = err
	}
	if err := s.check.Shutdown(ctx); err != nil && firstErr == nil {
		firstErr = err
	}
	return firstErr
}

func newHTTPServer(addr string, h http.Handler) *http.Server {
	return &http.Server{
		Addr:              addr,
		Handler:           h,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
}

func healthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}
}

// recoverMiddleware logs panics from modules and returns 500 instead of
// crashing the whole monolith process.
func recoverMiddleware(next http.Handler, logger *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				logger.Error("panic in module handler", "panic", rec, "path", r.URL.Path)
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}
