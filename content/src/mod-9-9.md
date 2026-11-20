@@meta
{
  "moduleId": "MOD-9.9",
  "slug": "mod-9-9",
  "unitId": "UNIT-9",
  "unitTitle": "Unit 9: Coding with AI",
  "title": "Debugging with AI",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Simplifying and Isolating Failure-Inducing Input", "source": "Zeller and Hildebrandt, IEEE TSE (2002)", "url": "https://www.st.cs.uni-saarland.de/papers/tse2002/" },
    { "title": "Reducing Failure-Inducing Inputs (The Debugging Book)", "source": "Andreas Zeller", "url": "https://www.debuggingbook.org/html/DeltaDebugger.html" },
    { "title": "git-bisect documentation", "source": "Official Docs (Git)", "url": "https://git-scm.com/docs/git-bisect" },
    { "title": "How to create a Minimal, Reproducible Example", "source": "Stack Overflow Help Center", "url": "https://stackoverflow.com/help/minimal-reproducible-example" },
    { "title": "traceback: Print or retrieve a stack traceback", "source": "Official Docs (Python)", "url": "https://docs.python.org/3/library/traceback.html" }
  ],
  "videoLibrary": [
    {
      "id": "VID-9.9-1",
      "title": "Claude Code Debugging: Fix Bugs With a Failing Test First",
      "creator": "Joel Stevick",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=89EVqDmU7eQ",
      "timingInstruction": "Watch after Section 1, before the method in Section 2",
      "keyTakeaway": "Reproducing a bug as a failing test before asking an AI to fix it."
    },
    {
      "id": "VID-9.9-2",
      "title": "Git bisect is insanely good (and so easy)",
      "creator": "Joshua Morony",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=Q-kqm0AgJZ8",
      "timingInstruction": "Watch after the isolation part of Section 2, before Step 1 of the lab",
      "keyTakeaway": "Finding the commit that introduced a bug by binary search through history."
    },
    {
      "id": "VID-9.9-3",
      "title": "Minimal Reproducible Example | How to get help online?",
      "creator": "LiquidBrain",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=b31NBuWz0DM",
      "timingInstruction": "Watch after the evidence part of Section 2, before Step 3 of the lab",
      "keyTakeaway": "Cutting a problem down to the smallest example that still shows it, for people or AI to help with."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Bisecting History, Minimising Inputs, Evidence Packets, Fix-Loop Guards, Regression Checks",
    "context": "The tool shop's checkout started failing for some orders after a week of AI-assisted changes, and the first attempts to have the AI fix it made things worse. You will find the commit that introduced the bug, shrink a failing order to its essential items, assemble the evidence an AI needs, detect a fix loop before it does more damage, and confirm the final fix without regressions.",
    "language": "python"
  }
}

@@reading
# Debugging with AI

AI assistants are remarkably good at explaining error messages and suggesting fixes, and remarkably bad at debugging when given poor evidence. The most common failure pattern in AI-assisted development is the **fix loop**: paste an error, accept a fix, see a different error, paste it, accept another fix, and twenty minutes later have more failing tests, more changed files, and less understanding than at the start. Module 9.1 noted that, in the 2025 Stack Overflow survey, 45 percent of developers said debugging AI-generated code takes more time.

This module gives you a debugging method that works with or without AI, tools that narrow a problem down mechanically, a way to package evidence so an AI's suggestions are grounded, and rules for stopping a loop before it digs the hole deeper.

## 1. First-Principles Mental Model & Intuition

### A doctor, not a mechanic swapping parts

A poor mechanic, faced with a strange noise, replaces parts until it stops: expensive, slow, and sometimes the noise moves somewhere else. A good doctor takes a history, examines, forms a hypothesis, runs a test that could prove it wrong, and only then treats. Debugging by pasting errors into an AI and accepting fixes is part-swapping. The AI is an excellent consultant for the doctor, provided the doctor brings the examination results.

```text
   1 REPRODUCE   a failing test or exact steps that fail every time
         |
   2 ISOLATE     which change? (bisect history)   which input? (minimise)   which line? (traceback)
         |
   3 HYPOTHESISE "BLADE-10 has no price when bought with SAW-3-BUNDLE"
         |        <- AI is most useful here, given an evidence packet
   4 VERIFY      change ONE thing; the failing test passes; nothing else breaks
         |
   5 PROTECT     keep the test; commit; note the cause
   LOOP GUARD:   same error 3 times, failing tests rising, or changes spreading -> STOP, roll back, rethink
```

### Why AI fix loops happen

A model asked to fix an error sees only what you pasted. With a single error line and no context, it guesses at the cause, often treating the symptom where the error surfaced rather than the cause upstream. Each guessed fix changes more code, which creates new errors, which prompt more guesses. Without a reproduction, there is no way to know if any fix worked; without isolation, the search space is the whole program.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Reproduce

A bug you cannot reproduce on demand cannot be confirmed fixed. The best reproduction is an automated **failing test** that captures the bug: it fails now and should pass when the bug is fixed. Writing it first, and asking an AI to make it pass without changing the test, gives the AI a precise target and gives you proof. Intermittent bugs need more work: record inputs, timing, and environment until a reproduction exists.

