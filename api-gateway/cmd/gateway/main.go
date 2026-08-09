// Command gateway runs the API gateway: a modular monolith Go process that
// exposes (1) a rate-limit check service consumed by Traefik's ForwardAuth
// middleware and (2) the protected module endpoints behind the gateway.
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/koala/atlas/api-gateway/internal/api"
	"github.com/koala/atlas/api-gateway/internal/config"
	"github.com/koala/atlas/api-gateway/internal/ratelimit"
)

func main() {
	if err := run(); err != nil {
		slog.Error("gateway exited with error", "error", err)
		os.Exit(1)
	}
}

func run() error {
	logger := slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: slog.LevelInfo}))
	cfg := config.Load()

	// Pick the store: Redis for distributed deployments, in-memory otherwise so
	// the process runs standalone for local development.
	var store ratelimit.Store
	if cfg.RedisAddr != "" && cfg.RedisAddr != "none" {
		rs, err := ratelimit.NewRedisStore(cfg.RedisAddr)
		if err != nil {
			return err
		}
		defer func() { _ = rs.Close() }()
		store = rs
		logger.Info("using Redis store", "addr", cfg.RedisAddr)
	} else {
		store = ratelimit.NewMemoryStore()
		logger.Info("using in-memory store (single instance only)")
	}

	limiter := ratelimit.NewLimiter(store, ratelimit.WithFailOpen(cfg.FailOpen))
	srv := api.NewServer(cfg, limiter, logger)

	if err := srv.Start(); err != nil {
		return err
	}
	logger.Info("gateway listening",
		"check", cfg.CheckAddr, "gateway", cfg.GatewayAddr)

	// Graceful shutdown on SIGINT/SIGTERM.
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	logger.Info("gateway stopped")
	return nil
}
