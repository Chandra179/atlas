---
title: "Interfaces"
aliases: []
tags: [golang]
created: "2026-07-05"
---
# Interfaces

An interface in Go is a contract. If a type has the right methods, it satisfies the contract. No `implements` keyword. No explicit declaration. The compiler checks the method set — not the type name.

## Implicit Satisfaction

```go
type Speaker interface {
	Speak() string
}

type Dog struct{}

func (d Dog) Speak() string { return "Woof!" }

type Cat struct{}

func (c Cat) Speak() string { return "Meow" }

func main() {
	var s Speaker
	s = Dog{}
	fmt.Println(s.Speak()) // Woof!
	s = Cat{}
	fmt.Println(s.Speak()) // Meow
}
```

`Dog` and `Cat` never mention `Speaker`. Both have a `Speak() string` method with the right signature, so both satisfy it. The compiler deduces the relationship from the method set alone.

If you want to prove a type satisfies an interface at compile time — not rely on tests or runtime panics — use the `var _` idiom:

```go
type Dependencies struct{ ... }

var _ Provider = (*Dependencies)(nil)
```

This assigns a nil pointer to `Provider`. If `*Dependencies` ever stops satisfying the interface, the code won't compile. The `_` discards the value; the compiler eliminates the line. Zero runtime cost. Place it next to the struct definition as documentation.

## Type Assertion

An interface value hides the concrete type inside it. You can call the interface's methods, but nothing else. If you need the concrete type back — to call a method the interface doesn't include, or to use it as `any` — use a type assertion:

```go
var s Speaker = Dog{}

d, ok := s.(Dog) // two-value form: ok == false on failure
if ok {
	fmt.Println(d.Speak()) // Woof!
}

d := s.(Dog) // single-value form: panics if wrong type
```

The two-value form is safe. The single-value form panics if you guess wrong.

## Type Switch

Dispatch on the concrete type inside an interface:

```go
func describe(s Speaker) {
	switch v := s.(type) {
	case Dog:
		fmt.Println("Dog says", v.Speak())
	case Cat:
		fmt.Println("Cat says", v.Speak())
	default:
		fmt.Println("Unknown speaker")
	}
}
```

Inside each `case`, `v` has the matched type — no manual assertion needed.

```go
func inspect(v any) {
	switch v.(type) {
	case string:
		fmt.Println("string")
	case int:
		fmt.Println("int")
	case bool:
		fmt.Println("bool")
	case nil:
		fmt.Println("nil")
	default:
		fmt.Println("unknown")
	}
}
```

## Empty Interface

`interface{}` (renamed `any` in Go 1.18) has zero methods. Every type satisfies it:

```go
var v any
v = 42
v = "hello"
v = Dog{}
```

Functions like `fmt.Println` and `json.Marshal` accept `any` for this reason:

```go
func Print(v any) {
	fmt.Printf("%v\n", v)
}
```

The cost: `any` gives no compile-time safety. Prefer generics when the relationship between types matters:

```go
// Runtime panic if caller passes the wrong type
func Concat(a, b any) string {
	return a.(string) + b.(string)
}

// Compiler catches mismatched types
func Concat[T ~string](a, b T) string {
	return string(a) + string(b)
}
```

## Structural Typing

A type satisfies an interface based on its method set — not its declared name:

```go
type Writer interface {
	Write([]byte) (int, error)
}

// os.File, bytes.Buffer, gzip.Writer — none import "Writer"
// They all have a Write method, so they all satisfy it.
```

This is compile-time duck typing. Contrast with nominal typing, where a type must explicitly `implements`:

| Nominal (Java) | Structural (Go) |
|---|---|
| `class Dog implements Speaker` | `func (Dog) Speak() string` |
| Type declares intent | Type needs the methods |
| Coupled to interface definition | Decoupled across packages |
| Must import the interface | No import needed |

Define interfaces in your package; any type with the right method satisfies them:

```go
// your package
type Storer interface {
	Get(id string) ([]byte, error)
}

// test — never imports your package's Storer
type mockStorer struct{}

func (m mockStorer) Get(id string) ([]byte, error) {
	return []byte("data"), nil
}
```

`mockStorer` just has the right method. That is enough.

## Why Interfaces Are Not Classes

Go interfaces look like abstract base classes. They are not:

| Feature | Class (Java/C++) | Go Interface |
|---|---|---|
| Data | Fields and state | No fields — method signatures only |
| Construction | Constructor (`new`, `init`) | No constructor |
| Inheritance | `extends` / `implements` | No inheritance — embed instead |
| Overloading | Multiple methods same name | Each name must be unique |
| Dispatch | Virtual by default | Only through interface value |
| Satisfaction | Explicit (`implements`) | Implicit (structural) |

**No fields.** An interface describes what you can *do*, not what you *have*. State belongs to concrete types.

**No inheritance.** Go composes:

```go
type Reader interface { Read([]byte) (int, error) }
type Closer interface { Close() error }

type ReadCloser interface {
	Reader
	Closer
}
```

**No overloading.** Each method name appears once.

**Small interfaces.** The standard library's best interfaces are tiny:

```go
type Reader interface { Read([]byte) (int, error) }
type Writer interface { Write([]byte) (int, error) }
type Stringer interface { String() string }
```

An interface with ten methods is probably wrong. Prefer many small interfaces over one big one.
