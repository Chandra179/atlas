# My Experience With API

Use HTTP status codes correctly (like `400` for bad requests). For further handling on the client side, we can return a business error code—for example, `"error_code: 23"`. Keep it informative while not displaying sensitive information to the user.

Clients can read `404 Not Found` or read directly from the response body (like `cats: []`). It all depends on each company's standards, as there are no global rules.

Carefully design how the fields behave in the API response. For example:

- `"admin_fee: 0"` could mean something specific in finance.

- Multi-platform clients (mobile, web) handling existing logic might have different mechanisms. While Client A treats `"jelly: {}"` as an unhandled empty object, another client treats it as valid object. We in the backend need to communicate clearly to the client how we handle it

We need to consider the worst-case scenario if we depend on an API, whether communicating between internal company services or external services. We cannot be sure that their service is consistent or free of production bugs. By using schema validation, we define what the structure is so that only API responses matching our definition will be parsed, allowing us to validate data early (such as checking whether they return `null` or empty data).

Each API may originate from the same base URL, but their response times and authentication can be different. Other things like headers can vary too, so we need to make them independent in terms of timeouts, headers, cookies, and related settings.
