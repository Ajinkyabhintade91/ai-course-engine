@@meta
{
  "moduleId": "MOD-7.4",
  "slug": "mod-7-4",
  "unitId": "UNIT-7",
  "unitTitle": "Unit 7: AI Automation Masterclass",
  "title": "Webhooks Explained",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Receive Stripe events in your webhook endpoint", "source": "Stripe Docs", "url": "https://docs.stripe.com/webhooks" },
    { "title": "Validating webhook deliveries", "source": "GitHub Docs", "url": "https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries" },
    { "title": "Best practices for using webhooks", "source": "GitHub Docs", "url": "https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks" },
    { "title": "Subscribe to webhooks over HTTPS", "source": "Shopify Developer Docs", "url": "https://shopify.dev/docs/apps/build/webhooks/subscribe/https" },
    { "title": "Standard Webhooks specification", "source": "Standard Webhooks", "url": "https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md" },
    { "title": "hmac: Keyed-Hashing for Message Authentication", "source": "Python Docs", "url": "https://docs.python.org/3/library/hmac.html" }
  ],
  "videoLibrary": [
    {
      "id": "VID-7.4-1",
      "title": "What is a Webhook? Webhooks for Beginners",
      "creator": "Mehul Mohan",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=mrkQ5iLb4DM",
      "timingInstruction": "Watch after reading Section 1, before the detail on signatures and retries",
      "keyTakeaway": "A short explanation of the push model: the other system calls your address when something happens, instead of you asking."
    },
    {
      "id": "VID-7.4-2",
      "title": "APIs vs Webhooks",
      "creator": "Rokt mParticle",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=K7Fl9EJ92cg",
      "timingInstruction": "Watch after reading Section 2 (push compared with polling)",
      "keyTakeaway": "Contrasts asking for data with being told about it, the trade-off this chapter quantifies with the cost of polling."
    },
    {
      "id": "VID-7.4-3",
      "title": "Webhooks for Beginners - Full Course",
      "creator": "freeCodeCamp.org",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=41NOoEz3Tzc",
      "timingInstruction": "Work through the sections on receiving and testing webhooks after completing the lab",
      "keyTakeaway": "A full course that builds and tests webhook receivers, including the verification and testing practices covered here."
    },
    {
      "id": "VID-7.4-4",
      "title": "API Basics | Web Hook vs other Rest API calls",
      "creator": "IT Cloud Quest",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=WUs1hErMDao",
      "timingInstruction": "Watch as a recap of how a webhook relates to the API calls of Module 7.3",
      "keyTakeaway": "Places webhooks alongside ordinary API calls: a webhook is an HTTP request, sent by the other side."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Sign, Verify, Deduplicate, Cost the Polling, and Order the Events",
    "context": "A shop's payment provider sends a webhook whenever an order is paid, and the shop's automation must act on each payment exactly once and never on a forged one. You will build the signature a provider computes, the verification a receiver performs, a handler that ignores repeated deliveries, a comparison with polling, and a resolver for events that arrive out of order.",
    "language": "python"
  }
}

@@reading
# Webhooks Explained

Module 7.3 described a client asking a server for something. A webhook turns that around: the server tells the client, the moment something happens. When an order is paid, a payment provider sends an HTTP request to an address you gave it, carrying the details of the payment. Your automation receives it and acts.

Most automation triggers that feel instant, "when a form is submitted", "when a payment succeeds", "when a message arrives", are webhooks underneath. They are efficient and fast. They also arrive late, twice, out of order, and sometimes from someone pretending to be the provider. This chapter covers how webhooks work and the four habits that make receiving them safe: verify the signature, answer quickly, deduplicate, and never assume the order.

## 1. First-Principles Mental Model & Intuition

### Calling the shop, or being called

Waiting for a parcel, you can phone the courier every hour to ask whether it has been sent. Most calls tell you nothing. When it is sent, you learn on the next call, up to an hour late. That is **polling**.

Or you can give the courier your number and ask them to text you when it is sent. You hear at once, and nobody makes useless calls. That is a **webhook**.

The text has its own problems. It might come twice. A text saying "delivered" might arrive before the one saying "sent". And anyone who knows your number can send a text that claims to be from the courier. Receiving webhooks well means dealing with all three.

### The delivery

```text
   PROVIDER (e.g. payment service)                    YOUR ENDPOINT
        |                                                   |
        |  order paid                                       |
        |                                                   |
        |  POST https://hooks.yourshop.example/payments     |
        |  Content-Type: application/json                   |
        |  Signature: t=1763300000,v1=4e86533d12af(64 hex) |
        |  {"id": "evt_1001", "type": "order.paid"}         |
        | ------------------------------------------------> |
        |                                                   |  1. verify the signature
        |                                                   |  2. record the event id
        |                       HTTP 200                    |  3. reply at once
        | <------------------------------------------------ |  4. do the work afterwards
        |                                                   |
        |  if no 2xx reply: retry later, for hours or days  |
```

The four numbered steps on the right are the whole craft of receiving webhooks. The rest of the chapter explains each.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Push and pull

| | Polling (pull) | Webhook (push) |
|---|---|---|
| Who starts the request | You | The provider |
| How soon you learn | Up to one polling interval late | Within seconds |
| Wasted requests | Most of them, when little changes | None |
| What you need | Nothing but credentials | A public address that can receive requests |
| If you are down | You catch up on the next poll | The provider retries, then may give up |
| Ordering | You read the current state | Events can arrive out of order |

The cost of polling is easy to underestimate. Polling every $p$ seconds for $D$ days makes

$$
\frac{86{,}400 \times D}{p}
$$

