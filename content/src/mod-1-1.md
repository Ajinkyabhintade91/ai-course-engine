@@meta
{
  "moduleId": "MOD-1.1",
  "slug": "mod-1-1",
  "unitId": "UNIT-1",
  "unitTitle": "Unit 1: Understanding AI from Basics",
  "title": "What is Artificial Intelligence?",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Computing Machinery and Intelligence (Turing, 1950)", "source": "Primary Paper", "url": "https://www.cs.princeton.edu/courses/archive/fall13/cos402/readings/turing.pdf" },
    { "title": "A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence (1955)", "source": "AI Magazine", "url": "https://ojs.aaai.org/index.php/aimagazine/article/view/1904" },
    { "title": "Artificial Intelligence: A Modern Approach, Chapter 1 (Russell & Norvig)", "source": "UC Berkeley", "url": "https://people.eecs.berkeley.edu/%7Erussell/aima1e/chapter01.pdf" },
    { "title": "Artificial Intelligence: A Modern Approach, 3rd edition preface", "source": "Official Book Site", "url": "https://aima.cs.berkeley.edu/3rd-ed/preface.html" },
    { "title": "AI Winter: the cycles of hype and funding", "source": "DataCamp Blog", "url": "https://www.datacamp.com/blog/ai-winter" },
    { "title": "Elements of AI (free course)", "source": "University of Helsinki", "url": "https://www.elementsofai.com/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-1.1-1",
      "title": "Crash Course Artificial Intelligence (full playlist, start with episode 1: What Is Artificial Intelligence?)",
      "creator": "CrashCourse",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/playlist?list=PL8dPuuaLjXtO65LeD2p4_Sb5XQ51par_b",
      "timingInstruction": "Watch episode 1 after reading Section 1",
      "keyTakeaway": "A structured, friendly tour of what counts as AI and how the field got here. Episode 1 reinforces the agent loop and the history timeline from this chapter."
    },
    {
      "id": "VID-1.1-2",
      "title": "Artificial Intelligence vs. Augmented Intelligence",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=Ce1m3Y0OMKA",
      "timingInstruction": "Watch after reading Section 2 (definitions)",
      "keyTakeaway": "A short whiteboard talk separating AI that replaces a decision from AI that supports a human making it, which is the distinction that matters most in real deployments."
    },
    {
      "id": "VID-1.1-3",
      "title": "AI For Everyone",
      "creator": "DeepLearning.AI (Andrew Ng)",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/ai-for-everyone",
      "timingInstruction": "Start after finishing this module; Week 1 maps to this chapter",
      "keyTakeaway": "The standard non-technical course on what AI can and cannot do, how AI projects are scoped, and how to talk about AI inside an organisation."
    },
    {
      "id": "VID-1.1-4",
      "title": "Introduction to Artificial Intelligence (AI)",
      "creator": "IBM",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/introduction-to-ai",
      "timingInstruction": "Optional deeper pass after the lab",
      "keyTakeaway": "Four modules covering AI concepts, machine learning, deep learning, language, vision, and ethics, with more application examples than this chapter has room for."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Build and Score Your First Rational Agent",
    "context": "Your team is prototyping the control logic for a two-room robot vacuum and needs a simulator to compare decision policies before any hardware exists. You will write the agent, the scoring environment, a benchmark against a random baseline, and a tiny rule-based chatbot to see why imitating conversation is not the same as understanding it.",
    "language": "python"
  }
}

@@reading
# What is Artificial Intelligence?

Almost everyone uses the phrase "artificial intelligence", and almost nobody means the same thing by it. A spam filter, a chess program, a self-driving car, and a chatbot that writes poetry are all called AI, yet they share very little machinery. This chapter gives you a definition that survives contact with all of them, a short history that explains why the field looks the way it does, and a map of where AI is already running in your daily life. By the end you will be able to look at any product that claims to be "AI-powered" and ask three precise questions about it: what does it sense, what can it do, and what is it scored on?

## 1. First-Principles Mental Model & Intuition

### AI is a goal, not a technique

Start with an analogy. "Transportation" is not a machine. It is a goal: get something from one place to another. A bicycle, a car, and a jet are three very different techniques that all serve that goal. Artificial intelligence is the same kind of word. It names a goal, which is to build machines that do things we would call intelligent if a person did them. The techniques have changed completely over seventy years. Early systems were hand-written logical rules. Later systems learned statistical patterns from data. Today's best-known systems are very large neural networks. All of them are AI, because all of them serve the goal.

