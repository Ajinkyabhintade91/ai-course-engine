@@meta
{
  "moduleId": "MOD-9.6",
  "slug": "mod-9-6",
  "unitId": "UNIT-9",
  "unitTitle": "Unit 9: Coding with AI",
  "title": "Replit",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Replit Agent", "source": "Official Docs (Replit)", "url": "https://docs.replit.com/replitai/agent" },
    { "title": "Checkpoints and rollbacks", "source": "Official Docs (Replit)", "url": "https://docs.replit.com/features/version-control/checkpoints-and-rollbacks.md" },
    { "title": "Development and production databases", "source": "Official Docs (Replit)", "url": "https://docs.replit.com/features/data-and-storage/development-and-production.md" },
    { "title": "Secrets", "source": "Official Docs (Replit)", "url": "https://docs.replit.com/replit-workspace/workspace-features/secrets" },
    { "title": "Deployment types", "source": "Official Docs (Replit)", "url": "https://docs.replit.com/features/publishing/deployment-types.md" },
    { "title": "Pricing", "source": "Replit", "url": "https://replit.com/pricing" }
  ],
  "videoLibrary": [
    {
      "id": "VID-9.6-1",
      "title": "Replit Agent Tutorial - 2026 | How to Build an AI App with Replit Agent | How to Use Replit Agent",
      "creator": "Dan - Smart Tutorials",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=fo16YPmuX9M",
      "timingInstruction": "Watch after Section 1, before the Agent part of Section 2",
      "keyTakeaway": "Building an app from a prompt with Replit Agent, including planning and checkpoints."
    },
    {
      "id": "VID-9.6-2",
      "title": "How to use Databases on Replit",
      "creator": "Matt Palmer",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=zbyRuoPNIc8",
      "timingInstruction": "Watch after the databases and secrets part of Section 2, before Step 3 of the lab",
      "keyTakeaway": "How Replit's built-in database works and how development and production data are kept apart."
    },
    {
      "id": "VID-9.6-3",
      "title": "Replit Deployments: Choosing the Right Deployment Type",
      "creator": "Replit",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=sXP5d0k1atk",
      "timingInstruction": "Watch after the deployments part of Section 2, before Step 1 of the lab",
      "keyTakeaway": "Autoscale, Reserved VM, Static, and Scheduled deployments, and which workload suits each."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Deployment Types, Secret Visibility, Rollback Plans, Environment Checks, Graduation Signals",
    "context": "A tool shop employee built a stock-alert app on Replit with the Agent, and the owner wants it published safely and to know when it will outgrow the platform. You will choose deployment types, work out who can see which secrets, plan a rollback that respects production data, compare development and production configuration, and decide when to graduate to your own stack.",
    "language": "python"
  }
}

@@reading
# Replit

**Replit** is a cloud development environment: an editor, a running computer, a database, secret storage, and hosting, all in the browser, with **Replit Agent** able to build an application from a description, test it, and publish it. For people who are not developers, or developers who want something running in minutes, it removes almost every setup step. That convenience is also its main risk: a published app with real users and data can exist before anyone has thought about how it is run.

Module 9.2 described the July 2025 incident in which Replit's agent deleted a production database during a code freeze. The platform changed in response, and this module describes it as documented at the time of writing (November 2026): how the Agent and checkpoints work, how development and production are separated, how secrets and deployments work, what it costs, and when to move a project to your own stack.

## 1. First-Principles Mental Model & Intuition

### A serviced workshop

Renting a serviced workshop means arriving to find the benches, power tools, electricity, storage, and a shopfront already installed, with a helpful technician who will build what you describe. You can sell from the shopfront on day one. You do not choose the electricity supplier, where the building is, or how the alarm system works, and as the business grows the rent rises and the layout may not fit.

That is Replit. The building is managed infrastructure on Google Cloud; the technician is the Agent; the storage is the database; the safe is the Secrets tool; the shopfront is a deployment.

```text
   REPLIT APP
   Agent (plan mode -> task list -> builds, tests) ---- checkpoints: files + context + config + memory + dev DB
        |                                                  (each checkpoint is also a Git commit)
   Workspace: editor, shell, Secrets (env vars), Git / GitHub sync
        |
   Development database (PostgreSQL)  ----------- Agent may change
        |  publish: schema changes reviewed and approved
   Production database (separate, own DATABASE_URL) - Agent can read via replica, cannot modify
        |
   Deployment: Autoscale | Reserved VM | Static | Scheduled   -> your domain
```

### The separation that matters

Most of the safety in modern Replit comes from one idea: **development and production are different places**. The Agent experiments freely in development, with checkpoints to undo its mistakes; production holds real users' data and changes only through a reviewed publish. Everything in this module either supports that separation or depends on it.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Replit Agent

