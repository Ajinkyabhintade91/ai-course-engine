@@meta
{
  "moduleId": "MOD-6.4",
  "slug": "mod-6-4",
  "unitId": "UNIT-6",
  "unitTitle": "Unit 6: AI Content Creation Masterclass",
  "title": "AI Voiceovers",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Neural Codec Language Models are Zero-Shot Text to Speech Synthesizers (VALL-E)", "source": "arXiv", "url": "https://arxiv.org/abs/2301.02111" },
    { "title": "Natural TTS Synthesis by Conditioning WaveNet on Mel Spectrogram Predictions (Tacotron 2)", "source": "arXiv", "url": "https://arxiv.org/abs/1712.05884" },
    { "title": "Speech Synthesis Markup Language (SSML) Version 1.1", "source": "W3C Recommendation", "url": "https://www.w3.org/TR/speech-synthesis11/" },
    { "title": "Text to speech guide", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/docs/guides/text-to-speech" },
    { "title": "Pricing", "source": "ElevenLabs", "url": "https://elevenlabs.io/pricing" },
    { "title": "Article 50: Transparency Obligations for Providers and Deployers of Certain AI Systems", "source": "EU Artificial Intelligence Act", "url": "https://artificialintelligenceact.eu/article/50/" },
    { "title": "FCC Makes AI-Generated Voices in Robocalls Illegal", "source": "U.S. Federal Communications Commission", "url": "https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal" }
  ],
  "videoLibrary": [
    {
      "id": "VID-6.4-1",
      "title": "How to Use ElevenLabs AI (Complete Voiceover Beginner Tutorial)",
      "creator": "Kevin Stratvert",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=yDTbAxJ3sKI",
      "timingInstruction": "Watch after reading Section 1, to see a script turned into narration and the main controls in use",
      "keyTakeaway": "A beginner's walkthrough of generating a voiceover: choosing a voice, pasting a script, adjusting the settings, and regenerating a line."
    },
    {
      "id": "VID-6.4-2",
      "title": "ElevenLabs Full Tutorial - AI Voice Cloning, Dubbing, Speech-to-Text & More!",
      "creator": "PromoAmbitions",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=hzyx0JkiAt4",
      "timingInstruction": "Watch after reading Section 2 (voice cloning and its two kinds)",
      "keyTakeaway": "Covers the wider set of voice features, cloning, dubbing into other languages, and transcription, and where each fits in production."
    },
    {
      "id": "VID-6.4-3",
      "title": "How To Clone Your Voice Perfectly (ElevenLabs 2026)",
      "creator": "How to Digital",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=veBEUHr4-Ig",
      "timingInstruction": "Watch before the consent part of Section 2, as an example of cloning your own voice with your own recording",
      "keyTakeaway": "Shows what a good source recording for a voice clone is like, and how the quality of the sample decides the quality of the clone."
    },
    {
      "id": "VID-6.4-4",
      "title": "AI Video Production for Business: Voice, Avatars, Automation",
      "creator": "SkillsBooster Academy",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/specializations/ai-video-production-for-business-voice-avatars-automation",
      "timingInstruction": "Take the voice course of this specialization after completing the lab",
      "keyTakeaway": "Structured practice in producing narration for business video and combining it with the avatar and automation tools of later chapters."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Time It, Say the Numbers, Fix Pronunciation, Mark It Up, and Chunk It",
    "context": "A woodworking shop is narrating its videos with an AI voice and keeps hearing mispronounced names, rushed lines, and narration that overruns the pictures. You will build an estimator of how long a script takes to say, a function that writes numbers as words, a pronunciation dictionary, a generator of SSML with pauses, and a splitter that divides a long script at sentence boundaries.",
    "language": "python"
  }
}

@@reading
# AI Voiceovers

A synthetic voice can now read a script in a way most listeners cannot tell from a person. It takes seconds, costs little, and can be redone as often as you like. For anyone who makes video, courses, or podcasts, narration has stopped being the hard part.

What has replaced it as the hard part is everything around the voice. A text-to-speech system reads exactly what is on the page, including the things a human reader would silently fix. A script that reads well on paper can sound stiff aloud. And a voice is part of a person, so cloning one raises questions of consent that generating a picture of a fox does not. This chapter covers how the technology works, how to write and mark up a script for it, and the rules for using voices that are not your own.

## 1. First-Principles Mental Model & Intuition

### The reader who never asks

Hand a script to a professional narrator and they will fix it as they go. They know that "Dr." is "Doctor" before a name and "Drive" after a street. They read "2026" as "twenty twenty-six" and "1,205" as "one thousand two hundred and five". They pause where the sense requires. If they meet an unfamiliar surname, they ask.

A speech model does none of this reliably. It converts the characters it is given into sound. It guesses at abbreviations, numbers, and names, and its guesses are confident and sometimes wrong. It cannot ask.

So the working rule of this chapter is simple. **Write what you want to hear.** If you want "kilometres", do not write "km". If the name is said "Win", arrange for the model to be given "Win". The script the model receives is a performance score, and you are the one who has to write out every note.

### From text to sound

```text
   THE CLASSIC PIPELINE

   text  ->  NORMALISE  ->  PHONEMES  ->  ACOUSTIC MODEL  ->  VOCODER  ->  audio
             "Dr." to       the sounds     pitch, timing,     turns the
             "Doctor"       of each word   and tone over      plan into
             "5 km" to                     time               a waveform
             "five kilometres"

   THE NEWER DESIGN

   text  +  a few seconds of a voice  ->  LANGUAGE MODEL OVER AUDIO TOKENS  ->  audio
                                          continues the sample, saying your text
```

Both designs begin with the same weak link: turning written text into the words to be spoken. Almost every pronunciation error you will meet comes from that first step, and it is the step you control.

### Eye and ear

A reader can see the whole sentence, glance back, and skip a bracket. A listener gets the words once, in order, at the speaker's pace. Writing for the ear means writing for someone who cannot look back.

| Written for the eye | Written for the ear |
|---|---|
| "Revenue (see Fig. 2) rose 12.5% to 1,205 units." | "Revenue rose by twelve and a half percent. That is one thousand two hundred and five units." |
| "The chisel, which had been neglected for years and was badly pitted, needed regrinding." | "The chisel had been neglected for years. It was badly pitted. It needed regrinding." |

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### How text-to-speech works

The classic system has four stages. **Text normalisation** rewrites numbers, dates, abbreviations, and symbols as words. **Grapheme-to-phoneme conversion** turns the words into the sounds that make them up. An **acoustic model** predicts, moment by moment, the pitch, loudness, and tone of the speech, in a form called a spectrogram. A **vocoder** turns that plan into the audio waveform. Systems of this kind, such as Google's Tacotron 2 in 2017, were the first to sound close to human.

Newer systems borrow the method of language models. Audio is compressed by a neural codec into a sequence of discrete tokens, much as text is. A language model is then trained to predict audio tokens. Given your text and a short recording of a voice, it continues the recording, speaking your text in that voice. Microsoft's VALL-E, in 2023, showed that three seconds of someone's speech was enough for a model of this kind to imitate them saying things they had never said.

Two consequences matter to a user. These models carry over more than the sound of a voice: its accent, its emotion, even the acoustics of the room in the sample. And because cloning needs so little audio, the technical barrier to imitating anyone has gone. The remaining barrier is rules, which the end of this section covers.

### Voice cloning: two kinds

| | Instant cloning | Professional cloning |
|---|---|---|
| Audio needed | Seconds to a few minutes | Half an hour or more of clean recording |
| How it works | The model is shown the sample each time | A model is trained further on the voice |
| Quality | A good likeness. Can wander on long passages | Very close, and stable |
| Time to set up | Moments | Hours |
| Typical use | Quick drafts, your own voice for short pieces | A brand's narrator, a long course, an audiobook |

The quality of a clone is set by the sample. A recording with background noise, music, or echo produces a clone with background noise, music, or echo.

### The controls

| Control | What it changes |
|---|---|
| **The voice** | Who is speaking. The largest decision |
| **Stability, or variability** | Low stability gives a more expressive and less predictable read. High gives an even one |
| **Speed** | The speaking rate |
| **Direction in plain language** | Some systems accept an instruction such as "calm, slightly amused, slow". OpenAI's speech interface has a field for it |
| **Markup** | Tags in the text for pauses, emphasis, and pronunciation |
| **A pronunciation dictionary** | A list of words with how to say them, applied to every script |

### SSML

The standard markup for speech is the **Speech Synthesis Markup Language**, SSML, a W3C standard since 2010. It is XML: tags wrapped around the text.

```xml
<speak>
  <prosody rate="medium">
    Flatten the back first.
    <break time="500ms"/>
    Hold the angle at <say-as interpret-as="cardinal">25</say-as> degrees.
    <emphasis level="moderate">Do not rock the blade.</emphasis>
    Finish with <sub alias="three thousand grit">3000#</sub> paper.
  </prosody>
</speak>
```

| Tag | Purpose |
|---|---|
| `speak` | Wraps the whole document |
| `break` | A pause, given as a time or a strength |
| `prosody` | Rate, pitch, and volume for the text inside it |
| `emphasis` | Stress on a word or phrase |
| `say-as` | How to read a number, date, or string of characters |
| `phoneme` | An exact pronunciation, written in a phonetic alphabet |
| `sub` | Text to speak in place of what is written |

Support varies, and this is the first thing to check in any tool. The large cloud speech services accept most of SSML. Several of the newer and more natural-sounding systems accept only a small part, commonly the break tag, and rely on pronunciation dictionaries and plain-language direction for the rest. Because SSML is XML, the characters that mean something in XML must be escaped: an ampersand in your script has to be written as `&amp;`, or the whole request fails.

Where SSML is not supported, punctuation does much of the same work. A full stop is a longer pause than a comma. A dash holds a beat. A line break starts a new thought.

### Writing for the ear

| Rule | Why |
|---|---|
| Short sentences, one idea each | The listener cannot look back |
| Put the subject and verb early | A long opening clause is held in memory with nothing to attach to |
| Write numbers and symbols as words | You decide how they are said |
| No brackets, footnotes, or "see below" | They have no spoken form |
| Round the numbers that need not be exact | "About twelve hundred" is heard. "1,205" is lost |
| Repeat the key term instead of varying it | A new word sounds like a new thing |
| Say where you are | "Second step." Listeners have no headings |
| Read it aloud before generating | Your tongue finds what your eye missed |

### Timing

Narration runs at a fairly steady rate. If a script has $w$ words and is read at $r$ words per minute, it lasts

$$
t = \frac{w}{r} \times 60 \text{ seconds}
$$

plus any pauses you add. A commonly used range for narration is 130 to 160 words per minute, with 150 a convenient middle.

| Duration | Words at 150 per minute |
|---|---|
| 15 seconds | About 38 |
| 30 seconds | 75 |
| 1 minute | 150 |
| 3 minutes | 450 |
| 10 minutes | 1,500 |

This arithmetic settles arguments before they start. A 30-second slot holds 75 words. A script of 120 words will not fit, however fast the voice, without sounding rushed.

### Long scripts

Three things go wrong with long passages generated in one request. Services limit the characters per request. Voices can drift over a long generation, changing pace or tone. And one bad sentence means regenerating everything.

The remedy is to split the script into chunks at sentence boundaries, generate each with the same voice and settings, and join the audio. A sentence that comes out wrong is regenerated alone.

Cost follows the same unit. Speech is usually priced by the character. On one widely used service at the time of writing (November 2026), a character costs about one credit, with monthly plans ranging from ten thousand credits free to hundreds of thousands on paid tiers. A 1,500-word script is roughly 9,000 characters. Every regeneration of a passage is paid for again, which is one more reason to get the text right first.

### Loudness

Narration that is too quiet beside the music, or louder than the video before it, sounds amateur. Loudness is measured in LUFS, a scale built to match how loud audio seems to a listener. Streaming and video platforms normalise what they play to a target, and a figure of about minus 14 LUFS is a common aim for online video.

To move audio from its measured loudness $L$ to a target $T$, apply a gain of

$$
g = T - L \text{ decibels}
$$

which multiplies the amplitude of the waveform by

$$
10^{\,g/20}
$$

Narration measured at minus 20 LUFS needs a gain of 6 decibels to reach minus 14, which is very nearly a doubling of amplitude. Editing tools do this for you. The point of the formula is to know what "normalise" means and that it is applied once, to the finished mix.

### Consent, disclosure, and rights

A voice identifies a person. The rules are still forming, and they point one way.

**Clone only your own voice, or one you have documented permission to use.** The services that offer high-quality cloning ask you to confirm that you have the right to the voice, and some verify it. Permission should be in writing and say what the voice may be used for, for how long, and what happens when the arrangement ends.

**A voice is protected in law in several ways.** In many places a person's voice is part of their likeness, which others may not exploit commercially without consent. In a 2025 ruling in a case brought by voice actors against a voice-cloning company, a federal court in New York dismissed most of the copyright and trademark claims and allowed claims under state law and contract to proceed. Legislation aimed specifically at digital replicas has been proposed at the federal level in the United States and has not passed.

**Some uses are restricted outright.** In February 2024 the United States communications regulator ruled that AI-generated voices in automated phone calls count as artificial voices under existing law, which makes such calls illegal without the recipient's prior consent.

**Disclosure.** Module 6.1 described the pattern. A realistic synthetic voice that listeners could take for a real person's is the kind of content platforms require to be labelled, and the EU's AI Act requires providers to mark synthetic audio so that it can be detected and deployers to disclose deepfakes. A stock narrator reading your explainer is generally not treated as deception. A cloned voice of a real person saying what they did not say is. Some providers' terms add a duty of their own: OpenAI's policy requires telling listeners that the voice they hear is generated by AI.

**Commercial use depends on your plan.** Free tiers often exclude it or require credit. Check before the audio is in a client's video.

Finally, services change. One major provider has announced that its dedicated speech models will be retired in early 2027 in favour of a newer real-time model, with a different way of calling it. A voice chosen for a long project is a dependency. Keep the script, the settings, and the pronunciation dictionary, so that the narration can be regenerated elsewhere.

### Complexity

Every function in the lab is linear in the length of the script. Cost is linear in characters generated, including every regeneration. Generation time for speech is typically shorter than the audio it produces.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, how long a script takes to say, and writing a number the way it is spoken.

```python
import html
import re

def narration_seconds(text, wpm=150):
    breaks = sum(int(milliseconds) for milliseconds in re.findall(r'<break time="(\d+)ms"/>', text))
    words = len(re.sub(r"<[^>]+>", " ", text).split())
    return round(words / wpm * 60 + breaks / 1000, 1)

ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
        "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

def say_number(n):
    if not 0 <= n <= 9999:
        raise ValueError("only 0 to 9999")
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("-" + ONES[n % 10] if n % 10 else "")
    if n < 1000:
        rest = n % 100
        return ONES[n // 100] + " hundred" + (" and " + say_number(rest) if rest else "")
    rest = n % 1000
    if rest == 0:
        return ONES[n // 1000] + " thousand"
    return ONES[n // 1000] + " thousand" + (" and " if rest < 100 else " ") + say_number(rest)

SCRIPT = ("A blunt chisel tears the wood. You can fix that in ten minutes. Start with the coarse stone, "
          "keep the angle at twenty-five degrees, and finish on the fine side. Then strop the edge on leather. "
          "That is all it takes.")
print(len(SCRIPT.split()), narration_seconds(SCRIPT), narration_seconds(SCRIPT, wpm=130), narration_seconds(SCRIPT, wpm=170))
print(say_number(25), "/", say_number(105), "/", say_number(1205), "/", say_number(2026))
```

- **`narration_seconds` counts the words and divides by the speaking rate.** Tags are removed first, so markup is not counted as speech. Explicit pauses are added from the break tags.
- **The 41-word script lasts 16.4 seconds at 150 words a minute.** At 130 it is 18.9 seconds, and at 170 it is 14.5. A slot of fifteen seconds needs either a faster read or fewer words.
- **`say_number` builds the words from the digits.** Below twenty, each number has its own name. Tens are joined to units with a hyphen. Hundreds and thousands are added in front, with "and" before a final part that is below one hundred, in the British manner.
- **1205 becomes "one thousand two hundred and five".** That is the form to put in a script, so that the speech model cannot choose "twelve oh five" or "one two zero five".
- **2026 becomes "two thousand and twenty-six".** As a quantity, that is right. As a year it would be said "twenty twenty-six". A function cannot know which is meant. A person writing for the ear decides.

Next, a pronunciation dictionary.

```python
LEXICON = {"Nguyen": "Win", "SQL": "sequel", "km": "kilometres", "25°": "twenty-five degrees",
           "Dr.": "Doctor", "&": "and", "e.g.": "for example"}

def apply_lexicon(text, lexicon):
    for written in sorted(lexicon, key=len, reverse=True):
        pattern = r"(?<![A-Za-z0-9])" + re.escape(written) + r"(?![A-Za-z0-9])"
        text = re.sub(pattern, lexicon[written], text)
    return text

print(apply_lexicon("Dr. Nguyen ran 5 km & set the bevel at 25° using SQL, e.g. on Monday.", LEXICON))
print(apply_lexicon("The kmart SQLite database", LEXICON))
```

- **The dictionary maps what is written to what should be said.** A name is respelt as it sounds. An acronym gets the word people say. A unit and a symbol are written out.
- **Each entry is replaced only where it stands alone.** The pattern refuses a match that has a letter or digit directly before or after it. So "km" is replaced after "5" and a space, and left alone inside "kmart", and "SQL" is not replaced inside "SQLite".
- **Longer entries are applied first.** If the dictionary held both "Dr." and "Dr. Nguyen", the longer would have to be tried before the shorter consumed part of it.
- **The first line comes out ready to speak.** "Doctor Win ran 5 kilometres and set the bevel at twenty-five degrees using sequel, for example on Monday."
- **The "5" is still a digit.** A single digit is safe. The dictionary deals with what is always said one way. Numbers that depend on context are a job for the writer, or for `say_number` applied deliberately.
- **A dictionary is kept and reused.** Every name and term your scripts use goes in once, and every later script is corrected for free. Many speech tools accept such a dictionary directly.

Then, generating SSML.

```python
def to_ssml(sentences, pause_ms=300, rate="medium"):
    pause = f'<break time="{pause_ms}ms"/>'
    body = pause.join(html.escape(sentence.strip(), quote=False) for sentence in sentences if sentence.strip())
    return f'<speak><prosody rate="{rate}">{body}</prosody></speak>'

lines = ["A blunt chisel tears the wood.", "You can fix that in ten minutes.", "Sand & oil in under 5 minutes."]
marked = to_ssml(lines)
print(marked)
print(narration_seconds(marked), narration_seconds(to_ssml(lines, pause_ms=500, rate="slow")))
```

- **The sentences are joined with a break tag between them.** The pause is the same everywhere, given in milliseconds.
- **Each sentence is escaped.** The ampersand in the third line becomes `&amp;`. Without that, the document would not be valid XML and the service would reject it.
- **The whole is wrapped in a prosody tag inside a speak tag.** The rate applies to everything.
- **Blank sentences are dropped.** An empty item would otherwise produce two pauses in a row.
- **The duration includes the pauses.** Three sentences with two pauses of 300 milliseconds come to 8.6 seconds. With pauses of 500 milliseconds, 9.0. The estimate does not know that "slow" also stretches the words, which is a reminder that it is an estimate.

Finally, splitting a long script, and two sums.

```python
def chunk_text(text, max_chars):
    sentences = [sentence for sentence in re.split(r"(?<=[.!?])\s+", text.strip()) if sentence]
    chunks, current = [], ""
    for sentence in sentences:
        if len(sentence) > max_chars:
            raise ValueError("a sentence is longer than the limit")
        if current and len(current) + 1 + len(sentence) > max_chars:
            chunks.append(current)
            current = sentence
        else:
            current = (current + " " + sentence).strip()
    if current:
        chunks.append(current)
    return chunks

chunks = chunk_text(SCRIPT, 120)
print([len(chunk) for chunk in chunks], len(SCRIPT))
print(chunks[1])
print(round(10 ** ((-14 - -20) / 20), 3), 1500 * 6, round(1500 / 150))
```

- **The script is divided at sentence ends.** The split happens at white space that follows a full stop, an exclamation mark, or a question mark.
- **Sentences are packed into a chunk until the next would exceed the limit.** Then a new chunk is started. No sentence is ever cut.
- **With a limit of 120 characters, the script becomes three chunks of 63, 96, and 53 characters.** The long middle sentence has a chunk to itself.
- **A sentence longer than the limit is an error, not something to cut.** A break in the middle of a sentence is audible. The fix is to rewrite the sentence, which a script for the ear wanted anyway.
- **Each chunk can be regenerated alone.** If the second comes out with an odd stress, 96 characters are paid for again, not 214.
- **The last line is three checks on Section 2.** A gain of 6 decibels multiplies amplitude by 1.995. A 1,500-word script at about six characters a word is 9,000 characters. And at 150 words a minute it runs for 10 minutes.

**Complexity.** Each function makes one pass, or one pass per dictionary entry, over the text. `say_number` does a fixed amount of work.

### A script page for narration

```text
VOICE:     [name]        MODEL: [name and version]     SETTINGS: [stability, speed]
DIRECTION: [calm, practical, a little dry]
TARGET:    [seconds]     WORDS: [count]                AT 150 WPM: [seconds]

1  A blunt chisel tears the wood.
2  You can fix that in ten minutes.
   [pause 500 ms]
3  Start with the coarse stone.

PRONUNCIATIONS: Nguyen = "Win"    SQL = "sequel"
NUMBERS: all written as words
RIGHTS: [stock voice, licence checked / own voice / cloned with written consent of ___]
```

### Listening back

| Listen for | Fix |
|---|---|
| A mispronounced name or term | Add it to the dictionary, or respell it |
| A number read strangely | Write it as words |
| A rushed or run-on passage | Shorter sentences, a full stop, a pause |
| A flat read | A more expressive setting, or a line of direction |
| An over-acted read | A steadier setting |
| A change of tone partway | Regenerate that chunk with the same settings |
| A breath or click at a join | Trim it, or add a short pause between chunks |
| Too quiet or too loud against music | Normalise the final mix |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Pasting the article.** Text written to be read, with brackets, long clauses, and figures, sounds like someone reading a document aloud. Rewrite it for the ear first.

**Digits and abbreviations in the script.** "St. John St." and "3/4" are coin tosses. Write "Saint John Street" and "three quarters".

**Names.** A speech model's pronunciation of an unfamiliar name is a guess. Respell it as it sounds, or use the tool's dictionary, and listen to every name once.

**Years and phone numbers.** The same digits are said differently as a quantity, a year, a telephone number, or a model name. Only the writer knows which.

**Generating the whole script in one piece.** A ten-minute generation with one bad sentence has to be redone or patched. Chunk by sentence or paragraph from the start.

**Changing settings between chunks.** The voice in chunk four sounds like a different day. Fix the voice, the model, and the settings for the whole piece, and write them down.

**Chasing a perfect take.** The same line regenerated twenty times costs twenty times as much. If a line keeps failing, change the line.

**A poor sample for a clone.** A recording made on a laptop microphone in a kitchen gives a clone that sounds like a laptop in a kitchen. Record clean, close, and quiet, and vary your delivery so that the clone can.

**No pauses.** Synthetic narration tends to run evenly from start to finish. Pauses after key points, and before a change of subject, are what make it sound considered.

**Narration that does not fit the pictures.** Count the words against the duration before generating. Seventy-five words for thirty seconds.

**Music louder than the voice.** The voice is the content. Bring the music down under it, and normalise the finished mix.

**A voice that is not yours to use.** A celebrity, a competitor's presenter, a former employee, or a relative, cloned without written consent, is a legal and ethical problem however good it sounds. Use a licensed stock voice or your own.

**Free-plan audio in paid work.** Check the licence for the plan before the audio reaches a client.

**Depending on one voice forever.** Services retire voices and models. Keep the script, the settings, and the dictionary so that you can regenerate elsewhere.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A speech model reads exactly what it is given, so a script for narration must contain what you want to hear: numbers and symbols as words, names as they are pronounced, and short sentences that a listener who cannot look back will follow. Classic systems normalise text, convert it to sounds, plan the speech, and render it. Newer ones predict audio tokens and can copy a voice from seconds of sample. Control comes from the choice of voice, expressiveness and speed settings, plain-language direction, a pronunciation dictionary, and SSML tags such as break, prosody, and say-as, where the tool supports them. A script of $w$ words at $r$ words per minute lasts $60w/r$ seconds, about 150 words to the minute. Long scripts are split at sentence boundaries, generated with fixed settings, and joined, so that one bad sentence is regenerated alone. Loudness is normalised once, on the final mix, by a gain of the target minus the measured level. A voice belongs to a person: clone only your own or one you have written permission for, label realistic synthetic speech where rules require it, and check that your plan allows commercial use.

**Question 1.** A client wants a 3-minute explainer. How many words should the script be at 150 words per minute? The writer delivers 600 words. What are the options? If the final script is 450 words at about six characters per word, how many characters are generated, and what does that imply if a third of the script has to be regenerated twice? Finally, the finished narration measures minus 20 LUFS against a target of minus 14. What gain is needed, and what does it do to the amplitude?

<details>
<summary>View Answer</summary>

Three minutes at 150 words per minute is 450 words. A 600-word script would run for 4 minutes at that rate, a full minute over. The options are to cut 150 words, to ask whether the video can be four minutes, or to raise the speaking rate, which helps only a little: fitting 600 words into three minutes needs 200 words a minute, well above a comfortable narration range, and it would sound rushed. Cutting is the right answer, and a quarter of most first drafts can go without loss. At six characters per word, 450 words is about 2,700 characters, and that many are generated on the first pass. Regenerating a third of the script, 900 characters, twice adds 1,800, for a total of 4,500 characters: two thirds more than a clean first pass. That is the cost of leaving pronunciation and pacing problems to be found by listening. It argues for fixing the text first, with numbers written out and the dictionary applied, and for splitting the script into small chunks so that a problem in one sentence means regenerating that sentence and not a third of the script. For loudness, the gain is the target minus the measured level: minus 14 minus minus 20 is 6 decibels. That multiplies the amplitude of the waveform by ten to the power of 6 over 20, which is about 2.0. The narration is roughly doubled in amplitude. It should be applied once to the finished mix, with a check that the loudest peaks do not clip.

</details>

**Question 2.** Rewrite this sentence for narration and explain each change: "Dr. Nguyen's Q3 2026 results (see Fig. 2) show revenue up 12.5% to 1,205 units, i.e. approx. 2x the 2024 figure."

<details>
<summary>View Answer</summary>

One version for the ear: "Doctor Win's results for the third quarter of twenty twenty-six are in. Revenue rose by twelve and a half percent, to about twelve hundred units. That is roughly double the figure for twenty twenty-four." The name is the first change. "Dr." before a name is "Doctor", and a speech model may read it as "Drive" or spell it out. The surname is respelt as it is pronounced, since the model's guess at an unfamiliar name is unreliable. In practice the respelling would live in a pronunciation dictionary so that the script itself can keep the correct spelling. "Q3 2026" becomes "the third quarter of twenty twenty-six": the abbreviation has no reliable spoken form, and a year is said differently from a quantity, which only the writer can know. "(see Fig. 2)" is removed, because a listener cannot see a figure and a bracket has no spoken equivalent. If the figure matters, the video shows it. "12.5%" becomes "twelve and a half percent", written as it should be said. "1,205 units" becomes "about twelve hundred units", because an exact four-digit number heard once is not retained, and the rounded figure is what the listener will remember. If the exact number matters, it should be on screen. "i.e. approx. 2x the 2024 figure" becomes a sentence of its own, "roughly double the figure for twenty twenty-four", with the Latin abbreviation, the shortened word, and the multiplication sign all replaced by words. Lastly, the one long sentence is three short ones, each with a single idea, because a listener cannot look back to see how the clauses fit together.

</details>

**Question 3.** A company wants its advertisements narrated in the voice of its founder, who retired five years ago. A marketer proposes cloning the voice from the founder's old podcast interviews, which are public. Assess the proposal and describe how to do this properly, or what to do instead.

<details>
<summary>View Answer</summary>

The proposal should not go ahead as described. That the recordings are public does not make the voice free to use. A voice identifies a person, and in many places it is protected as part of their likeness against commercial use without consent. An advertisement is exactly such a use. The founder agreed to give interviews. They did not agree to be made to say new things in advertisements years later. There is a deception problem as well: listeners who recognise the voice would believe the founder is endorsing the product now, in words the founder never spoke. And the cloning service's terms almost certainly require the user to hold rights to the voice, so the marketer would be in breach of those too. There is also a practical flaw. Podcast audio with other speakers, music, and room noise makes a poor sample. To do it properly, ask the founder. If they agree, put the agreement in writing: which uses are covered, for how long, in which territories, whether the founder approves each script, what they are paid, and what happens to the voice model when the agreement ends or if they withdraw. Then record a clean sample with them for a professional clone, keep the scripts within what they approved, and follow the disclosure rules that apply, since a realistic synthetic voice of a real person is the kind of content platforms and the EU's rules expect to be labelled. If the founder declines, or cannot be asked, the alternatives are a licensed stock voice, a voice actor, or a current member of staff who consents on the same written terms. Any of those gives the company a narrator it has the right to use.

</details>

@@starter
"""
Lab: Time It, Say the Numbers, Fix Pronunciation, Mark It Up, and Chunk It
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import html
import re

ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
        "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

SCRIPT = ("A blunt chisel tears the wood. You can fix that in ten minutes. Start with the coarse stone, "
          "keep the angle at twenty-five degrees, and finish on the fine side. Then strop the edge on leather. "
          "That is all it takes.")

LEXICON = {"Nguyen": "Win", "SQL": "sequel", "km": "kilometres", "25°": "twenty-five degrees",
           "Dr.": "Doctor", "&": "and", "e.g.": "for example"}


# ---------------------------------------------------------------- Step 1
def narration_seconds(text, wpm=150):
    """Estimate how long the text takes to say.
    breaks = the total of the numbers in tags of the exact form  <break time="NNNms"/>
             (find them with re.findall(r'<break time="(\\d+)ms"/>', text))
    words  = the number of whitespace-separated words once every tag has been replaced by a
             space (re.sub(r"<[^>]+>", " ", text))
    Return words / wpm * 60 + breaks / 1000, rounded to 1 decimal place."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def say_number(n):
    """Write an integer from 0 to 9999 as words, British style. Outside that range raise ValueError.
        below 20:     ONES[n]
        below 100:    TENS[n // 10], then "-" + ONES[n % 10] if the units are not zero
        below 1000:   ONES[n // 100] + " hundred", then " and " + say_number(rest) if rest = n % 100 is not zero
        otherwise:    ONES[n // 1000] + " thousand"; if rest = n % 1000 is not zero, add " and " when
                      rest < 100 or " " when rest >= 100, followed by say_number(rest)
    Examples: 21 -> "twenty-one", 105 -> "one hundred and five", 1005 -> "one thousand and five",
              1205 -> "one thousand two hundred and five"."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def apply_lexicon(text, lexicon):
    """Replace each written form in the lexicon with its spoken form, but only where the
    written form stands alone: not directly preceded or followed by a letter or a digit.
    Apply the entries from the longest written form to the shortest. For each one use
        re.sub(r"(?<![A-Za-z0-9])" + re.escape(written) + r"(?![A-Za-z0-9])", spoken, text)
    Return the text."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def to_ssml(sentences, pause_ms=300, rate="medium"):
    """Build an SSML document from a list of sentences. Strip each sentence, drop blank ones,
    and escape each with html.escape(sentence, quote=False). Join them with the tag
        <break time="PAUSEms"/>
    and wrap the result as
        <speak><prosody rate="RATE">SENTENCES AND BREAKS</prosody></speak>
    with no extra spaces or line breaks anywhere."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def chunk_text(text, max_chars):
    """Split text into chunks of at most max_chars characters, without cutting a sentence.
    sentences = the non-empty pieces of re.split(r"(?<=[.!?])\\s+", text.strip())
    If any sentence is longer than max_chars, raise ValueError.
    Pack the sentences in order: add a sentence to the current chunk, joined by one space,
    unless that would make the chunk longer than max_chars, in which case finish the current
    chunk and start a new one with the sentence. Return the list of chunks."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("seconds :", narration_seconds(SCRIPT))
    print("number  :", say_number(1205))
    print("lexicon :", apply_lexicon("Dr. Nguyen ran 5 km & set the bevel at 25°.", LEXICON))
    print("ssml    :", to_ssml(["A blunt chisel tears the wood.", "You can fix that in ten minutes."]))
    print("chunks  :", chunk_text(SCRIPT, 120))

@@solution
"""
Lab solution: Time It, Say the Numbers, Fix Pronunciation, Mark It Up, and Chunk It
Standard library only.
"""
import html
import re

ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
        "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

SCRIPT = ("A blunt chisel tears the wood. You can fix that in ten minutes. Start with the coarse stone, "
          "keep the angle at twenty-five degrees, and finish on the fine side. Then strop the edge on leather. "
          "That is all it takes.")

LEXICON = {"Nguyen": "Win", "SQL": "sequel", "km": "kilometres", "25°": "twenty-five degrees",
           "Dr.": "Doctor", "&": "and", "e.g.": "for example"}


# ---------------------------------------------------------------- Step 1
def narration_seconds(text, wpm=150):
    """Count the words against the slot before generating anything. Markup is not speech,
    and pauses are time."""
    breaks = sum(int(milliseconds) for milliseconds in re.findall(r'<break time="(\d+)ms"/>', text))
    words = len(re.sub(r"<[^>]+>", " ", text).split())
    return round(words / wpm * 60 + breaks / 1000, 1)


# ---------------------------------------------------------------- Step 2
def say_number(n):
    """Write what you want to hear. The function cannot know whether 2026 is a quantity or
    a year: that is the writer's decision."""
    if not 0 <= n <= 9999:
        raise ValueError("only 0 to 9999")
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("-" + ONES[n % 10] if n % 10 else "")
    if n < 1000:
        rest = n % 100
        return ONES[n // 100] + " hundred" + (" and " + say_number(rest) if rest else "")
    rest = n % 1000
    if rest == 0:
        return ONES[n // 1000] + " thousand"
    return ONES[n // 1000] + " thousand" + (" and " if rest < 100 else " ") + say_number(rest)


# ---------------------------------------------------------------- Step 3
def apply_lexicon(text, lexicon):
    """A pronunciation dictionary is written once and corrects every later script. Entries
    are replaced only where they stand alone, so "km" is not changed inside "kmart"."""
    for written in sorted(lexicon, key=len, reverse=True):
        pattern = r"(?<![A-Za-z0-9])" + re.escape(written) + r"(?![A-Za-z0-9])"
        text = re.sub(pattern, lexicon[written], text)
    return text


# ---------------------------------------------------------------- Step 4
def to_ssml(sentences, pause_ms=300, rate="medium"):
    """SSML is XML, so an ampersand in the script must be escaped or the request fails.
    Check which tags a tool supports before relying on any of them."""
    pause = f'<break time="{pause_ms}ms"/>'
    body = pause.join(html.escape(sentence.strip(), quote=False) for sentence in sentences if sentence.strip())
    return f'<speak><prosody rate="{rate}">{body}</prosody></speak>'


# ---------------------------------------------------------------- Step 5
def chunk_text(text, max_chars):
    """A break inside a sentence is audible, so sentences are never cut. Small chunks mean
    one bad line is regenerated alone."""
    sentences = [sentence for sentence in re.split(r"(?<=[.!?])\s+", text.strip()) if sentence]
    chunks, current = [], ""
    for sentence in sentences:
        if len(sentence) > max_chars:
            raise ValueError("a sentence is longer than the limit")
        if current and len(current) + 1 + len(sentence) > max_chars:
            chunks.append(current)
            current = sentence
        else:
            current = (current + " " + sentence).strip()
    if current:
        chunks.append(current)
    return chunks


if __name__ == "__main__":
    print(len(SCRIPT.split()), narration_seconds(SCRIPT), narration_seconds(SCRIPT, wpm=130), narration_seconds(SCRIPT, wpm=170))
    print(say_number(25), "/", say_number(105), "/", say_number(1205), "/", say_number(2026))

    print(apply_lexicon("Dr. Nguyen ran 5 km & set the bevel at 25° using SQL, e.g. on Monday.", LEXICON))
    print(apply_lexicon("The kmart SQLite database", LEXICON))

    lines = ["A blunt chisel tears the wood.", "You can fix that in ten minutes.", "Sand & oil in under 5 minutes."]
    marked = to_ssml(lines)
    print(marked)
    print(narration_seconds(marked), narration_seconds(to_ssml(lines, pause_ms=500, rate="slow")))

    chunks = chunk_text(SCRIPT, 120)
    print([len(chunk) for chunk in chunks], len(SCRIPT))
    print(chunks[1])
    print(round(10 ** ((-14 - -20) / 20), 3), 1500 * 6, round(1500 / 150))
    print(3 * 150, 600 / 150, 600 / 3, 450 * 6, 2700 + 2 * 900, round(4500 / 2700, 2))

@@step
{
  "stepNumber": 1,
  "title": "Estimate how long a script takes to say",
  "instruction": "Implement narration_seconds(text, wpm). Find every explicit pause: tags of the exact form <break time=\"NNNms\"/>, using re.findall with the pattern r'<break time=\"(\\d+)ms\"/>', and add up their numbers of milliseconds. Then count the spoken words: replace every tag in the text with a space, using re.sub(r\"<[^>]+>\", \" \", text), and count the whitespace-separated words that remain. Return the words divided by wpm, times 60, plus the pauses in seconds, rounded to 1 decimal place. Run it on SCRIPT at 150, 130, and 170 words per minute. This is the timing formula from Section 2. [MOD-6.4]",
  "hintConceptual": "A narrator reads at a steady pace, so the length of the reading is the number of words divided by the pace, plus the silences you asked for. The stage directions in the margin are not read aloud.",
  "hintSyntax": "breaks = sum(int(milliseconds) for milliseconds in re.findall(r'<break time=\"(\\d+)ms\"/>', text))\nwords = len(re.sub(r\"<[^>]+>\", \" \", text).split())\nreturn round(words / wpm * 60 + breaks / 1000, 1)"
}
@@assert
assert narration_seconds(SCRIPT) == 16.4, f"The 41-word script lasts 16.4 seconds at 150 words a minute, got {narration_seconds(SCRIPT)}"
assert narration_seconds(SCRIPT, wpm=130) == 18.9 and narration_seconds(SCRIPT, wpm=170) == 14.5, "Slower and faster reads of the same script"
assert narration_seconds("word " * 150) == 60.0 and narration_seconds("word " * 300, 120) == 150.0, "150 words at 150 words a minute is one minute"
assert narration_seconds("One two three.") == 1.2, "Three words take 1.2 seconds"
assert narration_seconds('One two three.<break time="500ms"/>Four five.') == 2.5, "Five words take 2 seconds, plus a pause of half a second, and the tag does not glue two words together"
assert narration_seconds('<speak><prosody rate="slow">Hello there.</prosody></speak>') == 0.8, "Tags are not counted as words"
assert narration_seconds('A.<break time="300ms"/>B.<break time="1200ms"/>C.') == 2.7, "Several pauses are added together"
assert narration_seconds("") == 0.0, "An empty script takes no time"
print("Step 1 passed: 41 words is 16.4 seconds at 150 words a minute.")

@@step
{
  "stepNumber": 2,
  "title": "Write a number as it is spoken",
  "instruction": "Implement say_number(n) for whole numbers from 0 to 9999, raising ValueError outside that range. Below 20, return ONES[n]. Below 100, return TENS[n // 10], followed by a hyphen and ONES[n % 10] if the units digit is not zero. Below 1000, return ONES[n // 100] and ' hundred', followed by ' and ' and say_number of the remainder if n % 100 is not zero. From 1000, return ONES[n // 1000] and ' thousand'; if the remainder n % 1000 is not zero, add ' and ' when the remainder is below 100, or a single space when it is 100 or more, and then say_number of the remainder. So 1005 is 'one thousand and five' and 1205 is 'one thousand two hundred and five'. This is the first rule of Section 1: write what you want to hear. [MOD-6.4]",
  "hintConceptual": "Say a number aloud slowly and notice the pieces: the thousands, then the hundreds, then 'and', then the last two digits. Each piece is a smaller number said the same way.",
  "hintSyntax": "if not 0 <= n <= 9999:\n    raise ValueError(\"only 0 to 9999\")\nif n < 20:\n    return ONES[n]\nif n < 100:\n    return TENS[n // 10] + (\"-\" + ONES[n % 10] if n % 10 else \"\")\nif n < 1000:\n    rest = n % 100\n    return ONES[n // 100] + \" hundred\" + (\" and \" + say_number(rest) if rest else \"\")\nrest = n % 1000\nif rest == 0:\n    return ONES[n // 1000] + \" thousand\"\nreturn ONES[n // 1000] + \" thousand\" + (\" and \" if rest < 100 else \" \") + say_number(rest)"
}
@@assert
assert say_number(1205) == "one thousand two hundred and five", f"1205 is 'one thousand two hundred and five', got {say_number(1205)!r}"
assert [say_number(n) for n in (0, 7, 13, 19)] == ["zero", "seven", "thirteen", "nineteen"], "Numbers below twenty have their own names"
assert [say_number(n) for n in (20, 21, 25, 99)] == ["twenty", "twenty-one", "twenty-five", "ninety-nine"], "Tens are joined to units with a hyphen, and a round ten has none"
assert [say_number(n) for n in (100, 105, 250, 999)] == ["one hundred", "one hundred and five", "two hundred and fifty", "nine hundred and ninety-nine"], "Hundreds take 'and' before the rest"
assert say_number(1000) == "one thousand" and say_number(1005) == "one thousand and five" and say_number(1200) == "one thousand two hundred", "Thousands: 'and' only when the rest is below a hundred"
assert say_number(2026) == "two thousand and twenty-six" and say_number(9999) == "nine thousand nine hundred and ninety-nine", "The largest cases"
def _refuses(n):
    try:
        say_number(n)
    except ValueError:
        return True
    return False
assert _refuses(-1) and _refuses(10000) and not _refuses(0) and not _refuses(9999), "Numbers outside 0 to 9999 raise ValueError"
print("Step 2 passed: 1205 is written 'one thousand two hundred and five', so the voice cannot choose otherwise.")

@@step
{
  "stepNumber": 3,
  "title": "Apply a pronunciation dictionary",
  "instruction": "Implement apply_lexicon(text, lexicon). The lexicon maps a written form to the form that should be spoken. Go through the written forms from the longest to the shortest, using sorted(lexicon, key=len, reverse=True). For each, replace it in the text with its spoken form, but only where it stands alone: not directly preceded or followed by a letter or a digit. The pattern for that is r\"(?<![A-Za-z0-9])\" + re.escape(written) + r\"(?![A-Za-z0-9])\", used with re.sub. Return the text. Run it on a sentence with a title, a name, a unit, a symbol, and an acronym, and then on 'The kmart SQLite database'. This is the pronunciation dictionary from Section 2. [MOD-6.4]",
  "hintConceptual": "A proofreader with a list of house corrections changes 'km' to 'kilometres' wherever it appears as a unit, and has the sense not to change the letters 'km' inside another word.",
  "hintSyntax": "for written in sorted(lexicon, key=len, reverse=True):\n    pattern = r\"(?<![A-Za-z0-9])\" + re.escape(written) + r\"(?![A-Za-z0-9])\"\n    text = re.sub(pattern, lexicon[written], text)\nreturn text"
}
@@assert
_line = apply_lexicon("Dr. Nguyen ran 5 km & set the bevel at 25° using SQL, e.g. on Monday.", LEXICON)
assert _line == "Doctor Win ran 5 kilometres and set the bevel at twenty-five degrees using sequel, for example on Monday.", f"Every entry is replaced where it stands alone, got {_line!r}"
assert apply_lexicon("The kmart SQLite database", LEXICON) == "The kmart SQLite database", "Entries inside longer words are left alone"
assert apply_lexicon("10km and 10 km", {"km": "kilometres"}) == "10km and 10 kilometres", "A digit directly before the entry also prevents the replacement"
assert apply_lexicon("Dr. Nguyen and Dr. Lee", {"Dr.": "Doctor", "Dr. Nguyen": "Doctor Win"}) == "Doctor Win and Doctor Lee", "Longer entries are applied before shorter ones"
assert apply_lexicon("Is it 1+1?", {"1+1": "one plus one"}) == "Is it one plus one?", "Characters that are special in regular expressions are matched literally"
assert apply_lexicon("sql and SQL", {"SQL": "sequel"}) == "sql and sequel", "Matching is case-sensitive"
assert apply_lexicon("Nothing to change.", LEXICON) == "Nothing to change." and apply_lexicon("Anything", {}) == "Anything", "Text with no entries, or an empty lexicon, is returned unchanged"
print("Step 3 passed: 'Dr. Nguyen ran 5 km' becomes 'Doctor Win ran 5 kilometres', and 'kmart' is untouched.")

@@step
{
  "stepNumber": 4,
  "title": "Mark up a script with SSML",
  "instruction": "Implement to_ssml(sentences, pause_ms, rate). Take a list of sentences. Strip each one, drop any that are blank, and escape each with html.escape(sentence, quote=False), so that an ampersand becomes &amp; and angle brackets become &lt; and &gt;. Join the sentences with the break tag <break time=\"PAUSEms\"/>, where PAUSE is pause_ms. Wrap the result in <prosody rate=\"RATE\"> and </prosody>, and wrap that in <speak> and </speak>, with no extra spaces or line breaks anywhere. Return the string. Build the document for three sentences, one of which contains an ampersand. These are the speak, prosody, and break tags from the SSML table in Section 2. [MOD-6.4]",
  "hintConceptual": "A script marked for a reader has the reader's pace written at the top and a mark between sentences where to breathe. Any character that the marking system itself uses has to be written in a safe form, or the marks are misread.",
  "hintSyntax": "pause = f'<break time=\"{pause_ms}ms\"/>'\nbody = pause.join(html.escape(sentence.strip(), quote=False) for sentence in sentences if sentence.strip())\nreturn f'<speak><prosody rate=\"{rate}\">{body}</prosody></speak>'"
}
@@assert
_lines = ["A blunt chisel tears the wood.", "You can fix that in ten minutes.", "Sand & oil in under 5 minutes."]
_marked = to_ssml(_lines)
assert _marked == '<speak><prosody rate="medium">A blunt chisel tears the wood.<break time="300ms"/>You can fix that in ten minutes.<break time="300ms"/>Sand &amp; oil in under 5 minutes.</prosody></speak>', f"Three sentences, two pauses, and an escaped ampersand, got {_marked!r}"
assert _marked.count('<break time="300ms"/>') == 2, "There is one pause between each pair of sentences, and none at the ends"
assert to_ssml(["Only one."]) == '<speak><prosody rate="medium">Only one.</prosody></speak>', "A single sentence has no pause"
assert to_ssml(["A.", "B."], pause_ms=500, rate="slow") == '<speak><prosody rate="slow">A.<break time="500ms"/>B.</prosody></speak>', "The pause and the rate are arguments"
assert to_ssml(["  A.  ", "", "   ", "B."]) == '<speak><prosody rate="medium">A.<break time="300ms"/>B.</prosody></speak>', "Sentences are stripped and blank ones are dropped"
assert to_ssml(["5 < 6 > 4", 'He said "go".']) == '<speak><prosody rate="medium">5 &lt; 6 &gt; 4<break time="300ms"/>He said "go".</prosody></speak>', "Angle brackets are escaped, and quotation marks are left as they are"
assert to_ssml([]) == '<speak><prosody rate="medium"></prosody></speak>', "No sentences gives an empty document"
print("Step 4 passed: the script is wrapped in speak and prosody tags, with a pause between sentences.")

@@step
{
  "stepNumber": 5,
  "title": "Split a long script at sentence boundaries",
  "instruction": "Implement chunk_text(text, max_chars). Split the stripped text into sentences with re.split(r\"(?<=[.!?])\\s+\", text.strip()), keeping the non-empty pieces. If any sentence is longer than max_chars, raise ValueError, because a sentence must never be cut. Then pack the sentences in order into chunks. Keep a current chunk, starting empty. For each sentence, if the current chunk is not empty and adding a space and the sentence would make it longer than max_chars, append the current chunk to the list and start a new one with the sentence. Otherwise add the sentence to the current chunk, with one space between. Append the last chunk if it is not empty. Return the list. Split SCRIPT with a limit of 120 characters. This is the method for long scripts from Section 2. [MOD-6.4]",
  "hintConceptual": "Packing books into boxes of a fixed size: keep adding books to the box until the next one will not fit, then close it and start another. You never saw a book in half to fill a box.",
  "hintSyntax": "sentences = [sentence for sentence in re.split(r\"(?<=[.!?])\\s+\", text.strip()) if sentence]\nchunks, current = [], \"\"\nfor sentence in sentences:\n    if len(sentence) > max_chars:\n        raise ValueError(\"a sentence is longer than the limit\")\n    if current and len(current) + 1 + len(sentence) > max_chars:\n        chunks.append(current)\n        current = sentence\n    else:\n        current = (current + \" \" + sentence).strip()\nif current:\n    chunks.append(current)\nreturn chunks"
}
@@assert
_chunks = chunk_text(SCRIPT, 120)
assert _chunks == ["A blunt chisel tears the wood. You can fix that in ten minutes.", "Start with the coarse stone, keep the angle at twenty-five degrees, and finish on the fine side.", "Then strop the edge on leather. That is all it takes."], f"Three chunks, with the long sentence alone in the second, got {_chunks}"
assert [len(chunk) for chunk in _chunks] == [63, 96, 53] and all(len(chunk) <= 120 for chunk in _chunks), "No chunk is over the limit"
assert " ".join(_chunks) == SCRIPT, "Joining the chunks with spaces gives back the script"
assert chunk_text(SCRIPT, 500) == [SCRIPT], "A script within the limit is a single chunk"
assert chunk_text("One. Two. Three.", 9) == ["One. Two.", "Three."] and chunk_text("One. Two. Three.", 6) == ["One.", "Two.", "Three."], "A chunk may be filled exactly to the limit"
assert chunk_text("Wait! Really? Yes.", 13) == ["Wait! Really?", "Yes."], "Exclamation marks and question marks also end sentences"
assert chunk_text("No full stop here", 50) == ["No full stop here"] and chunk_text("", 10) == [] and chunk_text("   ", 10) == [], "Text without a final full stop is kept, and empty text gives no chunks"
def _refuses():
    try:
        chunk_text(SCRIPT, 80)
    except ValueError:
        return True
    return False
assert _refuses(), "A sentence of 96 characters cannot fit a limit of 80, and is not cut: ValueError"
print("Step 5 passed: the script splits into chunks of 63, 96, and 53 characters, with no sentence cut.")