This matters because the most common beginner mistake is to treat AI as one specific thing, usually "whatever ChatGPT is". If you hold that picture, half the field becomes invisible. A route planner that finds the fastest way across a city uses search algorithms from the 1960s, learns nothing, and is still a textbook example of AI.

### The agent loop

The single most useful mental model in this course is the **agent**. An agent is anything that perceives its environment and acts on it. A thermostat is an agent: it senses temperature and switches a heater. A chess program is an agent: it sees the board and chooses a move. A chatbot is an agent: it reads your message and produces a reply.

```text
            percepts (what it senses)
   +-------------------------------------------+
   |                                           v
+--+----------+                        +---------------+
| ENVIRONMENT |                        |     AGENT     |
| room, board,|                        | decide: which |
| inbox, web  |                        | action next?  |
+--^----------+                        +-------+-------+
   |                                           |
   +-------------------------------------------+
            actions (what it does)

   A separate scorekeeper, the PERFORMANCE MEASURE,
   watches the environment and grades the outcome.
```

Every AI system you will meet in this course fits this picture. What changes from system to system is how the "decide" box is built. In a rule-based system a programmer writes the decision logic by hand. In a machine-learning system the logic is fitted from examples. In a large language model the logic is billions of learned numbers. The loop around the box stays the same.

### Why the scorekeeper matters

Notice the scorekeeper in the diagram. An agent is only "intelligent" relative to some measure of success. A vacuum robot scored on "amount of dirt collected" might learn to dump dirt back on the floor so it can collect it again. A robot scored on "clean floor area over time" would not. The behaviour you get depends on the score you choose, and choosing the score is a human job. Keep this in mind every time you read a headline about an AI doing something strange. Very often the system did exactly what it was scored on, and the score was the mistake.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Four ways to define AI

The standard textbook, *Artificial Intelligence: A Modern Approach* by Stuart Russell and Peter Norvig, sorts historical definitions of AI along two questions. Is the target *thinking* or *acting*? And is success measured against *humans* or against an ideal standard called *rationality*?

| | Measured against humans | Measured against an ideal |
|---|---|---|
| **Thinking** | Thinking humanly: model how human minds work (cognitive science) | Thinking rationally: follow the laws of logic |
| **Acting** | Acting humanly: behave indistinguishably from a person (the Turing test) | Acting rationally: do the right thing given what you know |

Modern AI engineering lives almost entirely in the bottom-right cell. We do not usually care whether a fraud detector thinks like a human. We care whether it makes good decisions.

### The rational agent, formally

A **percept** is one piece of input at one moment. The **percept sequence** is everything the agent has perceived so far. An agent's behaviour is described by its **agent function**, which maps any percept sequence to an action:

$$
f : P^{*} \rightarrow A
$$

Here $P^{*}$ is the set of all possible percept sequences and $A$ is the set of available actions. A **rational agent** picks, for every percept sequence, the action that is expected to maximise its performance measure, given the evidence so far and whatever knowledge it has built in:

$$
a^{*} = \arg\max_{a \in A} \; \mathbb{E}\left[\, U(\text{outcome}) \mid a,\ \text{percepts so far} \,\right]
$$

Read this slowly, because each symbol carries a practical lesson.

- $U$ is the performance measure, the scorekeeper. Change it and the best action changes.
- $\mathbb{E}$ means *expected value*. The agent maximises the average outcome over its uncertainty. It cannot see the future.
- The condition "percepts so far" means the agent is judged on what it could know, not on what was actually true.

That last point separates **rationality** from **omniscience**. Suppose you carry an umbrella because the forecast says 90 percent chance of rain, and it stays dry. Your decision was still rational. Rational means best *expected* outcome, not best outcome in hindsight. When people say an AI "made a mistake", it is worth asking whether it made a poor decision or a good decision with an unlucky result.

Rationality therefore depends on exactly four things: the performance measure, the agent's prior knowledge of the environment, the actions available to it, and the percept sequence to date. Engineers summarise the design of any agent with the acronym **PEAS**: Performance measure, Environment, Actuators, Sensors.

| Agent | Performance measure | Environment | Actuators | Sensors |
|---|---|---|---|---|
| Spam filter | Few missed spams, almost no lost real mail | Your inbox | Move to spam folder, or leave | Message text, sender, links |
| Route planner | Short travel time | Road network and traffic | Displayed route | Map data, live speeds |
| Chat assistant | Helpful, correct, safe answers | A conversation | Generated text | Your messages, attached files |

