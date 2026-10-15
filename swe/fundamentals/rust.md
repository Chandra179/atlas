String : growable and for string creation
str: text that already exists it cannot create and manage a new growable string buffer

scalar types: integers, floating-point numbers, booleans and characters
compound types: tuples, arrays and slices

Result<T, E>	Success or error	Ok(10)
Option<T>	Optional value	Some(10)

- Structs and methods using impl.
- Enums and pattern matching with match.
- Generic types and functions.
- Traits and trait bounds.
- Display, Debug, and custom error types.
- Derive

Rust is statically typed

Ownership & Borrowed
Mutable & Immutable
Lifetime annotations and lifetime elision.

? in rust  for   error   propagation for Result<T, E> and Option<T>
```rust
// Equivalent to:
// let foo = match my_function() {
//     Ok(v) => v,
//     Err(e) => return Err(e.into()),
// };
let foo = my_function()?;   

fn first_word(s: &str) -> Option<&str> {
    let w = s.split_whitespace().next()?;  // None → return early
    Some(w)
}

//  or  for debug  formatti
println!("{:?}") 
```

- Vec<T> for growable collections.
- HashMap<K, V> for key-value lookups.
- Slices and collection borrowing.
- Iterators: iter, iter_mut, into_iter.
- Iterator adapters: map, filter, collect.
- Closures.
- Modules, visibility, and use.
- Cargo packages, dependencies, tests, and project structure.

Database in rust

## Async
- Threads versus asynchronous tasks.
- Futures and .await.
- Tokio's runtime and task scheduling.
- Shared state and synchronization.
- Send and Sync.
- Arc, Mutex, and RwLock.
- Connection pooling and backpressure.
- Structured logging and distributed tracing.
- Configuration, secrets, graceful shutdown, and deployment.
- Arc<Mutex<T>> with Arc<RwLock<T>>

A scalar type represents a single value
- Integers
- Floating-point numbers
- Booleans
- Characters

Integer Types
Type	Size	Range
i8	8 bits	-128 to 127
i16	16 bits	\(-2^{15}\) to \(2^{15}-1\)
i32	32 bits	\(-2^{31}\) to \(2^{31}-1\)
i64	64 bits	\(-2^{63}\) to \(2^{63}-1\)
i128	128 bits	\(-2^{127}\) to \(2^{127}-1\)
isize	Platform-sized	Signed pointer-sized integer
u8	8 bits	0 to 255
u16	16 bits	0 to \(2^{16}-1\)
u32	32 bits	0 to \(2^{32}-1\)
u64	64 bits	0 to \(2^{64}-1\)
u128	128 bits	0 to \(2^{128}-1\)
usize	Platform-sized	Unsigned pointer-sized integer

how much  ime consuming  is for this operation conversion:
```rust
let z = i64::from(x) + y;
let y = x.wrapping_add(1);
```

character
let c = 'A';       // char: one Unicode scalar value
let s = "ABC";     // &str: a string slice
let owned = String::from("ABC"); // String: owned string

compound  types
tuple
```rust
let user: (u64, &str, bool) = (101, "Alice", true);
let (id, name, active) = user;
```

Arrays have fixed length. They cannot grow or shrink after creation.  If you need a dynamically sized collection, use Vec<T>
```rust
let scores: [i32; 4] = [80, 90, 75, 95];

let mut scores = vec![10, 20, 30]
scores.push(40);
```

slices   and  their behavior
```rust
let numbers = [10, 20, 30, 40, 50];
let middle: &[i32] = &numbers[1..4];

println!("{middle:?}"); // [20, 30, 40]
```

A slice does not own or resize the underlying sequence. A reference to a slice typically stores a pointer and a length.

String slicing uses byte offsets
```rust

let text: &str = "Hello, Rust!";
let part = &text[0..5];

println!("{part}"); // Hello
```

type  inference
Variable	Inferred type	Reason
age	i32	Default integer type
price	f64	Default floating-point type
active	bool	Boolean literal
name	&str	String literal

Copy    for   scalar  type
```rust
let a: i32 = 10;
let b = a;

println!("{a}"); // 10
println!("{b}"); // 10
```

Move: owned values can transfer ownership
```rust
let a = String::from("Hello");
let b = a;

// println!("{a}"); // Compile error
println!("{b}");
```
When a is assigned to b, ownership moves to b.

If you actually want a separate owned copy, use clone():
```rust
let a = String::from("Hello");
let b = a.clone();

println!("{a}");
println!("{b}");
```

Borrowing. A reference lets you access an existing value without moving ownership.
```rust
fn print_number(n: &i32) {
    println!("{n}");
}

fn main() {
    let number = 42;

    print_number(&number);

    println!("{number}"); // Still valid
}
```

Mutability is separate from ownership
A variable declared with let is immutable by default
```rust
let x = 10;

// x = 20; // Compile error
```

But mut does not change the type or grant permission to mutate data through an immutable reference.
```rust
let mut name = String::from("Alice");
name.push_str(" Smith"); // Allowed
```

Tokio
Axium