requests. Polling every minute for 30 days is 43,200 requests. If only 20 things change a day, 600 of those requests find something new and 42,600 find nothing: about 99 percent wasted. And the average delay in noticing a change is half the interval, $p/2$: 30 seconds when polling every minute, seven and a half minutes when polling every fifteen.

Workflow tools that cannot receive webhooks for an app fall back on polling, which is why their triggers often run every few minutes, and why the interval depends on the plan you pay for. Module 7.6 covers trigger types in detail.

Polling has one real advantage: it reads the current state. A webhook tells you that something happened. If you missed one, you may never know.

### Anatomy of a delivery

| Part | Content | Example |
|---|---|---|
| **URL** | Your endpoint, registered with the provider | `https://hooks.yourshop.example/payments` |
| **Method** | Almost always `POST` | |
| **Payload** | JSON describing the event | Event ID, type, time, and the object it concerns |
| **Event ID** | Unique per event, the same on every retry | `evt_1001` |
| **Signature** | Proof that the provider sent it | A header containing an HMAC |
| **Timestamp** | When it was signed | Part of the signature header, or a header of its own |

Real providers name these differently. Stripe puts the timestamp and signature together in a `Stripe-Signature` header. GitHub sends `X-Hub-Signature-256` and a unique `X-GitHub-Delivery`. Shopify sends `X-Shopify-Hmac-SHA256` and a `X-Shopify-Webhook-Id` for deduplication. An open specification called Standard Webhooks, adopted by some providers, defines `webhook-id`, `webhook-timestamp`, and `webhook-signature` headers. The ideas are the same everywhere.

### Signatures

Your endpoint is a public address. Anyone can send it a request that says "order A1234 is paid". The defence is a **signature**: a code computed from the request's content and a secret that only you and the provider know.

The standard construction is an **HMAC**, a hash-based message authentication code, usually with SHA-256. The provider computes

$$
\text{signature} = \text{HMAC}_{\text{SHA256}}(\text{secret},\; \text{message})
$$

and sends it with the request. You compute the same thing from the body you received and your copy of the secret, and compare. Without the secret, nobody can produce a signature that matches, and any change to the body, even a single space, produces a different signature.

What exactly is signed varies. Stripe signs the timestamp, a full stop, and the raw body. GitHub signs the raw body. Standard Webhooks signs the event ID, the timestamp, and the body, joined by full stops. The documentation of each provider says which. GitHub's documentation gives a test case that is useful for checking your code: with the secret "It's a Secret to Everybody" and the body "Hello, World!", the HMAC-SHA256 should be a hexadecimal string beginning `757107ea`.

Three rules make verification actually work.

**Use the raw body.** The signature is over the exact bytes sent. Parsing the JSON and writing it back out, even without changing anything, can change spacing or key order and break the match. Stripe's documentation states this requirement explicitly.

**Compare in constant time.** An ordinary string comparison stops at the first differing character, so the time it takes leaks how much of a guess was right. Python's `hmac.compare_digest` takes the same time however much matches. GitHub's documentation says never to use a plain `==`.

**Check the timestamp.** A signature proves the request came from the provider once. An attacker who captured a real request could send it again later, a **replay**. Including the timestamp in what is signed, and rejecting requests older than a few minutes, closes that gap. Stripe's libraries use a default tolerance of five minutes.

### Answer quickly

Providers wait only briefly for your reply. GitHub asks for a response within 10 seconds. Shopify's connection times out after one second and the whole delivery after five. If your endpoint is still working when the time runs out, the provider counts it as a failure and tries again, and your automation may process the same event twice, or more.

The pattern every provider recommends: verify, record that the event arrived, reply with a 2xx status at once, and do the real work afterwards, from a queue. A webhook handler that calls a language model before replying will time out.

A redirect is also a failure. Stripe treats a 3xx response as not delivered.

### Retries and duplicates

When a delivery fails, providers try again, usually with growing gaps. Stripe retries live events for up to three days with exponential backoff. Shopify retries eight times over four hours, and deletes a subscription after eight consecutive failures. The Standard Webhooks specification recommends retrying over days with exponential backoff and random jitter.

A schedule of $n$ attempts starting with a wait of $b$ and doubling each time, capped at $c$, waits

$$
w_{k} = \min(c,\; b \times 2^{k}) \quad \text{for } k = 0, 1, \dots, n - 1
$$

Starting at one minute and doubling eight times covers a little over four hours. The point for a receiver is that **a failing endpoint is not the end of an event**: it will come back, possibly long after.

Retries are one source of duplicates. There are others: a delivery that succeeded but whose reply was lost, and a provider's own internal redundancy. Stripe's documentation says plainly that an endpoint may receive the same event more than once. The defence is the event ID. Record every ID you process, and if one arrives again, reply 200 and do nothing. This is idempotency, the idea from Modules 6.12 and 7.3, applied on the receiving side.

### Order is not guaranteed

Events can arrive in a different order from the one in which they happened. A "shipped" event can arrive before the "paid" event for the same order, if the first delivery of "paid" failed and was retried. Stripe's documentation says not to rely on event order or on timestamps for ordering.

Three approaches work.

| Approach | How |
|---|---|
| **Use a version or sequence number** | Keep only the event with the highest version for each object |
| **Treat the event as a notification** | On any event, fetch the object's current state from the API |
| **Make every action safe in any order** | Design so that "shipped then paid" leads to the same result as "paid then shipped" |

The second is the most robust and costs an API call per event. It also handles the case of a missed event: the fetch returns the truth regardless.

### Testing and securing an endpoint

