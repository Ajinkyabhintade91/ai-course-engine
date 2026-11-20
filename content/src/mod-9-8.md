@@meta
{
  "moduleId": "MOD-9.8",
  "slug": "mod-9-8",
  "unitId": "UNIT-9",
  "unitTitle": "Unit 9: Coding with AI",
  "title": "Building Web Applications",
  "difficulty": "Intermediate",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "Client-Server overview", "source": "MDN Web Docs", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview" },
    { "title": "RFC 9110: HTTP Semantics", "source": "IETF", "url": "https://www.rfc-editor.org/rfc/rfc9110" },
    { "title": "A01:2025 Broken Access Control", "source": "OWASP Top 10", "url": "https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/" },
    { "title": "Constraints (primary keys, foreign keys)", "source": "Official Docs (PostgreSQL)", "url": "https://www.postgresql.org/docs/current/ddl-constraints.html" },
    { "title": "Extracting State Logic into a Reducer", "source": "Official Docs (React)", "url": "https://react.dev/learn/extracting-state-logic-into-a-reducer" }
  ],
  "videoLibrary": [
    {
      "id": "VID-9.8-1",
      "title": "Frontend, API, Backend and Database explained",
      "creator": "Tamara Jost",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=NzEYYemQ3_8",
      "timingInstruction": "Watch after Section 1, before the architecture part of Section 2",
      "keyTakeaway": "How the four layers of a web app talk to each other, in plain terms."
    },
    {
      "id": "VID-9.8-2",
      "title": "Database Keys Made Easy - Primary, Foreign, Candidate, Surrogate, & Many More",
      "creator": "Decomplexify",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=8wUUMOKAK-c",
      "timingInstruction": "Watch after the data modelling part of Section 2, before Step 2 of the lab",
      "keyTakeaway": "Why every table needs a key and how foreign keys tie records together."
    },
    {
      "id": "VID-9.8-3",
      "title": "Good APIs Vs Bad APIs: 7 Tips for API Design",
      "creator": "ByteByteGo",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=_gQaygjm_hg",
      "timingInstruction": "Watch after the API part of Section 2, before Step 3 of the lab",
      "keyTakeaway": "Resource naming, methods, and status codes that make an API predictable."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Spec Gaps, Schema Checks, REST Routes, Role-Based Access, State Reducers",
    "context": "The tool shop wants a lead tracker for its trade sales team, built with an AI app builder, and the owner has learned from the vibe-coded attempt that the specification and the checks matter more than the prompt. You will find gaps in an app specification, check a data model, generate REST routes with correct status codes, enforce role-based access, and manage interface state with a reducer that handles optimistic updates.",
    "language": "python"
  }
}

@@reading
# Building Web Applications

A **web application** differs from a website, Module 9.7, in one essential way: it **remembers and changes things** on behalf of its users. A lead tracker stores leads, lets salespeople update them, shows each person what they are allowed to see, and keeps working when two people edit at once. That requires a backend, a database, authentication, and careful thinking about data and permissions, which is precisely where AI app builders are weakest when left to guess.

This module explains the architecture of a web app, how to **specify** one so an AI builder produces the right thing, and the three foundations it must get right: the **data model**, the **API**, and **state**, plus access control, the most common serious flaw in web applications.

## 1. First-Principles Mental Model & Intuition

### A restaurant

A restaurant has a dining room where customers see menus and place orders: the **frontend**. A kitchen where orders are checked, cooked, and recorded: the **backend**. A pantry and an order book that persist from day to day: the **database**. The door staff who check reservations and seat people in the right section: **authentication and authorisation**. Waiters carry orders between dining room and kitchen in a fixed format: the **API**.

A good restaurant has a written menu before it opens, knows exactly what goes in the order book, and never lets a diner walk into the kitchen and cook for themselves. An app built from a vague prompt is like a restaurant opened before anyone wrote the menu.

```text
   BROWSER (frontend)                 SERVER (backend)                       DATABASE
   pages, forms, state  --HTTPS-->    API routes: GET/POST/PATCH/DELETE  -->  tables: users, leads, notes
   (reducer: pending,     JSON        authenticate: who are you?             primary keys, foreign keys,
    confirmed, errors)  <--------     authorise: may you do this to          constraints, timestamps
                         status codes   THIS record? (role + ownership)
                         200 201 204    validate input (422 if invalid)
                         403 404 422    business rules, then read/write
```

### Specification first

AI builders are excellent at turning a precise specification into working code and poor at guessing what you meant. Most failures in AI-built apps trace back to things nobody specified: who the users are, what each may do, what data exists and how it relates, and what happens when something goes wrong. Ten minutes on a specification saves hours of prompting in circles.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Architecture

MDN's client-server overview describes the basic pattern: the **client**, the browser, sends HTTP requests; the **server** processes them, often reading or writing a **database**, and returns responses. Modern apps typically split into a frontend, which renders pages and holds interface state, and a backend exposing an **API**, usually JSON over HTTP, with **authentication**, establishing who the user is, and **authorisation**, deciding what they may do, enforced on the server. Anything enforced only in the browser can be bypassed by anyone who sends requests directly.

### Specifying an app for an AI builder

A useful specification answers:

| Section | Lead tracker example |
|---|---|
| Purpose | Track trade leads from enquiry to won or lost |
| Roles | admin, sales, viewer |
| Entities and fields, with types | Lead: name text, email text, stage enum, owner User, value number |
| Pages | Pipeline board, lead detail, settings |
| Permissions per role | admin: everything; sales: read all, edit own; viewer: read only |
| Authentication | Email magic link |
| Edge cases | Duplicate emails, deleting a user who owns leads |

A specification can be checked for completeness before any code exists: every entity field has a type, every role has permissions, and no permissions refer to roles that do not exist. A field without a type, like a "value" that might be text or a number, is exactly where an AI builder will guess.

### Data modelling

The database holds the truth. A relational model organises it into **tables**, one per entity, each row identified by a **primary key**, with relationships expressed by **foreign keys** that reference another table's key; PostgreSQL's documentation explains how these constraints make the database itself refuse invalid data, such as a note attached to a lead that does not exist.

Three rules prevent most data bugs:

1. **Every table has a primary key.** Without one, rows cannot be reliably updated or referenced.
2. **Every foreign key points to a table that exists.** A dangling reference is a crash or a silent data loss waiting to happen.
3. **Store each fact once.** If `leads` has `owner_id` referencing `users`, it should not also store `user_name`: when the user changes their name, the two copies disagree. This is **normalisation**; deliberate copies, for speed or history, should be the exception and documented.

Timestamps such as `created_at` on every table make debugging and auditing possible.

### APIs

A **REST** API exposes **resources**, such as leads, at URLs, and uses HTTP methods for actions:

| Method and path | Action | Success status |
|---|---|---|
| GET /leads | List | 200 OK |
| POST /leads | Create | 201 Created |
| GET /leads/{id} | Read one | 200 OK |
| PATCH /leads/{id} | Update some fields | 200 OK |
| DELETE /leads/{id} | Delete | 204 No Content |
| GET /leads/{id}/notes | List a lead's notes | 200 OK |

HTTP semantics, standardised in RFC 9110, also define the failure codes clients rely on: **403 Forbidden** when the user may not do this, **404 Not Found** when the resource does not exist, and **422 Unprocessable Content** when the request is well-formed but its data is invalid, such as a missing email. Consistent status codes let the frontend react correctly: show a validation message for 422, a "no access" page for 403, and so on. The order of checks matters too: authorisation before validation, so that someone without access learns nothing from the validation messages.

### Access control

OWASP's Top 10 ranks **broken access control** as the first web application security risk. Two layers are needed: **role-based** rules, what each role may do in general, and **object-level** rules, which particular records, Module 8.17's BOLA. For the lead tracker: admins may do anything; salespeople may read all leads and create leads, but update only their own; viewers may only read. Written as a function, access control is testable, and tests are the only way to know an AI-generated backend enforces it on every route.

### State in the frontend

The interface holds **state**: the leads on screen, what is loading, and errors. React's documentation recommends consolidating complex state updates into a **reducer**, a pure function

$$\text{state}_{t+1} = \text{reduce}(\text{state}_t, \text{event}_t)$$

that computes the next state from the current one and an event, without modifying the old state. Reducers make state changes predictable and testable. A common pattern is the **optimistic update**: when the user adds a lead, show it immediately as pending; if the server confirms, replace the pending entry with the saved one and its real id; if the server rejects it, remove it and show the error. The user gets an instant response, and the screen never lies for long.

### Complexity

Specification checks are linear in entities, fields, and roles. Schema checks are roughly linear in tables times columns for typical schemas, quadratic in columns per table in the worst case. Route generation is linear in resources. An authorisation decision is constant. A reducer step copies the state, linear in its size.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, finding gaps in a specification.

```python
def spec_gaps(spec):
    gaps = []
    for key in ("purpose", "roles", "entities", "pages", "auth"):
        if not spec.get(key):
            gaps.append(f"missing {key}")
    for name, fields in (spec.get("entities") or {}).items():
        for field, kind in fields.items():
            if not kind:
                gaps.append(f"{name}.{field} has no type")
    roles, permissions = spec.get("roles") or [], spec.get("permissions") or {}
    gaps += [f"permissions for unknown role {r}" for r in permissions if r not in roles]
    gaps += [f"no permissions for {r}" for r in roles if r not in permissions]
    return gaps

SPEC = {"purpose": "Track trade leads from enquiry to won or lost", "roles": ["admin", "sales", "viewer"],
        "entities": {"Lead": {"name": "text", "email": "text", "stage": "enum", "owner_id": "User", "value": ""},
                     "User": {"name": "text", "role": "enum"}},
        "pages": ["Pipeline", "Lead detail", "Settings"], "auth": "email magic link",
        "permissions": {"admin": ["all"], "sales": ["read", "edit own"]}}
print(spec_gaps(SPEC))
```

- **Required sections are checked first.** An empty specification reports all five.
- **`Lead.value` has no type.** Text or number? The AI will guess, and sorting by value will break if it guesses text.
- **The viewer role has no permissions.** Unspecified permissions become whatever the AI assumes.

Next, checking the data model.