Replit describes the Agent as taking your ideas, helping you refine them, and making them real: it writes code, sets up infrastructure, and tests the result. A **Plan mode** lets you brainstorm, ask questions, and map out the project before the Agent changes any code or data, producing an ordered task list for you to approve. The Agent tests its own work regularly as it builds. At the time of writing, the documentation lists several modes trading capability against cost, from a free mode to more powerful paid modes.

### Checkpoints and rollback

The Agent creates **checkpoints** automatically. According to the documentation, a checkpoint captures project files, the AI conversation context, environment configuration, Agent memory, and **development** database contents, and each checkpoint creates a Git commit. Rolling back has two important defaults:

| Rollback restores | Default |
|---|---|
| Files, conversation context, configuration, Agent memory | Yes |
| Development database | Only if you select the database option |
| Production database | Never through rollback; production has its own recovery |

Development database history is kept for checkpoints up to 7 days old. Production databases have point-in-time recovery, on by default with a 7-day window, extendable to 28 days on higher plans. The asymmetry is deliberate: undoing code should never silently undo real customers' data.

### Databases

Replit apps get a built-in **PostgreSQL** database, run on Replit's own managed infrastructure. A published app has a **separate production database** with its own `DATABASE_URL`. The documentation states that the Agent **cannot modify the production database**; it can read production through a read replica, and schema changes reach production only through the publishing flow, with a review step, a preview, and approval. This is the dev/prod separation that Module 9.2 recommended, built into the platform.

### Secrets

The **Secrets** tool stores sensitive values encrypted and exposes them to the app as environment variables; a separate **Configurations** section holds non-sensitive settings such as log levels, and the documentation warns against putting API keys there. Secrets are available to every deployment type except Static deployments, which have no server. Production apps have their own secret values set in the publishing settings. Who can see what, as documented:

| Viewer | Secret names | Secret values |
|---|---|---|
| Owner or multiplayer collaborator | Yes | Yes |
| Someone who remixes the app, not a collaborator | Yes | No |
| Visitor to the cover page | No | No |
| Organisation member without the Owner role | Yes | Not viewable in the tool, but readable by printing environment variables |

The last row is the important caveat: anyone who can run code in the workspace can print the environment, so "cannot view" is a convenience, not a security boundary. Give workspace access only to people you would trust with the values, and use separate, limited keys for development and production.

### Deployments

Replit calls deploying "publishing". The documented deployment types:

| Type | What it is | Good for |
|---|---|---|
| **Autoscale** | Adjusts resources with usage, scales to zero when idle; the default | Most web apps and APIs with variable traffic |
| **Reserved VM** | One dedicated server that never sleeps, at a fixed monthly cost | Bots, websockets, always-on background work |
| **Static** | Files only, no backend; not compatible with Agent-built apps | Plain websites, Module 9.7 |
| **Scheduled** | Runs a command on a schedule, then stops; no public URL | Nightly jobs, reports, clean-ups |

Published apps run on Google Cloud in the United States, with other regions available to Enterprise customers on request, which matters for data-residency requirements. Custom domains can be attached.

### Cost

At the time of writing, Replit's pricing page lists **Core** at 20 US dollars a month, or 18 billed annually, and **Pro** at 100, or 90 annually, each including usage credits, with **Enterprise** on custom pricing, and a free starter tier with tight limits. Billing is usage-based: Agent work uses **effort-based pricing** that depends on the complexity of each request, and hosting is billed by usage on top. Two consequences: a vague prompt that sends the Agent round in circles costs money as well as time, and an app's running cost should be estimated before launch, not discovered on the first invoice.

### When to graduate

Replit is excellent for getting started and fine for many small production apps. Signals that a project should move to its own stack, Modules 9.10 and 9.11:

| Signal | Why |
|---|---|
| Data must stay in a region other than the United States | Published apps are US-hosted unless on Enterprise |
| Compliance requirements, such as audits or specific certifications | You may need control the platform does not give |
| More collaborators than the plan allows | Pro lists up to 15 collaborators |
| Monthly platform cost well above an equivalent self-managed stack | Convenience has a price at scale |
| Infrastructure the platform does not offer | Specific databases, queues, or regions |

Graduation is easier if you prepare early: keep the code in a GitHub repository, which Replit supports through Git integration, use standard PostgreSQL features, and keep configuration in environment variables.

### Complexity

Choosing a deployment type is constant. Secret visibility is a table lookup. A rollback plan is linear in checkpoints. Comparing environments is linear in keys. Graduation checks are linear in signals.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, choosing a deployment type.

```python
def deployment_type(app):
    if not app["has_backend"] and not app["agent_built"]:
        return "Static", "files only, no server"
    if app["runs_on_schedule"] and not app["needs_url"]:
        return "Scheduled", "runs a command on a schedule, then stops"
    if app["always_on"]:
        return "Reserved VM", "a dedicated server that never sleeps"
    return "Autoscale", "scales with traffic, down to zero when idle"

BASE = {"has_backend": True, "agent_built": True, "runs_on_schedule": False, "needs_url": True, "always_on": False}
print(deployment_type(BASE))
print(deployment_type({**BASE, "always_on": True}))
print(deployment_type({**BASE, "runs_on_schedule": True, "needs_url": False}))
print(deployment_type({**BASE, "has_backend": False, "agent_built": False}))
```