| Practice | Why |
|---|---|
| Use the provider's test mode and test events | Exercise the handler without real payments |
| Use a tunnelling or request-inspection tool in development | See exactly what is sent, headers and body |
| Replay a captured delivery | Check that a duplicate is ignored |
| Send a request with a wrong signature | Check that it is rejected |
| Keep the secret in a credential store | Module 7.15 |
| Use HTTPS only | So the body cannot be read or altered on the way |
| Monitor failed deliveries | Most providers show them in a dashboard |
| Reconcile periodically | Poll once a day to catch anything the webhooks missed |

The last row combines both models: webhooks for speed, a slow poll as a safety net.

### Complexity

Verifying a signature is linear in the size of the body. Checking for a duplicate is a set lookup, constant time on average. The deduplication record grows with every event and needs a retention period, since providers stop retrying after a few days.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, signing and verifying.

```python
import hashlib
import hmac
import json

SECRET = b"whsec_test_8f2a"

def sign(secret, timestamp, body):
    return hmac.new(secret, f"{timestamp}.".encode() + body, hashlib.sha256).hexdigest()

def verify(secret, header, body, now, tolerance=300):
    parts = dict(item.split("=", 1) for item in header.split(",") if "=" in item)
    if "t" not in parts or "v1" not in parts:
        return "malformed"
    timestamp = int(parts["t"])
    if abs(now - timestamp) > tolerance:
        return "too-old"
    return "ok" if hmac.compare_digest(sign(secret, timestamp, body), parts["v1"]) else "bad-signature"

BODY = json.dumps({"id": "evt_1001", "type": "order.paid", "data": {"order": "A1234", "total": 42.5}}, separators=(",", ":")).encode()
SENT_AT = 1763300000
HEADER = f"t={SENT_AT},v1={sign(SECRET, SENT_AT, BODY)}"
print(HEADER[:24])
print(verify(SECRET, HEADER, BODY, now=SENT_AT + 10))
print(verify(SECRET, HEADER, BODY + b" ", now=SENT_AT + 10), verify(b"guessed", HEADER, BODY, now=SENT_AT + 10))
print(verify(SECRET, HEADER, BODY, now=SENT_AT + 301), verify(SECRET, "v1=abc", BODY, now=SENT_AT))
print(verify(SECRET, HEADER, json.dumps(json.loads(BODY), indent=2).encode(), now=SENT_AT + 10))
print(hmac.new(b"It's a Secret to Everybody", b"Hello, World!", hashlib.sha256).hexdigest()[:8])
```

- **`sign` follows Stripe's scheme.** The timestamp, a full stop, and the raw body bytes, run through HMAC-SHA256 with the shared secret, as hexadecimal.
- **The header carries both.** "t=" with the time and "v1=" with the signature, separated by a comma.
- **A genuine delivery, ten seconds old, verifies.** The receiver recomputes the signature from what it received and finds it identical.
- **A body changed by a single space fails.** So does a signature checked with the wrong secret. An attacker without the secret cannot make either pass.
- **A delivery more than five minutes old is rejected as too old.** That is the defence against replaying a captured request.
- **A header missing its parts is reported as malformed.** It is rejected without computing anything.
- **Re-serialising the body breaks the signature.** The same JSON, written out with indentation, is different bytes. This is why a receiver must verify the raw body before parsing it.
- **The last line checks the code against GitHub's published test case.** The result begins "757107ea", as the documentation says it should.
- **`hmac.compare_digest` compares in constant time.** An ordinary `==` would leak, through timing, how many leading characters of a forged signature were right.

Next, processing each event once.

```python
def process_once(event, seen, actions):
    if event["id"] in seen:
        return "duplicate"
    seen.add(event["id"])
    actions.append((event["type"], event["data"]["order"]))
    return "processed"

seen, actions = set(), []
deliveries = [{"id": "evt_1", "type": "order.paid", "data": {"order": "A1"}},
              {"id": "evt_2", "type": "order.paid", "data": {"order": "A2"}},
              {"id": "evt_1", "type": "order.paid", "data": {"order": "A1"}}]
print([process_once(event, seen, actions) for event in deliveries])
print(actions)
```

- **The handler records every event ID it processes.** A set gives a fast lookup.
- **The third delivery repeats the first.** It is a retry, or a duplicate from the provider. The handler recognises the ID and does nothing.
- **Order A1 is fulfilled once.** Without the check, it would have been shipped twice.
- **The reply to a duplicate should still be 200.** Replying with an error would make the provider retry again.
- **The record must outlive the retry window.** In a real system the set is a database table, and entries older than the provider's longest retry period, a few days, can be removed.

Then, the cost of polling instead.

```python
def polling_cost(interval_seconds, days=30, changes_per_day=20):
    requests = int(days * 86400 / interval_seconds)
    useful = min(requests, days * changes_per_day)
    return {"requests": requests, "empty": requests - useful, "average_delay_s": interval_seconds / 2}

def retry_schedule(base_seconds, attempts, cap_seconds):
    waits = [min(cap_seconds, base_seconds * 2 ** attempt) for attempt in range(attempts)]
    return {"waits": waits, "total_hours": round(sum(waits) / 3600, 2)}

print(polling_cost(60), polling_cost(900))
print(retry_schedule(60, 8, 6 * 3600))
```