```python
def schema_issues(tables):
    issues = []
    for table, cols in tables.items():
        if cols.get("id") != "pk":
            issues.append(f"{table} has no primary key id")
        for col, kind in cols.items():
            if kind.startswith("fk:"):
                target = kind[3:]
                if target not in tables:
                    issues.append(f"{table}.{col} references missing table {target}")
                else:
                    prefix = target.lower().rstrip("s")
                    for dup in [d for d in cols if d.startswith(prefix + "_") and d != col]:
                        issues.append(f"{table}.{dup} duplicates data from {target}")
        if "created_at" not in cols:
            issues.append(f"{table} has no created_at")
    return issues

TABLES = {"users": {"id": "pk", "name": "text", "email": "text", "created_at": "timestamp"},
          "leads": {"id": "pk", "name": "text", "owner_id": "fk:users", "user_name": "text", "stage": "text", "created_at": "timestamp"},
          "notes": {"lead_id": "fk:leads", "body": "text", "author_id": "fk:staff"}}
for issue in schema_issues(TABLES):
    print(issue)
```

- **`leads.user_name` copies a fact that lives in `users`.** It will drift when names change.
- **`notes` has no primary key.** Individual notes cannot be edited or deleted reliably.
- **`notes.author_id` points at a `staff` table that does not exist.** A typical AI inconsistency between two prompts.
- **`notes` has no timestamp.** Four issues, each cheap to fix before data exists and expensive after.

Then, routes and status codes.

```python
def routes(resource, children=()):
    base = f"/{resource}"
    table = [("GET", base, "list"), ("POST", base, "create"), ("GET", base + "/{id}", "read"),
             ("PATCH", base + "/{id}", "update"), ("DELETE", base + "/{id}", "delete")]
    for child in children:
        table += [("GET", f"{base}/{{id}}/{child}", f"list {child}"), ("POST", f"{base}/{{id}}/{child}", f"create {child}")]
    return table

STATUS = {"create": 201, "read": 200, "list": 200, "update": 200, "delete": 204}

def respond(action, found=True, valid=True, allowed=True):
    if not allowed:
        return 403
    if not valid:
        return 422
    if not found and action not in ("create", "list"):
        return 404
    return STATUS[action]

for route in routes("leads", ["notes"]):
    print(route)
print(respond("create"), respond("read", found=False), respond("update", valid=False), respond("delete", allowed=False))
```

- **Five routes per resource, plus nested routes for its children.** A predictable API is easier for both people and AI to extend.
- **Creating returns 201, deleting 204.**
- **Authorisation is checked first, then validation, then existence.** A forbidden user gets 403 without learning whether their data was valid.
- **Invalid data gives 422, checked before existence; missing records give 404.**

Then, role-based and object-level access.

```python
def authorize(user, action, record=None):
    role = user["role"]
    if role == "admin":
        return True, "admin"
    if action in ("read", "list"):
        return role in ("sales", "viewer"), f"{role} may read"
    if role == "sales" and action == "create":
        return True, "sales may create"
    if role == "sales" and action == "update":
        return record is not None and record["owner_id"] == user["id"], "own records only"
    return False, f"{role} may not {action}"

SALES, VIEWER = {"id": 7, "role": "sales"}, {"id": 9, "role": "viewer"}
MINE, THEIRS = {"id": 1, "owner_id": 7}, {"id": 2, "owner_id": 8}
print(authorize(SALES, "update", MINE), authorize(SALES, "update", THEIRS), authorize(SALES, "delete", MINE))
print(authorize(VIEWER, "list"), authorize(VIEWER, "update", MINE))
```

- **Admins pass everything.**
- **Salespeople read all leads but update only their own.** The record's owner is compared with the user, on the server.
- **Salespeople cannot delete, even their own leads.**
- **Viewers only read.** Each rule is one testable line, so every route can be checked against it.

Finally, a reducer with optimistic updates.

```python
def reduce(state, event):
    leads, pending, error = dict(state["leads"]), dict(state["pending"]), None
    kind = event["type"]
    if kind == "add_pending":
        pending[event["temp_id"]] = event["lead"]
    elif kind == "add_ok":
        lead = pending.pop(event["temp_id"])
        leads[event["id"]] = {**lead, "id": event["id"]}
    elif kind == "add_failed":
        pending.pop(event["temp_id"], None)
        error = event["message"]
    elif kind == "move_stage":
        leads[event["id"]] = {**leads[event["id"]], "stage": event["stage"]}
    return {"leads": leads, "pending": pending, "error": error}

state = {"leads": {1: {"id": 1, "name": "Harper Joinery", "stage": "new"}}, "pending": {}, "error": None}
state = reduce(state, {"type": "add_pending", "temp_id": "t1", "lead": {"name": "Oak & Co", "stage": "new"}})
print(reduce(state, {"type": "add_ok", "temp_id": "t1", "id": 2}))
print(reduce(state, {"type": "add_failed", "temp_id": "t1", "message": "email already exists"}))
```

- **The new lead appears at once as pending.** The user sees an immediate response.
- **On success it moves to the confirmed leads with the server's id.**
- **On failure it disappears and the error is shown.** The duplicate email, rejected by the server, never pretends to be saved.
- **The old state is never modified.** Each event returns a new state, so the history is predictable and testable.