### Acting humanly: the Turing test

In October 1950 Alan Turing published "Computing Machinery and Intelligence" in the philosophy journal *Mind*. He found the question "Can machines think?" too vague to answer, so he replaced it with a game. An interrogator exchanges typed messages with two hidden parties, one human and one machine, and must decide which is which. If the interrogator cannot reliably tell, the machine has passed what we now call the **Turing test**.

Turing made a concrete prediction: in about fifty years, computers with roughly $10^{9}$ units of storage would play the game well enough that an average interrogator would have no more than a 70 percent chance of identifying the machine after five minutes of questioning.

The test is historically important and practically weak. It measures *imitation*, not understanding, and it rewards deception. In 1966 Joseph Weizenbaum at MIT wrote ELIZA, a program that imitated a psychotherapist using nothing but pattern matching. It would turn "I feel sad" into "Why do you feel sad?" with no model of sadness at all. Some users became convinced it understood them. You will build a miniature ELIZA in the lab and see how little is behind the curtain.

### Narrow and general intelligence

- **Narrow AI** (also called weak AI) performs a specific task or family of tasks: translate text, detect tumours in scans, recommend a film. Every AI system deployed today is narrow in this sense, including large language models, even though their "task" of producing useful text is very broad.
- **Artificial general intelligence (AGI)** would match human ability across essentially all intellectual tasks, including ones it was never built for. There is no agreed definition and no agreed test, and experts disagree widely on when or whether it will arrive. Treat confident claims in either direction with caution.

### A short history in five eras

| Era | Years (approximate) | Dominant idea | Why it stalled or succeeded |
|---|---|---|---|
| Birth and symbolic AI | 1950s to early 1970s | Intelligence is symbol manipulation and logical search | Solved puzzles; could not cope with messy real-world input |
| First AI winter | Mid 1970s | Funding cuts after unmet promises | The 1973 Lighthill report in the UK criticised the field's "grandiose objectives" |
| Expert systems | 1980s | Encode a human expert's knowledge as if-then rules | Commercial success, then collapse: rules were costly to maintain and brittle |
| Statistical machine learning | 1990s to 2000s | Learn patterns from data instead of writing rules | Worked wherever enough labelled data existed |
| Deep learning and generative AI | 2012 to today | Large neural networks learn their own features | Data, GPUs, and better algorithms arrived together |

A few anchor dates are worth remembering. The field got its name from a proposal dated 31 August 1955, written by John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon, for a summer workshop held at Dartmouth College in 1956. Their founding conjecture was that every aspect of learning or intelligence can in principle be described so precisely that a machine can simulate it. In 1997 IBM's Deep Blue defeated world chess champion Garry Kasparov using massive search. In 2012 a neural network called AlexNet won the ImageNet image-recognition competition by a wide margin and started the deep learning era. In 2016 DeepMind's AlphaGo beat Lee Sedol at Go. In 2017 the Transformer architecture was published, and in November 2022 ChatGPT put a large language model in front of the general public.

The two **AI winters** (roughly the mid 1970s and the late 1980s into the early 1990s) follow one pattern: bold promises, heavy investment, results that fall short, then a funding collapse. The exact dates vary between historians. The pattern is the lesson. It is a useful antidote to both hype and despair.

### Where AI shows up today

| Application | What it senses | What it does | Typical technique |
|---|---|---|---|
| Web search | Your query, billions of pages | Ranks results | Learned ranking models plus classical retrieval |
| Recommendations | Your history and similar users | Chooses what to show next | Collaborative filtering, neural networks |
| Perception | Pixels, audio waves | Labels objects, transcribes speech | Deep neural networks |
| Language | Text | Translates, summarises, answers | Large language models |
| Decision systems | Transactions, sensor readings, game states | Approves, routes, plans, plays | Search, optimisation, reinforcement learning |

**Complexity note.** The agent function $f$ is a mathematical ideal. Written out as a lookup table it would need one row for every possible percept sequence. With $|P|$ possible percepts and a lifetime of $T$ steps, that table has $\sum_{t=1}^{T} |P|^{t}$ rows, which grows exponentially in $T$. A chess agent would need more rows than there are atoms in the observable universe. The entire craft of AI is finding compact programs, whether rules, search procedures, or learned models, that approximate the ideal table without storing it.

## 3. Production-Grade Implementation & Annotated Walkthrough