- **Polling every minute for 30 days makes 43,200 requests.** With 20 changes a day, 42,600 of them find nothing new, and a change is noticed 30 seconds late on average.
- **Polling every 15 minutes makes 2,880 requests.** Far fewer, and changes are noticed seven and a half minutes late on average. Polling trades requests against delay.
- **A webhook makes 600 deliveries, one per change, and each arrives at once.**
- **`retry_schedule` doubles the wait each time, up to a cap.** Eight attempts starting at one minute wait 1, 2, 4, 8, 16, 32, 64, and 128 minutes: a little over four hours in all. An endpoint that is down for an afternoon still receives its events.

Finally, events out of order.

```python
def latest_state(events):
    latest = {}
    for event in events:
        key = event["object"]
        if key not in latest or event["version"] > latest[key]["version"]:
            latest[key] = event
    return {key: value["status"] for key, value in sorted(latest.items())}

arrivals = [{"object": "A1", "version": 2, "status": "shipped"},
            {"object": "A1", "version": 1, "status": "paid"},
            {"object": "A2", "version": 1, "status": "paid"}]
print(latest_state(arrivals))
```

- **Each event carries the object it concerns and a version that increases with each change.**
- **For each object, only the highest version is kept.** An older event arriving late is ignored.
- **Order A1's "shipped" arrived before its "paid".** Processed naively in arrival order, the order would end up marked "paid", going backwards. With versions, it stays "shipped".
- **If a provider gives no version, fetch the current state instead.** On any event for A1, ask the API for A1 as it is now, which is the most robust approach in Section 2's table.

**Complexity.** Signing and verifying are linear in the body. Deduplication and the latest-state map are constant time per event on average.

### A webhook receiver, step by step

```text
1. Read the raw body and the headers. Do not parse yet.
2. Verify the signature over the raw body, in constant time. If it fails: 401, stop.
3. Check the timestamp is within tolerance. If not: reject, stop.
4. Parse the JSON. Read the event ID.
5. If the ID has been seen: reply 200, stop.
6. Record the ID. Put the event on a queue.
7. Reply 200, within the provider's timeout.
8. Separately, a worker takes events from the queue and does the work.
9. Daily: reconcile with the provider's API, to catch any event that never arrived.
```

### Diagnosing webhook problems

| Symptom | Likely cause | Fix |
|---|---|---|
| Every signature fails | Body parsed before verifying, or wrong secret | Verify the raw bytes, check which secret the endpoint uses |
| Signatures fail in test only | Test and live modes have different secrets | Use the secret for the mode |
| Actions happen twice | No deduplication, or a slow reply caused a retry | Record event IDs, reply before doing the work |
| Status goes backwards | Events processed in arrival order | Use versions, or fetch current state |
| Provider disabled the endpoint | Repeated failures | Fix the endpoint, then re-enable and redeliver |
| Some events never arrive | Endpoint was down past the retry window | Reconcile by polling |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**No signature check.** An endpoint that trusts every request will one day act on a forged "payment succeeded". Verify every delivery, and reject what fails.

**Parsing before verifying.** Frameworks and workflow tools often parse JSON automatically, and the raw body is gone. Find the setting that preserves the raw body, or the signature will never match.

**Comparing with `==`.** It works, and it leaks timing. Use the constant-time comparison your language provides.

**Doing the work in the request.** A handler that calls three APIs and a language model before replying will time out, and the provider will retry, and the work will run again. Reply first.

**No deduplication.** Duplicates are documented behaviour, not an edge case. Record event IDs.

**Using the wrong ID.** Some providers send an ID per delivery attempt and another per event. Deduplicate on the one that stays the same across retries, which the documentation names.

**Trusting arrival order.** "Refunded" arriving before "paid" leaves an order paid. Use versions or fetch current state.

**Assuming webhooks never miss.** An endpoint down for longer than the retry window loses events for good. Reconcile periodically.

**Secrets in the code.** A webhook secret committed to a repository is public. Keep it in a credential store and rotate it if it leaks.

**Test secrets in production.** Test and live modes usually sign with different secrets. An endpoint configured with the test secret rejects every real delivery.

**Ignoring the dashboard.** Providers show failed deliveries and why. Checking it weekly catches a broken endpoint before customers notice.

**A webhook that triggers itself.** An automation that updates a record, which sends a webhook, which runs the automation, loops forever. Guard against acting on your own changes.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A webhook is the push counterpart of an API call: the provider sends an HTTP request to your endpoint the moment something happens, which is faster and far cheaper than polling every $p$ seconds, $86{,}400D/p$ requests over $D$ days, most of them empty, with an average delay of $p/2$. A delivery carries a JSON payload with an event ID, a signature, and a timestamp. The signature is an HMAC-SHA256 of the signed content under a shared secret, and a receiver must verify it over the raw body, in constant time, and reject timestamps outside a few minutes to stop replays. The receiver replies with a 2xx within the provider's short timeout and does the work afterwards from a queue. Providers retry failed deliveries for hours or days with exponential backoff, and may deliver an event more than once, so the receiver records event IDs and ignores repeats. Events can arrive out of order, so keep only the highest version per object, or fetch the current state, and reconcile with a periodic poll to catch anything missed.

**Question 1.** A shop polls a payments API every 2 minutes to learn about new payments, and receives about 50 payments a day. Over 30 days, how many requests does it make, how many find a new payment at most, and what is the average delay in learning of a payment? With a webhook instead, how many deliveries would there be, and what new problems must the shop handle?

<details>
<summary>View Answer</summary>

