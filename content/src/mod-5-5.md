@@meta
{
  "moduleId": "MOD-5.5",
  "slug": "mod-5-5",
  "unitId": "UNIT-5",
  "unitTitle": "Unit 5: Complete Prompt Engineering Master Class",
  "title": "Structured Output",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Structured Outputs", "source": "OpenAI API Docs", "url": "https://developers.openai.com/api/docs/guides/structured-outputs" },
    { "title": "Structured outputs", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/build-with-claude/structured-outputs" },
    { "title": "Structured output", "source": "Google AI Studio Docs", "url": "https://aistudio.google.com/docs/structured-output" },
    { "title": "Introducing Structured Outputs in the API", "source": "OpenAI", "url": "https://openai.com/index/introducing-structured-outputs-in-the-api/" },
    { "title": "Efficient Guided Generation for Large Language Models", "source": "arXiv", "url": "https://arxiv.org/abs/2307.09702" },
    { "title": "Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models", "source": "arXiv", "url": "https://arxiv.org/abs/2408.02442" }
  ],
  "videoLibrary": [
    {
      "id": "VID-5.5-1",
      "title": "Getting Structured Output in JSON format",
      "creator": "Telusko",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=CllLqPwCjD4",
      "timingInstruction": "Watch the final section on how the next token is chosen, before Section 2",
      "keyTakeaway": "Requesting and parsing JSON output from a model in code."
    },
    {
      "id": "VID-5.5-2",
      "title": "Constrained Decoding Explained: How LLMs Generate Perfect Structured Output",
      "creator": "Engineering Insider",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=zf26-YNA9Cc",
      "timingInstruction": "Optional background on tool use, after reading Section 2",
      "keyTakeaway": "How constrained decoding guarantees output that matches a schema."
    },
    {
      "id": "VID-5.5-3",
      "title": "Building with the Claude API",
      "creator": "Anthropic",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/building-with-the-claude-api",
      "timingInstruction": "Take the lessons on tool use and structured data after completing the lab",
      "keyTakeaway": "Covers requesting structured data from a model in code, with schemas and tool definitions, and handling the cases where it goes wrong."
    },
    {
      "id": "VID-5.5-4",
      "title": "Generative AI for Software Development",
      "creator": "DeepLearning.AI",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/professional-certificates/generative-ai-for-software-development",
      "timingInstruction": "Optional, for readers who will build software around model output",
      "keyTakeaway": "A course series on using models inside software, where output that a program can parse is a basic requirement."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Extract, Validate, Repair, and Constrain",
    "context": "A team is wiring a model into an order-processing system that will fail if it receives anything other than data in an exact shape. You will build the safety net for that: a function that digs JSON out of a chatty reply, a validator for a small schema language, a repair loop that feeds errors back to the model, and a toy constrained decoder that makes invalid output impossible.",
    "language": "python"
  }
}

@@reading
# Structured Output

A person reading a model's answer does not mind whether it begins "Sure, here is the summary" or goes straight to the point. A program minds very much. Software that expects a customer's name, an amount, and a date in fixed places will crash, or worse, silently do the wrong thing, when it receives a friendly paragraph.

**Structured output** is model output in a form a program can rely on: fields with names, values of known types, in a predictable arrangement. Usually that form is JSON. This chapter explains why structure matters, the four ways of getting it, how the strongest of them makes invalid output impossible, and why even valid output still has to be checked.

## 1. First-Principles Mental Model & Intuition

### A form, not a letter

Imagine a clerk who processes applications. The clerk can handle a completed form: name in this box, date in that one. The clerk cannot handle a letter, however well written, because finding the date means reading and interpreting, and the clerk has no judgement to exercise.

Software is that clerk. A model, left to itself, writes letters.

```text
   WHAT A MODEL TENDS TO WRITE                 WHAT A PROGRAM NEEDS

   Sure! I found the details. The              {
   customer is Ada Lovelace, and she             "customer": "Ada Lovelace",
   ordered 3 units on the 4th of March.          "quantity": 3,
   Let me know if you need anything else!        "date": "2026-03-04"
                                               }
```

Both contain the same facts. Only the second can be handed to a program.

### Three levels of assurance

There are three ways to get a form in place of a letter, in increasing order of strength.

| Level | What you do | What you get |
|---|---|---|
| **Ask** | Describe the format in the prompt, perhaps with an example | Usually the right shape. Sometimes a letter |
| **Ask and check** | Parse the reply, validate it, and ask again if it fails | The right shape, after some retries |
| **Enforce** | Have the provider restrict the model so that only valid output can be produced | The right shape, every time |

The third level sounds like the end of the story. It is not, because of a distinction that runs through this whole chapter.

### Valid is not correct

A form can be filled in perfectly and be wrong. Every box has a value of the right kind, and the date is the wrong date.

```text
   {"customer": "Ada Lovelace", "quantity": 30, "date": "2026-03-04"}
```

That is flawless JSON matching the schema, and the quantity is ten times what was ordered. Enforcement guarantees the **shape**. Nothing guarantees the **content**. Structured output makes a model's answer usable by software. It does not make the answer true, and the checking habits of earlier modules still apply.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### JSON and schemas in one page

JSON is a text format for data built from six kinds of value: strings in double quotes, numbers, the words true and false, null, arrays in square brackets, and objects, which are named fields in braces. Module 5.10 covers it in full.

A **schema** describes the shape a piece of JSON must have. The standard way to write one is itself JSON, in a notation called JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "customer": {"type": "string"},
    "quantity": {"type": "integer"},
    "priority": {"type": "string", "enum": ["low", "normal", "high"]}
  },
  "required": ["customer", "quantity"],
  "additionalProperties": false
}
```

This says: an object, with a text field called customer, a whole-number field called quantity, and an optional priority that must be one of three words. Customer and quantity must be present. No other fields are allowed.

### Four techniques

| Technique | How it works | Reliability |
|---|---|---|
| **Format instructions** | Describe the fields in the prompt and say "return only JSON" | Good with current models, never guaranteed |
| **An example of the output** | Show one complete sample, as in Module 5.4 | Better, and very good for unusual shapes |
| **Tool calling** | Define a tool whose arguments have the schema you want. The model "calls" it, and the arguments are your data | High, and the standard route before enforcement existed |
| **Schema-enforced output** | Give the provider a schema. The model is restricted during generation so that only matching output can be produced | Guaranteed shape, with conditions |

Providers also distinguish two things that sound alike. A **JSON mode** guarantees that the output is valid JSON and says nothing about which fields it contains. **Structured outputs**, in the full sense, guarantee that the output matches your schema. OpenAI's documentation makes the distinction explicitly and recommends the second. Anthropic's and Google's interfaces offer schema-enforced output too, each with its own parameter names. In all three, you supply a JSON Schema and receive JSON that fits it.

When OpenAI introduced schema enforcement in August 2024, it reported that its new model scored 100 percent on its test of following complex schemas, where an earlier model given only instructions scored under 40 percent. That gap is the difference between asking and enforcing.

### How enforcement works: constrained decoding

Module 1.4 described how a model writes: at each step it assigns a score to every token in its vocabulary, converts the scores to probabilities, and picks one. **Constrained decoding** intervenes between the scoring and the picking.

```text
   text so far:   {"quantity":

   model's scores for the next token:
        " three"   high        <- would break the schema: a number is required
        " 3"       high        <- allowed
        "Sure"     medium      <- would break JSON
        " 30"      low         <- allowed
        "}"        low         <- not allowed yet: the value is missing

   the mask:  keep only tokens that leave the output a valid beginning of
              something the schema permits

   after masking:   " 3"  and  " 30"  remain.  One of them is chosen.
```

The schema is compiled into a grammar, and the grammar into a machine that, given the text so far, can say which tokens are permitted next. Every other token has its probability set to zero before the choice is made. If $p_i$ is the model's probability for token $i$ and $V$ is the set of permitted tokens, the constrained probability is

$$
p'_i =
\begin{cases}
\dfrac{p_i}{\sum_{j \in V} p_j} & \text{if } i \in V \\[2ex]
0 & \text{otherwise}
\end{cases}
$$

The model is still choosing. It is choosing among valid options only. The output cannot fail to match, in the same way that a pen which only writes inside the boxes cannot write outside them. A 2023 paper, "Efficient Guided Generation", showed how to compute the permitted set quickly enough to be practical, and open-source tools for local models work the same way.

Look again at the example above. Both "3" and "30" are permitted. The mask enforces "a whole number here". It has no opinion about which whole number. Valid is not correct.

### The conditions on the guarantee

Enforced output has limits that the documentation spells out, and that are worth knowing before you rely on it.

**Schemas must use a supported subset.** Providers support the core of JSON Schema and reject or ignore the rest. Typical restrictions, which differ by vendor and change over time: every field must be listed as required, with optional values expressed as "this type or null". Extra fields must be forbidden. Limits on numbers, such as a minimum and maximum, and on string length may be unsupported. One vendor documents that it silently drops some constraints it does not enforce. Read the current list for the provider you use.

**A refusal is not a form.** If a request falls foul of safety rules, the model may decline. OpenAI's documentation notes that a refusal arrives in a separate field and may not match your schema. Code that assumes every reply parses will crash on the first refusal.

**Truncated output is invalid output.** If the reply hits the output-token limit partway through, the JSON is cut off mid-object. Check why the reply ended before parsing it.

**Rules the schema cannot express still need code.** "The end date is after the start date" and "the line items add up to the total" are not expressible in a schema. They are checked in your program.

### Structure can cost reasoning

A 2024 study, "Let Me Speak Freely?", reported that forcing strict formats reduced models' performance on reasoning tasks, and that tighter restrictions did more damage. Its conclusions have been disputed, by researchers who argued that better prompting closes the gap. The practical lesson is uncontroversial and comes down to the order of the fields.

A model writes from left to right. If the first field in your schema is the answer, the model must commit to an answer before it has written any reasoning. Put a reasoning field first:

```text
   {"answer": "...", "reasoning": "..."}       the answer is fixed before any thinking is written
   {"reasoning": "...", "answer": "..."}       the thinking is written first, and the answer follows from it
```

The alternative is two steps: let the model reason in free text, then, in a second request, convert the conclusion to the structure. Models that reason internally before answering reduce the problem, since their thinking happens before any output is written.

### Validation in layers

Whatever technique you use, check the output in layers, from cheapest to most expensive.

| Layer | Question | Caught by |
|---|---|---|
| **Syntax** | Is this JSON at all? | A JSON parser |
| **Schema** | Are the right fields present, with the right types? | A schema validator |
| **Semantics** | Do the values make sense together? | Rules in your code |
| **Truth** | Do the values match the source? | Comparison with the input, or a person |

Enforcement takes care of the first two. The third and fourth are always yours.

### Repair loops, and their arithmetic

Without enforcement, some replies will fail. Suppose a model produces valid output with probability $p$ on each attempt. A workflow that makes $n$ calls and needs all of them to succeed does so with probability

$$
P(\text{all valid}) = p^{n}
$$

At $p = 0.95$ and $n = 20$, that is $0.95^{20} = 0.358$. A step that works 95 percent of the time, used twenty times, fails the workflow nearly two times in three.

The remedy is to retry. If each call may be attempted up to $k + 1$ times, and failures were independent, the chance that a call fails every time would be

$$
(1 - p)^{k + 1}
$$

With a 5 percent failure rate and three retries, $0.05^{4}$ is about six in a million. Failures are not independent, though. A model that produced a trailing comma once, asked the identical question again, will often do it again. This is why a good **repair loop** does not simply repeat the request. It tells the model what was wrong:

```text
   attempt 1   -->  reply  -->  parse and validate  -->  errors
                                                           |
   attempt 2   <--  the original prompt  +  "Your reply was rejected:
                    $.age: expected integer. Return only the corrected JSON."
```

The error message changes the prompt, which changes the distribution, which is what makes a different result likely. The loop must have a limit, after which it reports failure and stops.

### Complexity

Parsing and validating are linear in the size of the output. A repair loop multiplies cost by the number of attempts, which is usually one. Constrained decoding adds a small cost per token, and providers note a one-off delay the first time a new schema is used, while it is compiled.

## 3. Production-Grade Implementation & Annotated Walkthrough

The "ask and check" level can be built in full, and the "enforce" level in miniature. First, getting JSON out of a reply and validating it.

```python
import json

def extract_json(text):
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end < start:
        raise ValueError("no JSON object found")
    try:
        return json.loads(text[start:end + 1])
    except json.JSONDecodeError as problem:
        raise ValueError(f"invalid JSON: {problem.msg}") from None

TYPES = {"object": dict, "array": list, "string": str, "boolean": bool, "number": (int, float), "integer": int}

def validate(value, schema, path="$"):
    expected = schema.get("type")
    if expected:
        matches = isinstance(value, TYPES[expected])
        if expected in ("number", "integer") and isinstance(value, bool):
            matches = False
        if not matches:
            return [f"{path}: expected {expected}"]
    errors = []
    if "enum" in schema and value not in schema["enum"]:
        errors.append(f"{path}: not one of {schema['enum']}")
    if isinstance(value, dict):
        errors += [f"{path}.{key}: required" for key in schema.get("required", []) if key not in value]
        properties = schema.get("properties", {})
        for key, item in value.items():
            if key in properties:
                errors += validate(item, properties[key], f"{path}.{key}")
            elif schema.get("additionalProperties") is False:
                errors.append(f"{path}.{key}: not allowed")
    if isinstance(value, list) and "items" in schema:
        for index, item in enumerate(value):
            errors += validate(item, schema["items"], f"{path}[{index}]")
    return errors

PERSON = {
    "type": "object",
    "properties": {"name": {"type": "string"}, "age": {"type": "integer"},
                   "role": {"type": "string", "enum": ["admin", "member"]}},
    "required": ["name", "age"],
    "additionalProperties": False,
}
chatty = 'Sure! Here is the record:\n```json\n{"name": "Ada", "age": "36", "role": "owner", "team": "maths"}\n```\nAnything else?'
record = extract_json(chatty)
print(record)
for error in validate(record, PERSON):
    print("  ", error)
print(validate({"name": "Ada", "age": 36}, PERSON), validate({"name": "Ada", "age": 360}, PERSON))
```

- **`extract_json` takes everything from the first opening brace to the last closing brace.** That discards the greeting, the code fence, and the sign-off in one move. It is crude and handles the commonest mess.
- **It raises an error when there is nothing to parse.** A reply with no braces, or one cut off before the closing brace, is reported as such. The parser's own message is passed on, so that the model can be told what was wrong.
- **`validate` returns a list of errors, each with a path.** `$` stands for the whole value, `$.age` for a field, `$.items[2]` for an element of an array. A path tells the model, or a person, exactly where to look.
- **A wrong type stops the check at that point.** If the value should be an object and is a string, there is no sense in looking for its fields.
- **True and false are not numbers.** In Python, `True` counts as an integer. The explicit check stops `true` from passing where a number is required.
- **The chatty reply fails three ways.** The age is text, the role is not one of the permitted words, and there is a field the schema does not allow. All three are found and reported in one pass.
- **An age of 360 passes.** It is an integer, and the schema asks for nothing more. Here is "valid is not correct" in a single line of output. A rule such as "between 0 and 130" belongs in a further check.

Next, the repair loop, with a scripted stand-in for the model.

```python
def repair_loop(model, prompt, schema, max_attempts=3):
    current = prompt
    for attempt in range(1, max_attempts + 1):
        try:
            value = extract_json(model(current))
            errors = validate(value, schema)
        except ValueError as problem:
            errors = [str(problem)]
        if not errors:
            return value, attempt
        current = prompt + "\n\nYour previous reply was rejected: " + "; ".join(errors) + "\nReturn only the corrected JSON."
    raise ValueError(f"no valid output after {max_attempts} attempts")

def scripted_model(replies):
    seen = []
    def model(prompt):
        seen.append(prompt)
        return replies[min(len(seen), len(replies)) - 1]
    model.seen = seen
    return model

model = scripted_model(['Here you go: {"name": "Ada", "age": "36"}', '{"name": "Ada"}', '{"name": "Ada", "age": 36}'])
print(repair_loop(model, "Extract the person as JSON.", PERSON))
print(model.seen[1])
print(f"20 calls at 95%: {0.95 ** 20:.3f}   one call failing 4 times in a row: {0.05 ** 4:.2e}")
```

- **Each attempt is extract, then validate.** A failure at either stage becomes a list of error messages. Both kinds of failure are handled by one path.
- **The error is sent back with the original prompt.** The second request is the first request plus a statement of what was wrong. The model is told the specific fault, which is what makes a different answer likely.
- **The corrected prompt is rebuilt from the original each time.** Errors from attempt one are not carried into attempt three. Each retry carries only the most recent complaint, so the prompt does not grow without limit.
- **The loop is bounded.** After `max_attempts` it raises an error. A loop that retried forever would spend without end on a request the model cannot satisfy.
- **The stand-in fails twice and succeeds on the third attempt.** First a number written as text, then a missing field, then a correct record. The function returns the record and the number of attempts it took.
- **The last line is the arithmetic from Section 2.** Twenty calls at 95 percent succeed together about 36 percent of the time. Four independent failures in a row would be six in a million, which is the optimistic bound.

Finally, enforcement in miniature: a decoder that can only produce one of two valid outputs.

```python
TARGETS = ('{"ok": true}', '{"ok": false}')

def allowed_next(prefix, targets=TARGETS):
    return sorted({target[len(prefix)] for target in targets if target.startswith(prefix) and len(target) > len(prefix)})

def constrained_decode(score, targets=TARGETS):
    text = ""
    while True:
        options = allowed_next(text, targets)
        if not options:
            return text
        text += min(options, key=lambda character: (-score(text, character), character))

def chatty_score(text, character):
    return {"S": 9, "u": 8, "r": 7, "e": 6, "f": 2, "t": 1}.get(character, 0)

print(allowed_next(""), allowed_next('{"ok": '), allowed_next('{"ok": t'), allowed_next('{"ok": true}'))
print("what the model wants to write first:", max("Sure{tf", key=lambda character: chatty_score("", character)))
print("what constrained decoding produces :", constrained_decode(chatty_score))
print("with the scores for t and f swapped:", constrained_decode(lambda text, character: {"t": 2, "f": 1}.get(character, 0)))
```

- **The "schema" here is a list of every permitted output.** A real schema permits an unbounded number of outputs and is compiled into a machine. A list of two strings does the same job for a toy.
- **`allowed_next` is the mask.** Given the text so far, it returns the characters that keep the text a valid beginning of some permitted output. At the start only an opening brace is allowed. After `{"ok": ` there are two choices. After `{"ok": t` there is one.
- **An empty list means the output is complete.** Nothing can follow a finished object.
- **`constrained_decode` picks the best-scoring permitted character at each step.** The model's scores still decide between the allowed options. They cannot select anything outside them.
- **The stand-in model wants to write "Sure".** Its highest score is for a capital S. Unconstrained, its output would begin with a greeting.
- **Constrained, it writes valid JSON.** The S is never among the permitted characters, so it is never chosen. At the one real choice, the model prefers "f", and the output is `{"ok": false}`.
- **Swap the preference and the value changes.** The structure is guaranteed by the mask. The content is decided by the model. Enforcement made the output valid. It did not make "false" the right answer.

**Complexity.** `extract_json` and `validate` are linear in the size of the reply. `repair_loop` makes at most `max_attempts` calls. `allowed_next` compares the prefix with each target, and `constrained_decode` calls it once per character produced.

### Designing a schema

A schema is a prompt. The model reads the field names and descriptions and is guided by them.

1. **Name fields for what they hold.** `invoice_total_pence` tells the model more than `value`.
2. **Describe fields** where the name is not enough, including units and formats: "ISO date, YYYY-MM-DD".
3. **Use enums for categories.** A fixed list of permitted words removes spelling variants and invented categories.
4. **Put reasoning before conclusions.** Fields are written in order.
5. **Include a way to say "not found".** A nullable field, or an explicit "unknown" in an enum. Without one, the model must invent a value to satisfy the schema.
6. **Keep it shallow.** Deep nesting is harder for a model to fill correctly and harder for you to validate.
7. **Do not ask for what you will not use.** Every field is more output to pay for and more to go wrong.

The fifth point matters most. A required field with no escape forces a value into existence. An invoice with no purchase-order number, run through a schema that demands one, will acquire one.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Markdown fences around the JSON.** Asked for JSON in an ordinary chat request, models often wrap it in a code fence and add a sentence before or after. A naive parser fails on the first character. Extract the object before parsing, or use an enforced mode.

**The reply was cut off.** A long structured output hits the token limit and ends mid-string. The result is not valid JSON, enforced or not. Check the reason the response ended, raise the limit, or ask for less.

**Required fields that invent data.** The schema requires a phone number and the document has none. The model produces a plausible one. Allow null, and say in the field's description when to use it.

**The answer before the reasoning.** A schema with `verdict` first and `explanation` second gets a verdict chosen without the explanation, and an explanation written to justify it. Reverse the order.

**Trusting the shape.** A team switches on schema enforcement, sees that every reply now parses, and stops checking values. Enforcement fixed the format errors. The wrong quantities and transposed dates are still there, now in perfectly valid JSON.

**Constraints the provider ignores.** A schema specifies a maximum length or a numeric range, the provider does not enforce that keyword, and the output violates it. Know which parts of your schema are enforced and validate the rest yourself.

**Refusals crash the parser.** The first time a model declines a request, code that assumed a JSON object fails. Handle the refusal case explicitly.

**Retrying without changing anything.** At a low temperature, the same request produces the same failure. Feed the error back, as the repair loop does.

**Enums that are too long or too vague.** Sixty categories with overlapping meanings produce inconsistent labels. Fewer, clearer categories, each with a one-line description, do better.

**Numbers as text.** `"36"` in place of `36`. Type checks catch it. So does asking for the right thing: say "an integer" in the field description.

**Parsing with string tricks.** Pulling values out of a reply with pattern matching breaks the first time the model reorders fields or adds a space. Parse the JSON properly, then read the fields.

**Structure where prose was wanted.** Not every output is for a program. Forcing a nuanced analysis into fields flattens it. Use structure for what software will consume, and prose for what a person will read.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Structured output is model output in a form software can rely on, usually JSON matching a schema. There are four ways to get it: format instructions, an example, tool calling, and schema-enforced output, in rising order of reliability. Enforcement works by constrained decoding: at each step, tokens that would make the output invalid are removed before one is chosen, so the result cannot fail to match the schema. The guarantee has conditions, including a supported subset of schema features, separate handling of refusals, and truncation at the token limit. And it covers only the shape: a value can be of the right type and wrong, so output must still be checked for sense and against its source. Without enforcement, validity compounds as $p^n$ across calls, and a repair loop that feeds the specific error back to the model, with a limit on attempts, is the remedy. A schema is itself a prompt: clear field names, enums for categories, reasoning fields before conclusions, and a way to say that a value was not found.

**Question 1.** A workflow makes 30 calls to a model, each of which returns valid structured output 97 percent of the time, and the workflow fails if any call fails. Compute the chance the workflow succeeds. Then suppose each call may be attempted up to three times in total, and treat failures as independent: compute the chance that a single call fails all three attempts, and the chance that the workflow now succeeds. Why is the second figure optimistic, and what makes it more nearly true?

<details>
<summary>View Answer</summary>

With no retries, the workflow succeeds only if all 30 calls do: 0.97 to the thirtieth power, which is about 0.401. So a step that works 97 percent of the time produces a workflow that fails about six times in ten. With up to three attempts per call, a call fails only if all three attempts fail. If failures were independent that would be 0.03 cubed, which is 0.000027, or 27 in a million. Each call then succeeds with probability 0.999973, and all 30 succeed with probability 0.999973 to the thirtieth power, about 0.9992. The workflow now fails less than once in a thousand runs. The figure is optimistic because failures are not independent. A model that produced a particular error, given the identical request again, is likely to produce it again, especially at a low temperature where output varies little. If the retry were a pure repeat, the chance of three failures could be close to the chance of one. What makes the calculation more nearly true is changing the request on each retry: sending back the original prompt together with the specific error, such as the field and the expected type. That alters the distribution the model samples from and makes a corrected answer likely. Schema enforcement by the provider removes format failures altogether, leaving refusals and truncation as the cases still to be handled.

</details>

**Question 2.** A model extracts data from an invoice into this structure: an invoice number, a date, a list of line items each with a description, quantity, and unit price, and a total. Schema enforcement is switched on, and every reply parses. A month later, accounts discover several records where the total does not equal the sum of the line items. Explain how that is possible, and describe the checks that should have been in place, by layer.

<details>
<summary>View Answer</summary>

Schema enforcement guarantees the shape of the output and nothing about its values. Constrained decoding permits any token that keeps the output consistent with the schema: where the schema says "a number", every number is permitted. The total is a number and each line item's quantity and price are numbers, so a record in which they do not add up satisfies the schema exactly as well as one in which they do. The model may have misread a figure on the invoice, dropped a line item, or copied a subtotal in place of the total. The team saw that every reply parsed and concluded that the extraction was working, when parsing only showed that the first two layers of checking had passed. By layer: syntax and schema are handled by enforcement, though the code should still handle refusals and truncated replies. The semantic layer is what was missing. Rules that a schema cannot express must be checked in code: the sum of quantity times unit price across the line items should equal the total, within a small tolerance for rounding. The date should be a real date and not in the future. Quantities should be positive. The truth layer comes last: figures should be compared with the source, for instance by confirming that the total and the invoice number appear in the document's text, and a sample of records, plus every record that fails a rule, should be reviewed by a person. Records failing any check should be held back from the accounts and not passed through.

</details>

**Question 3.** Critique this schema for classifying customer complaints, and propose a better one: an object with required fields, in this order: `category` (a string), `severity` (a number), `explanation` (a string), and `order_number` (a string).

<details>
<summary>View Answer</summary>

There are five problems. First, the order. The category and severity come before the explanation, so the model must commit to both before writing any reasoning, and the explanation will then be composed to justify them. The reasoning should come first. Second, the category is a free string. The model will produce "billing", "Billing issue", "payments", and "invoice problem" for the same thing, and downstream software that counts categories will fragment. It should be an enum with a short fixed list, each with a clear meaning, including "other". Third, severity as an unconstrained number has no defined scale. One reply will say 3 and another 0.8 and another 85. It should be an enum of named levels, such as low, medium, and high, or an integer with the scale stated in its description. Fourth, the order number is required with no way to express absence. Many complaints will not mention one, and a required string forces the model to supply something, which means invented order numbers in the records. It should allow null, with a description saying to use null when no order number appears in the complaint. Fifth, nothing has a description, so the model must guess at meanings and formats. A better schema, in order: `reasoning`, a string, described as a brief analysis of the complaint; `category`, an enum; `severity`, an enum with the levels defined; `order_number`, a string or null; with every field required, extra fields forbidden, and a description on each. The values would still need checking: an order number, if given, should be confirmed to appear in the complaint's text.

</details>

@@starter
"""
Lab: Extract, Validate, Repair, and Constrain
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import json

TYPES = {"object": dict, "array": list, "string": str, "boolean": bool, "number": (int, float), "integer": int}

PERSON = {
    "type": "object",
    "properties": {"name": {"type": "string"}, "age": {"type": "integer"},
                   "role": {"type": "string", "enum": ["admin", "member"]}},
    "required": ["name", "age"],
    "additionalProperties": False,
}

TARGETS = ('{"ok": true}', '{"ok": false}')


def scripted_model(replies):
    """Provided: a stand-in model that returns the given replies in order, repeating the last.
    model.seen is the list of prompts it was called with."""
    seen = []

    def model(prompt):
        seen.append(prompt)
        return replies[min(len(seen), len(replies)) - 1]

    model.seen = seen
    return model


def chatty_score(text, character):
    """Provided: a stand-in model's scores. It would like to begin with the word "Sure"."""
    return {"S": 9, "u": 8, "r": 7, "e": 6, "f": 2, "t": 1}.get(character, 0)


# ---------------------------------------------------------------- Step 1
def extract_json(text):
    """Find the JSON object in a reply and parse it.
    Take the text from the FIRST "{" to the LAST "}" inclusive and parse it with json.loads.
    If there is no "{" or no "}" after it, raise ValueError("no JSON object found").
    If json.loads raises json.JSONDecodeError, raise ValueError("invalid JSON: " + its .msg)."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def validate(value, schema, path="$"):
    """Check a value against a small subset of JSON Schema. Return a list of error strings.
    1. If the schema has "type": the value must be an instance of TYPES[type]. True and False
       do NOT count as "number" or "integer". On a mismatch return [f"{path}: expected {type}"]
       at once, with no further checks.
    2. If the schema has "enum" and the value is not in it: add f"{path}: not one of {enum}".
    3. If the value is a dict:
         - for each key in schema.get("required", []) that is missing: add f"{path}.{key}: required"
         - for each key, item in the value: if the key is in schema.get("properties", {}),
           add the errors of validate(item, that schema, f"{path}.{key}");
           otherwise, if schema.get("additionalProperties") is False, add f"{path}.{key}: not allowed"
    4. If the value is a list and the schema has "items": validate each element with
       the path f"{path}[{index}]".
    An empty list means the value is valid."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def repair_loop(model, prompt, schema, max_attempts=3):
    """Ask the model, check the reply, and ask again with the errors if it fails.
    Start with current = prompt. For attempt 1, 2, ..., max_attempts:
      - reply = model(current); value = extract_json(reply); errors = validate(value, schema).
        If extract_json raises ValueError, errors = [the error's message].
      - if there are no errors, return (value, attempt)
      - otherwise current = prompt + "\\n\\nYour previous reply was rejected: " + "; ".join(errors)
                            + "\\nReturn only the corrected JSON."
    If every attempt fails, raise ValueError."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def allowed_next(prefix, targets=TARGETS):
    """The mask of a toy constrained decoder. targets lists every permitted output.
    Return the sorted list of characters that could come next: for each target that starts
    with prefix and is longer than it, the character at position len(prefix)."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def constrained_decode(score, targets=TARGETS):
    """Generate text one character at a time, choosing only among permitted characters.
    Start with an empty text. Repeat: get allowed_next(text, targets). If nothing is allowed,
    return the text. Otherwise append the allowed character with the highest
    score(text, character), breaking ties in favour of the character that sorts first."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    chatty = 'Sure! Here is the record:\n```json\n{"name": "Ada", "age": "36"}\n```'
    print("extracted:", extract_json(chatty))
    print("errors   :", validate({"name": "Ada", "age": "36"}, PERSON))
    print("repaired :", repair_loop(scripted_model(['{"name": "Ada"}', '{"name": "Ada", "age": 36}']), "Extract the person.", PERSON))
    print("allowed  :", allowed_next('{"ok": '))
    print("decoded  :", constrained_decode(chatty_score))

@@solution
"""
Lab solution: Extract, Validate, Repair, and Constrain
Standard library only.
"""
import json

TYPES = {"object": dict, "array": list, "string": str, "boolean": bool, "number": (int, float), "integer": int}

PERSON = {
    "type": "object",
    "properties": {"name": {"type": "string"}, "age": {"type": "integer"},
                   "role": {"type": "string", "enum": ["admin", "member"]}},
    "required": ["name", "age"],
    "additionalProperties": False,
}

TARGETS = ('{"ok": true}', '{"ok": false}')


def scripted_model(replies):
    """Provided: a stand-in model that returns the given replies in order, repeating the last.
    model.seen is the list of prompts it was called with."""
    seen = []

    def model(prompt):
        seen.append(prompt)
        return replies[min(len(seen), len(replies)) - 1]

    model.seen = seen
    return model


def chatty_score(text, character):
    """Provided: a stand-in model's scores. It would like to begin with the word "Sure"."""
    return {"S": 9, "u": 8, "r": 7, "e": 6, "f": 2, "t": 1}.get(character, 0)


# ---------------------------------------------------------------- Step 1
def extract_json(text):
    """First brace to last brace discards the greeting, the code fence, and the sign-off.
    A reply with nothing to parse is reported, and the parser's message is passed on."""
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end < start:
        raise ValueError("no JSON object found")
    try:
        return json.loads(text[start:end + 1])
    except json.JSONDecodeError as problem:
        raise ValueError(f"invalid JSON: {problem.msg}") from None


# ---------------------------------------------------------------- Step 2
def validate(value, schema, path="$"):
    """Every error carries a path, so a model or a person knows exactly where to look.
    This checks shape only: an age of 360 is a perfectly valid integer."""
    expected = schema.get("type")
    if expected:
        matches = isinstance(value, TYPES[expected])
        if expected in ("number", "integer") and isinstance(value, bool):
            matches = False
        if not matches:
            return [f"{path}: expected {expected}"]
    errors = []
    if "enum" in schema and value not in schema["enum"]:
        errors.append(f"{path}: not one of {schema['enum']}")
    if isinstance(value, dict):
        errors += [f"{path}.{key}: required" for key in schema.get("required", []) if key not in value]
        properties = schema.get("properties", {})
        for key, item in value.items():
            if key in properties:
                errors += validate(item, properties[key], f"{path}.{key}")
            elif schema.get("additionalProperties") is False:
                errors.append(f"{path}.{key}: not allowed")
    if isinstance(value, list) and "items" in schema:
        for index, item in enumerate(value):
            errors += validate(item, schema["items"], f"{path}[{index}]")
    return errors


# ---------------------------------------------------------------- Step 3
def repair_loop(model, prompt, schema, max_attempts=3):
    """A retry that repeats the same request tends to repeat the same failure. Sending the
    specific error back changes the prompt, which is what makes a different answer likely."""
    current = prompt
    for attempt in range(1, max_attempts + 1):
        try:
            value = extract_json(model(current))
            errors = validate(value, schema)
        except ValueError as problem:
            errors = [str(problem)]
        if not errors:
            return value, attempt
        current = prompt + "\n\nYour previous reply was rejected: " + "; ".join(errors) + "\nReturn only the corrected JSON."
    raise ValueError(f"no valid output after {max_attempts} attempts")


# ---------------------------------------------------------------- Step 4
def allowed_next(prefix, targets=TARGETS):
    """The mask: the characters that keep the text a valid beginning of a permitted output."""
    return sorted({target[len(prefix)] for target in targets if target.startswith(prefix) and len(target) > len(prefix)})


# ---------------------------------------------------------------- Step 5
def constrained_decode(score, targets=TARGETS):
    """The model's scores choose among the permitted characters and cannot select anything
    else. The structure is guaranteed. The content is still the model's choice."""
    text = ""
    while True:
        options = allowed_next(text, targets)
        if not options:
            return text
        text += min(options, key=lambda character: (-score(text, character), character))


if __name__ == "__main__":
    chatty = 'Sure! Here is the record:\n```json\n{"name": "Ada", "age": "36", "role": "owner", "team": "maths"}\n```\nAnything else?'
    record = extract_json(chatty)
    print(record)
    for error in validate(record, PERSON):
        print("  ", error)
    print(validate({"name": "Ada", "age": 36}, PERSON), validate({"name": "Ada", "age": 360}, PERSON))

    model = scripted_model(['Here you go: {"name": "Ada", "age": "36"}', '{"name": "Ada"}', '{"name": "Ada", "age": 36}'])
    print(repair_loop(model, "Extract the person as JSON.", PERSON))
    print(model.seen[1])
    print(f"20 calls at 95%: {0.95 ** 20:.3f}   one call failing 4 times in a row: {0.05 ** 4:.2e}")

    print(allowed_next(""), allowed_next('{"ok": '), allowed_next('{"ok": t'), allowed_next('{"ok": true}'))
    print("what the model wants to write first:", max("Sure{tf", key=lambda character: chatty_score("", character)))
    print("what constrained decoding produces :", constrained_decode(chatty_score))
    print("with the scores for t and f swapped:", constrained_decode(lambda text, character: {"t": 2, "f": 1}.get(character, 0)))
    print(f"recall question 1: {0.97 ** 30:.3f}  {0.03 ** 3:.6f}  {(1 - 0.03 ** 3) ** 30:.4f}")

@@step
{
  "stepNumber": 1,
  "title": "Dig the JSON out of a chatty reply",
  "instruction": "Implement extract_json(text). Find the position of the first opening brace with text.find and of the last closing brace with text.rfind. If there is no opening brace, or the last closing brace comes before it, raise ValueError with the message 'no JSON object found'. Otherwise parse the text from the first brace to the last brace inclusive with json.loads and return the result. If json.loads raises json.JSONDecodeError, raise ValueError with the message 'invalid JSON: ' followed by the error's msg attribute. This handles the commonest mess described in Section 4: a greeting, a code fence, and a sign-off around the data. [MOD-5.5]",
  "hintConceptual": "The data you want sits between the first opening brace and the last closing brace. Cut that part out, hand it to a real parser, and turn any failure into a clear message.",
  "hintSyntax": "start, end = text.find(\"{\"), text.rfind(\"}\")\nif start == -1 or end < start:\n    raise ValueError(\"no JSON object found\")\ntry:\n    return json.loads(text[start:end + 1])\nexcept json.JSONDecodeError as problem:\n    raise ValueError(f\"invalid JSON: {problem.msg}\") from None"
}
@@assert
assert extract_json('{"name": "Ada", "age": 36}') == {"name": "Ada", "age": 36}, "Plain JSON is parsed"
assert extract_json('Sure! Here is the record:\n```json\n{"name": "Ada", "age": 36}\n```\nAnything else?') == {"name": "Ada", "age": 36}, "A greeting, a code fence, and a sign-off are discarded"
assert extract_json('Result: {"items": [{"id": 1}, {"id": 2}]} done') == {"items": [{"id": 1}, {"id": 2}]}, "Nested objects are kept whole: first brace to LAST brace"
def _message(text):
    try:
        extract_json(text)
    except ValueError as problem:
        return str(problem)
    return None
assert _message("I could not find any data.") == "no JSON object found", "A reply with no braces raises ValueError('no JSON object found')"
assert _message('{"name": "Ada", "age": 3') == "no JSON object found", "A reply cut off before the closing brace has no complete object"
assert _message("} nothing here {") == "no JSON object found", "A closing brace before the opening one is not an object"
assert _message('{"name": "Ada", "age": 36,}').startswith("invalid JSON: "), f"A trailing comma is invalid JSON, got {_message(chr(123) + chr(34) + 'a' + chr(34) + ': 1,' + chr(125))!r}"
assert _message("{name: Ada}").startswith("invalid JSON: "), "Unquoted names are invalid JSON"
print("Step 1 passed: JSON is extracted from a chatty reply, and unparseable replies are reported clearly.")

@@step
{
  "stepNumber": 2,
  "title": "Validate against a schema",
  "instruction": "Implement validate(value, schema, path). Follow the four rules in the docstring. First, if the schema has a 'type', check the value with isinstance against TYPES[type], remembering that True and False must not count as 'number' or 'integer'. If the type does not match, return a one-item list with the message path, a colon and a space, 'expected', and the type, and check nothing further. Then collect errors: an enum mismatch; for a dict, each missing required key, then each key in the value, which is validated against its property schema if it has one and is reported as 'not allowed' if the schema's additionalProperties is False; and for a list with an 'items' schema, each element. Paths are built as path.key for fields and path[index] for elements. Return the list. This is the schema layer of the checks in Section 2. [MOD-5.5]",
  "hintConceptual": "Check the outer shape first. If it is the wrong kind of thing altogether, stop. Otherwise look inside: is anything required missing, is anything present that should not be, and does each part have the right shape in its turn?",
  "hintSyntax": "expected = schema.get(\"type\")\nif expected:\n    matches = isinstance(value, TYPES[expected])\n    if expected in (\"number\", \"integer\") and isinstance(value, bool):\n        matches = False\n    if not matches:\n        return [f\"{path}: expected {expected}\"]\nerrors = []\nif \"enum\" in schema and value not in schema[\"enum\"]:\n    errors.append(f\"{path}: not one of {schema['enum']}\")\nif isinstance(value, dict):\n    errors += [f\"{path}.{key}: required\" for key in schema.get(\"required\", []) if key not in value]\n    properties = schema.get(\"properties\", {})\n    for key, item in value.items():\n        if key in properties:\n            errors += validate(item, properties[key], f\"{path}.{key}\")\n        elif schema.get(\"additionalProperties\") is False:\n            errors.append(f\"{path}.{key}: not allowed\")\nif isinstance(value, list) and \"items\" in schema:\n    for index, item in enumerate(value):\n        errors += validate(item, schema[\"items\"], f\"{path}[{index}]\")\nreturn errors"
}
@@assert
assert validate({"name": "Ada", "age": 36}, PERSON) == [], f"A valid record has no errors, got {validate({'name': 'Ada', 'age': 36}, PERSON)}"
assert validate({"name": "Ada", "age": 36, "role": "admin"}, PERSON) == [], "An optional field with a permitted value is valid"
assert validate({"name": "Ada", "age": "36", "role": "owner", "team": "maths"}, PERSON) == ["$.age: expected integer", "$.role: not one of ['admin', 'member']", "$.team: not allowed"], f"The chatty record fails three ways, got {validate({'name': 'Ada', 'age': '36', 'role': 'owner', 'team': 'maths'}, PERSON)}"
assert validate({"name": "Ada"}, PERSON) == ["$.age: required"], "A missing required field is reported with its path"
assert validate({}, PERSON) == ["$.name: required", "$.age: required"], "Missing fields are reported in the order of the schema's required list"
assert validate("Ada", PERSON) == ["$: expected object"], "A wrong outer type is reported once, with no further checks"
assert validate({"name": "Ada", "age": True}, PERSON) == ["$.age: expected integer"], "True is not an integer"
assert validate({"name": "Ada", "age": 36.5}, PERSON) == ["$.age: expected integer"], "A fractional number is not an integer"
assert validate({"name": "Ada", "age": 360}, PERSON) == [], "An age of 360 is a valid integer: the schema checks shape, not sense"
assert validate(3.5, {"type": "number"}) == [] and validate(3, {"type": "number"}) == [] and validate(False, {"type": "number"}) == ["$: expected number"], "Whole and fractional numbers are numbers, and booleans are not"
_order = {"type": "object", "properties": {"items": {"type": "array", "items": {"type": "object", "properties": {"qty": {"type": "integer"}}, "required": ["qty"]}}}}
assert validate({"items": [{"qty": 1}, {"qty": "two"}, {}]}, _order) == ["$.items[1].qty: expected integer", "$.items[2].qty: required"], "Array elements are validated with indexed paths"
assert validate({"anything": 1}, {"type": "object"}) == [], "Without additionalProperties: false, extra fields are allowed"
print("Step 2 passed: wrong types, missing fields, bad enum values, and extra fields are all reported with paths.")

@@step
{
  "stepNumber": 3,
  "title": "A repair loop that feeds the error back",
  "instruction": "Implement repair_loop(model, prompt, schema, max_attempts). Keep a variable current, starting as the prompt. For each attempt from 1 to max_attempts: call model(current), pass the reply to extract_json, and validate the result against the schema. If extract_json raises ValueError, treat the error's message as the single error. If there are no errors, return the tuple (value, attempt). Otherwise set current to the original prompt, two newlines, 'Your previous reply was rejected: ', the errors joined with a semicolon and a space, a newline, and 'Return only the corrected JSON.' If every attempt fails, raise ValueError. This is the repair loop from Section 2: the specific error is sent back, and the number of attempts is limited. [MOD-5.5]",
  "hintConceptual": "Ask, check, and if the answer is wrong say exactly what was wrong and ask again. Give up after a fixed number of tries, because a request the model cannot satisfy should not be repeated forever.",
  "hintSyntax": "current = prompt\nfor attempt in range(1, max_attempts + 1):\n    try:\n        value = extract_json(model(current))\n        errors = validate(value, schema)\n    except ValueError as problem:\n        errors = [str(problem)]\n    if not errors:\n        return value, attempt\n    current = prompt + \"\\n\\nYour previous reply was rejected: \" + \"; \".join(errors) + \"\\nReturn only the corrected JSON.\"\nraise ValueError(f\"no valid output after {max_attempts} attempts\")"
}
@@assert
_model = scripted_model(['Here you go: {"name": "Ada", "age": "36"}', '{"name": "Ada"}', '{"name": "Ada", "age": 36}'])
assert repair_loop(_model, "Extract the person as JSON.", PERSON) == ({"name": "Ada", "age": 36}, 3), "Two failures and then a valid record: the value and the attempt number are returned"
assert _model.seen[0] == "Extract the person as JSON.", "The first request is the prompt itself"
assert _model.seen[1] == "Extract the person as JSON.\n\nYour previous reply was rejected: $.age: expected integer\nReturn only the corrected JSON.", f"The second request carries the first error, got {_model.seen[1]!r}"
assert _model.seen[2] == "Extract the person as JSON.\n\nYour previous reply was rejected: $.age: required\nReturn only the corrected JSON.", "Each retry is built from the ORIGINAL prompt and the latest errors only"
_good = scripted_model(['{"name": "Ada", "age": 36}'])
assert repair_loop(_good, "p", PERSON) == ({"name": "Ada", "age": 36}, 1) and len(_good.seen) == 1, "A valid first reply needs one call"
_prose = scripted_model(["I am sorry, I cannot help with that.", '{"name": "Ada", "age": 36}'])
assert repair_loop(_prose, "p", PERSON)[1] == 2 and "no JSON object found" in _prose.seen[1], "A reply with no JSON is treated as an error and fed back"
_two = scripted_model(['{"name": 5, "extra": 1}', '{"name": "Ada", "age": 36}'])
repair_loop(_two, "p", PERSON)
assert "$.age: required; $.name: expected string; $.extra: not allowed" in _two.seen[1], f"Several errors are joined with '; ', got {_two.seen[1]!r}"
_never = scripted_model(['{"name": "Ada"}'])
def _gives_up():
    try:
        repair_loop(_never, "p", PERSON, max_attempts=4)
    except ValueError:
        return True
    return False
assert _gives_up() and len(_never.seen) == 4, "After max_attempts failures the loop raises ValueError, having made exactly that many calls"
print("Step 3 passed: errors are sent back to the model, and the loop stops after a fixed number of attempts.")

@@step
{
  "stepNumber": 4,
  "title": "The mask of a constrained decoder",
  "instruction": "Implement allowed_next(prefix, targets). targets is a tuple of every output that is permitted. For each target that starts with the prefix and is longer than the prefix, the character at position len(prefix) is one that may come next. Return those characters as a sorted list with no duplicates. An empty list means the prefix is already a complete permitted output, or is not the beginning of any. This is the mask from Section 2, in miniature: given the text so far, which continuations keep it valid? [MOD-5.5]",
  "hintConceptual": "Look at every finished answer you would accept. Keep the ones that begin with what has been written so far, and see what comes next in each. Those next characters are the only ones allowed.",
  "hintSyntax": "return sorted({target[len(prefix)] for target in targets if target.startswith(prefix) and len(target) > len(prefix)})"
}
@@assert
assert allowed_next("") == ["{"], f"At the start only an opening brace is allowed, got {allowed_next('')}"
assert allowed_next('{"ok": ') == ["f", "t"], "After the field name there are two choices, in sorted order"
assert allowed_next('{"ok": t') == ["r"], "Once t is chosen, only r can follow"
assert allowed_next('{"ok": true') == ["}"], "The closing brace is the only way to finish"
assert allowed_next('{"ok": true}') == [], "Nothing may follow a complete output"
assert allowed_next("Sure") == [], "Text that is not the beginning of any permitted output has no continuation"
assert allowed_next("ca", targets=("cat", "car", "cab", "dog")) == ["b", "r", "t"], "The targets argument must be used, and the result is sorted"
assert allowed_next("", targets=("yes", "yep", "no")) == ["n", "y"], "Duplicates are removed"
print("Step 4 passed: the mask allows only characters that keep the output valid.")

@@step
{
  "stepNumber": 5,
  "title": "Decode under the constraint",
  "instruction": "Implement constrained_decode(score, targets). Start with an empty string. Repeat: get the permitted characters with allowed_next(text, targets). If there are none, return the text. Otherwise choose the permitted character with the highest score(text, character), and if several tie, the one that sorts first, and append it. Run it with the provided chatty_score, a stand-in model whose strongest wish is to begin with the letter S. It cannot, because S is never permitted, and the output is valid JSON. This is constrained decoding from Section 2: the model chooses, among valid options only. [MOD-5.5]",
  "hintConceptual": "At each step, ask what is allowed, and let the model pick its favourite among those. Whatever it would have preferred outside that list is simply not available.",
  "hintSyntax": "text = \"\"\nwhile True:\n    options = allowed_next(text, targets)\n    if not options:\n        return text\n    text += min(options, key=lambda character: (-score(text, character), character))"
}
@@assert
assert constrained_decode(chatty_score) == '{"ok": false}', f"The chatty model is forced to write valid JSON, and prefers f to t, got {constrained_decode(chatty_score)!r}"
assert json.loads(constrained_decode(chatty_score)) == {"ok": False}, "The output parses as JSON"
assert constrained_decode(lambda text, character: {"t": 2, "f": 1}.get(character, 0)) == '{"ok": true}', "With the preference reversed the value changes and the structure does not"
assert constrained_decode(lambda text, character: 0) == '{"ok": false}', "With equal scores, the character that sorts first is chosen"
assert constrained_decode(lambda text, character: 1 if character == "o" else 0, targets=("yes", "no")) == "no", "The targets argument must be used"
assert constrained_decode(lambda text, character: len(text) if character == "b" else 0, targets=("ab", "aa")) == "ab", "The score function is given the text so far"
assert constrained_decode(chatty_score, targets=()) == "", "With nothing permitted the output is empty"
print("Step 5 passed: the stand-in model wanted to write 'Sure' and produced valid JSON.")
