---
title: "Errors"
aliases: []
tags: [golang]
created: "2026-07-05"
---

# Errors

Errors are values. Go has no exceptions. This guide covers the three error patterns (sentinels, custom types, wrapping) and the standard library tools for building and inspecting them.

## The `error` Interface

Every error satisfies this interface:

```go
type error interface {
	Error() string
}
```

Create one with `errors.New`:

```go
err := errors.New("something went wrong")
fmt.Println(err) // something went wrong
```

Or with `fmt.Errorf` when you need formatting:

```go
err := fmt.Errorf("user %d not found", id)
```

These are the simplest errors — just a string. They carry no structure you can inspect programmatically.

## Sentinel Errors

A cache lookup has three possible outcomes: value found, key missing, something broke.

How does the caller distinguish "not found" from "database down"? A sentinel error — a package-level value callers compare against:

```go
package cache

var ErrMiss = errors.New("key not in cache")

func Get(key string) (Value, error) {
	v, ok := m[key]
	if !ok {
		return Value{}, ErrMiss
	}
	return v, nil
}
```

```go
v, err := cache.Get("foo")
if errors.Is(err, cache.ErrMiss) {
	v, err = db.Get("foo") // fall through to source of truth
}
if err != nil {
	return err // real problem
}
```

Standard library sentinels: `io.EOF`, `sql.ErrNoRows`, `context.Canceled`, `net.ErrClosed`.

## Custom Error Types

When you need structured data, define a type that implements `error`:

```go
type NotFoundError struct {
	ID  int
	Err error
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("item %d not found: %v", e.ID, e.Err)
}

func GetItem(id int) (*Item, error) {
	return nil, &NotFoundError{ID: id, Err: db.ErrNotFound}
}
```

Callers extract it with a type assertion:

```go
item, err := GetItem(42)
var nfe *NotFoundError
if errors.As(err, &nfe) {
	fmt.Println("missing ID:", nfe.ID)
}
```

Custom types carry fields the caller can inspect. Common uses: HTTP status codes, validation errors, retryable flags.

## Error Wrapping

`fmt.Errorf` with `%w` preserves the original error in a new one:

```go
// BUG: %v discards the original — callers can't inspect it
if err != nil {
	return fmt.Errorf("decompress %s: %v", name, err)
}

// Fix ✅: %w wraps it — callers can use Is/As
if err != nil {
	return fmt.Errorf("decompress %s: %w", name, err)
}
```

## How Unwrapping Works

`errors.Is` and `errors.As` traverse the chain from outermost to innermost, unwrapping one layer at a time:

```go
// 3-layer chain: handler failed → query failed → database connection lost
err1 := ErrDatabaseDown
err2 := fmt.Errorf("query failed: %w", &QueryError{SQL: "SELECT *"})
err3 := fmt.Errorf("handler failed: %w", err2)

// Step-by-step traversal of errors.Is(err3, ErrDatabaseDown):
//   Check Layer 3 → no match → Unwrap → get err2
//   Check Layer 2 → no match → Unwrap → get err1
//   Check Layer 1 → match!     → return true
if errors.Is(err3, ErrDatabaseDown) {
	fmt.Println("database is down")
}

// errors.As does the same — finds the first matching type in the chain
var qErr *QueryError
if errors.As(err3, &qErr) {
	fmt.Println("failed SQL:", qErr.SQL)
}
```

You never write the unwrapping loop yourself. If Go reaches the bottom without a match, `Is` returns false and `As` returns nil.

## `errors.Is`

`errors.Is` walks the error chain and compares each error against a target with ==
Use it instead of direct equality:

```go
// Fragile: only works with the exact error
if err == db.ErrNotFound { ... }

// Robust: works even if err wraps the sentinel
if errors.Is(err, db.ErrNotFound) { ... }
```

A custom error type can define an `Is` method to control matching:

```go
type AuthError struct {
	User string
}

func (e *AuthError) Is(target error) bool {
	return target == ErrPermission // match any permission check
}
```

## `errors.As`

`errors.As` walks the chain and finds the first error that matches a target type:

```go
// BUG: type assertion only checks the outermost error
nfe, ok := err.(*NotFoundError)

// Fix ✅: As walks the whole chain
var nfe *NotFoundError
if errors.As(err, &nfe) {
	fmt.Println("missing ID:", nfe.ID)
}
```

**Go 1.26+** has `errors.AsType[T]` — the generic form avoids the pointer-to-pointer idiom:

```go
// Go 1.26+
if nfe, ok := errors.AsType[*NotFoundError](err); ok {
	fmt.Println("missing ID:", nfe.ID)
}
```

Custom error types can define an `As` method to masquerade as a different type:

```go
func (e *AuthError) As(target any) bool {
	pe, ok := target.(**os.PathError)
	if !ok {
		return false
	}
	*pe = &os.PathError{Op: "auth", Path: e.User, Err: e}
	return true
}
```

## `errors.Join` (Go 1.20+)

Combine multiple independent errors into one:

```go
func Validate(input string) error {
	var errs []error
	if len(input) < 3 {
		errs = append(errs, errors.New("too short"))
	}
	if input[0] != '/' {
		errs = append(errs, errors.New("must start with /"))
	}
	return errors.Join(errs...)
}

err := Validate("ab")
fmt.Println(err)
// too short
// must start with /
```

`Join` returns nil if every argument is nil. The returned error implements `Unwrap() []error`. `Is` and `As` search all branches in depth-first order.

## Whether to Wrap

Not every error should be wrapped. The choice depends on whether the inner error is part of your API:

| Wrap (`%w`) | Don't wrap (`%v`) |
|---|---|
| Inner error is part of the contract | Inner error is an implementation detail |
| Callers may use `Is`/`As` on it | Callers only see the message |
| You commit to returning that error | You can change the underlying cause later |

```go
// Wrap: callers should know it's a permission error
func OpenFile(path string) error {
	f, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("open %s: %w", path, err)
	}
	// ...
}

// Don't wrap: database is an implementation detail
func LookupUser(id int) (*User, error) {
	err := db.Query("SELECT ...", id)
	if err != nil {
		return fmt.Errorf("lookup user %d: %v", id, err)
	}
}
```

When in doubt: wrap only if you want callers to program against the inner error. A well-designed package documents which sentinels or types it returns, and wraps them consistently.

## Errors Are Values

Because errors are values, you can build abstractions around them. The `errWriter` pattern from Rob Pike's talk eliminates repetitive `if err != nil` checks:

```go
// BUG: repetitive error handling obscures the write logic
_, err = fd.Write(p0)
if err != nil {
	return err
}
_, err = fd.Write(p1)
if err != nil {
	return err
}
_, err = fd.Write(p2)
if err != nil {
	return err
}

// Fix ✅: errWriter defers all checks to one place
type errWriter struct {
	w   io.Writer
	err error
}

func (ew *errWriter) write(buf []byte) {
	if ew.err != nil {
		return
	}
	_, ew.err = ew.w.Write(buf)
}

ew := &errWriter{w: fd}
ew.write(p0)
ew.write(p1)
ew.write(p2)
if ew.err != nil {
	return ew.err
}
```

This pattern appears in the standard library — `bufio.Writer` works the same way. The writes are easy to read; the error check happens exactly once at the end.