- **The stock-alert web app goes on Autoscale.** Traffic is uneven, and idle time costs little.
- **A chat bot holding a websocket open needs a Reserved VM.** Scaling to zero would disconnect it.
- **The nightly stock check is Scheduled.** It needs no public URL.
- **A plain brochure site is Static, but Agent-built apps cannot use Static.** The documentation says so explicitly.

Next, who can see a secret.

```python
VISIBILITY = {"owner": (True, True), "collaborator": (True, True), "remixer": (True, False),
              "visitor": (False, False), "org_member": (True, False)}

def secret_view(role):
    names, values = VISIBILITY.get(role, (False, False))
    can_print = role in {"owner", "collaborator", "org_member"}
    note = "can read values by printing environment variables" if can_print and not values else ""
    return {"names": names, "values": values, "note": note}

for role in ("owner", "remixer", "visitor", "org_member"):
    print(role, secret_view(role))
```

- **Owners and collaborators see names and values.**
- **Remixers see which secrets exist, not their values.** They must supply their own.
- **Visitors see nothing.**
- **Organisation members cannot view values in the tool but can print the environment.** Access to the workspace is access to the secrets.

Then, planning a rollback.

```python
def rollback_plan(checkpoints, target, include_db, now_day):
    cp = next((c for c in checkpoints if c["id"] == target), None)
    if cp is None:
        return None, ["unknown checkpoint"]
    restored = ["files", "conversation", "configuration", "agent memory"]
    warnings = []
    if include_db:
        if now_day - cp["day"] <= 7:
            restored.append("development database")
        else:
            warnings.append("development database history only covers 7 days")
    warnings.append("production database is not changed by rollback")
    later = sum(1 for c in checkpoints if c["day"] > cp["day"])
    return restored, warnings + ([f"{later} later checkpoint(s) undone"] if later else [])

CHECKPOINTS = [{"id": "cp1", "day": 1}, {"id": "cp2", "day": 9}, {"id": "cp3", "day": 12}, {"id": "cp4", "day": 13}]
print(rollback_plan(CHECKPOINTS, "cp2", include_db=True, now_day=14))
print(rollback_plan(CHECKPOINTS, "cp1", include_db=True, now_day=14))
print(rollback_plan(CHECKPOINTS, "cp3", include_db=False, now_day=14))
```

- **Code, context, configuration, and memory always roll back.**
- **The development database rolls back only if asked, and only within 7 days.** cp2 is 5 days old; cp1 is 13.
- **Production is never touched by rollback.** That warning always appears, as a reminder.
- **Later checkpoints are counted.** Rolling back to cp2 undoes two later ones.

Then, comparing development and production settings.

```python
def env_check(dev, prod):
    issues = []
    for key in sorted(dev):
        if key not in prod:
            issues.append(f"{key} missing in production")
        elif prod[key] == dev[key] and key.endswith(("_URL", "_KEY", "_SECRET")):
            issues.append(f"{key} identical in dev and production")
    for key in sorted(prod):
        if "test" in str(prod[key]).lower() and key.endswith(("_KEY", "_SECRET")):
            issues.append(f"{key} looks like a test credential in production")
    return issues

DEV = {"DATABASE_URL": "postgres://dev-db", "STRIPE_KEY": "sk_test_123", "ALERT_EMAIL": "me@example.com", "SLACK_WEBHOOK_URL": "https://hooks.example/abc"}
PROD = {"DATABASE_URL": "postgres://prod-db", "STRIPE_KEY": "sk_test_123", "SLACK_WEBHOOK_URL": "https://hooks.example/abc"}
for issue in env_check(DEV, PROD):
    print(issue)
```

- **The alert email is missing in production.** The app will fail, or silently skip alerts.
- **The Stripe key and Slack webhook are identical in both environments.** Development activity reaches production channels.
- **The production Stripe key is a test key.** Customers' payments would not be taken.
- **The databases differ, as they should.**

Finally, graduation signals.

```python
def graduation(app):
    reasons = []
    if app["data_region"] != "US" and not app["enterprise"]:
        reasons.append(f"data must stay in {app['data_region']}; published apps are US-hosted")
    if app["compliance"]:
        reasons.append("compliance needs control over infrastructure")
    if app["collaborators"] > 15:
        reasons.append(f"{app['collaborators']} collaborators exceeds the plan limit")
    if app["monthly_platform_cost"] > 2 * app["monthly_self_hosted_cost"]:
        reasons.append("platform costs more than twice a self-managed stack")
    return ("graduate" if reasons else "stay"), reasons

APP = {"data_region": "US", "enterprise": False, "compliance": False, "collaborators": 3,
       "monthly_platform_cost": 60, "monthly_self_hosted_cost": 45}
print(graduation(APP))
print(graduation({**APP, "data_region": "EU", "monthly_platform_cost": 400}))
```

