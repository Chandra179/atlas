# My Golang Journey

Determine when to use descriptive or short variable names; it really depends on how long the function process is. A long function with short variable names will lose context as we navigate the logic in that function. 

A function name should also have a clear intent, like `GetProductDetail`. We don't really care how complex the logic is in that function, as long as the intent is GETTING data, not modifying it.
Use abstraction when  needed for example:

```go
func GetNews() (NewsResp) {
  // call reddit news
  // return NewesResp{}
}
```

Later if we need to change news API we will have to refactor the code. This might complicate the function logic as we add new code to handle a different news API. The better approach is using interface

```go
type NewsReq struct {}
type NewsResp struct {}

type NewsAPI interface {
  func GetNews(req NewsReq)(NewsResp, error) 
}
```

Here we defined struct like `NewsReq` and `NewsResp`. The purpose of this is to act as a translation layer, because every news API might have a different API response, so we map it to our data format. So if we want to change news API we can just change the concrete implementation

```go
// news/dependencies.go
func NewNews(n NewsAPI) {
}

// external/news.go
type RedditNews struct {}
type YahooNews struct {}

func (r *RedditNews) GetNews(req NewsReq) (NewsResp, error) {}
func (r *YahooNews) GetNews(req NewsReq) (NewsResp, error) {}

// server.go
rn := &RedditNews{}
yn := &YahooNews{}

news := news.NewNews(rn)
// news := news.NewNews(yn)
```

A little tip that might be helpful if the codebase is large is to put a type assertion in the concrete implementation. This way, while we are still coding, we can know immediately if there is an error (meaning the function is not properly implementing the abstraction).

```go
// external/news.go
package external

import "yourproject/news"

type RedditNews struct {}
type YahooNews struct {}

// Interface compliance checks (Compile-time type assertions)
var _ news.NewsAPI = (*RedditNews)(nil)
var _ news.NewsAPI = (*YahooNews)(nil)

func (r *RedditNews) GetNews(req news.NewsReq) (news.NewsResp, error) {
    return news.NewsResp{}, nil
}

func (y *YahooNews) GetNews(req news.NewsReq) (news.NewsResp, error) {
    return news.NewsResp{}, nil
}
```

Variable data types is matter. Most of the time, we create API contracts for the frontend (WEB). JavaScript has a maximum safe integer length, and its default data type for numbers is `Number` (which uses 64-bit floating-point math) $9,007,199,254,740,991$ (16 digits).

So, returning number bigger than that like **Big Integer** will cause the number to be automatically rounded and corrupted by JavaScript. The solution to this problem is to convert that big integer into a **String** before sending it in the API response.

Another thing related to numbers is floating/decimal numbers. A lot of companies I worked at before used float data types for money, which results in number inaccuracy. For example, if you add small amounts together using floats, the math will eventually break:

```go
package main

import "fmt"

func main() {
    var price float64 = 0.1
    var total float64 = 0.0

    // Add 0.1 ten times
    for i := 0; i < 10; i++ {
        total += price
    }

    // You expect 1.0, but float inaccuracy gives you: 0.9999999999999999
    fmt.Println("Total:", total) 
}
```

There are ways to handle this properly, like using the Stripe approach. With this method, we use the smallest unit of the currency, like "cents," and use an integer data type. Because integers don't have decimals, there will be absolutely no inaccuracy with decimal points. Ref: https://docs.stripe.com/api/charges/object

| **Actual Amount** | **Value Stored in Database / Code (as Integer)** |
| --- | --- |
| $1.00 | `100` (cents) |
| $10.50 | `1050` (cents) |
| $99.99 | `9999` (cents) |

Next is the return values of the fields in the API. Go has default zero values. For example, an integer defaults to `0`, a float to `0.0`, and a string to `""`.

In finance, `0` might actually mean something. You have to be very careful when deciding how to handle this, because an admin fee of `0` means something entirely different from a missing or unconfigured admin fee.

```go
type FeeResponse struct {
    // If AdminFee is 0, omitempty completely deletes it from the JSON output!
    AdminFee int64 `json:"admin_fee,omitempty"` 
}
```

Also, check carefully when adding `omitempty` to a struct field. Unlike native data types (like integers or strings), an empty nested struct will **not** be excluded from the JSON payload. Instead, it will return an empty JSON object `{}` filled with its own default zero values.

Go's standard `encoding/json` package determines if a field is "empty" based on a strict list: `false`, `0`, a `nil` pointer, or an array/slice/map/string with a length of 0. An initialized struct value (like `Address{}`) does not fit any of those categories, so Go considers it "not empty" and serializes it as an empty object `{}`.

When it comes to logging, if we use third-party tools like CloudWatch or Datadog, their pricing models are by data ingestion per gigabyte (GB) and the total number of indexed log events. Make sure to compact your data. For example, requests formatted in JSON should be compacted into a single line rather than spread across multiple lines.

```go
// BAD: Wasteful multi-line logging (treated as 5+ log events)
{
  "request_id": "req-123",
  "status": 200,
  "path": "/v1/news",
  "latency_ms": 45
}

// GOOD: Compacted single-line structured logging (treated as 1 log event)
{"request_id":"req-123","status":200,"path":"/v1/news","latency_ms":45}
```

**Idempotency** is often used in use cases involving **retries and accidental data duplication**  whether it is implemented by data hashing, unique ID generation on multiple requests, or other techniques. Its to guarantee that performing the exact same request multiple times will have the exact same result as performing it once