### Isolate: which change? Bisecting history

If something worked last week and fails now, one of the commits in between introduced the bug. **Binary search** over the commit history finds it: test the middle commit; if it is bad, the culprit is in the first half, otherwise the second; repeat. Git automates this as `git bisect`, which the Git documentation describes as using binary search to find the commit that introduced a bug. For $n$ candidate commits, the number of tests is at most

$$\lceil \log_2 n \rceil$$

so 100 commits need 7 tests, and 1,000 need 10. This is one of the strongest arguments for small, frequent commits, Module 9.10: bisection can only point at a commit, and a small commit is a small search.

### Isolate: which input? Delta debugging

If the bug depends on input, a large failing input, such as an order with eight items, hides which items matter. **Delta debugging**, introduced by Andreas Zeller and Ralf Hildebrandt in their 2002 paper "Simplifying and Isolating Failure-Inducing Input", systematically removes parts of a failing input while it still fails, until a **minimal** failing input remains: removing any further part makes the failure disappear. The algorithm, `ddmin`, splits the input into $n$ chunks and tests each chunk and each complement:

1. If some chunk alone still fails, continue with that chunk, $n = 2$.
2. Else if some complement still fails, continue with it, $n = \max(n - 1, 2)$.
3. Else, if chunks can be made smaller, double $n$; otherwise stop.

The result is 1-minimal: every remaining element is needed. An eight-item failing order reduces to the two items that together trigger the bug. This is exactly the **minimal reproducible example** that the Stack Overflow help centre asks for, and it is the single most useful thing you can give an AI, or a colleague.

### Isolate: which line? Reading the traceback

An error's **traceback** lists the chain of calls that led to it, most recent last. The final line is the exception type and message; the frames above show where it happened. The frame that matters is usually the **deepest frame in your own code**, not inside a library: libraries usually fail because your code passed them something unexpected. In the lab's checkout error, the exception is raised in a catalogue library, but the deepest frame of the shop's own code is in `pricing.py` at line 17, which is where to look.

### The evidence packet

Asking an AI for help is asking a colleague who cannot see your screen. Give it:

| Evidence | Why |
|---|---|
| The exact error and traceback | The AI reads the frames as well as the message |
| The deepest frame in your code | Where to look first |
| Steps to reproduce, ideally a failing test | What "fixed" means |
| Expected versus actual behaviour | The gap to close |
| Environment: language and library versions | Many bugs are version-specific |
| The minimal failing input | Removes noise |
| What you have tried | Prevents repeat suggestions |

A packet with these fields turns a guessing game into a reasoning task. Ask for a **hypothesis and a test** before a fix: "What do you think causes this, and how could we confirm it?"

### Hypothesise and verify

A good hypothesis is specific and falsifiable: "the catalogue has no price for BLADE-10 when it is part of a bundle, because the bundle lookup removes the item from the price table". Verify by **changing one thing at a time** and rerunning the reproduction. Changing several things at once, which AI fixes often do, makes it impossible to know which change mattered, and multiplies the chance of breaking something else.

### Avoiding fix loops

A **fix loop** shows itself in three measurable ways: the **same error** keeps returning, the number of **failing tests rises**, and the **files changed** spread. Any of these is a signal to stop, roll back to the last good state, Module 9.10, and rethink with better evidence. Anthropic's Claude Code best practices give a similar rule: after two failed corrections, clear the context and write a better prompt rather than trying a third time. A fresh start with a minimal reproduction beats a long, confused conversation.

### Regression

A fix is complete when the failing test passes **and** nothing that passed before now fails, **and** no test has silently stopped running. Comparing test results before and after the fix catches all three. Keep the new test permanently: it guards against the bug returning, which happens often when an AI later regenerates the same code.

### Complexity

Bisection takes $\lceil \log_2 n \rceil$ tests. Delta debugging takes $O(n^2)$ tests in the worst case and far fewer in typical cases. Traceback parsing is linear in its length. The loop guard is linear in attempts. The regression check is linear in tests.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, bisecting history.

```python
import math
import re

def bisect(commits, is_bad):
    lo, hi, tests = 0, len(commits) - 1, 0
    while lo < hi:
        mid = (lo + hi) // 2
        tests += 1
        if is_bad(commits[mid]):
            hi = mid
        else:
            lo = mid + 1
    return commits[lo], tests

COMMITS = [f"c{i}" for i in range(1, 101)]
print(bisect(COMMITS, lambda c: int(c[1:]) >= 73), math.ceil(math.log2(100)))
```

- **The first commit is known good and the last known bad; the search narrows between them.**
- **A bad middle commit means the culprit is at or before it; a good one means after.**
- **Commit 73 is found in 7 tests out of 100 commits.** The bound $\lceil \log_2 100 \rceil$ is 7.
- **`is_bad` is your reproduction.** Without a reliable one, bisection gives nonsense.

Next, minimising a failing input.

