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

|**Actual Amount**|**Value Stored in Database / Code (as Integer)**|
|---|---|
|$1.00|`100` (cents)|
|$10.50|`1050` (cents)|
|$99.99|`9999` (cents)|
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