Polling every 120 seconds, the shop makes 86,400 divided by 120, which is 720 requests a day, and 21,600 over 30 days. There are 50 payments a day, 1,500 in the month, so at most 1,500 requests find something new, and in fact fewer, since several payments may arrive between two polls and be found together. At least 20,100 requests, about 93 percent, find nothing. A payment is noticed on the next poll after it happens, on average half an interval later, so about one minute late. With a webhook there would be one delivery per payment, about 1,500 in the month, each arriving within seconds. Three new problems come with that. The shop must expose a public endpoint and verify each delivery's signature over the raw body, with a timestamp check, because anyone can send a request to that address claiming a payment succeeded. It must handle duplicates, recording each event's ID and ignoring repeats, because the provider may deliver the same event more than once, for example after a slow reply. And it must handle events that arrive late or out of order, and accept that if the endpoint is down longer than the provider's retry window some events may never arrive, which is why a daily reconciliation poll is still worth keeping alongside the webhook.

</details>

**Question 2.** A developer's webhook handler verifies signatures, but every real delivery fails verification while the provider's dashboard shows the requests were sent. The handler uses a workflow tool that parses the incoming JSON and then re-serialises it to compute the signature. Explain why verification fails, and how to fix it. What is a second likely cause?

<details>
<summary>View Answer</summary>

The signature is computed by the provider over the exact bytes of the body it sent, possibly with a timestamp prefixed. When the workflow tool parses the JSON into an object and then writes it back out to compute the check, the result is almost never the same bytes: spacing changes, the order of keys may change, numbers may be written differently, and Unicode characters may be escaped or not. The HMAC of different bytes is a completely different value, so the comparison fails every time, even though the content means the same thing. This chapter's example showed it: the same payload written with indentation fails verification. The fix is to verify against the raw body exactly as received, before any parsing. Most frameworks and workflow tools have an option to keep the raw request body, sometimes called raw body or binary data, and the verification must use that. Only after verification succeeds should the body be parsed. A second likely cause is the wrong secret. Providers commonly use different signing secrets for test and live modes, and for different endpoints, so a handler configured with the test-mode secret will reject every live delivery, and the reverse. The secret in the handler's credentials should be checked against the one shown for this endpoint and mode in the provider's dashboard. A third possibility is a timestamp check failing because the receiving server's clock is badly wrong, which would show up as deliveries rejected as too old.

</details>

**Question 3.** A webhook handler receives "order.paid" and then calls a courier API, a language model to write a thank-you note, and an email service, before replying 200. It takes about 12 seconds. The provider's timeout is 10 seconds. Describe what happens over the following hours, and redesign the handler.

<details>
<summary>View Answer</summary>

Each delivery takes about 12 seconds to answer, but the provider stops waiting at 10 and records the delivery as failed. The handler, however, keeps running and completes its work: the courier is booked, the note is written, and the email is sent. The provider then retries, perhaps after a minute, and the same thing happens: the work is done again, and the delivery is again recorded as failed because the reply still takes 12 seconds. With retries continuing on a growing schedule for hours or days, each paid order could be booked with the courier and emailed many times, and if the failures continue the provider may eventually disable the endpoint altogether, after which new payments stop arriving at all. The redesign separates receiving from working. The handler reads the raw body, verifies the signature and timestamp, parses the event, and checks its ID against a record of processed events. If the ID is new, it records the ID, places the event on a queue, and replies 200 at once, within well under a second. If the ID has been seen, it replies 200 and does nothing. A separate worker takes events from the queue and does the slow work: booking the courier, generating the note, sending the email. The worker's actions should themselves be idempotent, for example by using the courier API's idempotency key or by checking whether a booking already exists for the order, so that a worker restarted mid-task does not book twice. Failures in the worker are then handled by its own retry policy, as Module 7.14 describes, without involving the provider at all.

</details>