```python
def ddmin(items, fails):
    n = 2
    while len(items) >= 2:
        size = len(items) // n
        chunks = [items[i:i + size] for i in range(0, len(items), size)] if size else [[x] for x in items]
        reduced = False
        for i, chunk in enumerate(chunks):
            complement = [x for j, c in enumerate(chunks) if j != i for x in c]
            if fails(chunk):
                items, n, reduced = chunk, 2, True
                break
            if fails(complement):
                items, n, reduced = complement, max(n - 1, 2), True
                break
        if not reduced:
            if n >= len(items):
                break
            n = min(len(items), n * 2)
    return items

ORDER = ["SAW-3", "DRILL-2", "BLADE-10", "GLOVES", "LAMP-9", "TAPE", "BOX-L", "SAW-3-BUNDLE"]
checkout_fails = lambda items: "BLADE-10" in items and "SAW-3-BUNDLE" in items
print(ddmin(ORDER, checkout_fails))
```

- **The failing order has eight items; the bug needs only two.**
- **Each round tests chunks and their complements.** Keeping a complement removes one chunk; keeping a chunk removes all the others.
- **When nothing can be removed at the current granularity, the chunks get smaller.**
- **The result, BLADE-10 with SAW-3-BUNDLE, is 1-minimal.** Remove either and checkout works.

Then, the evidence packet.

```python
FRAME = re.compile(r'File "([^"]+)", line (\d+), in (\S+)')

def evidence(traceback_text, steps, expected, actual, env):
    frames = FRAME.findall(traceback_text)
    lines = [line for line in traceback_text.strip().splitlines() if line.strip()]
    own = [f for f in frames if "site-packages" not in f[0]]
    return {"error": lines[-1] if lines else "",
            "deepest_own_frame": f"{own[-1][0]}:{own[-1][1]} in {own[-1][2]}" if own else None,
            "missing": [k for k, v in (("steps", steps), ("expected", expected), ("actual", actual), ("env", env)) if not v]}

TRACEBACK = """Traceback (most recent call last):
  File "/app/server.py", line 41, in checkout
    total = cart_total(items)
  File "/app/pricing.py", line 17, in cart_total
    return sum(price(i) for i in items)
  File "/app/pricing.py", line 17, in <genexpr>
    return sum(price(i) for i in items)
  File "/usr/lib/python3.12/site-packages/catalog/lookup.py", line 88, in price
    raise KeyError(sku)
KeyError: 'BLADE-10'"""
print(evidence(TRACEBACK, ["add BLADE-10 and SAW-3-BUNDLE", "checkout"], "order total shown", "500 error", "Python 3.12, catalog 4.2"))
```

- **The last line is the error: a missing key for BLADE-10.**
- **Frames inside `site-packages` are library code and are skipped.**
- **The deepest frame of the shop's own code is `pricing.py` line 17.** Where to start reading.
- **Missing fields are listed.** A packet without steps, expectations, or versions invites guessing.

Then, the fix-loop guard.

```python
def loop_guard(attempts, max_same=2):
    reasons = []
    errors = [a["error"] for a in attempts]
    if len(errors) >= max_same + 1 and len(set(errors[-(max_same + 1):])) == 1:
        reasons.append(f"same error {max_same + 1} times")
    failing = [a["failing_tests"] for a in attempts]
    if len(failing) >= 2 and failing[-1] > failing[0]:
        reasons.append(f"failing tests rose from {failing[0]} to {failing[-1]}")
    files = [a["files_changed"] for a in attempts]
    if files and files[-1] > 3 * max(1, files[0]):
        reasons.append(f"changes spread to {files[-1]} files")
    return ("stop: roll back and rethink" if reasons else "continue"), reasons

ATTEMPTS = [{"error": "KeyError: 'BLADE-10'", "failing_tests": 1, "files_changed": 1},
            {"error": "KeyError: 'BLADE-10'", "failing_tests": 2, "files_changed": 3},
            {"error": "KeyError: 'BLADE-10'", "failing_tests": 4, "files_changed": 7}]
print(loop_guard(ATTEMPTS))
```

- **Three attempts, the same error each time.** The fixes are not reaching the cause.
- **Failing tests went from 1 to 4.** Each fix broke something else.
- **Changes spread from 1 file to 7.** The hole is getting deeper.
- **All three signals say stop, roll back, and come back with a minimal reproduction.**

Finally, the regression check.

```python
def regression(before, after, bug_test):
    issues = []
    if after.get(bug_test) != "pass":
        issues.append(f"{bug_test} still failing")
    issues += [f"{t} newly failing" for t in sorted(before) if before[t] == "pass" and t in after and after[t] != "pass"]
    issues += [f"{t} no longer runs" for t in sorted(before) if t not in after]
    return not issues, issues

BEFORE = {"test_total": "pass", "test_discount": "pass", "test_bundle_blade": "fail", "test_tax": "pass"}
print(regression(BEFORE, {**BEFORE, "test_bundle_blade": "pass"}, "test_bundle_blade"))
print(regression(BEFORE, {"test_total": "pass", "test_discount": "fail", "test_bundle_blade": "pass"}, "test_bundle_blade"))
```