- **A small US app with three collaborators and modest costs should stay.** The convenience is worth it.
- **EU data residency plus costs nearly nine times a self-managed stack: graduate.** Plan the move with the code already in GitHub.

**Complexity.** `deployment_type` and `secret_view` are constant. `rollback_plan` is linear in checkpoints. `env_check` is linear in keys. `graduation` is constant.

### A Replit launch checklist

```text
BUILD       Plan mode first; small prompts; review the Agent's task list before approving
CHECKPOINTS roll back freely in development; include the dev database only when you mean to
DATA        production database separate; schema changes reviewed at publish; PITR window noted
SECRETS     in Secrets, not Configurations; separate dev and production values; live keys only in production
ACCESS      collaborators and org members can read secrets via the environment; invite accordingly
DEPLOY      Autoscale for the web app; Scheduled for nightly jobs; Reserved VM for bots
COST        estimate Agent and hosting usage; set alerts
EXIT PLAN   code synced to GitHub; standard PostgreSQL; configuration in environment variables
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Rolling back and expecting the data back.** Rollback leaves the database alone unless you ask, and never touches production. Know which you need.

**Assuming rollback restores production.** Production recovery is a separate point-in-time restore. Know its window.

**Secrets in Configurations.** Configurations are for non-sensitive values. Keys go in Secrets.

**Same keys everywhere.** Development tests spam production channels and corrupt data. Separate credentials.

**Test keys in production.** Payments silently fail. Check before launch.

**Sharing the workspace widely.** Anyone who can run code can print secrets. Limit access.

**Static deployment for an Agent-built app.** Not supported. Use Autoscale.

**Autoscale for a bot.** Scaling to zero breaks long-lived connections. Use a Reserved VM.

**Vague prompts on effort-based billing.** Circling costs money. Plan first, prompt precisely.

**No GitHub sync.** Leaving the platform later is harder. Connect a repository early.

**Ignoring data residency.** US hosting may not suit EU customers' data. Check before launch.

**Surprise bills.** Usage-based pricing scales with success. Estimate and set alerts.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Replit combines a browser editor, running environment, PostgreSQL database, secrets, and hosting with an Agent that plans, builds, and tests apps from descriptions. Agent checkpoints capture files, conversation, configuration, memory, and development data, and are Git commits; rollback restores the development database only on request and within 7 days, and never the production database, which has separate point-in-time recovery. Development and production databases are separate, the Agent cannot modify production, and schema changes reach production through a reviewed publish. Secrets are encrypted environment variables, separate from non-sensitive configurations, visible in full to owners and collaborators, by name to remixers, and readable by anyone who can print the environment. Deployments are Autoscale for most web apps, Reserved VMs for always-on work, Static for plain sites but not Agent-built apps, and Scheduled for jobs. Pricing is usage-based with effort-based Agent billing, and apps are US-hosted unless on Enterprise. Graduate to your own stack when data residency, compliance, team size, cost, or infrastructure needs outgrow the platform, which is easiest if the code is already in GitHub.

**Question 1.** After a bad Agent session on day 14, a developer rolls back to checkpoint cp2 from day 9, expecting the test orders they created since then to disappear from production as well. Using `rollback_plan`, explain what actually happens and what they should do.

<details>
<summary>View Answer</summary>

`rollback_plan` for cp2 on day 14 restores files, conversation context, configuration, and Agent memory; if the developer selects the database option, it also restores the development database, because cp2 is 5 days old, within the 7-day history. It warns that the production database is not changed by rollback, and that two later checkpoints, cp3 and cp4, are undone. So the code returns to its day-9 state, and the development data may too, but every order in production stays exactly where it is. That is by design: Replit's documentation says production databases are not restored by the rollback feature, so undoing code can never silently destroy real customers' data. If the test orders were created in production, which they should not have been, the developer should delete them deliberately, preferably with a reviewed script or the database tools, or, if something went badly wrong, use production's point-in-time recovery within its window, accepting that it also reverts any real orders placed since. The lasting fix is to test in development only, with separate credentials, so test data never reaches production.

</details>

**Question 2.** The stock-alert app's production settings came from copying the development values. Run `env_check` on the module's `DEV` and `PROD` and explain each issue and the fix.

<details>
<summary>View Answer</summary>

`env_check` reports four issues. `ALERT_EMAIL` is missing in production, so the app will either fail when sending alerts or skip them, depending on how it handles missing variables; set a production value, ideally a shared operations address rather than one person's. `SLACK_WEBHOOK_URL` is identical in development and production, so every test alert from development lands in the production channel, training staff to ignore it; create a separate development webhook. `STRIPE_KEY` is identical in both, and because it is a test key, `sk_test_123`, it is also flagged as a test credential in production: customers would go through a checkout that never charges them, or fails. Production needs the live key, development keeps the test key, and the live key should exist only in the production secrets, never in the workspace's development secrets, where collaborators and anyone who can print the environment could read it. The databases already differ, as Replit provisions a separate production database with its own `DATABASE_URL`. Running a check like this before every publish, or in continuous integration, catches these mistakes cheaply.

</details>

**Question 3.** The stock-alert app is expanding to Ireland and Germany, where the shop's lawyer wants customer data kept in the EU, and hosting has grown to about 400 US dollars a month against an estimated 45 for a self-managed stack. Use `graduation` to advise, and describe how to prepare the move.

<details>
<summary>View Answer</summary>

`graduation` returns "graduate" with two reasons: the data must stay in the EU while published apps are hosted in the United States unless on an Enterprise plan, and the platform costs more than twice a self-managed stack, about 400 against 45. The residency requirement alone is decisive unless the shop negotiates Enterprise terms with EU hosting, which may cost more again; the cost gap reinforces it. Preparation reduces risk. Connect the app to a GitHub repository through Replit's Git integration, if not already done, so the code and its history leave with you. Confirm the code reads all configuration from environment variables, which Replit's Secrets already encourage, so it runs anywhere. The database is standard PostgreSQL, so plan a migration with a dump and restore into an EU-hosted PostgreSQL service, rehearsed on a copy first, and a short write freeze during the switch. Choose an EU-region host for the app, set up deployment and rollback, Modules 9.10 and 9.11, point the custom domain at the new host, and keep the Replit deployment running read-only until the new one is verified. Replit remains a good place for future prototypes.

</details>

@@starter
"""
Lab: Deployment Types, Secret Visibility, Rollback Plans, Environment Checks, Graduation Signals
Standard library only. A simplified model of Replit's documented behaviour. Complete the TODO in each step, then
press "Run & Verify Step".
"""
BASE = {"has_backend": True, "agent_built": True, "runs_on_schedule": False, "needs_url": True, "always_on": False}
VISIBILITY = {"owner": (True, True), "collaborator": (True, True), "remixer": (True, False),
              "visitor": (False, False), "org_member": (True, False)}
CHECKPOINTS = [{"id": "cp1", "day": 1}, {"id": "cp2", "day": 9}, {"id": "cp3", "day": 12}, {"id": "cp4", "day": 13}]
DEV = {"DATABASE_URL": "postgres://dev-db", "STRIPE_KEY": "sk_test_123", "ALERT_EMAIL": "me@example.com", "SLACK_WEBHOOK_URL": "https://hooks.example/abc"}
PROD = {"DATABASE_URL": "postgres://prod-db", "STRIPE_KEY": "sk_test_123", "SLACK_WEBHOOK_URL": "https://hooks.example/abc"}
APP = {"data_region": "US", "enterprise": False, "compliance": False, "collaborators": 3,
       "monthly_platform_cost": 60, "monthly_self_hosted_cost": 45}


# ---------------------------------------------------------------- Step 1
def deployment_type(app):
    """No backend and not Agent-built -> ("Static", "files only, no server"); scheduled without a URL ->
    ("Scheduled", "runs a command on a schedule, then stops"); always on -> ("Reserved VM", "a dedicated server that
    never sleeps"); else ("Autoscale", "scales with traffic, down to zero when idle")."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def secret_view(role):
    """(names, values) from VISIBILITY, (False, False) if unknown. note = "can read values by printing environment
    variables" for owner/collaborator/org_member when values is False, else "". Return {"names", "values", "note"}."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def rollback_plan(checkpoints, target, include_db, now_day):
    """Unknown target -> (None, ["unknown checkpoint"]). Restored: files, conversation, configuration, agent memory;
    plus "development database" if include_db and now_day - day <= 7, else warn "development database history only
    covers 7 days" (when include_db). Always warn "production database is not changed by rollback"; then
    "<n> later checkpoint(s) undone" if any later. Return (restored, warnings)."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def env_check(dev, prod):
    """For dev keys in sorted order: "<key> missing in production"; or, if equal and the key ends with _URL, _KEY or
    _SECRET, "<key> identical in dev and production". Then for prod keys in sorted order ending _KEY or _SECRET
    whose value contains "test" (any case): "<key> looks like a test credential in production"."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def graduation(app):
    """Reasons: region not US and not enterprise; compliance; collaborators > 15; platform cost > 2 x self-hosted.
    Return ("graduate" or "stay", reasons)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("deploy:", deployment_type(BASE))
    print("env   :", env_check(DEV, PROD))

@@solution
"""
Lab solution: Deployment Types, Secret Visibility, Rollback Plans, Environment Checks, Graduation Signals
Standard library only. A simplified model of Replit's documented behaviour.
"""
BASE = {"has_backend": True, "agent_built": True, "runs_on_schedule": False, "needs_url": True, "always_on": False}
VISIBILITY = {"owner": (True, True), "collaborator": (True, True), "remixer": (True, False),
              "visitor": (False, False), "org_member": (True, False)}
CHECKPOINTS = [{"id": "cp1", "day": 1}, {"id": "cp2", "day": 9}, {"id": "cp3", "day": 12}, {"id": "cp4", "day": 13}]
DEV = {"DATABASE_URL": "postgres://dev-db", "STRIPE_KEY": "sk_test_123", "ALERT_EMAIL": "me@example.com", "SLACK_WEBHOOK_URL": "https://hooks.example/abc"}
PROD = {"DATABASE_URL": "postgres://prod-db", "STRIPE_KEY": "sk_test_123", "SLACK_WEBHOOK_URL": "https://hooks.example/abc"}
APP = {"data_region": "US", "enterprise": False, "compliance": False, "collaborators": 3,
       "monthly_platform_cost": 60, "monthly_self_hosted_cost": 45}


# ---------------------------------------------------------------- Step 1
def deployment_type(app):
    """Match the workload to Static, Scheduled, Reserved VM, or Autoscale."""
    if not app["has_backend"] and not app["agent_built"]:
        return "Static", "files only, no server"
    if app["runs_on_schedule"] and not app["needs_url"]:
        return "Scheduled", "runs a command on a schedule, then stops"
    if app["always_on"]:
        return "Reserved VM", "a dedicated server that never sleeps"
    return "Autoscale", "scales with traffic, down to zero when idle"


# ---------------------------------------------------------------- Step 2
def secret_view(role):
    """Who sees names and values, and the environment-printing caveat."""
    names, values = VISIBILITY.get(role, (False, False))
    can_print = role in {"owner", "collaborator", "org_member"}
    note = "can read values by printing environment variables" if can_print and not values else ""
    return {"names": names, "values": values, "note": note}


# ---------------------------------------------------------------- Step 3
def rollback_plan(checkpoints, target, include_db, now_day):
    """Code rolls back; the dev database only on request within 7 days; production never."""
    cp = next((c for c in checkpoints if c["id"] == target), None)
    if cp is None:
        return None, ["unknown checkpoint"]
    restored = ["files", "conversation", "configuration", "agent memory"]
    warnings = []
    if include_db:
        if now_day - cp["day"] <= 7:
            restored.append("development database")
        else:
            warnings.append("development database history only covers 7 days")
    warnings.append("production database is not changed by rollback")
    later = sum(1 for c in checkpoints if c["day"] > cp["day"])
    return restored, warnings + ([f"{later} later checkpoint(s) undone"] if later else [])


# ---------------------------------------------------------------- Step 4
def env_check(dev, prod):
    """Missing, shared, and test credentials in production."""
    issues = []
    for key in sorted(dev):
        if key not in prod:
            issues.append(f"{key} missing in production")
        elif prod[key] == dev[key] and key.endswith(("_URL", "_KEY", "_SECRET")):
            issues.append(f"{key} identical in dev and production")
    for key in sorted(prod):
        if "test" in str(prod[key]).lower() and key.endswith(("_KEY", "_SECRET")):
            issues.append(f"{key} looks like a test credential in production")
    return issues


# ---------------------------------------------------------------- Step 5
def graduation(app):
    """Stay while the platform fits; move when residency, compliance, team, or cost say so."""
    reasons = []
    if app["data_region"] != "US" and not app["enterprise"]:
        reasons.append(f"data must stay in {app['data_region']}; published apps are US-hosted")
    if app["compliance"]:
        reasons.append("compliance needs control over infrastructure")
    if app["collaborators"] > 15:
        reasons.append(f"{app['collaborators']} collaborators exceeds the plan limit")
    if app["monthly_platform_cost"] > 2 * app["monthly_self_hosted_cost"]:
        reasons.append("platform costs more than twice a self-managed stack")
    return ("graduate" if reasons else "stay"), reasons


if __name__ == "__main__":
    print(deployment_type({**BASE, "always_on": True}))
    print(secret_view("org_member"))
    print(rollback_plan(CHECKPOINTS, "cp2", include_db=True, now_day=14))
    print(env_check(DEV, PROD))
    print(graduation({**APP, "data_region": "EU", "monthly_platform_cost": 400}))

@@step
{
  "stepNumber": 1,
  "title": "Choose a deployment type",
  "instruction": "Implement deployment_type(app): ('Static', 'files only, no server') if it has no backend and was not built by the Agent; ('Scheduled', 'runs a command on a schedule, then stops') if it runs on a schedule and needs no URL; ('Reserved VM', 'a dedicated server that never sleeps') if it must always be on; otherwise ('Autoscale', 'scales with traffic, down to zero when idle'). Choose for five apps. This is deployments from Section 2. [MOD-9.6]",
  "hintConceptual": "A leaflet needs a display stand, a nightly stocktake needs an alarm clock, a receptionist needs a desk that is always staffed, and a shop with busy and quiet hours needs staff who come and go with the customers.",
  "hintSyntax": "if not app[\"has_backend\"] and not app[\"agent_built\"]:\n    return \"Static\", \"files only, no server\"\nif app[\"runs_on_schedule\"] and not app[\"needs_url\"]:\n    return \"Scheduled\", \"runs a command on a schedule, then stops\"\nif app[\"always_on\"]:\n    return \"Reserved VM\", \"a dedicated server that never sleeps\"\nreturn \"Autoscale\", \"scales with traffic, down to zero when idle\""
}
@@assert
assert deployment_type(BASE) == ("Autoscale", "scales with traffic, down to zero when idle"), f"The web app, got {deployment_type(BASE)}"
assert deployment_type({**BASE, "always_on": True})[0] == "Reserved VM" and deployment_type({**BASE, "runs_on_schedule": True, "needs_url": False})[0] == "Scheduled", "A bot; a nightly job"
assert deployment_type({**BASE, "has_backend": False, "agent_built": False}) == ("Static", "files only, no server"), "A plain site"
assert deployment_type({**BASE, "has_backend": False})[0] == "Autoscale", "Agent-built apps cannot be Static"
print("Step 1 passed: the web app autoscales, the bot gets a Reserved VM, the nightly check is Scheduled.")

@@step
{
  "stepNumber": 2,
  "title": "Work out who sees secrets",
  "instruction": "Implement secret_view(role). Look up (names, values) in VISIBILITY, using (False, False) for an unknown role. Set the note to 'can read values by printing environment variables' when the role is owner, collaborator, or org_member and values is False, otherwise ''. Return a dict of names, values, and note. Check five roles plus an unknown one. This is secrets from Section 2. [MOD-9.6]",
  "hintConceptual": "Some people may open the safe, some may read the labels on the boxes, some see nothing, and anyone allowed to run the machinery can read whatever the machinery reads.",
  "hintSyntax": "names, values = VISIBILITY.get(role, (False, False))\ncan_print = role in {\"owner\", \"collaborator\", \"org_member\"}\nnote = \"can read values by printing environment variables\" if can_print and not values else \"\"\nreturn {\"names\": names, \"values\": values, \"note\": note}"
}
@@assert
assert secret_view("owner") == {"names": True, "values": True, "note": ""} and secret_view("collaborator")["values"] is True, f"Full access, got {secret_view('owner')}"
assert secret_view("remixer") == {"names": True, "values": False, "note": ""}, "Names only"
assert secret_view("visitor") == {"names": False, "values": False, "note": ""} and secret_view("stranger") == {"names": False, "values": False, "note": ""}, "Nothing"
assert secret_view("org_member") == {"names": True, "values": False, "note": "can read values by printing environment variables"}, "The caveat"
print("Step 2 passed: an org member cannot view values but can print them.")

@@step
{
  "stepNumber": 3,
  "title": "Plan a rollback",
  "instruction": "Implement rollback_plan(checkpoints, target, include_db, now_day). Return (None, ['unknown checkpoint']) if the target id is not found. Restored always contains files, conversation, configuration, and agent memory. If include_db, add 'development database' when the checkpoint is at most 7 days old, otherwise warn 'development database history only covers 7 days'. Then always warn 'production database is not changed by rollback', and finally, if any checkpoints are later than the target, warn '<n> later checkpoint(s) undone'. Plan four rollbacks. This is checkpoints and rollback from Section 2. [MOD-9.6]",
  "hintConceptual": "Rewinding the workshop puts the tools and drawings back as they were; the stockroom is rewound only if you ask and the records go back far enough; the customers' orders are never rewound.",
  "hintSyntax": "cp = next((c for c in checkpoints if c[\"id\"] == target), None)\nif cp is None:\n    return None, [\"unknown checkpoint\"]\nrestored = [\"files\", \"conversation\", \"configuration\", \"agent memory\"]\nwarnings = []\nif include_db:\n    if now_day - cp[\"day\"] <= 7: restored.append(\"development database\")\n    else: warnings.append(\"development database history only covers 7 days\")\nwarnings.append(\"production database is not changed by rollback\")\nlater = sum(1 for c in checkpoints if c[\"day\"] > cp[\"day\"])\nreturn restored, warnings + ([f\"{later} later checkpoint(s) undone\"] if later else [])"
}
@@assert
_base = ["files", "conversation", "configuration", "agent memory"]
assert rollback_plan(CHECKPOINTS, "cp2", True, 14) == (_base + ["development database"], ["production database is not changed by rollback", "2 later checkpoint(s) undone"]), f"Five days old, got {rollback_plan(CHECKPOINTS, 'cp2', True, 14)}"
assert rollback_plan(CHECKPOINTS, "cp1", True, 14) == (_base, ["development database history only covers 7 days", "production database is not changed by rollback", "3 later checkpoint(s) undone"]), "Too old for the database"
assert rollback_plan(CHECKPOINTS, "cp4", False, 14) == (_base, ["production database is not changed by rollback"]), "Latest checkpoint, no database"
assert rollback_plan(CHECKPOINTS, "cp9", True, 14) == (None, ["unknown checkpoint"]), "Unknown"
print("Step 3 passed: cp2 restores the dev database; production is never rolled back.")

@@step
{
  "stepNumber": 4,
  "title": "Compare development and production",
  "instruction": "Implement env_check(dev, prod). For each development key in sorted order, add '<key> missing in production' if production lacks it, or '<key> identical in dev and production' if the values are equal and the key ends with _URL, _KEY, or _SECRET. Then for each production key in sorted order ending with _KEY or _SECRET whose value contains 'test' in any case, add '<key> looks like a test credential in production'. Check the stock-alert app. This is secrets from Section 2. [MOD-9.6]",
  "hintConceptual": "Lay the rehearsal settings beside the live ones and look for gaps, for the same key used on both stages, and for props still marked 'test' on the real stage.",
  "hintSyntax": "issues = []\nfor key in sorted(dev):\n    if key not in prod:\n        issues.append(f\"{key} missing in production\")\n    elif prod[key] == dev[key] and key.endswith((\"_URL\", \"_KEY\", \"_SECRET\")):\n        issues.append(f\"{key} identical in dev and production\")\nfor key in sorted(prod):\n    if \"test\" in str(prod[key]).lower() and key.endswith((\"_KEY\", \"_SECRET\")):\n        issues.append(f\"{key} looks like a test credential in production\")\nreturn issues"
}
@@assert
assert env_check(DEV, PROD) == ["ALERT_EMAIL missing in production", "SLACK_WEBHOOK_URL identical in dev and production", "STRIPE_KEY identical in dev and production", "STRIPE_KEY looks like a test credential in production"], f"Four issues, got {env_check(DEV, PROD)}"
assert env_check({"LOG_LEVEL": "debug"}, {"LOG_LEVEL": "debug"}) == [], "Identical non-secret settings are fine"
assert env_check({}, {"API_SECRET": "TEST-abc"}) == ["API_SECRET looks like a test credential in production"], "Case-insensitive test check"
assert env_check({"A_KEY": "x"}, {"A_KEY": "y"}) == [], "Different values pass"
print("Step 4 passed: a missing alert email, two shared credentials, and a test payment key in production.")

@@step
{
  "stepNumber": 5,
  "title": "Decide when to graduate",
  "instruction": "Implement graduation(app). Collect reasons: 'data must stay in <region>; published apps are US-hosted' if the region is not 'US' and the plan is not enterprise; 'compliance needs control over infrastructure' if compliance is required; '<n> collaborators exceeds the plan limit' if there are more than 15; 'platform costs more than twice a self-managed stack' if the monthly platform cost exceeds twice the self-hosted cost. Return ('graduate', reasons) if there are any, else ('stay', []). Assess four situations. This is when to graduate from Section 2. [MOD-9.6]",
  "hintConceptual": "Stay in the serviced workshop while it suits you; move out when the law wants your stock elsewhere, the inspectors need more control, the team no longer fits, or the rent dwarfs the cost of your own premises.",
  "hintSyntax": "reasons = []\nif app[\"data_region\"] != \"US\" and not app[\"enterprise\"]:\n    reasons.append(f\"data must stay in {app['data_region']}; published apps are US-hosted\")\nif app[\"compliance\"]:\n    reasons.append(\"compliance needs control over infrastructure\")\nif app[\"collaborators\"] > 15:\n    reasons.append(f\"{app['collaborators']} collaborators exceeds the plan limit\")\nif app[\"monthly_platform_cost\"] > 2 * app[\"monthly_self_hosted_cost\"]:\n    reasons.append(\"platform costs more than twice a self-managed stack\")\nreturn (\"graduate\" if reasons else \"stay\"), reasons"
}
@@assert
assert graduation(APP) == ("stay", []), f"A small US app stays, got {graduation(APP)}"
assert graduation({**APP, "data_region": "EU", "monthly_platform_cost": 400}) == ("graduate", ["data must stay in EU; published apps are US-hosted", "platform costs more than twice a self-managed stack"]), "The third recall question"
assert graduation({**APP, "data_region": "EU", "enterprise": True}) == ("stay", []), "Enterprise can request other regions"
assert graduation({**APP, "collaborators": 16, "compliance": True})[1] == ["compliance needs control over infrastructure", "16 collaborators exceeds the plan limit"], "Compliance and team size"
print("Step 5 passed: EU residency and a ninefold cost gap say graduate.")