@@starter
"""
Lab: Sign, Verify, Deduplicate, Cost the Polling, and Order the Events
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import hashlib
import hmac
import json

SECRET = b"whsec_test_8f2a"
BODY = json.dumps({"id": "evt_1001", "type": "order.paid", "data": {"order": "A1234", "total": 42.5}}, separators=(",", ":")).encode()
SENT_AT = 1763300000


# ---------------------------------------------------------------- Step 1
def sign(secret, timestamp, body):
    """Return the hexadecimal HMAC-SHA256, keyed with `secret` (bytes), of the timestamp,
    a full stop, and the raw body bytes:
        hmac.new(secret, f"{timestamp}.".encode() + body, hashlib.sha256).hexdigest()"""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def verify(secret, header, body, now, tolerance=300):
    """header looks like "t=1763300000,v1=abc123". Split it on commas into name=value parts
    (split each part at the first "="; ignore parts without "=").
        if "t" or "v1" is missing                     -> "malformed"
        if abs(now - int(t)) > tolerance               -> "too-old"
        if hmac.compare_digest(the expected signature computed with the same scheme as Step 1,
                               v1) is true             -> "ok"
        otherwise                                      -> "bad-signature"
    Compute the expected signature here directly, so this step does not depend on Step 1."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def process_once(event, seen, actions):
    """If event["id"] is already in the set `seen`, return "duplicate" and change nothing.
    Otherwise add the id to `seen`, append (event["type"], event["data"]["order"]) to the
    list `actions`, and return "processed"."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def polling_cost(interval_seconds, days=30, changes_per_day=20):
    """requests = int(days * 86400 / interval_seconds)
    useful   = the smaller of requests and days * changes_per_day
    Return {"requests": requests, "empty": requests - useful,
            "average_delay_s": interval_seconds / 2}."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def latest_state(events):
    """Each event is {"object", "version", "status"}. For each object keep the event with the
    highest version (on a tie, the first one seen). Return {object: status}, with objects in
    sorted order."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    header = f"t={SENT_AT},v1={sign(SECRET, SENT_AT, BODY)}"
    print("sign   :", sign(SECRET, SENT_AT, BODY))
    print("verify :", verify(SECRET, header, BODY, now=SENT_AT + 10))
    seen, actions = set(), []
    print("once   :", process_once({"id": "evt_1", "type": "order.paid", "data": {"order": "A1"}}, seen, actions))
    print("polling:", polling_cost(60))
    print("latest :", latest_state([{"object": "A1", "version": 2, "status": "shipped"}, {"object": "A1", "version": 1, "status": "paid"}]))

@@solution
"""
Lab solution: Sign, Verify, Deduplicate, Cost the Polling, and Order the Events
Standard library only.
"""
import hashlib
import hmac
import json

SECRET = b"whsec_test_8f2a"
BODY = json.dumps({"id": "evt_1001", "type": "order.paid", "data": {"order": "A1234", "total": 42.5}}, separators=(",", ":")).encode()
SENT_AT = 1763300000


# ---------------------------------------------------------------- Step 1
def sign(secret, timestamp, body):
    """Only someone holding the secret can produce this, and any change to the body or the
    timestamp produces a different value."""
    return hmac.new(secret, f"{timestamp}.".encode() + body, hashlib.sha256).hexdigest()


# ---------------------------------------------------------------- Step 2
def verify(secret, header, body, now, tolerance=300):
    """Over the raw body, in constant time, and within a time window, so that neither a
    forged request nor a captured, replayed one is accepted."""
    parts = dict(item.split("=", 1) for item in header.split(",") if "=" in item)
    if "t" not in parts or "v1" not in parts:
        return "malformed"
    timestamp = int(parts["t"])
    if abs(now - timestamp) > tolerance:
        return "too-old"
    expected = hmac.new(secret, f"{timestamp}.".encode() + body, hashlib.sha256).hexdigest()
    return "ok" if hmac.compare_digest(expected, parts["v1"]) else "bad-signature"


# ---------------------------------------------------------------- Step 3
def process_once(event, seen, actions):
    """Duplicates are documented behaviour, not an edge case. The event id stays the same
    across retries, so recording it makes a repeated delivery harmless."""
    if event["id"] in seen:
        return "duplicate"
    seen.add(event["id"])
    actions.append((event["type"], event["data"]["order"]))
    return "processed"


# ---------------------------------------------------------------- Step 4
def polling_cost(interval_seconds, days=30, changes_per_day=20):
    """Polling trades requests against delay: most requests find nothing, and a change is
    noticed half an interval late on average."""
    requests = int(days * 86400 / interval_seconds)
    useful = min(requests, days * changes_per_day)
    return {"requests": requests, "empty": requests - useful, "average_delay_s": interval_seconds / 2}


# ---------------------------------------------------------------- Step 5
def latest_state(events):
    """Arrival order is not event order. Keeping the highest version per object stops a late
    'paid' from overwriting an earlier-arrived 'shipped'."""
    latest = {}
    for event in events:
        key = event["object"]
        if key not in latest or event["version"] > latest[key]["version"]:
            latest[key] = event
    return {key: value["status"] for key, value in sorted(latest.items())}


def retry_schedule(base_seconds, attempts, cap_seconds):
    """A provider's retry waits: doubling from base, capped."""
    waits = [min(cap_seconds, base_seconds * 2 ** attempt) for attempt in range(attempts)]
    return {"waits": waits, "total_hours": round(sum(waits) / 3600, 2)}


if __name__ == "__main__":
    header = f"t={SENT_AT},v1={sign(SECRET, SENT_AT, BODY)}"
    print(header[:24])
    print(verify(SECRET, header, BODY, now=SENT_AT + 10))
    print(verify(SECRET, header, BODY + b" ", now=SENT_AT + 10), verify(b"guessed", header, BODY, now=SENT_AT + 10))
    print(verify(SECRET, header, BODY, now=SENT_AT + 301), verify(SECRET, "v1=abc", BODY, now=SENT_AT))
    print(verify(SECRET, header, json.dumps(json.loads(BODY), indent=2).encode(), now=SENT_AT + 10))
    print(hmac.new(b"It's a Secret to Everybody", b"Hello, World!", hashlib.sha256).hexdigest()[:8])

    seen, actions = set(), []
    deliveries = [{"id": "evt_1", "type": "order.paid", "data": {"order": "A1"}},
                  {"id": "evt_2", "type": "order.paid", "data": {"order": "A2"}},
                  {"id": "evt_1", "type": "order.paid", "data": {"order": "A1"}}]
    print([process_once(event, seen, actions) for event in deliveries], actions)

    print(polling_cost(60), polling_cost(900), polling_cost(120, changes_per_day=50))
    print(retry_schedule(60, 8, 6 * 3600))
    print(latest_state([{"object": "A1", "version": 2, "status": "shipped"}, {"object": "A1", "version": 1, "status": "paid"}, {"object": "A2", "version": 1, "status": "paid"}]))