The clearest way to make the definitions concrete is to build the smallest possible agent and score it. The program below models a thermostat. It has an environment (a room that loses heat), an agent (a decision rule), and a performance measure (comfort minus energy cost). It uses only the Python standard library.

```python
import random

TARGET = 21.0          # desired room temperature in degrees Celsius

def reflex_thermostat(percept):
    """A simple reflex agent: the action depends only on the current percept."""
    temperature = percept
    if temperature < TARGET - 0.5:
        return "HEAT"
    return "OFF"

def always_off(percept):
    """A baseline agent that never acts. Baselines tell you what 'good' means."""
    return "OFF"

def simulate(agent, hours=24, seed=0):
    """Run one day and return the performance score (higher is better)."""
    rng = random.Random(seed)          # seeded: the same seed gives the same day
    temperature = 18.0
    score = 0.0
    for _ in range(hours):
        action = agent(temperature)                    # percept in, action out
        if action == "HEAT":
            temperature += 1.5
            score -= 0.3                               # energy has a cost
        temperature -= rng.uniform(0.2, 1.0)           # the room leaks heat
        score -= abs(temperature - TARGET)             # discomfort has a cost
    return round(score, 2)

if __name__ == "__main__":
    for name, agent in [("reflex", reflex_thermostat), ("always off", always_off)]:
        scores = [simulate(agent, seed=s) for s in range(100)]
        print(f"{name:>10}: mean score {sum(scores) / len(scores):8.2f}")
```

Walk through it line by line with the theory in hand.

1. **`reflex_thermostat(percept)` is the agent function.** It takes a percept and returns an action. Because it looks only at the *current* temperature and ignores history, it is called a **simple reflex agent**, the most basic design in the textbook taxonomy. More capable designs keep internal state (model-based agents), plan toward goals (goal-based agents), or weigh trade-offs numerically (utility-based agents).
2. **`simulate` is the environment and the scorekeeper together.** Inside the loop the environment hands the agent a percept, applies the chosen action, and then changes on its own (the room cools by a random amount). This is a **stochastic** environment: the same action does not always lead to the same result.
3. **The score encodes a trade-off.** Heating costs 0.3 points per hour and discomfort costs one point per degree away from target. If you made energy much more expensive, the "rational" behaviour would shift toward a colder room. The agent's code would need to change even though its sensors and actuators did not. That is the performance measure doing its work.
4. **`random.Random(seed)` makes experiments reproducible.** In a stochastic environment a single run tells you very little. The script averages 100 seeded days. Evaluating on many runs and comparing against a baseline is how every serious AI system is assessed, from thermostats to language models.
5. **`always_off` is a baseline.** A score means nothing alone. "Our agent scores minus 40" is uninformative until you learn that doing nothing scores minus 180.

Now compare this with a second way to build the "decide" box: a **rule-based system**, the technology behind 1980s expert systems. Instead of one function, knowledge is stored as data, and a general engine applies it.

```python
RULES = [
    # (set of conditions that must all be known, fact to conclude)
    ({"has_fever", "has_cough"}, "possible_flu"),
    ({"possible_flu", "short_of_breath"}, "see_doctor_today"),
    ({"has_rash"}, "possible_allergy"),
]

def forward_chain(facts):
    """Keep applying rules until no rule adds anything new."""
    known = set(facts)
    changed = True
    while changed:
        changed = False
        for conditions, conclusion in RULES:
            if conditions <= known and conclusion not in known:
                known.add(conclusion)       # the rule "fires"
                changed = True
    return known

print(forward_chain({"has_fever", "has_cough", "short_of_breath"}))
# contains 'possible_flu' and 'see_doctor_today'
print(forward_chain({"has_fever", "has_dry_cough"}))
# concludes nothing new: 'has_dry_cough' is not the exact symbol 'has_cough'
```

This technique is called **forward chaining**. The second call shows the famous weakness. The system has no idea that a dry cough is a kind of cough. Every variation a human would handle without thinking needs another hand-written rule. Real expert systems grew to thousands of rules that interacted in ways nobody could predict, and the cost of maintaining them is a large part of why that era ended. Machine learning, the subject of the next module, attacks precisely this problem by fitting the decision logic from examples.

The time cost of the loop above is worth a glance. Each pass checks every rule, and there can be at most one pass per new fact, so with $R$ rules and at most $F$ derivable facts the engine does on the order of $R \times F$ subset checks. That is fine for dozens of rules and painful for tens of thousands, which is why production rule engines use smarter matching algorithms.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

These are the points that come up repeatedly when practitioners correct newcomers, and that introductory material tends to skip.

