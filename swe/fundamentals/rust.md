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