@@step
{
  "stepNumber": 1,
  "title": "Sign a delivery",
  "instruction": "Implement sign(secret, timestamp, body). The secret and the body are bytes. Build the message from the timestamp written as text, a full stop, and the raw body bytes. Return the hexadecimal digest of hmac.new with the secret, that message, and hashlib.sha256. This is the scheme a provider such as Stripe uses, described in Section 2. Sign BODY at SENT_AT, and check your understanding against GitHub's published test case, which signs the body alone. [MOD-7.4]",
  "hintConceptual": "A wax seal pressed with a ring that only two people own. Anyone can see the seal, nobody else can make one, and breaking the letter open breaks the seal.",
  "hintSyntax": "return hmac.new(secret, f\"{timestamp}.\".encode() + body, hashlib.sha256).hexdigest()"
}
@@assert
_sig = sign(SECRET, SENT_AT, BODY)
assert _sig == hmac.new(SECRET, b"1763300000." + BODY, hashlib.sha256).hexdigest(), f"The signature covers the timestamp, a full stop, and the raw body, got {_sig}"
assert isinstance(_sig, str) and len(_sig) == 64 and all(character in "0123456789abcdef" for character in _sig), "SHA-256 in hexadecimal is 64 characters"
assert sign(SECRET, SENT_AT, BODY) == _sig, "The same inputs always give the same signature"
assert sign(SECRET, SENT_AT, BODY + b" ") != _sig and sign(SECRET, SENT_AT + 1, BODY) != _sig and sign(b"other", SENT_AT, BODY) != _sig, "A changed body, timestamp, or secret changes the signature"
assert sign(b"k", 0, b"") == hmac.new(b"k", b"0.", hashlib.sha256).hexdigest(), "An empty body is still signed with the timestamp"
assert hmac.new(b"It's a Secret to Everybody", b"Hello, World!", hashlib.sha256).hexdigest().startswith("757107ea"), "GitHub's test case, which signs the body alone"
print("Step 1 passed: one secret, one signature, and any change to the body breaks it.")

@@step
{
  "stepNumber": 2,
  "title": "Verify a delivery",
  "instruction": "Implement verify(secret, header, body, now, tolerance). The header looks like 't=1763300000,v1=' followed by a signature. Split it on commas, split each part at its first equals sign, and ignore parts without one. If 't' or 'v1' is missing, return 'malformed'. If the difference between now and the timestamp, in either direction, is more than tolerance seconds, return 'too-old'. Otherwise compute the expected signature yourself, over the timestamp, a full stop, and the raw body, with HMAC-SHA256 and the secret, and compare it with v1 using hmac.compare_digest. Return 'ok' if they match and 'bad-signature' if not. Verify a genuine delivery, a tampered one, an old one, and the same JSON re-serialised. These are the three rules of Section 2. [MOD-7.4]",
  "hintConceptual": "Checking a sealed letter: is there a seal at all, was it sent recently, and does the seal match the one you would have made? Look at the seal with a method that takes the same time whether it is nearly right or completely wrong.",
  "hintSyntax": "parts = dict(item.split(\"=\", 1) for item in header.split(\",\") if \"=\" in item)\nif \"t\" not in parts or \"v1\" not in parts:\n    return \"malformed\"\ntimestamp = int(parts[\"t\"])\nif abs(now - timestamp) > tolerance:\n    return \"too-old\"\nexpected = hmac.new(secret, f\"{timestamp}.\".encode() + body, hashlib.sha256).hexdigest()\nreturn \"ok\" if hmac.compare_digest(expected, parts[\"v1\"]) else \"bad-signature\""
}
@@assert
_good = hmac.new(SECRET, b"1763300000." + BODY, hashlib.sha256).hexdigest()
_header = f"t={SENT_AT},v1={_good}"
assert verify(SECRET, _header, BODY, now=SENT_AT + 10) == "ok", f"A genuine delivery verifies, got {verify(SECRET, _header, BODY, now=SENT_AT + 10)}"
assert verify(SECRET, _header, BODY + b" ", now=SENT_AT + 10) == "bad-signature" and verify(b"guessed", _header, BODY, now=SENT_AT + 10) == "bad-signature", "A tampered body or a wrong secret fails"
assert verify(SECRET, _header, json.dumps(json.loads(BODY), indent=2).encode(), now=SENT_AT + 10) == "bad-signature", "The same JSON re-serialised is different bytes, so verification must use the raw body"
assert verify(SECRET, _header, BODY, now=SENT_AT + 301) == "too-old" and verify(SECRET, _header, BODY, now=SENT_AT - 301) == "too-old", "Older than five minutes, or from the future by as much, is rejected"
assert verify(SECRET, _header, BODY, now=SENT_AT + 300) == "ok" and verify(SECRET, _header, BODY, now=SENT_AT + 1000, tolerance=1000) == "ok", "Exactly at the tolerance is accepted, and the tolerance is an argument"
assert verify(SECRET, "v1=abc", BODY, now=SENT_AT) == "malformed" and verify(SECRET, f"t={SENT_AT}", BODY, now=SENT_AT) == "malformed" and verify(SECRET, "", BODY, now=SENT_AT) == "malformed", "A header missing its parts is malformed"
assert verify(SECRET, f"t={SENT_AT},v1={_good},junk", BODY, now=SENT_AT) == "ok", "Parts without an equals sign are ignored"
print("Step 2 passed: genuine deliveries verify, and tampered, stale, or re-serialised ones do not.")