**"AI", "machine learning", and "deep learning" are not synonyms.** They are nested: deep learning is one kind of machine learning, which is one kind of AI. Plenty of deployed AI uses no learning at all. If a vendor says "AI-powered", the useful follow-up is "which part is learned, and from what data?" Often the honest answer is a handful of rules or a simple statistical model, and that may be exactly the right engineering choice.

**The AI effect.** There is a long-running joke in the field that AI is "whatever hasn't been done yet". Optical character recognition, chess engines, and route planning were all considered AI research, and each stopped being called AI once it worked reliably. Expect the same to happen to today's tools. The practical consequence is that the label tells you nothing about how a system works. Look at the mechanism.

**Passing a conversation test does not demonstrate understanding.** ELIZA fooled people in 1966 with a few dozen patterns. Fluent output is cheap evidence. When you evaluate any AI system, test it on the task you actually need done, with cases where a wrong answer is detectable, and do not rely on how confident or human it sounds.

**The specification problem is the hard part.** Engineers who ship AI systems report spending far more effort on defining success than on the model. A recommendation system scored on clicks will learn to serve clickbait. A support bot scored on "conversations closed" will learn to end conversations. Before building anything, write down the performance measure and ask, "What is the laziest or most perverse way to score well on this?" This failure pattern has a name, **specification gaming**, and it appears at every scale.

**"The AI decided" hides human choices.** People chose the data, the objective, the actions the system may take, and the threshold at which it acts. When a system misbehaves, debugging starts with those choices. Treating the system as an independent mind slows the investigation.

**A baseline comes first.** Experienced practitioners always ask how a trivial approach performs: a fixed rule, a random choice, "always predict the most common answer". Many impressive-sounding results shrink dramatically next to a sensible baseline, and some disappear.

**Do not confuse randomness with intelligence, or determinism with stupidity.** A seeded random number generator makes a stochastic simulation repeatable. Without a seed you cannot tell whether a change to your agent helped or whether you got a lucky run. Reproducibility is the first debugging tool in AI work.

**History rhymes.** The winters were caused by promising general intelligence and delivering narrow tools. The narrow tools were often useful. When you plan a project or advise a client, promise the narrow tool.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Artificial intelligence is the goal of building machines that act intelligently, and the working definition used by engineers is the rational agent: a system that maps what it has perceived to the action expected to score best on a chosen performance measure. The field began in the 1950s with logic and search, passed through expert systems and two funding winters, turned to statistical learning in the 1990s, and has been dominated by deep neural networks since 2012. Every system, old or new, can be analysed with the same four questions: what is the performance measure, what is the environment, what can it do, and what can it sense.

Answer each question from memory before opening the answer.

**Question 1.** A weather app tells you there is a 10 percent chance of rain, you leave your umbrella at home, and you get soaked. Was your decision irrational? Explain using the definition of a rational agent.

<details>
<summary>View Answer</summary>

No. A rational agent chooses the action with the best *expected* outcome given the evidence available at the time. With a 10 percent chance of rain, leaving the umbrella was the better bet for most reasonable ways of scoring comfort against inconvenience. Rationality is not omniscience, and a good decision can have a bad result. The decision would be irrational only if the evidence you had, such as dark clouds overhead, pointed the other way and you ignored it.

</details>

**Question 2.** ELIZA convinced some users it understood them in 1966. What does this tell you about using the Turing test as a measure of intelligence, and what would you measure instead when evaluating an AI product?

<details>
<summary>View Answer</summary>

It shows that the Turing test measures the ability to imitate conversation, which can be achieved with shallow pattern matching and which depends heavily on how willing the human judge is to be fooled. Fluent language is weak evidence of understanding. For a product, define the actual task and its performance measure, then test on cases with checkable answers, compare against a simple baseline, and look specifically at the failures.

</details>

**Question 3.** A company scores its customer-support bot on "percentage of chats closed without a human". Using the PEAS framework, identify the risk and propose a better performance measure.

<details>
<summary>View Answer</summary>

The performance measure rewards closing chats, not solving problems. An agent optimising it can score well by discouraging customers, giving unhelpful answers that end the conversation, or refusing to escalate, which is specification gaming. A better measure combines verified resolution (the customer confirms the issue was fixed, or does not return with the same issue within a week), satisfaction ratings, and a penalty for failing to escalate cases that needed a human. The environment, actuators, and sensors are unchanged. Only the scorekeeper was wrong.

</details>