**Complexity.** `spec_gaps` is linear in the specification. `schema_issues` is roughly linear in columns for typical schemas. `routes` is linear in children. `respond` and `authorize` are constant. `reduce` copies the state dictionaries.

### A lead tracker specification sheet

```text
PURPOSE      track trade leads from enquiry to won or lost
ROLES        admin (all); sales (read all, create, update own); viewer (read only)
ENTITIES     users(id pk, name, email unique, role, created_at)
             leads(id pk, name, email, stage enum[new, quoted, won, lost], value numeric, owner_id fk users, created_at)
             notes(id pk, lead_id fk leads, author_id fk users, body, created_at)
API          REST: /leads, /leads/{id}, /leads/{id}/notes; 201 create, 204 delete, 403, 404, 422
AUTH         email magic link; every route checks role AND record ownership on the server
UI           pipeline board by stage; optimistic moves and adds with rollback on error
EDGE CASES   duplicate email -> 422; deleting a user who owns leads -> reassign first
TESTS        one test per permission rule per route; schema constraints in the database
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Prompting before specifying.** "Build me a CRM" produces someone else's idea of a CRM. Write the specification first.

**Untyped fields.** A value stored as text sorts "1000" before "200". Give every field a type.

**Permissions only in the frontend.** Hiding a button does not stop an API call. Enforce on the server.

**Role checks without ownership checks.** A salesperson editing a colleague's lead by changing the id in the URL. Check the record.

**Copies of the same fact.** Names stored in two tables drift apart. Reference, do not copy.

**Missing foreign key constraints.** Orphaned notes pointing at deleted leads. Let the database enforce relationships.

**Inconsistent status codes.** Every error returned as 200 with a message makes the frontend guess. Use the standard codes.

**Validation before authorisation.** Detailed validation errors leak information to users without access. Check access first.

**Optimistic updates without rollback.** The screen shows saved data that the server rejected. Always handle failure.

**Mutating state in place.** Interfaces fail to re-render or show stale data. Return new state.

**No tests for access control.** The AI may forget a check on one route of twenty. Test every route against the rules.

**Schema changes without migrations.** Editing the database by hand in production is how data is lost. Use migrations, Module 9.11.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A web application adds a backend, a database, and authentication to a website so it can store and change data for its users, with the browser as client sending HTTP requests to a server that enforces authentication, authorisation, and validation. AI builders work best from a specification covering purpose, roles, typed entities, pages, permissions per role, authentication, and edge cases, which can be checked for gaps before building. Data models need a primary key on every table, foreign keys that point to real tables, each fact stored once, and timestamps. REST APIs expose resources through standard methods and status codes, 200, 201, 204 for success and 403, 404, 422 for failures, with authorisation checked before validation. Broken access control is OWASP's top risk, so role-based and object-level rules must be enforced on the server and tested on every route. Frontend state is best managed by pure reducers, with optimistic updates that show changes immediately and roll back on server errors.

**Question 1.** A team asks an AI builder for "a lead tracker for our sales team" and gets an app where everyone can edit and delete every lead, and lead values sort strangely. Using `spec_gaps` and `schema_issues`, explain what went wrong and what the specification should have said.

<details>
<summary>View Answer</summary>

The prompt specified almost nothing, so the AI filled every gap with defaults: with no roles or permissions, it built a single kind of user who can do everything, and with no types, it stored the value as text, so values sort as strings, "1000" before "200". Running `spec_gaps` on a proper specification would have caught both before building: it reports fields without a type, such as `Lead.value`, and roles without permissions, such as the viewer. The specification should state the roles, admin, sales, and viewer, and what each may do: admins everything, salespeople read all leads, create leads, and update only their own, viewers read only; and it should type every field, value as a number. `schema_issues` on the generated tables would also catch data-model problems, such as a missing primary key on notes, a foreign key pointing at a table that does not exist, or the owner's name copied into the leads table. Fixing these after real data exists means migrations and cleanup; fixing them in the specification costs minutes.

</details>

**Question 2.** A salesperson, user 7, discovers that changing the address from `/leads/1/edit` to `/leads/2/edit` lets them edit a colleague's lead. Explain the flaw using `authorize` and `respond`, and how to prevent it across the whole app.

<details>
<summary>View Answer</summary>

The backend checked the role, salespeople may update leads, but not the record: whether this particular lead belongs to the user. That is broken object level authorisation, the most common form of OWASP's top-ranked risk, broken access control. The lab's `authorize` shows the correct rule: for a salesperson updating a lead, it compares the record's `owner_id` with the user's id, so lead 1, owned by user 7, is allowed, and lead 2, owned by user 8, is refused with "own records only". `respond` then returns 403 because authorisation is checked first, before validation or existence checks, so the user learns nothing else about lead 2. To prevent it across the app, every route that touches a record should load the record and call one shared authorisation function on the server, never relying on the frontend hiding buttons; the specification should list permissions per role and action; and automated tests should try every route as every role against records they do and do not own, expecting 403 where appropriate, since an AI-generated backend can easily miss the check on one route out of twenty.

</details>

**Question 3.** In the pipeline board, a salesperson adds a lead whose email already exists. Trace the lab's `reduce` through the events and explain why optimistic updates need the failure path.

<details>
<summary>View Answer</summary>

When the salesperson submits the form, the frontend dispatches `add_pending` with a temporary id, t1, and `reduce` returns a new state with the lead in `pending`, so it appears on the board immediately, marked as saving, while the request goes to the server. The server checks the data, finds the email already exists, and responds with 422. The frontend then dispatches `add_failed` with t1 and the message, and `reduce` removes t1 from pending and sets the error to "email already exists", so the lead disappears from the board and the message is shown. Had the server accepted it, `add_ok` would have moved the lead from pending into the confirmed leads with the real id, 2. Without the failure path, the screen would keep showing a lead that was never saved: the salesperson would believe it was recorded, add notes to it, and lose all of it on the next page load. Optimistic updates trade a short period of uncertainty for responsiveness, and that trade is only honest if every pending change is either confirmed or rolled back with an explanation. Because `reduce` never modifies the old state, each transition is easy to test.

</details>

@@starter
"""
Lab: Spec Gaps, Schema Checks, REST Routes, Role-Based Access, State Reducers
Standard library only. No server or database. Complete the TODO in each step, then press "Run & Verify Step".
"""
SPEC = {"purpose": "Track trade leads from enquiry to won or lost", "roles": ["admin", "sales", "viewer"],
        "entities": {"Lead": {"name": "text", "email": "text", "stage": "enum", "owner_id": "User", "value": ""},
                     "User": {"name": "text", "role": "enum"}},
        "pages": ["Pipeline", "Lead detail", "Settings"], "auth": "email magic link",
        "permissions": {"admin": ["all"], "sales": ["read", "edit own"]}}
TABLES = {"users": {"id": "pk", "name": "text", "email": "text", "created_at": "timestamp"},
          "leads": {"id": "pk", "name": "text", "owner_id": "fk:users", "user_name": "text", "stage": "text", "created_at": "timestamp"},
          "notes": {"lead_id": "fk:leads", "body": "text", "author_id": "fk:staff"}}
STATUS = {"create": 201, "read": 200, "list": 200, "update": 200, "delete": 204}
SALES, VIEWER, ADMIN = {"id": 7, "role": "sales"}, {"id": 9, "role": "viewer"}, {"id": 1, "role": "admin"}
MINE, THEIRS = {"id": 1, "owner_id": 7}, {"id": 2, "owner_id": 8}
START = {"leads": {1: {"id": 1, "name": "Harper Joinery", "stage": "new"}}, "pending": {}, "error": None}


# ---------------------------------------------------------------- Step 1
def spec_gaps(spec):
    """"missing <key>" for each falsy purpose/roles/entities/pages/auth; "<Entity>.<field> has no type" for empty
    types; "permissions for unknown role <r>"; "no permissions for <r>" for roles without permissions."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def schema_issues(tables):
    """Per table in order: "<t> has no primary key id" unless cols["id"] == "pk"; for each "fk:<target>" column,
    "<t>.<c> references missing table <target>" or, if it exists, "<t>.<d> duplicates data from <target>" for other
    columns starting with target.lower().rstrip("s") + "_"; "<t> has no created_at"."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def routes(resource, children=()):
    """List, create, read, update (PATCH), delete routes for /<resource>, then for each child GET and POST
    /<resource>/{id}/<child> as "list <child>" and "create <child>"."""
    # TODO Step 3
    return None


def respond(action, found=True, valid=True, allowed=True):
    """403 if not allowed; 422 if not valid; 404 if not found (except create and list); else STATUS[action]."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def authorize(user, action, record=None):
    """admin -> (True, "admin"); read/list -> (role in sales/viewer, "<role> may read"); sales create -> (True,
    "sales may create"); sales update -> (record owned by user, "own records only"); else (False, "<role> may not
    <action>")."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def reduce(state, event):
    """Copy leads and pending; error None. add_pending: pending[temp_id] = lead. add_ok: move pending temp_id into
    leads[id] with "id" set. add_failed: drop temp_id, error = message. move_stage: replace leads[id] with the new
    stage. Return {"leads", "pending", "error"} without modifying the old state."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("gaps  :", spec_gaps(SPEC))
    print("schema:", schema_issues(TABLES))

@@solution
"""
Lab solution: Spec Gaps, Schema Checks, REST Routes, Role-Based Access, State Reducers
Standard library only. No server or database.
"""
SPEC = {"purpose": "Track trade leads from enquiry to won or lost", "roles": ["admin", "sales", "viewer"],
        "entities": {"Lead": {"name": "text", "email": "text", "stage": "enum", "owner_id": "User", "value": ""},
                     "User": {"name": "text", "role": "enum"}},
        "pages": ["Pipeline", "Lead detail", "Settings"], "auth": "email magic link",
        "permissions": {"admin": ["all"], "sales": ["read", "edit own"]}}
TABLES = {"users": {"id": "pk", "name": "text", "email": "text", "created_at": "timestamp"},
          "leads": {"id": "pk", "name": "text", "owner_id": "fk:users", "user_name": "text", "stage": "text", "created_at": "timestamp"},
          "notes": {"lead_id": "fk:leads", "body": "text", "author_id": "fk:staff"}}
STATUS = {"create": 201, "read": 200, "list": 200, "update": 200, "delete": 204}
SALES, VIEWER, ADMIN = {"id": 7, "role": "sales"}, {"id": 9, "role": "viewer"}, {"id": 1, "role": "admin"}
MINE, THEIRS = {"id": 1, "owner_id": 7}, {"id": 2, "owner_id": 8}
START = {"leads": {1: {"id": 1, "name": "Harper Joinery", "stage": "new"}}, "pending": {}, "error": None}


# ---------------------------------------------------------------- Step 1
def spec_gaps(spec):
    """Everything the AI would otherwise guess."""
    gaps = []
    for key in ("purpose", "roles", "entities", "pages", "auth"):
        if not spec.get(key):
            gaps.append(f"missing {key}")
    for name, fields in (spec.get("entities") or {}).items():
        for field, kind in fields.items():
            if not kind:
                gaps.append(f"{name}.{field} has no type")
    roles, permissions = spec.get("roles") or [], spec.get("permissions") or {}
    gaps += [f"permissions for unknown role {r}" for r in permissions if r not in roles]
    gaps += [f"no permissions for {r}" for r in roles if r not in permissions]
    return gaps


# ---------------------------------------------------------------- Step 2
def schema_issues(tables):
    """Keys, real references, one copy of each fact, timestamps."""
    issues = []
    for table, cols in tables.items():
        if cols.get("id") != "pk":
            issues.append(f"{table} has no primary key id")
        for col, kind in cols.items():
            if kind.startswith("fk:"):
                target = kind[3:]
                if target not in tables:
                    issues.append(f"{table}.{col} references missing table {target}")
                else:
                    prefix = target.lower().rstrip("s")
                    for dup in [d for d in cols if d.startswith(prefix + "_") and d != col]:
                        issues.append(f"{table}.{dup} duplicates data from {target}")
        if "created_at" not in cols:
            issues.append(f"{table} has no created_at")
    return issues


# ---------------------------------------------------------------- Step 3
def routes(resource, children=()):
    """Predictable REST routes."""
    base = f"/{resource}"
    table = [("GET", base, "list"), ("POST", base, "create"), ("GET", base + "/{id}", "read"),
             ("PATCH", base + "/{id}", "update"), ("DELETE", base + "/{id}", "delete")]
    for child in children:
        table += [("GET", f"{base}/{{id}}/{child}", f"list {child}"), ("POST", f"{base}/{{id}}/{child}", f"create {child}")]
    return table


def respond(action, found=True, valid=True, allowed=True):
    """Authorisation first, then validation, then existence."""
    if not allowed:
        return 403
    if not valid:
        return 422
    if not found and action not in ("create", "list"):
        return 404
    return STATUS[action]


# ---------------------------------------------------------------- Step 4
def authorize(user, action, record=None):
    """Role rules plus ownership, enforced on the server."""
    role = user["role"]
    if role == "admin":
        return True, "admin"
    if action in ("read", "list"):
        return role in ("sales", "viewer"), f"{role} may read"
    if role == "sales" and action == "create":
        return True, "sales may create"
    if role == "sales" and action == "update":
        return record is not None and record["owner_id"] == user["id"], "own records only"
    return False, f"{role} may not {action}"


# ---------------------------------------------------------------- Step 5
def reduce(state, event):
    """A pure reducer with optimistic adds and rollback."""
    leads, pending, error = dict(state["leads"]), dict(state["pending"]), None
    kind = event["type"]
    if kind == "add_pending":
        pending[event["temp_id"]] = event["lead"]
    elif kind == "add_ok":
        lead = pending.pop(event["temp_id"])
        leads[event["id"]] = {**lead, "id": event["id"]}
    elif kind == "add_failed":
        pending.pop(event["temp_id"], None)
        error = event["message"]
    elif kind == "move_stage":
        leads[event["id"]] = {**leads[event["id"]], "stage": event["stage"]}
    return {"leads": leads, "pending": pending, "error": error}


if __name__ == "__main__":
    print(spec_gaps(SPEC))
    print(schema_issues(TABLES))
    print(authorize(SALES, "update", THEIRS), respond("update", allowed=False))
    s = reduce(START, {"type": "add_pending", "temp_id": "t1", "lead": {"name": "Oak & Co", "stage": "new"}})
    print(reduce(s, {"type": "add_failed", "temp_id": "t1", "message": "email already exists"}))

@@step
{
  "stepNumber": 1,
  "title": "Find gaps in the specification",
  "instruction": "Implement spec_gaps(spec). Add 'missing <key>' for each of purpose, roles, entities, pages, and auth that is missing or empty. For each entity field with an empty type, add '<Entity>.<field> has no type'. Add 'permissions for unknown role <role>' for permission entries whose role is not listed, then 'no permissions for <role>' for listed roles without permissions. Check the lead tracker specification and an empty one. This is specifying an app for an AI builder from Section 2. [MOD-9.8]",
  "hintConceptual": "Before the builder starts, read the order form for blanks: missing sections, fields with no type, and people listed with no rules about what they may do.",
  "hintSyntax": "gaps = []\nfor key in (\"purpose\", \"roles\", \"entities\", \"pages\", \"auth\"):\n    if not spec.get(key): gaps.append(f\"missing {key}\")\nfor name, fields in (spec.get(\"entities\") or {}).items():\n    for field, kind in fields.items():\n        if not kind: gaps.append(f\"{name}.{field} has no type\")\nroles, permissions = spec.get(\"roles\") or [], spec.get(\"permissions\") or {}\ngaps += [f\"permissions for unknown role {r}\" for r in permissions if r not in roles]\ngaps += [f\"no permissions for {r}\" for r in roles if r not in permissions]\nreturn gaps"
}
@@assert
assert spec_gaps(SPEC) == ["Lead.value has no type", "no permissions for viewer"], f"Two gaps, got {spec_gaps(SPEC)}"
assert spec_gaps({}) == ["missing purpose", "missing roles", "missing entities", "missing pages", "missing auth"], "An empty specification"
assert spec_gaps({**SPEC, "permissions": {**SPEC["permissions"], "viewer": ["read"], "guest": ["read"]}}) == ["Lead.value has no type", "permissions for unknown role guest"], "An unknown role"
print("Step 1 passed: the untyped value and the viewer's missing permissions are caught before building.")

@@step
{
  "stepNumber": 2,
  "title": "Check the data model",
  "instruction": "Implement schema_issues(tables). For each table in order: add '<table> has no primary key id' unless its 'id' column is 'pk'; for each column whose kind starts with 'fk:', take the target table and add '<table>.<col> references missing table <target>' if it does not exist, otherwise add '<table>.<dup> duplicates data from <target>' for every other column starting with the target's name lower-cased with trailing 's' removed plus '_'; finally add '<table> has no created_at' if that column is absent. Check the three tables. This is data modelling from Section 2. [MOD-9.8]",
  "hintConceptual": "Every drawer needs a label, every cross-reference must point to a drawer that exists, and no fact should be written in two drawers where the copies can drift apart.",
  "hintSyntax": "issues = []\nfor table, cols in tables.items():\n    if cols.get(\"id\") != \"pk\": issues.append(f\"{table} has no primary key id\")\n    for col, kind in cols.items():\n        if kind.startswith(\"fk:\"):\n            target = kind[3:]\n            if target not in tables: issues.append(f\"{table}.{col} references missing table {target}\")\n            else:\n                prefix = target.lower().rstrip(\"s\")\n                for dup in [d for d in cols if d.startswith(prefix + \"_\") and d != col]:\n                    issues.append(f\"{table}.{dup} duplicates data from {target}\")\n    if \"created_at\" not in cols: issues.append(f\"{table} has no created_at\")\nreturn issues"
}
@@assert
assert schema_issues(TABLES) == ["leads.user_name duplicates data from users", "notes has no primary key id", "notes.author_id references missing table staff", "notes has no created_at"], f"Four issues, got {schema_issues(TABLES)}"
_fixed = {"users": TABLES["users"], "leads": {k: v for k, v in TABLES["leads"].items() if k != "user_name"},
          "notes": {"id": "pk", "lead_id": "fk:leads", "body": "text", "author_id": "fk:users", "created_at": "timestamp"}}
assert schema_issues(_fixed) == [], "The corrected model"
assert schema_issues({"t": {"id": "uuid"}}) == ["t has no primary key id", "t has no created_at"], "Key and timestamp"
print("Step 2 passed: a copied name, a keyless table, and a dangling reference found.")

@@step
{
  "stepNumber": 3,
  "title": "Generate routes and status codes",
  "instruction": "Implement routes(resource, children): for '/<resource>' return ('GET', base, 'list'), ('POST', base, 'create'), ('GET', base + '/{id}', 'read'), ('PATCH', base + '/{id}', 'update'), ('DELETE', base + '/{id}', 'delete'), then for each child ('GET', base + '/{id}/<child>', 'list <child>') and ('POST', same path, 'create <child>'). Implement respond(action, found, valid, allowed): 403 if not allowed, else 422 if not valid, else 404 if not found and the action is neither create nor list, else STATUS[action]. Generate the lead routes and check seven responses. This is APIs from Section 2. [MOD-9.8]",
  "hintConceptual": "Every kind of thing gets the same five doors, and every reply uses the standard code: made it, here it is, gone, not allowed, not found, or that order does not make sense.",
  "hintSyntax": "base = f\"/{resource}\"\ntable = [(\"GET\", base, \"list\"), (\"POST\", base, \"create\"), (\"GET\", base + \"/{id}\", \"read\"), (\"PATCH\", base + \"/{id}\", \"update\"), (\"DELETE\", base + \"/{id}\", \"delete\")]\nfor child in children:\n    table += [(\"GET\", f\"{base}/{{id}}/{child}\", f\"list {child}\"), (\"POST\", f\"{base}/{{id}}/{child}\", f\"create {child}\")]\nreturn table\n\n# respond\nif not allowed: return 403\nif not valid: return 422\nif not found and action not in (\"create\", \"list\"): return 404\nreturn STATUS[action]"
}
@@assert
_r = routes("leads", ["notes"])
assert _r[:5] == [("GET", "/leads", "list"), ("POST", "/leads", "create"), ("GET", "/leads/{id}", "read"), ("PATCH", "/leads/{id}", "update"), ("DELETE", "/leads/{id}", "delete")], f"Five routes, got {_r[:5]}"
assert _r[5:] == [("GET", "/leads/{id}/notes", "list notes"), ("POST", "/leads/{id}/notes", "create notes")] and len(routes("users")) == 5, "Nested routes"
assert [respond("create"), respond("read", found=False), respond("update", valid=False), respond("delete", allowed=False), respond("delete")] == [201, 404, 422, 403, 204], "Status codes"
assert respond("update", found=False, valid=False, allowed=False) == 403 and respond("list", found=False) == 200, "Authorisation first; lists are never 404"
print("Step 3 passed: seven routes, and 403 is decided before 422 or 404.")

@@step
{
  "stepNumber": 4,
  "title": "Enforce role-based access",
  "instruction": "Implement authorize(user, action, record). Admins get (True, 'admin'). For 'read' or 'list', return whether the role is sales or viewer, with '<role> may read'. A salesperson creating gets (True, 'sales may create'). A salesperson updating gets whether the record exists and its owner_id equals the user's id, with 'own records only'. Everything else is (False, '<role> may not <action>'). Check eight decisions. This is access control from Section 2. [MOD-9.8]",
  "hintConceptual": "The manager may do anything, sales staff may look at every file and add new ones but only change their own, and observers may only look.",
  "hintSyntax": "role = user[\"role\"]\nif role == \"admin\":\n    return True, \"admin\"\nif action in (\"read\", \"list\"):\n    return role in (\"sales\", \"viewer\"), f\"{role} may read\"\nif role == \"sales\" and action == \"create\":\n    return True, \"sales may create\"\nif role == \"sales\" and action == \"update\":\n    return record is not None and record[\"owner_id\"] == user[\"id\"], \"own records only\"\nreturn False, f\"{role} may not {action}\""
}
@@assert
assert authorize(SALES, "update", MINE) == (True, "own records only") and authorize(SALES, "update", THEIRS) == (False, "own records only"), f"Ownership, got {authorize(SALES, 'update', THEIRS)}"
assert authorize(SALES, "delete", MINE) == (False, "sales may not delete") and authorize(SALES, "create") == (True, "sales may create"), "Sales cannot delete; can create"
assert authorize(VIEWER, "list") == (True, "viewer may read") and authorize(VIEWER, "update", MINE) == (False, "viewer may not update"), "Viewers read only"
assert authorize(ADMIN, "delete", THEIRS) == (True, "admin") and authorize(SALES, "update") == (False, "own records only"), "Admin; no record means no update"
print("Step 4 passed: user 7 can edit lead 1 but not lead 2.")

@@step
{
  "stepNumber": 5,
  "title": "Manage state with a reducer",
  "instruction": "Implement reduce(state, event). Copy the leads and pending dictionaries and set error to None. 'add_pending' stores the event's lead under its temp_id in pending. 'add_ok' removes the temp_id from pending and stores that lead in leads under the event's id, with 'id' set. 'add_failed' removes the temp_id from pending and sets error to the message. 'move_stage' replaces the lead with the given id by a copy with the new stage. Return the new state without modifying the old one. Run an add that succeeds, one that fails, and a stage move. This is state in the frontend from Section 2. [MOD-9.8]",
  "hintConceptual": "Write the new order on the board straight away in pencil; ink it in when the kitchen confirms, rub it out with a note if the kitchen refuses, and never scribble over yesterday's board.",
  "hintSyntax": "leads, pending, error = dict(state[\"leads\"]), dict(state[\"pending\"]), None\nkind = event[\"type\"]\nif kind == \"add_pending\":\n    pending[event[\"temp_id\"]] = event[\"lead\"]\nelif kind == \"add_ok\":\n    lead = pending.pop(event[\"temp_id\"])\n    leads[event[\"id\"]] = {**lead, \"id\": event[\"id\"]}\nelif kind == \"add_failed\":\n    pending.pop(event[\"temp_id\"], None)\n    error = event[\"message\"]\nelif kind == \"move_stage\":\n    leads[event[\"id\"]] = {**leads[event[\"id\"]], \"stage\": event[\"stage\"]}\nreturn {\"leads\": leads, \"pending\": pending, \"error\": error}"
}
@@assert
_p = reduce(START, {"type": "add_pending", "temp_id": "t1", "lead": {"name": "Oak & Co", "stage": "new"}})
assert _p is not None and _p["pending"] == {"t1": {"name": "Oak & Co", "stage": "new"}} and START["pending"] == {}, f"Pending without touching the old state, got {_p}"
_ok = reduce(_p, {"type": "add_ok", "temp_id": "t1", "id": 2})
assert _ok == {"leads": {1: {"id": 1, "name": "Harper Joinery", "stage": "new"}, 2: {"name": "Oak & Co", "stage": "new", "id": 2}}, "pending": {}, "error": None}, "Confirmed"
assert reduce(_p, {"type": "add_failed", "temp_id": "t1", "message": "email already exists"}) == {"leads": START["leads"], "pending": {}, "error": "email already exists"}, "Rolled back with an error"
_m = reduce(_ok, {"type": "move_stage", "id": 1, "stage": "quoted"})
assert _m["leads"][1]["stage"] == "quoted" and _ok["leads"][1]["stage"] == "new", "Moves create new objects"
print("Step 5 passed: the duplicate lead is rolled back with its error; the old state never changes.")