Handling the request lifetime by using `context.WithTimeout` in Go. While Go or your web framework might have a global default timeout, we often have strict constraints on how long a specific internal process should be running, for example

```go
func GetUserAccount(db *sql.DB, userID int) (*sql.Rows, error) {
	// Create a context that automatically cancels after 2 seconds
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Time(time.Second*2))
	defer cancel() // Free up resources once the function returns

	// Pass the context directly into the library function.
	// If the database takes longer than 2 seconds, the query cancels automatically.
	query := "SELECT id, balance FROM accounts WHERE id = ?"
	return db.QueryContext(ctx, query, userID)
}
```

Determining when to use a distributed cache versus local in-memory storage depends heavily on your specific use case.

For my company blog project, I chose to use **in-memory storage** because I already know the total size of the data being handled. For example, the main page uses less than 2 MB of data. Instead of setting up a separate Redis instance, I used Go’s native `//go:embed` directive to load the blog content directly into memory once at compile time.

```go
//go:embed blog_data.json
var blogContent []byte

func main() {
	// The 2MB of data is baked right into the binary and ready instantly
	fmt.Println("Blog data size:", len(blogContent)) 
}
```

While this approach makes the initial application startup a bit slower, it results in much faster runtime performance. Because the data lives inside the application process itself, we eliminate the extra **network hop** required to fetch data from an external database or cache.

I applied a similar approach to some of our external APIs, like our weather data endpoint. I built an in-memory cache but added strict guardrails like a maximum memory limit and a Time-To-Live (TTL) expiration mechanism to keep memory leaks in check.

Why skip a dedicated cache like Redis entirely here? It comes down to **cost and realism**. A company blog isn't going to get millions of visitors overnight. Setting up, paying for, and maintaining a separate infrastructure piece like Redis for a low-traffic service is over-engineering. Local in-memory storage is faster, cheaper, and perfectly sufficient.

Choosing the right message broker whether it's Kafka, RabbitMQ, NATS, or AWS SNS/SQS depends entirely on your specific use case, scale requirements, and team expertise. While Kafka is fantastic for real-time data streaming and event replayability due to its append-only log architecture, you have to look at your team. 

If your company or team only has deep knowledge of AWS SNS/SQS, it often makes more sense to choose that tool to achieve the same business functionality. The main concern is service cost, but setting up and maintaining a complex message broker architecture yourself if not done right can quickly equal or exceed the infrastructure and maintenance costs of a managed third-party serverless solution.

If your system doesn't require the full, heavy feature set of a traditional message broker, you can opt for a highly performant, lightweight option like **NATS**. It provides incredibly fast pub/sub messaging without the operational footprint of bigger tools.

And again it depends on your specific use case and how it scales:
- **AWS SNS/SQS:** Best for cloud-native, zero-maintenance, standard asynchronous queuing where you want to pay only for what you use.
- **Kafka:** Best for high-throughput log streaming, event sourcing, and scenarios where multiple consumers need to replay old historical data.
- **RabbitMQ:** Best when you require complex routing logic (like wildcards, topic matching, and exchange bindings) before messages hit a queue.
- **NATS:** Best for ultra-low latency, lightweight cloud-native microservices where performance is critical and operational simplicity is preferred.

From my perspective, infrastructure is the foundation for long-term and sustainable software. It is something that must be built right first. An application developer's program depends heavily on how the infrastructure is set up, including things like system availability, data durability, and stability. If a company doesn’t have proper observability, like distributed tracing to correlate logs between different microservices, or if they have painfully slow deployment times, it makes the software unsustainable for the future.

At the same time, application developers are responsible for keeping the system healthy. Our role is to ensure the code follows best practices. For example, even if the infrastructure is stable, bad code without proper timeouts can still crash the system.

How deep should you dive into a problem? When do you decide you are overthinking or underthinking?

I believe there is a specific level where you must stop because diving deeper is simply not worth the time, effort, or cost. A classic example of overthinking is designing an idempotency cache:

1. You start with an **in-memory cache** for idempotency, but realize it won't survive an app crash.
2. So, you decide to use **Redis**. But what if Redis crashes?
3. You decide to add a **Redis Replica**. But what if data volume grows too big?
4. You plan for **Redis Sharding**. But what if an entire AWS region goes down?
5. You start designing **Geo-Sharding** and a full **Disaster Recovery plan**.

While this covers every single disaster scenario, it is complete overkill to do all at once.

| **Approach**      | **What it looks like**                                                                                                                                   | **The Risk**                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Underthinking** | Throwing a quick fix together without considering basic failures (e.g., using a local map for idempotency in a multi-instance, autoscaling environment). | The app breaks immediately under standard production conditions.                                                                     |
| **Overthinking**  | Designing for "Six Nines" ($99.9999\%$) availability for a service that has low traffic or low business criticality.                                     | You waste months building complex infrastructure, delay the product launch, and create a system that is too complicated to maintain. |
You need to stop at a reasonable level that satisfies your **current business constraints and immediate next phase of growth**. The best approach is to build the simplest version that safely handles standard production requirements, and then **gradually improve it step-by-step** if you actually encounter issues related to that scale. Don't solve problems you don't have yet. Solve the problems you have today, design the system so it is flexible enough to change tomorrow