@@starter
"""
Lab: Build and Score Your First Rational Agent
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

The world has two rooms, 'A' (left) and 'B' (right). Each room is 'Dirty' or 'Clean'.
A percept is a tuple: (location, status), for example ('A', 'Dirty').
An action is one of: 'Suck', 'Left', 'Right'.
"""
import random
import re


def random_agent(percept, rng=random):
    """Baseline agent: ignores the percept and picks any action. (Provided for you.)"""
    return rng.choice(["Suck", "Left", "Right"])


# ---------------------------------------------------------------- Step 1
def reflex_agent(percept):
    """Return the best action for the CURRENT percept only."""
    location, status = percept
    # TODO Step 1: return 'Suck' if the current room is Dirty;
    #              otherwise move to the other room ('Right' from A, 'Left' from B).
    return None


# ---------------------------------------------------------------- Step 2
def run_episode(agent, world, start="A", steps=6):
    """Simulate `steps` time steps and return the performance score.

    Scoring (the performance measure):
      +10 each time the agent sucks up dirt in a Dirty room
       -1 each time the agent moves ('Left' or 'Right')
        0 for sucking in a room that is already Clean
    """
    world = dict(world)      # copy so the caller's dictionary is not modified
    location = start
    score = 0
    # TODO Step 2: loop `steps` times. Each time:
    #   1. build the percept (location, world[location])
    #   2. ask the agent for an action
    #   3. apply the action to `world` / `location` and update `score`
    return None


# ---------------------------------------------------------------- Step 3
def average_score(agent, trials=200, steps=6, seed=0):
    """Average run_episode score over `trials` randomly generated worlds."""
    rng = random.Random(seed)
    # TODO Step 3: for each trial, build a random world such as
    #   {'A': rng.choice(['Dirty', 'Clean']), 'B': rng.choice(['Dirty', 'Clean'])}
    # pick a random start room with rng.choice(['A', 'B']),
    # run an episode, and return the mean score as a float.
    return None


# ---------------------------------------------------------------- Step 4
ELIZA_RULES = [
    # (regular expression, reply template). {0} is replaced by the captured text.
    (r"i feel (.+)", "Why do you feel {0}?"),
    (r"i am (.+)", "How long have you been {0}?"),
    (r"because (.+)", "Is that the real reason?"),
]
DEFAULT_REPLY = "Please tell me more."


def eliza_reply(message):
    """Reply using the first matching rule; fall back to DEFAULT_REPLY."""
    text = message.lower().strip().rstrip(".!?")
    # TODO Step 4: try each (pattern, template) in ELIZA_RULES with re.search.
    #   On the first match return template.format(match.group(1)).
    #   If nothing matches return DEFAULT_REPLY.
    return None


if __name__ == "__main__":
    print("reflex_agent(('A', 'Dirty')) ->", reflex_agent(("A", "Dirty")))
    print("one episode score            ->", run_episode(reflex_agent, {"A": "Dirty", "B": "Dirty"}))
    print("average reflex score         ->", average_score(reflex_agent))
    print("eliza_reply('I feel tired')  ->", eliza_reply("I feel tired"))

@@solution
"""
Lab solution: Build and Score Your First Rational Agent
Standard library only.

The world has two rooms, 'A' (left) and 'B' (right). Each room is 'Dirty' or 'Clean'.
A percept is a tuple: (location, status), for example ('A', 'Dirty').
An action is one of: 'Suck', 'Left', 'Right'.
"""
import random
import re


def random_agent(percept, rng=random):
    """Baseline agent: ignores the percept and picks any action."""
    return rng.choice(["Suck", "Left", "Right"])


# ---------------------------------------------------------------- Step 1
def reflex_agent(percept):
    """A simple reflex agent: the action depends only on the current percept.

    This is the agent function f(percept) -> action written as three rules.
    It keeps no memory, so it will happily shuttle between two clean rooms forever.
    """
    location, status = percept
    if status == "Dirty":
        return "Suck"                      # cleaning is always worth +10
    return "Right" if location == "A" else "Left"


# ---------------------------------------------------------------- Step 2
def run_episode(agent, world, start="A", steps=6):
    """Simulate `steps` time steps and return the performance score.

    This function is the ENVIRONMENT and the PERFORMANCE MEASURE in one place:
    it produces percepts, applies actions, and keeps score.
    """
    world = dict(world)                    # never mutate the caller's data
    location = start
    score = 0
    for _ in range(steps):
        percept = (location, world[location])
        action = agent(percept)
        if action == "Suck":
            if world[location] == "Dirty":
                world[location] = "Clean"
                score += 10                # reward only real cleaning
        elif action == "Right":
            location = "B"
            score -= 1                     # movement costs energy
        elif action == "Left":
            location = "A"
            score -= 1
        # any other action is ignored: an agent that returns nonsense just wastes a step
    return score