@@step
{
  "stepNumber": 3,
  "title": "Process each event once",
  "instruction": "Implement process_once(event, seen, actions). The event has an 'id', a 'type', and 'data' containing an 'order'. If the event's id is already in the set seen, return 'duplicate' and change nothing. Otherwise add the id to seen, append a tuple of the event's type and its order to the list actions, and return 'processed'. Deliver three events, the third repeating the first. This is deduplication by event ID from Section 2. [MOD-7.4]",
  "hintConceptual": "A cloakroom attendant who has already handed back coat number 12 does not hand back a second coat when the same ticket is shown again.",
  "hintSyntax": "if event[\"id\"] in seen:\n    return \"duplicate\"\nseen.add(event[\"id\"])\nactions.append((event[\"type\"], event[\"data\"][\"order\"]))\nreturn \"processed\""
}
@@assert
_seen, _actions = set(), []
_deliveries = [{"id": "evt_1", "type": "order.paid", "data": {"order": "A1"}}, {"id": "evt_2", "type": "order.paid", "data": {"order": "A2"}}, {"id": "evt_1", "type": "order.paid", "data": {"order": "A1"}}]
_results = [process_once(event, _seen, _actions) for event in _deliveries]
assert _results == ["processed", "processed", "duplicate"], f"The repeated delivery is recognised, got {_results}"
assert _actions == [("order.paid", "A1"), ("order.paid", "A2")] and _seen == {"evt_1", "evt_2"}, "Order A1 is acted on once"
_before = list(_actions)
assert process_once({"id": "evt_2", "type": "order.refunded", "data": {"order": "A2"}}, _seen, _actions) == "duplicate" and _actions == _before, "A duplicate changes nothing, even if its body differs"
assert process_once({"id": "evt_3", "type": "order.refunded", "data": {"order": "A1"}}, _seen, _actions) == "processed" and _actions[-1] == ("order.refunded", "A1"), "A new event about the same order is processed"
_fresh_seen, _fresh_actions = set(), []
assert [process_once({"id": "x", "type": "t", "data": {"order": "o"}}, _fresh_seen, _fresh_actions) for _ in range(5)] == ["processed"] + ["duplicate"] * 4 and len(_fresh_actions) == 1, "Five deliveries of one event act once"
print("Step 3 passed: a retried delivery is recognised and order A1 is fulfilled once.")

@@step
{
  "stepNumber": 4,
  "title": "What polling would cost",
  "instruction": "Implement polling_cost(interval_seconds, days, changes_per_day). The number of requests is the whole number part of the days times 86,400 divided by the interval. The useful requests are at most the number of changes over the period, which is the days times the changes per day, and never more than the number of requests. Return a dict with 'requests', 'empty', which is the requests minus the useful ones, and 'average_delay_s', which is half the interval. Compare polling every minute with every fifteen minutes. This is the polling arithmetic from Section 2. [MOD-7.4]",
  "hintConceptual": "Checking the letterbox every few minutes means many trips to an empty box, and on average you find a letter half a gap after it arrived.",
  "hintSyntax": "requests = int(days * 86400 / interval_seconds)\nuseful = min(requests, days * changes_per_day)\nreturn {\"requests\": requests, \"empty\": requests - useful, \"average_delay_s\": interval_seconds / 2}"
}
@@assert
assert polling_cost(60) == {"requests": 43200, "empty": 42600, "average_delay_s": 30.0}, f"Polling every minute for 30 days: 43,200 requests, 42,600 empty, got {polling_cost(60)}"
assert polling_cost(900) == {"requests": 2880, "empty": 2280, "average_delay_s": 450.0}, "Every 15 minutes: fewer requests and a longer delay"
assert polling_cost(120, changes_per_day=50) == {"requests": 21600, "empty": 20100, "average_delay_s": 60.0}, "The numbers from the first recall question"
assert polling_cost(86400, days=1, changes_per_day=20) == {"requests": 1, "empty": 0, "average_delay_s": 43200.0}, "Polling once a day can find at most one batch per poll"
assert polling_cost(3600, days=2, changes_per_day=0) == {"requests": 48, "empty": 48, "average_delay_s": 1800.0}, "With nothing changing, every request is empty"
assert polling_cost(7, days=1)["requests"] == 12342, "The count is the whole number of polls that fit"
print("Step 4 passed: polling every minute wastes 42,600 of 43,200 requests a month.")

@@step
{
  "stepNumber": 5,
  "title": "Handle events out of order",
  "instruction": "Implement latest_state(events). Each event has an 'object', an increasing 'version', and a 'status'. Go through the events in arrival order. For each object, keep the event with the highest version, and when two have the same version keep the first one seen. Return a dict mapping each object to the status of its kept event, with the objects in sorted order. Run it on events where a 'shipped' arrives before the 'paid' that preceded it. This is the version approach from Section 2's table. [MOD-7.4]",
  "hintConceptual": "Letters dated by the sender can arrive in any order. Whatever turns up, the one with the latest date says how things stand now.",
  "hintSyntax": "latest = {}\nfor event in events:\n    key = event[\"object\"]\n    if key not in latest or event[\"version\"] > latest[key][\"version\"]:\n        latest[key] = event\nreturn {key: value[\"status\"] for key, value in sorted(latest.items())}"
}
@@assert
_arrivals = [{"object": "A1", "version": 2, "status": "shipped"}, {"object": "A1", "version": 1, "status": "paid"}, {"object": "A2", "version": 1, "status": "paid"}]
assert latest_state(_arrivals) == {"A1": "shipped", "A2": "paid"}, f"A late 'paid' does not overwrite 'shipped', got {latest_state(_arrivals)}"
assert list(latest_state([{"object": "B", "version": 1, "status": "x"}, {"object": "A", "version": 1, "status": "y"}])) == ["A", "B"], "Objects are returned in sorted order"
assert latest_state([{"object": "A1", "version": 1, "status": "paid"}, {"object": "A1", "version": 3, "status": "refunded"}, {"object": "A1", "version": 2, "status": "shipped"}]) == {"A1": "refunded"}, "The highest version wins whatever the arrival order"
assert latest_state([{"object": "A1", "version": 2, "status": "first"}, {"object": "A1", "version": 2, "status": "second"}]) == {"A1": "first"}, "On a tie the first seen is kept"
assert latest_state([]) == {}, "No events, no state"
print("Step 5 passed: order A1 stays 'shipped' although its 'paid' event arrived second.")