- **The bug's test must pass.**
- **Previously passing tests must still pass.** The second fix broke the discount test.
- **Tests must still run.** The tax test has disappeared from the results, perhaps deleted or skipped by the AI: a regression hiding as silence.

**Complexity.** `bisect` runs at most $\lceil \log_2 n \rceil$ tests. `ddmin` runs a quadratic number of tests at worst. `evidence` is linear in the traceback. `loop_guard` is linear in attempts. `regression` is linear in tests.

### A debugging session plan

```text
REPRODUCE   failing test: test_bundle_blade (BLADE-10 + SAW-3-BUNDLE -> checkout 500)
ISOLATE     git bisect between last week's release (good) and HEAD (bad): 7 steps for 100 commits
            ddmin on the failing order: 8 items -> 2
            traceback: deepest own frame app/pricing.py:17, the generator inside cart_total
ASK AI      evidence packet; "give a hypothesis and a way to test it", not "fix it"
VERIFY      one change at a time; rerun test_bundle_blade and the full suite
STOP RULES  same error 3 times, failing tests rising, or more than 3x the files -> roll back, rethink
FINISH      bug test passes; no new failures; no tests missing; commit with the cause in the message
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Pasting only the last error line.** The traceback, the input, and the steps matter more. Send the evidence packet.

**Asking for a fix before a hypothesis.** Fixes without understanding treat symptoms. Ask what causes it and how to confirm.

**No reproduction.** Without one, "it works now" means nothing. Write the failing test first.

**Debugging in the library.** The error surfaces in library code because your code called it wrongly. Start at your deepest frame.

**Huge failing inputs.** The AI drowns in irrelevant data. Minimise first.

**Big commits.** Bisecting to a 2,000-line commit narrows little. Commit small.

**Changing several things at once.** You will not know which change worked, or which broke something. One change at a time.

**The third identical error.** The loop is not converging. Stop, roll back, rethink.

**Accepting a fix that edits the test.** Making the test pass by changing it is not a fix. Protect the test.

**Tests that silently disappear.** A deleted or skipped test looks like a pass. Compare the test lists.

**Long, polluted conversations.** Earlier wrong guesses steer later ones. Clear the context and start with the packet.

**Not recording the cause.** The same bug returns when the AI regenerates the code. Keep the test and write down why.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Debugging with AI works when you follow a method, reproduce, isolate, hypothesise, verify, and protect, and give the AI evidence rather than symptoms. Reproduction is ideally a failing test. Isolation narrows the problem three ways: bisecting commit history in at most the ceiling of log base 2 of n tests, as `git bisect` does; delta debugging, Zeller and Hildebrandt's ddmin, which shrinks a failing input to a 1-minimal one; and reading the traceback for the deepest frame in your own code. An evidence packet of error, traceback, steps, expected and actual behaviour, environment, minimal input, and what was tried lets the AI reason instead of guess, and asking for a hypothesis and a test before a fix keeps it honest. Fix loops show as the same error repeating, failing tests rising, and changes spreading, and the cure is to stop, roll back, and restart with better evidence. A fix is done when the bug's test passes, nothing previously passing fails, no test has stopped running, and the test is kept.

**Question 1.** Checkout worked in last week's release and fails now, with 100 commits in between, many of them large AI-generated changes. Using `bisect` and the bound from Section 2, explain how to find the cause, and how commit size affects the result.

<details>
<summary>View Answer</summary>

Mark last week's release as good and the current head as bad, and binary-search the commits between them: test the middle commit with the reproduction, the failing checkout test, and keep the half that contains the change from good to bad. Each test halves the candidates, so 100 commits need at most the ceiling of log base 2 of 100, which is 7 tests; the lab's `bisect` finds commit 73 in exactly 7. `git bisect` automates the bookkeeping, and `git bisect run` can run the test automatically at each step. The result is a single commit, and its size decides how useful that is: a 20-line commit tells you almost exactly what broke, while a 2,000-line commit from an AI agent that "refactored pricing and added bundles" leaves a large search inside the commit. This is why Module 9.10 recommends small, frequent commits, one task each: bisection then lands on a small, comprehensible change. Two practical cautions: the reproduction must be reliable, since a flaky test sends bisection down the wrong half, and commits that do not build should be skipped rather than marked good or bad.

</details>

**Question 2.** A developer pastes "KeyError: 'BLADE-10'" into an AI chat and gets three fixes in a row, each changing more files, with failing tests going from 1 to 4. Using `loop_guard` and `evidence`, explain what is going wrong and how to restart.

<details>
<summary>View Answer</summary>

`loop_guard` on those attempts returns "stop: roll back and rethink" with three reasons: the same error three times, failing tests rising from 1 to 4, and changes spreading from 1 file to 7. The AI saw only one line, so it guessed: probably adding a default price, catching the KeyError, or editing the catalogue lookup, each treating the symptom where the error surfaced, and each change broke other tests. The restart begins by rolling back to the last good commit, so the extra damage disappears. Then build the evidence packet: the full traceback, which `evidence` reduces to the error and the deepest own frame, `pricing.py` line 17, in the generator expression inside `cart_total`; the steps, expected and actual behaviour, and environment versions; and the minimal failing input from `ddmin`, BLADE-10 together with SAW-3-BUNDLE, which reveals that the bug is about the combination, not BLADE-10 alone. Start a fresh conversation with the packet and a failing test, ask for a hypothesis and a way to confirm it before any fix, then apply one change at a time and rerun the full suite after each.

</details>

**Question 3.** After the fix, the bundle test passes and the AI reports "all tests green". The before and after results match the lab's second regression example. Use `regression` to evaluate the claim and say what to do next.

<details>
<summary>View Answer</summary>

`regression` returns False with two issues: `test_discount` is newly failing, and `test_tax` no longer runs. The bug's own test passes, but the fix broke discount calculation, and the tax test is missing from the results entirely, perhaps deleted, renamed, or marked as skipped by the AI while it worked. "All tests green" was literally true of the tests that ran, which is why comparing the list of tests before and after matters as much as comparing their results: a disappeared test is a silent regression. Next steps: restore the tax test from version control and find out why it stopped running; investigate the discount failure, probably a side effect of how the fix changed price lookup for bundles, with the same method, a failing test and a hypothesis; adjust the fix so that all three tests pass, changing one thing at a time; and only then commit, with the cause of the original bug in the commit message and the new bundle test kept permanently. Protecting the tests from edits during fixes, for example with a hook or a review rule from Module 9.3, prevents a recurrence.

</details>

@@starter
"""
Lab: Bisecting History, Minimising Inputs, Evidence Packets, Fix-Loop Guards, Regression Checks
Standard library only. No Git or test runner needed. Complete the TODO in each step, then press "Run & Verify Step".
"""
import math
import re

COMMITS = [f"c{i}" for i in range(1, 101)]
ORDER = ["SAW-3", "DRILL-2", "BLADE-10", "GLOVES", "LAMP-9", "TAPE", "BOX-L", "SAW-3-BUNDLE"]
FRAME = re.compile(r'File "([^"]+)", line (\d+), in (\S+)')
TRACEBACK = """Traceback (most recent call last):
  File "/app/server.py", line 41, in checkout
    total = cart_total(items)
  File "/app/pricing.py", line 17, in cart_total
    return sum(price(i) for i in items)
  File "/app/pricing.py", line 17, in <genexpr>
    return sum(price(i) for i in items)
  File "/usr/lib/python3.12/site-packages/catalog/lookup.py", line 88, in price
    raise KeyError(sku)
KeyError: 'BLADE-10'"""
ATTEMPTS = [{"error": "KeyError: 'BLADE-10'", "failing_tests": 1, "files_changed": 1},
            {"error": "KeyError: 'BLADE-10'", "failing_tests": 2, "files_changed": 3},
            {"error": "KeyError: 'BLADE-10'", "failing_tests": 4, "files_changed": 7}]
BEFORE = {"test_total": "pass", "test_discount": "pass", "test_bundle_blade": "fail", "test_tax": "pass"}


def checkout_fails(items):
    """Given: the bug needs both of these items."""
    return "BLADE-10" in items and "SAW-3-BUNDLE" in items


# ---------------------------------------------------------------- Step 1
def bisect(commits, is_bad):
    """Binary search for the first bad commit (first assumed good, last bad). Return (commit, tests run)."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def ddmin(items, fails):
    """Delta debugging: n = 2; while len >= 2, split into chunks of len // n (singletons if 0); keep the first chunk
    that fails (n = 2) or else the first complement that fails (n = max(n - 1, 2)); if neither, stop when n >= len,
    else n = min(len, 2n). Return the minimal failing list."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def evidence(traceback_text, steps, expected, actual, env):
    """{"error": last non-blank line or "", "deepest_own_frame": "<file>:<line> in <func>" of the last FRAME not in
    site-packages or None, "missing": names of falsy steps/expected/actual/env in that order}."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def loop_guard(attempts, max_same=2):
    """Reasons: "same error <max_same+1> times" if the last max_same+1 errors are identical; "failing tests rose from
    <first> to <last>"; "changes spread to <last> files" if last > 3 * max(1, first). Return
    ("stop: roll back and rethink" or "continue", reasons)."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def regression(before, after, bug_test):
    """Issues: "<bug_test> still failing"; "<t> newly failing" for tests that passed before and are present but not
    passing after (sorted); "<t> no longer runs" for tests missing after (sorted). Return (no issues, issues)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("bisect:", bisect(COMMITS, lambda c: int(c[1:]) >= 73))
    print("ddmin :", ddmin(ORDER, checkout_fails))

@@solution
"""
Lab solution: Bisecting History, Minimising Inputs, Evidence Packets, Fix-Loop Guards, Regression Checks
Standard library only. No Git or test runner needed.
"""
import math
import re

COMMITS = [f"c{i}" for i in range(1, 101)]
ORDER = ["SAW-3", "DRILL-2", "BLADE-10", "GLOVES", "LAMP-9", "TAPE", "BOX-L", "SAW-3-BUNDLE"]
FRAME = re.compile(r'File "([^"]+)", line (\d+), in (\S+)')
TRACEBACK = """Traceback (most recent call last):
  File "/app/server.py", line 41, in checkout
    total = cart_total(items)
  File "/app/pricing.py", line 17, in cart_total
    return sum(price(i) for i in items)
  File "/app/pricing.py", line 17, in <genexpr>
    return sum(price(i) for i in items)
  File "/usr/lib/python3.12/site-packages/catalog/lookup.py", line 88, in price
    raise KeyError(sku)
KeyError: 'BLADE-10'"""
ATTEMPTS = [{"error": "KeyError: 'BLADE-10'", "failing_tests": 1, "files_changed": 1},
            {"error": "KeyError: 'BLADE-10'", "failing_tests": 2, "files_changed": 3},
            {"error": "KeyError: 'BLADE-10'", "failing_tests": 4, "files_changed": 7}]
BEFORE = {"test_total": "pass", "test_discount": "pass", "test_bundle_blade": "fail", "test_tax": "pass"}


def checkout_fails(items):
    """Given: the bug needs both of these items."""
    return "BLADE-10" in items and "SAW-3-BUNDLE" in items


# ---------------------------------------------------------------- Step 1
def bisect(commits, is_bad):
    """log2(n) tests to the commit that broke it."""
    lo, hi, tests = 0, len(commits) - 1, 0
    while lo < hi:
        mid = (lo + hi) // 2
        tests += 1
        if is_bad(commits[mid]):
            hi = mid
        else:
            lo = mid + 1
    return commits[lo], tests


# ---------------------------------------------------------------- Step 2
def ddmin(items, fails):
    """Zeller and Hildebrandt's delta debugging, simplified."""
    n = 2
    while len(items) >= 2:
        size = len(items) // n
        chunks = [items[i:i + size] for i in range(0, len(items), size)] if size else [[x] for x in items]
        reduced = False
        for i, chunk in enumerate(chunks):
            complement = [x for j, c in enumerate(chunks) if j != i for x in c]
            if fails(chunk):
                items, n, reduced = chunk, 2, True
                break
            if fails(complement):
                items, n, reduced = complement, max(n - 1, 2), True
                break
        if not reduced:
            if n >= len(items):
                break
            n = min(len(items), n * 2)
    return items


# ---------------------------------------------------------------- Step 3
def evidence(traceback_text, steps, expected, actual, env):
    """The error, where in your code, and what is missing from the report."""
    frames = FRAME.findall(traceback_text)
    lines = [line for line in traceback_text.strip().splitlines() if line.strip()]
    own = [f for f in frames if "site-packages" not in f[0]]
    return {"error": lines[-1] if lines else "",
            "deepest_own_frame": f"{own[-1][0]}:{own[-1][1]} in {own[-1][2]}" if own else None,
            "missing": [k for k, v in (("steps", steps), ("expected", expected), ("actual", actual), ("env", env)) if not v]}


# ---------------------------------------------------------------- Step 4
def loop_guard(attempts, max_same=2):
    """Stop when the loop is not converging."""
    reasons = []
    errors = [a["error"] for a in attempts]
    if len(errors) >= max_same + 1 and len(set(errors[-(max_same + 1):])) == 1:
        reasons.append(f"same error {max_same + 1} times")
    failing = [a["failing_tests"] for a in attempts]
    if len(failing) >= 2 and failing[-1] > failing[0]:
        reasons.append(f"failing tests rose from {failing[0]} to {failing[-1]}")
    files = [a["files_changed"] for a in attempts]
    if files and files[-1] > 3 * max(1, files[0]):
        reasons.append(f"changes spread to {files[-1]} files")
    return ("stop: roll back and rethink" if reasons else "continue"), reasons


# ---------------------------------------------------------------- Step 5
def regression(before, after, bug_test):
    """Fixed, nothing newly broken, nothing silently gone."""
    issues = []
    if after.get(bug_test) != "pass":
        issues.append(f"{bug_test} still failing")
    issues += [f"{t} newly failing" for t in sorted(before) if before[t] == "pass" and t in after and after[t] != "pass"]
    issues += [f"{t} no longer runs" for t in sorted(before) if t not in after]
    return not issues, issues


if __name__ == "__main__":
    print(bisect(COMMITS, lambda c: int(c[1:]) >= 73), math.ceil(math.log2(len(COMMITS))))
    print(ddmin(ORDER, checkout_fails))
    print(evidence(TRACEBACK, ["add BLADE-10 and SAW-3-BUNDLE", "checkout"], "order total", "500 error", "Python 3.12"))
    print(loop_guard(ATTEMPTS))
    print(regression(BEFORE, {"test_total": "pass", "test_discount": "fail", "test_bundle_blade": "pass"}, "test_bundle_blade"))

@@step
{
  "stepNumber": 1,
  "title": "Bisect the history",
  "instruction": "Implement bisect(commits, is_bad). Treat the first commit as good and the last as bad. Keep lo and hi indices; while lo < hi, test the middle commit (count each test): if it is bad, set hi to mid, otherwise lo to mid + 1. Return the commit at lo and the number of tests. Find the culprit among 100 commits. This is bisecting history from Section 2. [MOD-9.9]",
  "hintConceptual": "Open the history book in the middle: if the page already shows the problem, it started earlier; if not, later. Halve the book each time.",
  "hintSyntax": "lo, hi, tests = 0, len(commits) - 1, 0\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    tests += 1\n    if is_bad(commits[mid]):\n        hi = mid\n    else:\n        lo = mid + 1\nreturn commits[lo], tests"
}
@@assert
assert bisect(COMMITS, lambda c: int(c[1:]) >= 73) == ("c73", 7), f"Seven tests for 100 commits, got {bisect(COMMITS, lambda c: int(c[1:]) >= 73)}"
assert bisect(COMMITS, lambda c: int(c[1:]) >= 2)[0] == "c2" and bisect(COMMITS, lambda c: c == "c100")[0] == "c100", "Edges"
assert bisect([f"c{i}" for i in range(1, 1001)], lambda c: int(c[1:]) >= 500)[1] <= math.ceil(math.log2(1000)), "Within the log2 bound"
assert bisect(["only"], lambda c: True) == ("only", 0), "One commit, nothing to test"
print("Step 1 passed: commit 73 found in 7 tests.")

@@step
{
  "stepNumber": 2,
  "title": "Minimise the failing input",
  "instruction": "Implement ddmin(items, fails). Start with n = 2. While at least two items remain: split them into chunks of len(items) // n (single items if that is 0); for each chunk in order, if the chunk alone fails keep it and set n = 2, else if its complement fails keep the complement and set n = max(n - 1, 2), stopping at the first success. If nothing was kept, stop when n is already at least the number of items, otherwise set n = min(len(items), 2n). Return the items. Minimise the failing order, a single-item bug, and a three-item case, and confirm the result is 1-minimal. This is delta debugging from Section 2. [MOD-9.9]",
  "hintConceptual": "Take things out of the failing basket a handful at a time, keeping the basket whenever it still fails, and use smaller handfuls when no handful can go, until every item left is essential.",
  "hintSyntax": "n = 2\nwhile len(items) >= 2:\n    size = len(items) // n\n    chunks = [items[i:i + size] for i in range(0, len(items), size)] if size else [[x] for x in items]\n    reduced = False\n    for i, chunk in enumerate(chunks):\n        complement = [x for j, c in enumerate(chunks) if j != i for x in c]\n        if fails(chunk):\n            items, n, reduced = chunk, 2, True\n            break\n        if fails(complement):\n            items, n, reduced = complement, max(n - 1, 2), True\n            break\n    if not reduced:\n        if n >= len(items):\n            break\n        n = min(len(items), n * 2)\nreturn items"
}
@@assert
assert ddmin(ORDER, checkout_fails) == ["BLADE-10", "SAW-3-BUNDLE"], f"Two essential items, got {ddmin(ORDER, checkout_fails)}"
assert ddmin(ORDER, lambda it: "LAMP-9" in it) == ["LAMP-9"], "A single-item bug"
_three = ddmin(list(range(20)), lambda it: {3, 11, 17} <= set(it))
assert sorted(_three) == [3, 11, 17], "Three essential elements out of twenty"
_m = ddmin(ORDER, checkout_fails)
assert all(not checkout_fails([x for x in _m if x != y]) for y in _m), "1-minimal: removing any item stops the failure"
print("Step 2 passed: eight items reduced to BLADE-10 with SAW-3-BUNDLE.")

@@step
{
  "stepNumber": 3,
  "title": "Build an evidence packet",
  "instruction": "Implement evidence(traceback_text, steps, expected, actual, env). The error is the last non-blank line of the traceback, or '' if there is none. Find all FRAME matches; the deepest own frame is the last one whose file path does not contain 'site-packages', formatted '<file>:<line> in <function>', or None. List the names of steps, expected, actual, and env that are empty, in that order. Return the three as a dict. Build packets for the checkout error and an empty report. This is the evidence packet from Section 2. [MOD-9.9]",
  "hintConceptual": "Before calling the specialist, note the exact complaint, where in your own house it showed up, and fill in every line of the referral form.",
  "hintSyntax": "frames = FRAME.findall(traceback_text)\nlines = [line for line in traceback_text.strip().splitlines() if line.strip()]\nown = [f for f in frames if \"site-packages\" not in f[0]]\nreturn {\"error\": lines[-1] if lines else \"\",\n        \"deepest_own_frame\": f\"{own[-1][0]}:{own[-1][1]} in {own[-1][2]}\" if own else None,\n        \"missing\": [k for k, v in ((\"steps\", steps), (\"expected\", expected), (\"actual\", actual), (\"env\", env)) if not v]}"
}
@@assert
_e = evidence(TRACEBACK, ["add BLADE-10 and SAW-3-BUNDLE", "checkout"], "order total shown", "500 error", "Python 3.12, catalog 4.2")
assert _e == {"error": "KeyError: 'BLADE-10'", "deepest_own_frame": "/app/pricing.py:17 in <genexpr>", "missing": []}, f"A complete packet, got {_e}"
assert evidence("", [], "", "", "") == {"error": "", "deepest_own_frame": None, "missing": ["steps", "expected", "actual", "env"]}, "An empty report"
assert evidence(TRACEBACK, ["x"], "y", "", "")["missing"] == ["actual", "env"], "Partial report"
_lib = 'Traceback (most recent call last):\n  File "/x/site-packages/lib.py", line 3, in f\nValueError: bad'
assert evidence(_lib, ["s"], "e", "a", "v")["deepest_own_frame"] is None, "Only library frames"
print("Step 3 passed: the error surfaced in a library, but pricing.py line 17 is where to look.")

@@step
{
  "stepNumber": 4,
  "title": "Guard against fix loops",
  "instruction": "Implement loop_guard(attempts, max_same). Add 'same error <max_same + 1> times' if there are at least max_same + 1 attempts and the last max_same + 1 errors are identical; 'failing tests rose from <first> to <last>' if there are at least two attempts and the last count exceeds the first; 'changes spread to <last> files' if the last files_changed exceeds three times the larger of 1 and the first. Return ('stop: roll back and rethink', reasons) if any, else ('continue', []). Check four sequences of attempts, and a lower max_same threshold. This is avoiding fix loops from Section 2. [MOD-9.9]",
  "hintConceptual": "If the same symptom keeps coming back, more things are going wrong after each treatment, and the treatment keeps spreading, stop treating and go back to diagnosis.",
  "hintSyntax": "reasons = []\nerrors = [a[\"error\"] for a in attempts]\nif len(errors) >= max_same + 1 and len(set(errors[-(max_same + 1):])) == 1:\n    reasons.append(f\"same error {max_same + 1} times\")\nfailing = [a[\"failing_tests\"] for a in attempts]\nif len(failing) >= 2 and failing[-1] > failing[0]:\n    reasons.append(f\"failing tests rose from {failing[0]} to {failing[-1]}\")\nfiles = [a[\"files_changed\"] for a in attempts]\nif files and files[-1] > 3 * max(1, files[0]):\n    reasons.append(f\"changes spread to {files[-1]} files\")\nreturn (\"stop: roll back and rethink\" if reasons else \"continue\"), reasons"
}
@@assert
assert loop_guard(ATTEMPTS) == ("stop: roll back and rethink", ["same error 3 times", "failing tests rose from 1 to 4", "changes spread to 7 files"]), f"All three signals, got {loop_guard(ATTEMPTS)}"
assert loop_guard(ATTEMPTS[:1]) == ("continue", []) and loop_guard(ATTEMPTS[:2]) == ("stop: roll back and rethink", ["failing tests rose from 1 to 2"]), "One attempt; rising failures alone"
_better = [{"error": "a", "failing_tests": 3, "files_changed": 1}, {"error": "b", "failing_tests": 1, "files_changed": 2}]
assert loop_guard(_better) == ("continue", []), "Progress: different error, fewer failures"
assert loop_guard(ATTEMPTS, max_same=1)[1][0] == "same error 2 times", "The threshold is an argument"
print("Step 4 passed: the same error three times, failures rising, changes spreading: stop.")

@@step
{
  "stepNumber": 5,
  "title": "Check for regressions",
  "instruction": "Implement regression(before, after, bug_test). Add '<bug_test> still failing' unless it passes after the fix. Then, in sorted order, add '<test> newly failing' for each test that passed before and is present but not passing after, and '<test> no longer runs' for each test from before that is missing after. Return whether there are no issues, and the issues. Check a clean fix and a fix that broke things. This is regression from Section 2. [MOD-9.9]",
  "hintConceptual": "After the repair, check that the broken thing works, that nothing that used to work is now broken, and that nothing has quietly been removed from the checklist.",
  "hintSyntax": "issues = []\nif after.get(bug_test) != \"pass\":\n    issues.append(f\"{bug_test} still failing\")\nissues += [f\"{t} newly failing\" for t in sorted(before) if before[t] == \"pass\" and t in after and after[t] != \"pass\"]\nissues += [f\"{t} no longer runs\" for t in sorted(before) if t not in after]\nreturn not issues, issues"
}
@@assert
assert regression(BEFORE, {**BEFORE, "test_bundle_blade": "pass"}, "test_bundle_blade") == (True, []), f"A clean fix, got {regression(BEFORE, {**BEFORE, 'test_bundle_blade': 'pass'}, 'test_bundle_blade')}"
assert regression(BEFORE, {"test_total": "pass", "test_discount": "fail", "test_bundle_blade": "pass"}, "test_bundle_blade") == (False, ["test_discount newly failing", "test_tax no longer runs"]), "Broken and missing tests"
assert regression(BEFORE, BEFORE, "test_bundle_blade") == (False, ["test_bundle_blade still failing"]), "Not fixed"
assert regression({"a": "fail"}, {"a": "fail", "b": "pass"}, "b") == (True, []), "Previously failing tests are not regressions"
print("Step 5 passed: 'all tests green' hid a broken discount test and a missing tax test.")