# ---------------------------------------------------------------- Step 3
def average_score(agent, trials=200, steps=6, seed=0):
    """Average score over many random worlds.

    One episode in a random world says almost nothing. A seeded generator makes the
    whole experiment repeatable, so two agents can be compared on identical worlds.
    """
    rng = random.Random(seed)
    total = 0
    for _ in range(trials):
        world = {
            "A": rng.choice(["Dirty", "Clean"]),
            "B": rng.choice(["Dirty", "Clean"]),
        }
        start = rng.choice(["A", "B"])
        total += run_episode(agent, world, start=start, steps=steps)
    return total / trials


# ---------------------------------------------------------------- Step 4
ELIZA_RULES = [
    (r"i feel (.+)", "Why do you feel {0}?"),
    (r"i am (.+)", "How long have you been {0}?"),
    (r"because (.+)", "Is that the real reason?"),
]
DEFAULT_REPLY = "Please tell me more."


def eliza_reply(message):
    """Imitate conversation with pure pattern matching.

    There is no model of feelings here, only string surgery. That is the point:
    human-sounding output is weak evidence of understanding.
    """
    text = message.lower().strip().rstrip(".!?")
    for pattern, template in ELIZA_RULES:
        match = re.search(pattern, text)
        if match:
            return template.format(match.group(1))
    return DEFAULT_REPLY


if __name__ == "__main__":
    print("reflex_agent(('A', 'Dirty')) ->", reflex_agent(("A", "Dirty")))
    print("one episode score            ->", run_episode(reflex_agent, {"A": "Dirty", "B": "Dirty"}))
    print("average reflex score         ->", average_score(reflex_agent))
    baseline_rng = random.Random(1)    # ONE seeded generator shared across calls, so actions really vary
    print("average random score         ->", average_score(lambda p: random_agent(p, baseline_rng)))
    print("eliza_reply('I feel tired')  ->", eliza_reply("I feel tired"))

@@step
{
  "stepNumber": 1,
  "title": "Write the reflex agent function",
  "instruction": "Implement reflex_agent(percept). The percept is a tuple (location, status). If the current room is 'Dirty', return 'Suck'. If it is 'Clean', move to the other room: return 'Right' when the agent is in room 'A' and 'Left' when it is in room 'B'. This is the agent function from Section 2 written as code: percept in, action out. [MOD-1.1]",
  "hintConceptual": "A simple reflex agent looks only at what it senses right now. Ask yourself which single fact makes cleaning the right move, and what the only sensible alternative is when that fact is false.",
  "hintSyntax": "if status == \"Dirty\":\n    return \"Suck\"\nreturn \"Right\" if location == \"A\" else \"Left\""
}
@@assert
assert reflex_agent(("A", "Dirty")) == "Suck", "In a Dirty room the agent must return 'Suck'"
assert reflex_agent(("B", "Dirty")) == "Suck", "In a Dirty room the agent must return 'Suck'"
assert reflex_agent(("A", "Clean")) == "Right", "From a Clean room A the agent must move 'Right'"
assert reflex_agent(("B", "Clean")) == "Left", "From a Clean room B the agent must move 'Left'"
print("Step 1 passed: the agent maps every percept to the right action.")

@@step
{
  "stepNumber": 2,
  "title": "Build the environment and the performance measure",
  "instruction": "Implement run_episode(agent, world, start, steps). Repeat `steps` times: build the percept (location, world[location]), call agent(percept) to get an action, then apply it. 'Suck' in a Dirty room cleans it and adds 10 to the score; 'Suck' in a Clean room changes nothing. 'Right' moves the agent to 'B' and 'Left' moves it to 'A', each costing 1 point. Return the final score. This function is the scorekeeper from the agent-loop diagram. [MOD-1.1]",
  "hintConceptual": "The environment owns the truth about the world and the score. The agent only ever sees a percept. Keep those two roles separate: the loop asks the agent what to do, then the loop (not the agent) changes the world.",
  "hintSyntax": "for _ in range(steps):\n    action = agent((location, world[location]))\n    if action == \"Suck\":\n        if world[location] == \"Dirty\":\n            world[location] = \"Clean\"\n            score += 10\n    elif action == \"Right\":\n        location = \"B\"\n        score -= 1\n    elif action == \"Left\":\n        location = \"A\"\n        score -= 1\nreturn score"
}
@@assert
def _always_suck(percept):
    return "Suck"

