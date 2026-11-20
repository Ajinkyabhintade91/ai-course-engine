@@meta
{
  "moduleId": "MOD-7.3",
  "slug": "mod-7-3",
  "unitId": "UNIT-7",
  "unitTitle": "Unit 7: AI Automation Masterclass",
  "title": "APIs Explained",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "RFC 9110: HTTP Semantics", "source": "IETF", "url": "https://www.rfc-editor.org/rfc/rfc9110.html" },
    { "title": "RFC 3986: Uniform Resource Identifier (URI): Generic Syntax", "source": "IETF", "url": "https://www.rfc-editor.org/rfc/rfc3986.html" },
    { "title": "HTTP response status codes", "source": "MDN Web Docs", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" },
    { "title": "OpenAPI Specification", "source": "OpenAPI Initiative", "url": "https://spec.openapis.org/oas/" },
    { "title": "Weather Forecast API documentation", "source": "Open-Meteo", "url": "https://open-meteo.com/en/docs" },
    { "title": "Rate limits (Claude API)", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/api/rate-limits" }
  ],
  "videoLibrary": [
    {
      "id": "VID-7.3-1",
      "title": "What is a REST API?",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=lsMQRaeKNDk",
      "timingInstruction": "Watch after reading Section 1, before the detail on methods and status codes",
      "keyTakeaway": "A clear account of resources, requests, and responses, the model that every API in this unit follows."
    },
    {
      "id": "VID-7.3-2",
      "title": "A Beginner's Guide to REST APIs in Under 10 Minutes!",
      "creator": "cloudmancer",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=LzOtbUw6f_o",
      "timingInstruction": "Watch after reading Section 2 (the parts of a request), and name each part as it appears",
      "keyTakeaway": "Walks through the anatomy of a REST request and response, matching the table of parts in this chapter."
    },
    {
      "id": "VID-7.3-3",
      "title": "What is REST? A Beginner’s Guide to REST APIs and How They Work",
      "creator": "Tiny Technical Tutorials",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=hlsxmp9kc0o",
      "timingInstruction": "Watch after completing the lab, as a second explanation of methods and status codes",
      "keyTakeaway": "Reinforces the methods, endpoints, and status codes of the lab with worked examples."
    },
    {
      "id": "VID-7.3-4",
      "title": "APIs",
      "creator": "Meta",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/apis",
      "timingInstruction": "Take if you want to see how APIs are built from the other side, the server",
      "keyTakeaway": "Meta's course on designing and building APIs, which explains why the conventions in this chapter exist."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Build a URL, Read a Response, Classify Status, Know Your Methods, Follow Pages",
    "context": "A shop wants its automations to talk to other services and needs everyone to understand what an API call actually is. You will build a request URL with correctly encoded parameters, a reader for a raw HTTP response, a classifier that says what a status code means and whether to retry, a table of which methods are safe to repeat, and a client that follows a paginated API to the end.",
    "language": "python"
  }
}

@@reading
# APIs Explained

Every automation tool in this unit, and every connection between apps, rests on one idea: a program asking another program for something, in a fixed format, over the internet. That is an **API**, an application programming interface. When a workflow tool "connects to Gmail" or "adds a row to a spreadsheet", it is making API calls on your behalf.

Most of the time you will not write those calls yourself. The tools do it. But when something goes wrong, when a step fails with "401" or "429", when a field comes back empty, when an app has no ready-made connector and you have to use a generic HTTP step, you need to know what an API call is, what it is made of, and what its answer means. This chapter covers exactly that.

## 1. First-Principles Mental Model & Intuition

### Ordering at a counter

A restaurant with a counter works like this. You do not go into the kitchen. You read the menu, which lists what can be ordered and how. You place an order at the counter, in the form the menu expects. The kitchen does its work, out of sight. You get back your food, or a slip saying why not: "sold out", "we don't do that", "come back in ten minutes".

An API is the counter of a software system.

| Restaurant | API |
|---|---|
| The menu | The API documentation |
| You | The **client**: your program or automation |
| The kitchen | The **server**: the system you are asking |
| An order | A **request** |
| The food, or the slip | The **response** |
| "Sold out", "come back later" | A **status code** |

The kitchen can change completely, new staff, new ovens, without you noticing, as long as the counter and the menu stay the same. That is the purpose of an API: a stable way in that hides how the system works inside.

### One request, one response

```text
   CLIENT                                                   SERVER
     |                                                        |
     |  GET /v1/forecast?latitude=52.52&longitude=13.41       |
     |  Host: api.open-meteo.com                              |
     |  Accept: application/json                              |
     | -----------------------------------------------------> |
     |                                                        |  looks up the forecast
     |  HTTP/1.1 200 OK                                       |
     |  Content-Type: application/json                        |
     |                                                        |
     |  {"hourly": {"temperature_2m": [6.1, 5.8, 5.4]}}       |
     | <----------------------------------------------------- |
```

Every web API call has this shape. The client sends a request with a method, an address, headers, and sometimes a body. The server sends back a response with a status code, headers, and usually a body. Then the conversation is over. The next request starts fresh, which is why credentials are sent again with each one.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The parts of a request

| Part | What it is | Example |
|---|---|---|
| **Method** | What kind of action | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| **Base URL** | Where the API lives | `https://api.open-meteo.com` |
| **Path, or endpoint** | Which resource | `/v1/forecast` |
| **Query parameters** | Options, after a question mark | `?latitude=52.52&longitude=13.41` |
| **Headers** | Information about the request | `Accept: application/json`, `Authorization: Bearer TOKEN` |
| **Body** | Data sent with the request, usually JSON | `{"name": "Claw hammer", "price": 14.50}` |

A **resource** is a thing the API knows about: a product, an order, a forecast. The path names it. A common convention, called REST, uses paths for things and methods for actions: `GET /orders/1042` reads an order, `DELETE /orders/1042` deletes it.

### Addresses and encoding

The address follows the rules of RFC 3986, the standard for web addresses. It has a scheme (`https`), an authority (the host), a path, an optional query, and an optional fragment. Some characters have special meanings in an address: `?` starts the query, `&` separates parameters, `/` separates path segments, `#` starts the fragment. Any of these inside a value must be **percent-encoded**: written as a `%` followed by two hexadecimal digits for the character's code. A space becomes `%20`, and `&` becomes `%26`.

Forgetting to encode is a classic source of broken requests. A search for "sharp & strong" sent unencoded becomes a search for "sharp " plus a stray parameter called " strong". Libraries and workflow tools encode for you. When you build an address by joining strings yourself, they do not.

### Methods: safe and idempotent

HTTP methods are defined in RFC 9110, which sorts them by two properties that matter enormously for automation.

A **safe** method is meant only to read. It changes nothing on the server. An **idempotent** method has the same effect whether it is sent once or many times.

| Method | Purpose | Safe | Idempotent |
|---|---|---|---|
| `GET` | Read a resource | Yes | Yes |
| `HEAD` | Read only the headers | Yes | Yes |
| `PUT` | Replace a resource with this one | No | Yes |
| `DELETE` | Remove a resource | No | Yes |
| `POST` | Create something, or perform an action | No | No |
| `PATCH` | Change part of a resource | No | Not in general |

Why it matters: networks fail. A request is sent, the connection drops, and the client cannot tell whether the server received it. For an idempotent request, the answer is simple: send it again. Replacing order 1042's address with the same address twice is the same as doing it once. For a `POST`, sending it again may create a second order, or charge a card twice. That is why payment services offer the idempotency keys mentioned in Module 6.12, which make a repeated `POST` safe, and why Module 7.14 treats retries with care.

### Status codes

Every response starts with a three-digit status code. The first digit gives the class.

| Class | Meaning | Common codes |
|---|---|---|
| **1xx** | Informational | Rarely seen in automation |
| **2xx** | Success | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 Moved Permanently, 304 Not Modified |
| **4xx** | Client error: the request was wrong | 400, 401, 403, 404, 409, 422, 429 |
| **5xx** | Server error: the server failed | 500, 502, 503, 504 |

The individual codes you will meet most:

| Code | Name | What to do |
|---|---|---|
| 200 | OK | Read the body |
| 201 | Created | The new resource exists. Its address is often in a header |
| 204 | No Content | Success, with nothing to read |
| 301 | Moved Permanently | Update the address you use |
| 304 | Not Modified | Your cached copy is still current |
| 400 | Bad Request | The request is malformed. Fix it, do not retry |
| 401 | Unauthorized | Credentials missing or invalid. Fix them |
| 403 | Forbidden | Credentials valid, permission missing |
| 404 | Not Found | The resource does not exist, or the path is wrong |
| 409 | Conflict | The request clashes with the current state |
| 422 | Unprocessable Content | Well formed, but the data is invalid |
| 429 | Too Many Requests | You are over a rate limit. Wait and retry |
| 500 | Internal Server Error | The server failed. Retry later |
| 502, 503, 504 | Bad Gateway, Service Unavailable, Gateway Timeout | Usually temporary. Retry later |

The pattern for automation is in the last column. **Client errors are usually your fault and will fail again if repeated**, so retrying wastes requests: fix the request. The exception is 429, which says "not now" rather than "not like that". **Server errors are usually temporary**, so a retry after a pause is reasonable, for idempotent requests. Module 7.14 builds this into a retry policy.

### Headers

Headers carry information about the request or response. A few appear constantly.

| Header | Direction | Purpose |
|---|---|---|
| `Content-Type` | Both | The format of the body, such as `application/json` |
| `Accept` | Request | The format the client wants back |
| `Authorization` | Request | Credentials, such as `Bearer` followed by a token |
| `Retry-After` | Response | How long to wait before trying again, after a 429 or 503 |
| Rate-limit headers | Response | How much of the limit remains |

Header names are case-insensitive: `Content-Type` and `content-type` are the same header. Code that reads headers must treat them so.

### Rate limits

APIs limit how much each client may ask for. Anthropic's documentation for its model API is a good example of how this works in practice. Limits are set per minute for requests and for tokens, going over any of them returns a 429, and the response may include a `retry-after` header saying how many seconds to wait. The response also carries headers reporting the limit, what remains, and when it resets, so a well-behaved client can slow down before it is refused. And the documentation notes that one kind of 429, a monthly spending cap, carries no `retry-after` because retrying will not help until the cap resets.

Two habits follow for any API. Read the rate-limit headers and pace yourself. And when refused, wait for the time given, not a time you guessed.

### Pagination

An API that returns a list rarely returns all of it at once. It returns a **page**, and a way to get the next one. There are two common schemes.

| Scheme | How the next page is requested | Weakness |
|---|---|---|
| **Offset** | `?offset=100&limit=100` | Items added or removed between pages shift everything, so some are skipped or repeated |
| **Cursor** | `?cursor=abc123`, where the cursor came from the last response | None of offset's problems, but you can only go forward |

A client that reads only the first page silently processes a fraction of the data. Fetching all pages is a loop: request, add the items, read the next cursor, stop when there is none. A sensible client also caps the number of pages, so that an API that keeps returning a cursor does not keep it running forever.

### Reading documentation

API documentation follows a pattern, and many APIs publish a machine-readable description in the OpenAPI format, whose current specification is maintained by the OpenAPI Initiative. Whatever the format, look for these, in this order:

1. **Authentication**: how to get credentials and where to put them. Module 7.15 covers this.
2. **Base URL**: and whether there are separate test and live addresses.
3. **The endpoint you need**: method, path, parameters, and an example request.
4. **The response**: an example body and the meaning of each field.
5. **Errors**: which status codes, and what the body contains.
6. **Limits**: rate limits, page sizes, maximum body size.

### A first request

The weather service Open-Meteo offers a forecast API that needs no key for non-commercial use, which makes it a good first request. Its documentation gives an example:

```text
https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m
```

Pasted into a browser's address bar, that is a `GET` request. The response is JSON with hourly temperatures for Berlin. In a workflow tool, the same request goes in a generic HTTP step: method `GET`, that URL, and the response's fields become available to the next step.

### Complexity

Building a URL and parsing a response are linear in their length. Fetching a paginated list makes one request per page, so the number of requests is the total items divided by the page size, rounded up. That is usually what counts against a rate limit.

## 3. Production-Grade Implementation & Annotated Walkthrough

The lab runs without a network, so the examples work on requests and responses as text. The same functions apply to real calls.

First, building a URL.

```python
import json
from urllib.parse import quote, urlencode

def build_url(base, path, params=None):
    url = base.rstrip("/") + "/" + "/".join(quote(part, safe="") for part in path.strip("/").split("/") if part)
    if params:
        clean = {key: value for key, value in params.items() if value is not None}
        if clean:
            url += "?" + urlencode(clean, doseq=True)
    return url

print(build_url("https://api.open-meteo.com/", "/v1/forecast", {"latitude": 52.52, "longitude": 13.41, "hourly": "temperature_2m"}))
print(build_url("https://shop.example.com/api", "products/claw hammer/reviews", {"q": "sharp & strong", "page": 2, "sort": None}))
print(build_url("https://shop.example.com/api", "/products/", {"tag": ["oak", "ash"]}))
```

- **The base, path, and parameters are joined with the right separators.** Extra slashes are removed, so a base ending in "/" and a path starting with "/" do not produce "//".
- **Each path segment is percent-encoded.** "claw hammer" becomes "claw%20hammer".
- **Parameters are encoded by `urlencode`.** "sharp & strong" becomes "sharp+%26+strong": the ampersand inside the value is encoded so that it is not mistaken for a separator, and spaces in a query are written as plus signs, a convention for query strings.
- **Parameters set to `None` are left out.** An optional sort order that was not chosen does not appear as "sort=None".
- **A list becomes a repeated parameter.** Two tags become "tag=oak&tag=ash", which is how many APIs expect several values.
- **The first line reproduces Open-Meteo's own example.**

Next, reading a response.

```python
RAW = ("HTTP/1.1 429 Too Many Requests\r\nContent-Type: application/json\r\nRetry-After: 30\r\nX-Request-Id: 7f3a\r\n\r\n"
       '{"error": {"type": "rate_limit_error", "message": "Slow down"}}')

def parse_response(raw):
    head, _, body = raw.partition("\r\n\r\n")
    lines = head.split("\r\n")
    version, code, reason = (lines[0].split(" ", 2) + [""])[:3]
    headers = {}
    for line in lines[1:]:
        name, _, value = line.partition(":")
        headers[name.strip().lower()] = value.strip()
    data = json.loads(body) if body and headers.get("content-type", "").startswith("application/json") else body
    return {"status": int(code), "reason": reason, "headers": headers, "body": data}

response = parse_response(RAW)
print(response["status"], response["reason"], response["headers"]["retry-after"], response["body"]["error"]["type"])
print(parse_response("HTTP/1.1 204 No Content\r\n\r\n"))
```

- **A raw HTTP response is text in four parts.** A status line, header lines, a blank line, and the body. Lines end with a carriage return and a line feed.
- **The status line gives the version, the code, and a reason phrase.** The code is what programs act on. The phrase is for people.
- **Header names are stored in lowercase.** That makes lookups case-insensitive, as the standard requires.
- **The body is parsed as JSON only when the content type says it is JSON.** Anything else is left as text.
- **The 429 response says to wait 30 seconds.** Its body names the error type. A client should wait those 30 seconds before trying again.
- **A 204 has no body.** Code that always parses the body as JSON fails on it.

Then, classifying status codes and methods.

```python
RETRYABLE = {408, 429, 500, 502, 503, 504}
SAFE = {"GET", "HEAD", "OPTIONS", "TRACE"}
IDEMPOTENT = SAFE | {"PUT", "DELETE"}

def classify_status(code):
    if 100 <= code < 200:
        kind = "informational"
    elif 200 <= code < 300:
        kind = "success"
    elif 300 <= code < 400:
        kind = "redirect"
    elif 400 <= code < 500:
        kind = "client error"
    elif 500 <= code < 600:
        kind = "server error"
    else:
        raise ValueError("not an HTTP status code")
    return {"class": kind, "retry": code in RETRYABLE}

def method_properties(method):
    name = method.upper()
    if name not in IDEMPOTENT | {"POST", "PATCH", "CONNECT"}:
        raise ValueError("unknown method")
    return {"safe": name in SAFE, "idempotent": name in IDEMPOTENT}

for code in (201, 304, 401, 422, 429, 503):
    print(code, classify_status(code))
for method in ("get", "POST", "put", "PATCH", "delete"):
    print(method, method_properties(method))
```

- **The class comes from the first digit.** 201 is success, 304 a redirect, 401 and 422 client errors, 503 a server error.
- **Only some codes are worth retrying.** 408 and 429 mean "not now". 500, 502, 503, and 504 usually mean the server is having trouble. The rest of the 4xx codes mean the request itself is wrong, and will be wrong again.
- **429 is a client error that should be retried.** Its class says the client caused it, by asking too fast, and the remedy is to wait.
- **Methods are matched without regard to case.** "get" and "GET" are the same.
- **`PUT` and `DELETE` are idempotent and not safe.** They change things, and repeating them changes nothing further.
- **`POST` and `PATCH` are neither.** A retried `POST` may do the thing twice.
- **A request should be retried automatically only if both answers say yes.** The status code says the failure is temporary, and the method says repeating it is harmless. A `POST` that got a 503 needs an idempotency key, or a check that it did not already succeed.

Finally, following pages.

```python
PAGES = {None: {"items": [1, 2, 3], "next": "c2"}, "c2": {"items": [4, 5, 6], "next": "c3"}, "c3": {"items": [7], "next": None}}

def fetch_all(get_page, max_pages=100):
    items, cursor, pages = [], None, 0
    while True:
        page = get_page(cursor)
        pages += 1
        items += page["items"]
        cursor = page.get("next")
        if not cursor:
            return {"items": items, "pages": pages}
        if pages >= max_pages:
            raise RuntimeError("too many pages")

requested = []
def fake_api(cursor):
    requested.append(cursor)
    return PAGES[cursor]

print(fetch_all(fake_api), requested)
try:
    fetch_all(lambda cursor: {"items": [0], "next": "again"}, max_pages=5)
except RuntimeError as error:
    print(error)
```

- **`fetch_all` takes a function that fetches one page.** In real use it would make an HTTP request with the cursor as a parameter. Here a dictionary stands in for the API.
- **The first request has no cursor.** Each response says what the next cursor is.
- **The loop stops when there is no next cursor.** Three pages give all seven items.
- **The cursors requested were none, "c2", and "c3".** Each page told the client where to go next.
- **A cap on pages stops a runaway.** An API, or a bug, that always returns another cursor would otherwise loop forever. Five pages in, the function stops and says so.

**Complexity.** `build_url` and `parse_response` are linear in their text. `classify_status` and `method_properties` are constant time. `fetch_all` makes one request per page.

### Reading an API's documentation: a checklist

```text
AUTH        How do I get credentials? Header name and format?
BASE URL    Test and live addresses?
ENDPOINT    Method, path, required and optional parameters, an example request
RESPONSE    An example body, and what each field means
ERRORS      Which status codes, and what the error body contains
LIMITS      Requests and tokens per minute, page size, body size, and the rate-limit headers
PAGINATION  Offset or cursor? What signals the last page?
CHANGES     Version in the URL or a header? Deprecation notices?
```

### Diagnosing a failed call

| You see | Most likely | Check |
|---|---|---|
| 400 | Malformed request | The body is valid JSON, required fields present |
| 401 | Credentials | The key or token is present, unexpired, in the right header |
| 403 | Permission | The key's scopes or role allow this action |
| 404 | Wrong address | The path, the identifier, the base URL for this environment |
| 422 | Invalid data | The error body usually names the field |
| 429 | Too fast | `retry-after`, your request rate, the plan's limits |
| 5xx | Their side | The service's status page, and retry later |
| 200 with wrong data | Your parsing | The field names and nesting of the actual response |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Unencoded parameters.** A product name with an ampersand or a space breaks a request built by joining strings. Use the encoding functions your language or tool provides.

**Retrying everything.** A loop that retries every failure sends a broken request a hundred times. Retry only the temporary failures, and only for requests that are safe to repeat.

**Retrying a `POST` blindly.** A timed-out "create order" that actually succeeded, retried, creates two orders. Use an idempotency key where the API offers one, or check for the result before retrying.

**Ignoring `retry-after`.** A client that retries a 429 immediately is refused again, and may be throttled harder. Wait the time the server gave.

**Reading only the first page.** A sync that processes "all customers" and gets only the first hundred looks fine until someone asks why a customer is missing. Follow the cursor to the end, with a cap.

**Assuming the body is JSON.** Errors from a gateway or a proxy often come back as HTML. Check the content type before parsing.

**Case-sensitive header lookups.** Code that looks for `Retry-After` misses `retry-after`. Normalise the names.

**Status 200 with an error inside.** Some APIs return success codes with an error described in the body. Read the documentation, and check the body as well as the code.

**Secrets in URLs.** A key passed as a query parameter ends up in server logs, browser history, and screenshots. Put credentials in headers, as Module 7.15 explains.

**Testing against the live system.** A first attempt at "create order" against a real shop creates a real order. Use the test environment when the API offers one.

**Trusting the example over the reference.** Documentation examples are often older than the reference tables. When they disagree, test.

**No logging.** When a call fails at three in the morning, the request, the status, and the response body are what diagnose it. Log them, without the credentials.

## 5. Active Recall Check & Synthesis Summary

**Summary.** An API is the counter of a software system: a client sends a request, the server sends back a response, and the system's insides stay hidden. A request has a method, a base URL and path naming a resource, query parameters, headers, and often a JSON body, and any special character inside a value must be percent-encoded. Methods differ in two properties defined in RFC 9110: safe methods only read, and idempotent methods have the same effect however often they are repeated, which is what makes a retry harmless. GET, HEAD, PUT, and DELETE are idempotent, and POST and PATCH are not. Status codes are grouped by first digit into success, redirection, client errors, and server errors, and the practical rule is to fix client errors, retry server errors and 429 after a pause, and retry automatically only when the method is idempotent. Headers carry formats, credentials, and rate-limit information, and their names are case-insensitive. Lists come in pages, offset or cursor, and a client must follow them to the end with a cap. Reading documentation means finding authentication, base URL, endpoint, response, errors, and limits.

**Question 1.** An automation sends `POST /orders` to create an order, and the connection times out before any response arrives. A colleague proposes retrying automatically. What is the risk, and what are the options? Separately, a `GET /orders/1042` returns 503. Should it be retried, and how?

<details>
<summary>View Answer</summary>

The risk with the POST is that the client cannot tell whether the server received and processed the request before the connection dropped. POST is neither safe nor idempotent: it creates something. If the order was created and the request is sent again, a second, identical order is created, perhaps with a second charge and a second shipment. There are three options. The best, where the API supports it, is an idempotency key: the client generates a unique key for this order, sends it in a header with the first attempt, and sends the same key with any retry, so the server recognises the repeat and returns the original result instead of creating another order. The second is to check before retrying: query the API for an order matching this one, for example by the client's own reference number, and retry only if none exists. The third, where neither is possible, is not to retry automatically but to flag the case for a person. The GET returning 503 is different on both counts. GET is safe and idempotent, so repeating it cannot change anything, and 503 means the service is temporarily unavailable, a failure likely to clear. It should be retried, after a pause rather than immediately, honouring a Retry-After header if the response includes one, and otherwise waiting a little longer after each failed attempt up to a limit, after which the failure is reported. Module 7.14 builds that policy.

</details>

**Question 2.** Build the request for searching a shop's API for products matching "oak & ash", in the "chisels" category, second page of results, with no sort order specified, at the base `https://shop.example.com/api` and path `/v2/products/search`. Write the URL, and explain each encoding decision. What would go wrong if the URL were built by simply joining strings?

<details>
<summary>View Answer</summary>

Using the method of this chapter, the base and path are joined with a single slash, and the parameters are encoded and appended after a question mark: https://shop.example.com/api/v2/products/search?q=oak+%26+ash&category=chisels&page=2. The search text "oak & ash" contains two spaces and an ampersand. In a query string the spaces are encoded as plus signs, and the ampersand as %26, because a bare ampersand is the separator between parameters. The category and page need no encoding. The sort order was not specified, so it is left out entirely, not sent as "sort=None" or "sort=", either of which an API might treat as an invalid value. If the URL were built by joining strings, as the base and path followed by "?q=" plus "oak & ash" plus "&category=chisels", the result would contain "q=oak & ash&category=chisels" with raw spaces and a raw ampersand. Most servers would then read q as "oak " and see a second parameter named " ash" with no value, and the space characters might be rejected outright as invalid in a URL. The search would return the wrong results or fail with a 400, depending on the server, and the failure would appear only for product searches that happen to contain special characters, which makes it hard to notice in testing.

</details>

**Question 3.** A sync reads customers from an API that returns 100 per page with a cursor. It is written to make one request and process the results. The shop has 2,340 customers. How many does the sync process, how many requests should it make, and what else could go wrong in fixing it? If the API allows 60 requests per minute, how long does a full sync take at minimum?

<details>
<summary>View Answer</summary>

Making one request, the sync processes only the first page: 100 customers out of 2,340, about 4 percent. It reports success, because the request succeeded, and the other 2,240 customers are silently ignored. A full read needs 2,340 divided by 100, rounded up, which is 24 requests: 23 full pages and a last page of 40. The fix is a loop that follows the cursor from each response until a response has none. Several things can go wrong in that fix. The loop must stop when the cursor is absent and not, for example, when a page has fewer items than expected, since some APIs return short pages before the end. It should have a cap on pages, so that a bug or an API that keeps returning a cursor cannot run it forever. It must respect rate limits, reading the rate-limit headers and pausing on a 429 with its Retry-After, or a long sync will be cut off partway. If customers can be added or deleted during the sync, a cursor-based API handles this well, but an offset-based one could skip or repeat customers. And it should record where it stopped, so that a sync interrupted by an error can resume, not start again from the beginning. At 60 requests per minute, 24 requests take at least 24 seconds if sent at the full rate, so the sync takes under half a minute at minimum, plus the time each request takes to return. Pacing it below the limit, to leave room for other automations sharing the same key, is wise.

</details>

@@starter
"""
Lab: Build a URL, Read a Response, Classify Status, Know Your Methods, Follow Pages
Standard library only, no network. Complete the TODO in each step, then press "Run & Verify Step".
"""
import json
from urllib.parse import quote, urlencode

RAW = ("HTTP/1.1 429 Too Many Requests\r\nContent-Type: application/json\r\nRetry-After: 30\r\nX-Request-Id: 7f3a\r\n\r\n"
       '{"error": {"type": "rate_limit_error", "message": "Slow down"}}')

RETRYABLE = {408, 429, 500, 502, 503, 504}
SAFE = {"GET", "HEAD", "OPTIONS", "TRACE"}
IDEMPOTENT = SAFE | {"PUT", "DELETE"}

PAGES = {None: {"items": [1, 2, 3], "next": "c2"}, "c2": {"items": [4, 5, 6], "next": "c3"}, "c3": {"items": [7], "next": None}}


# ---------------------------------------------------------------- Step 1
def build_url(base, path, params=None):
    """Join base and path with exactly one "/" between them: strip trailing "/" from base,
    split the path on "/", drop empty segments, encode each with quote(segment, safe=""),
    and join them with "/". If params has any values that are not None, append "?" and
    urlencode(those params, doseq=True). Return the URL."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def parse_response(raw):
    """raw is a full HTTP response as text, lines ending "\\r\\n". Split it at the first
    "\\r\\n\\r\\n" into head and body. The first head line is "VERSION CODE REASON".
    Each further line is "Name: value"; store headers with lowercased, stripped names and
    stripped values. If the body is non-empty and the content-type header starts with
    "application/json", parse it with json.loads; otherwise keep it as text.
    Return {"status": int code, "reason": reason, "headers": headers, "body": body}."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def classify_status(code):
    """Return {"class": the class, "retry": code in RETRYABLE}, where class is
        "informational" for 100-199, "success" for 200-299, "redirect" for 300-399,
        "client error" for 400-499, "server error" for 500-599.
    Any other code raises ValueError."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def method_properties(method):
    """Compare in upper case. If the method is not in IDEMPOTENT, POST, PATCH, or CONNECT,
    raise ValueError. Return {"safe": in SAFE, "idempotent": in IDEMPOTENT}."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def fetch_all(get_page, max_pages=100):
    """get_page(cursor) returns {"items": a list, "next": cursor or None}. Start with cursor
    None. Fetch pages, collecting items, until a page has no "next" (missing, None, or empty).
    If the number of pages fetched reaches max_pages and there is still a next cursor, raise
    RuntimeError. Return {"items": all items in order, "pages": pages fetched}."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("url    :", build_url("https://shop.example.com/api", "products/claw hammer", {"q": "sharp & strong"}))
    print("parse  :", parse_response(RAW))
    print("status :", classify_status(429))
    print("method :", method_properties("post"))
    print("pages  :", fetch_all(lambda cursor: PAGES[cursor]))

@@solution
"""
Lab solution: Build a URL, Read a Response, Classify Status, Know Your Methods, Follow Pages
Standard library only, no network.
"""
import json
from urllib.parse import quote, urlencode

RAW = ("HTTP/1.1 429 Too Many Requests\r\nContent-Type: application/json\r\nRetry-After: 30\r\nX-Request-Id: 7f3a\r\n\r\n"
       '{"error": {"type": "rate_limit_error", "message": "Slow down"}}')

RETRYABLE = {408, 429, 500, 502, 503, 504}
SAFE = {"GET", "HEAD", "OPTIONS", "TRACE"}
IDEMPOTENT = SAFE | {"PUT", "DELETE"}

PAGES = {None: {"items": [1, 2, 3], "next": "c2"}, "c2": {"items": [4, 5, 6], "next": "c3"}, "c3": {"items": [7], "next": None}}


# ---------------------------------------------------------------- Step 1
def build_url(base, path, params=None):
    """Joining strings by hand breaks on the first space or ampersand in a value. Encoding
    each piece, and leaving out unset options, gives a request the server reads as meant."""
    url = base.rstrip("/") + "/" + "/".join(quote(part, safe="") for part in path.strip("/").split("/") if part)
    if params:
        clean = {key: value for key, value in params.items() if value is not None}
        if clean:
            url += "?" + urlencode(clean, doseq=True)
    return url


# ---------------------------------------------------------------- Step 2
def parse_response(raw):
    """Status line, headers, blank line, body. Header names are case-insensitive, so they are
    stored in lower case, and the body is parsed as JSON only when it says it is JSON."""
    head, _, body = raw.partition("\r\n\r\n")
    lines = head.split("\r\n")
    version, code, reason = (lines[0].split(" ", 2) + [""])[:3]
    headers = {}
    for line in lines[1:]:
        name, _, value = line.partition(":")
        headers[name.strip().lower()] = value.strip()
    data = json.loads(body) if body and headers.get("content-type", "").startswith("application/json") else body
    return {"status": int(code), "reason": reason, "headers": headers, "body": data}


# ---------------------------------------------------------------- Step 3
def classify_status(code):
    """Client errors are usually yours and will fail again, except 429, which means 'not now'.
    Server errors are usually temporary."""
    if 100 <= code < 200:
        kind = "informational"
    elif 200 <= code < 300:
        kind = "success"
    elif 300 <= code < 400:
        kind = "redirect"
    elif 400 <= code < 500:
        kind = "client error"
    elif 500 <= code < 600:
        kind = "server error"
    else:
        raise ValueError("not an HTTP status code")
    return {"class": kind, "retry": code in RETRYABLE}


# ---------------------------------------------------------------- Step 4
def method_properties(method):
    """An idempotent request can be repeated after a lost response. A POST cannot, without an
    idempotency key or a check that the first attempt failed."""
    name = method.upper()
    if name not in IDEMPOTENT | {"POST", "PATCH", "CONNECT"}:
        raise ValueError("unknown method")
    return {"safe": name in SAFE, "idempotent": name in IDEMPOTENT}


# ---------------------------------------------------------------- Step 5
def fetch_all(get_page, max_pages=100):
    """Reading only the first page silently processes a fraction of the data. The cap stops
    an API, or a bug, that always returns another cursor."""
    items, cursor, pages = [], None, 0
    while True:
        page = get_page(cursor)
        pages += 1
        items += page["items"]
        cursor = page.get("next")
        if not cursor:
            return {"items": items, "pages": pages}
        if pages >= max_pages:
            raise RuntimeError("too many pages")


if __name__ == "__main__":
    print(build_url("https://api.open-meteo.com/", "/v1/forecast", {"latitude": 52.52, "longitude": 13.41, "hourly": "temperature_2m"}))
    print(build_url("https://shop.example.com/api", "products/claw hammer/reviews", {"q": "sharp & strong", "page": 2, "sort": None}))
    print(build_url("https://shop.example.com/api", "/products/", {"tag": ["oak", "ash"]}))
    print(build_url("https://shop.example.com/api", "/v2/products/search", {"q": "oak & ash", "category": "chisels", "page": 2, "sort": None}))

    response = parse_response(RAW)
    print(response["status"], response["reason"], response["headers"]["retry-after"], response["body"]["error"]["type"])
    print(parse_response("HTTP/1.1 204 No Content\r\n\r\n"))

    for code in (201, 304, 401, 422, 429, 503):
        print(code, classify_status(code))
    for method in ("get", "POST", "put", "PATCH", "delete"):
        print(method, method_properties(method))

    requested = []

    def fake_api(cursor):
        requested.append(cursor)
        return PAGES[cursor]

    print(fetch_all(fake_api), requested)
    try:
        fetch_all(lambda cursor: {"items": [0], "next": "again"}, max_pages=5)
    except RuntimeError as error:
        print(error)
    print(-(-2340 // 100))

@@step
{
  "stepNumber": 1,
  "title": "Build a request URL",
  "instruction": "Implement build_url(base, path, params). Remove any trailing slashes from the base. Split the path on slashes, drop empty segments, encode each remaining segment with quote(segment, safe=\"\"), and join them with slashes. Join the base and the path with a single slash. If params is given and has any values that are not None, append a question mark and urlencode of those parameters with doseq=True, which encodes special characters and turns a list into a repeated parameter. Return the URL. Build Open-Meteo's example URL and a product search containing a space and an ampersand. This is the encoding described in Section 2. [MOD-7.3]",
  "hintConceptual": "An address on an envelope has fixed places for the street, the town, and the postcode. If a name contains a character that means something on the envelope, it must be written in a way that cannot be mistaken for a separator.",
  "hintSyntax": "url = base.rstrip(\"/\") + \"/\" + \"/\".join(quote(part, safe=\"\") for part in path.strip(\"/\").split(\"/\") if part)\nif params:\n    clean = {key: value for key, value in params.items() if value is not None}\n    if clean:\n        url += \"?\" + urlencode(clean, doseq=True)\nreturn url"
}
@@assert
assert build_url("https://api.open-meteo.com/", "/v1/forecast", {"latitude": 52.52, "longitude": 13.41, "hourly": "temperature_2m"}) == "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m", f"Open-Meteo's example, got {build_url('https://api.open-meteo.com/', '/v1/forecast', {'latitude': 52.52, 'longitude': 13.41, 'hourly': 'temperature_2m'})}"
assert build_url("https://shop.example.com/api", "products/claw hammer/reviews", {"q": "sharp & strong", "page": 2, "sort": None}) == "https://shop.example.com/api/products/claw%20hammer/reviews?q=sharp+%26+strong&page=2", "Spaces and ampersands are encoded, and None parameters are left out"
assert build_url("https://shop.example.com/api", "/products/", {"tag": ["oak", "ash"]}) == "https://shop.example.com/api/products?tag=oak&tag=ash", "A list becomes a repeated parameter, and extra slashes are removed"
assert build_url("https://shop.example.com/api", "/v2/products/search", {"q": "oak & ash", "category": "chisels", "page": 2, "sort": None}) == "https://shop.example.com/api/v2/products/search?q=oak+%26+ash&category=chisels&page=2", "The URL from the second recall question"
assert build_url("https://x.test///", "a//b", None) == "https://x.test/a/b" and build_url("https://x.test", "", {}) == "https://x.test/", "No params, no question mark, and empty segments are dropped"
assert build_url("https://x.test", "files/a/b", {"only": None}) == "https://x.test/files/a/b", "If every parameter is None there is no query"
assert build_url("https://x.test", "item/50%off#1", None) == "https://x.test/item/50%25off%231", "Percent and hash signs inside a segment are encoded too"
print("Step 1 passed: 'sharp & strong' is sent as sharp+%26+strong, and the space in 'claw hammer' as %20.")

@@step
{
  "stepNumber": 2,
  "title": "Read a raw response",
  "instruction": "Implement parse_response(raw). Split the text at the first blank line, which is the sequence of a carriage return, a line feed, a carriage return, and a line feed, into the head and the body. Split the head into lines at each carriage return and line feed. The first line has the version, the numeric code, and a reason phrase, separated by single spaces, and the reason may contain spaces. Each further line is a header: split it at the first colon, and store it under the name stripped and lowercased, with its value stripped. If the body is not empty and the content-type header starts with 'application/json', parse it with json.loads; otherwise keep it as text. Return a dict with 'status' as an integer, 'reason', 'headers', and 'body'. Parse RAW. This is the structure of a response from Section 1. [MOD-7.3]",
  "hintConceptual": "A letter has a heading with the sender's details, a blank line, and then the message. Read the heading line by line, and read the message the way its heading says it is written.",
  "hintSyntax": "head, _, body = raw.partition(\"\\r\\n\\r\\n\")\nlines = head.split(\"\\r\\n\")\nversion, code, reason = (lines[0].split(\" \", 2) + [\"\"])[:3]\nheaders = {}\nfor line in lines[1:]:\n    name, _, value = line.partition(\":\")\n    headers[name.strip().lower()] = value.strip()\ndata = json.loads(body) if body and headers.get(\"content-type\", \"\").startswith(\"application/json\") else body\nreturn {\"status\": int(code), \"reason\": reason, \"headers\": headers, \"body\": data}"
}
@@assert
_parsed = parse_response(RAW)
assert _parsed == {"status": 429, "reason": "Too Many Requests", "headers": {"content-type": "application/json", "retry-after": "30", "x-request-id": "7f3a"}, "body": {"error": {"type": "rate_limit_error", "message": "Slow down"}}}, f"The 429 response, parsed, got {_parsed}"
assert isinstance(_parsed["status"], int) and _parsed["headers"]["retry-after"] == "30", "The status is a number, and Retry-After is found under its lowercase name"
assert parse_response("HTTP/1.1 204 No Content\r\n\r\n") == {"status": 204, "reason": "No Content", "headers": {}, "body": ""}, "A 204 has no headers and no body here"
assert parse_response("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nhello") == {"status": 200, "reason": "OK", "headers": {"content-type": "text/plain"}, "body": "hello"}, "A non-JSON body is kept as text"
assert parse_response("HTTP/1.1 502 Bad Gateway\r\ncontent-type: text/html\r\n\r\n<html>Bad gateway</html>")["body"] == "<html>Bad gateway</html>", "An HTML error page from a gateway is not parsed as JSON"
assert parse_response("HTTP/1.1 200 OK\r\nX-Note: a: b\r\n\r\n")["headers"] == {"x-note": "a: b"}, "Only the first colon separates a header's name from its value"
assert parse_response('HTTP/1.1 201 Created\r\nContent-Type: application/json; charset=utf-8\r\n\r\n{"id": 1043}')["body"] == {"id": 1043}, "A content type with parameters still counts as JSON"
print("Step 2 passed: the 429 says to wait 30 seconds, and its body names the error.")

@@step
{
  "stepNumber": 3,
  "title": "Classify a status code",
  "instruction": "Implement classify_status(code). The class is 'informational' for 100 to 199, 'success' for 200 to 299, 'redirect' for 300 to 399, 'client error' for 400 to 499, and 'server error' for 500 to 599. Any other number raises ValueError. Return a dict with 'class' and 'retry', which is True if the code is in RETRYABLE. Classify 201, 304, 401, 422, 429, and 503. This is the status code table from Section 2, and its practical rule: fix client errors, retry server errors and 429 after a pause. [MOD-7.3]",
  "hintConceptual": "A reply slip from the counter either says 'here you are', 'go elsewhere', 'your order was wrong', or 'our kitchen has a problem'. Only the last, and 'come back in a minute', are worth trying again unchanged.",
  "hintSyntax": "if 100 <= code < 200:\n    kind = \"informational\"\nelif 200 <= code < 300:\n    kind = \"success\"\nelif 300 <= code < 400:\n    kind = \"redirect\"\nelif 400 <= code < 500:\n    kind = \"client error\"\nelif 500 <= code < 600:\n    kind = \"server error\"\nelse:\n    raise ValueError(\"not an HTTP status code\")\nreturn {\"class\": kind, \"retry\": code in RETRYABLE}"
}
@@assert
assert classify_status(429) == {"class": "client error", "retry": True}, f"429 is a client error that should be retried after a pause, got {classify_status(429)}"
assert classify_status(503) == {"class": "server error", "retry": True} and classify_status(500)["retry"] is True, "Server errors are usually temporary"
assert classify_status(401) == {"class": "client error", "retry": False} and classify_status(422)["retry"] is False and classify_status(404)["retry"] is False, "Most client errors will fail again"
assert classify_status(201) == {"class": "success", "retry": False} and classify_status(204)["class"] == "success", "Success codes"
assert classify_status(304) == {"class": "redirect", "retry": False} and classify_status(101)["class"] == "informational", "Redirects and informational codes"
assert classify_status(408)["retry"] is True and classify_status(501)["retry"] is False, "A request timeout is retryable, and 'not implemented' is not"
def _refuses(code):
    try:
        classify_status(code)
    except ValueError:
        return True
    return False
assert _refuses(99) and _refuses(600) and _refuses(0) and not _refuses(599), "Numbers outside 100 to 599 are not status codes"
print("Step 3 passed: 429 and 503 are worth retrying, 401 and 422 are not.")

@@step
{
  "stepNumber": 4,
  "title": "Know which methods are safe to repeat",
  "instruction": "Implement method_properties(method). Compare in upper case. If the method is not one of the idempotent methods, POST, PATCH, or CONNECT, raise ValueError. Return a dict with 'safe', True if the method is in SAFE, and 'idempotent', True if it is in IDEMPOTENT. Check GET, POST, PUT, PATCH, and DELETE. This is the table of methods from Section 2, from RFC 9110: a request is safe to retry automatically only if its method is idempotent. [MOD-7.3]",
  "hintConceptual": "Asking twice what the time is changes nothing. Setting the clock to noon twice leaves it at noon. Adding an hour to the clock twice is a different matter.",
  "hintSyntax": "name = method.upper()\nif name not in IDEMPOTENT | {\"POST\", \"PATCH\", \"CONNECT\"}:\n    raise ValueError(\"unknown method\")\nreturn {\"safe\": name in SAFE, \"idempotent\": name in IDEMPOTENT}"
}
@@assert
assert method_properties("get") == {"safe": True, "idempotent": True}, f"GET is safe and idempotent, got {method_properties('get')}"
assert method_properties("POST") == {"safe": False, "idempotent": False}, "POST is neither"
assert method_properties("put") == {"safe": False, "idempotent": True} and method_properties("Delete") == {"safe": False, "idempotent": True}, "PUT and DELETE change things and can be repeated"
assert method_properties("PATCH") == {"safe": False, "idempotent": False}, "PATCH is not idempotent in general"
assert method_properties("HEAD") == {"safe": True, "idempotent": True} and method_properties("options")["safe"] is True, "HEAD and OPTIONS only read"
def _refuses(method):
    try:
        method_properties(method)
    except ValueError:
        return True
    return False
assert _refuses("FETCH") and _refuses("") and not _refuses("connect"), "Unknown methods raise ValueError"
print("Step 4 passed: GET, PUT, and DELETE can be repeated after a lost response, and POST cannot.")

@@step
{
  "stepNumber": 5,
  "title": "Follow every page",
  "instruction": "Implement fetch_all(get_page, max_pages). Start with no cursor, an empty list of items, and a page count of 0. Repeatedly call get_page with the current cursor, add one to the page count, add the page's items to the list, and read the page's 'next' value as the new cursor. If there is no next cursor, because it is missing, None, or empty, return a dict with 'items' and 'pages'. Otherwise, if the page count has reached max_pages, raise RuntimeError. Fetch all three pages of PAGES, then try an API that always returns another cursor. This is cursor pagination from Section 2. [MOD-7.3]",
  "hintConceptual": "Reading a long article split over several pages, each page ends with 'continued on page so-and-so'. Keep turning until a page does not say that, but give up if you have turned a hundred pages and it still does.",
  "hintSyntax": "items, cursor, pages = [], None, 0\nwhile True:\n    page = get_page(cursor)\n    pages += 1\n    items += page[\"items\"]\n    cursor = page.get(\"next\")\n    if not cursor:\n        return {\"items\": items, \"pages\": pages}\n    if pages >= max_pages:\n        raise RuntimeError(\"too many pages\")"
}
@@assert
_requested = []
def _fake(cursor):
    _requested.append(cursor)
    return PAGES[cursor]
assert fetch_all(_fake) == {"items": [1, 2, 3, 4, 5, 6, 7], "pages": 3}, "Three pages give all seven items"
assert _requested == [None, "c2", "c3"], "The first request has no cursor, and each later one uses the cursor from the page before"
assert fetch_all(lambda cursor: {"items": ["only"]}) == {"items": ["only"], "pages": 1} and fetch_all(lambda cursor: {"items": [], "next": ""}) == {"items": [], "pages": 1}, "A missing or empty next ends the loop"
def _runaway():
    try:
        fetch_all(lambda cursor: {"items": [0], "next": "again"}, max_pages=5)
    except RuntimeError:
        return True
    return False
assert _runaway(), "An API that always returns another cursor is stopped at the cap"
_count = []
def _limited(cursor):
    _count.append(cursor)
    page = len(_count)
    return {"items": [page], "next": None if page == 3 else f"p{page + 1}"}
assert fetch_all(_limited, max_pages=3) == {"items": [1, 2, 3], "pages": 3}, "Reaching the cap on the last page is not an error"
print("Step 5 passed: all three pages are read, and a runaway API is stopped.")