def _clean_then_move(percept):
    location, status = percept
    if status == "Dirty":
        return "Suck"
    return "Right" if location == "A" else "Left"

_w = {"A": "Dirty", "B": "Dirty"}
assert run_episode(_always_suck, _w, start="A", steps=3) == 10, "Sucking 3 times in one dirty room scores exactly 10"
assert run_episode(_clean_then_move, _w, start="A", steps=3) == 19, "Suck (+10), Right (-1), Suck (+10) should score 19"
assert run_episode(_clean_then_move, {"A": "Clean", "B": "Clean"}, start="A", steps=4) == -4, "Four moves between clean rooms should score -4"
assert _w == {"A": "Dirty", "B": "Dirty"}, "run_episode must not modify the world passed in by the caller"
print("Step 2 passed: the environment applies actions and keeps score correctly.")

@@step
{
  "stepNumber": 3,
  "title": "Benchmark against a baseline",
  "instruction": "Implement average_score(agent, trials, steps, seed). Use the seeded generator rng that is already created. For each trial build a random world where rooms 'A' and 'B' are each rng.choice(['Dirty', 'Clean']), choose a random start room with rng.choice(['A', 'B']), run one episode, and add up the scores. Return the mean as a float. A single run in a random world proves nothing; averages over seeded runs do. [MOD-1.1]",
  "hintConceptual": "You are estimating an expected value, the E in the rational-agent formula, by sampling. Using the same seed for two different agents gives them the same sequence of worlds, which makes the comparison fair.",
  "hintSyntax": "total = 0\nfor _ in range(trials):\n    world = {\"A\": rng.choice([\"Dirty\", \"Clean\"]), \"B\": rng.choice([\"Dirty\", \"Clean\"])}\n    start = rng.choice([\"A\", \"B\"])\n    total += run_episode(agent, world, start=start, steps=steps)\nreturn total / trials"
}
@@assert
def _smart(percept):
    location, status = percept
    if status == "Dirty":
        return "Suck"
    return "Right" if location == "A" else "Left"

_rng = random.Random(7)
def _random_policy(percept):
    return _rng.choice(["Suck", "Left", "Right"])

_a = average_score(_smart, trials=300, steps=6, seed=3)
_b = average_score(_smart, trials=300, steps=6, seed=3)
_r = average_score(_random_policy, trials=300, steps=6, seed=3)
assert isinstance(_a, float), "average_score must return a float"
assert _a == _b, "The same seed must give exactly the same average (use the provided rng)"
assert _a > _r, "The reflex policy should beat the random baseline on average"
assert -6 <= _a <= 20, "The average is outside the possible score range; check your arithmetic"
print(f"Step 3 passed: reflex {_a:.2f} vs random {_r:.2f} over 300 seeded worlds.")

@@step
{
  "stepNumber": 4,
  "title": "Imitation without understanding: a mini ELIZA",
  "instruction": "Implement eliza_reply(message). The cleaned, lower-case text is already in `text`. Go through ELIZA_RULES in order; for the first rule whose pattern matches (use re.search), return the template filled in with the captured group. If no rule matches, return DEFAULT_REPLY. Then try a few messages of your own and notice how quickly the illusion breaks. [MOD-1.1]",
  "hintConceptual": "This is a rule-based system, like the forward-chaining example in Section 3, except the rules transform text. The first matching rule wins, so rule order is part of the program's behaviour.",
  "hintSyntax": "for pattern, template in ELIZA_RULES:\n    match = re.search(pattern, text)\n    if match:\n        return template.format(match.group(1))\nreturn DEFAULT_REPLY"
}
@@assert
assert eliza_reply("I feel tired") == "Why do you feel tired?", "The 'i feel (.+)' rule should produce 'Why do you feel tired?'"
assert eliza_reply("I am worried about exams.") == "How long have you been worried about exams?", "Trailing punctuation should be stripped before matching"
assert eliza_reply("Because my boss said so") == "Is that the real reason?", "The 'because' rule should fire"
assert eliza_reply("Hello there") == "Please tell me more.", "Unmatched input must return DEFAULT_REPLY"
print("Step 4 passed: your chatbot sounds attentive and understands nothing.")
