# Prompts.md — Building the AI Interview Agent in Antigravity

This is an ordered sequence of prompts for building the "Interview Agent" hackathon
submission (ABTalks AI Cohort / Decode SIH 2026) using an agentic coding tool like
Antigravity. Run them roughly in order — each one assumes the previous step's files
exist. Attach `curriculum.json`, `candidates.json`, and `technical-spec.md` to the
project/workspace before starting Prompt 1 so the agent can read them directly instead
of guessing at the schema.

---

## Prompt 0 — Project framing (paste once at the start of the session)

```
I'm building "The Interview Agent" for the ABTalks AI Cohort hackathon. Read the
attached technical-spec.md, curriculum.json, and candidates.json fully before writing
any code — do not assume the schema, inspect the real files.

Goal: an AI agent that conducts a realistic, multi-turn technical interview with a
cohort graduate, based on their personal learning history in candidates.json, quizzing
them on real content from curriculum.json.

Hard requirements from the spec:
- Single HTTP endpoint: POST /api/interview, no auth, state keyed by sessionId.
- Minimum 8 questions, covering at least 4 distinct curriculum days.
- Follow-up questions generated from the candidate's actual previous answer.
- Conversation context maintained across multiple requests (multi-turn, not stateless).
- Final response includes done:true and a feedback object: {summary, strengths[], gaps[], next[]}.
- No persistent DB, no auth, no long-term history required — in-memory session state
  for the lifetime of one interview is enough.

Stack: Node.js + Express (ESM, not CommonJS), Anthropic API via @anthropic-ai/sdk for
the actual interview intelligence, plain in-memory Map for session state — no database.

Before writing code, propose a file/module layout and a state-machine design for how a
single session moves from "start" through N question/follow-up cycles to "done", and
show me how it guarantees the 8-question / 4-day minimums even for a thin candidate
profile. Wait for my go-ahead before generating files.
```

---

## Prompt 1 — Scaffolding

```
Scaffold the project exactly as we agreed:
- package.json (ESM, type:module) with express, cors, dotenv, @anthropic-ai/sdk
- .env.example documenting ANTHROPIC_API_KEY, CLAUDE_MODEL, PORT, and any tunable
  interview constants (min questions, min days, max questions per topic)
- server.js as a thin Express app exposing POST /api/interview and a GET /health
- src/ folder for the actual logic — don't put business logic in server.js
- data/ folder — copy curriculum.json and candidates.json in verbatim for local
  reference/testing, matching the schemas you already read

Don't implement the interview logic yet, just get `npm install` and a bare server that
returns 200 on /health running.
```

---

## Prompt 2 — Curriculum data layer

```
Create src/dataLoader.js that loads data/curriculum.json once at startup and exposes:
- getCurriculumDay(dayNumber) — O(1) lookup of a single day's {title, type, objectives,
  tools}
- moduleForDay(dayNumber) — which of the 8 modules a given day number falls under,
  based on each module's [startDay, endDay] range
- the raw parsed curriculum object, for anything that needs the full day list

Keep it dependency-free, just fs + path.
```

---

## Prompt 3 — Personalized topic planner

```
Create src/planBuilder.js with buildInterviewPlan(candidate, { minDays }) that turns a
candidate object (matching candidates.json's schema — member + missions[] +
signals) into an ordered list of interview topics enriched with curriculum details.

Prioritization logic (this is the "intelligence" of picking what to ask about, before
any LLM call happens):
- Skipped missions should be highest priority — they're real gaps worth probing.
- Passed missions that took many attempts should be next — struggle signals shallow
  understanding worth pressure-testing.
- Easy first-try passes are lowest priority but still useful for breadth.
- Enforce module diversity — don't let the plan cluster on one module if the candidate
  has signal spread across several.
- Cap the plan at a configurable MAX_TOPICS (default 6).
- Final plan should be sorted chronologically by day number so the interview reads as
  a coherent narrative, even though topics were *selected* by priority.

Critical edge case: if a candidate's mission history is too thin to reach `minDays`
distinct days, pad the plan with additional real curriculum days — first preferring
days at or before the highest day number the candidate actually touched, then falling
back to the full curriculum if that's still not enough. This must never leave the plan
short of `minDays` topics, even for an empty missions array.

Also export extendPlan(existingPlan) — a fallback used mid-interview if we somehow run
out of topics before hitting the spec's minimums, returning additional unused
curriculum days in day order.

Write a couple of throwaway node -e test scripts to prove: (a) a normal ~10-mission
candidate produces a sensible diverse plan, (b) a candidate with just 1 mission still
produces >= minDays topics, (c) an empty missions array still produces >= minDays
topics. Show me the output before moving on.
```

---

## Prompt 4 — LLM client (the actual interviewer)

```
Create src/llmClient.js wrapping @anthropic-ai/sdk with three functions:

1. generateOpeningQuestion({ candidate, topic, isFirstTopic }) — returns a single
   plain-text interviewer message. If isFirstTopic, it's a short warm welcome
   (candidate's first name + framing) followed by the first question. Otherwise it's a
   brief bridge from the previous topic into this one, then the question. If the
   topic's status is "skipped" or "unattempted-in-profile", frame the question at a
   conceptual/foundational level rather than assuming hands-on experience. If the
   candidate struggled (multiple attempts), aim the question at the part of the concept
   people usually get wrong.

2. decideFollowUp({ candidate, topic, question, answer, history }) — calls the model
   asking it to return ONLY JSON: {needsFollowUp, followUpQuestion, reasoning}. The
   model should only ask a follow-up when it would meaningfully test deeper
   understanding (vague answer, name-dropped a tool without explaining it, dodged the
   "why", or made a claim worth pressure-testing) — not just to hit a quota. Parse
   defensively: if the model's output isn't valid JSON, fail safe to
   {needsFollowUp:false} rather than crashing the interview.

3. generateFeedback({ candidate, transcript }) — takes the full array of {day, title,
   question, answer} and returns ONLY JSON matching the spec's feedback shape:
   {summary, strengths[], gaps[], next[]}. Must be evidence-based — reference what the
   candidate actually said, not generic advice. Same defensive JSON parsing as above.

Give the interviewer a consistent persona (name, tone: rigorous but warm senior AI
engineer) as a shared system prompt string used across all three calls, so tone stays
consistent turn to turn. Keep questions to 1-3 sentences, one question per turn, no
markdown formatting in the interviewer's own replies.

Read the model name from process.env.CLAUDE_MODEL with a sensible current default.
```

---

## Prompt 5 — Session store

```
Create src/sessionStore.js: a plain in-memory Map keyed by sessionId with
createSession, getSession, saveSession, deleteSession. No persistence, no TTL logic
needed — spec says persistent accounts / long-term history are out of scope.
```

---

## Prompt 6 — The state machine

```
Create src/interviewController.js with handleInterviewRequest(body) as the single
entry point server.js will call. It must:

- Validate sessionId is present; 400 if not.
- If no session exists yet for this sessionId: require `candidate` in the body, build
  the plan via buildInterviewPlan, generate the opening question for topic[0], store
  full session state (candidate, plan, topicIndex, questionsInCurrentTopic,
  askedQuestions, daysCovered[], history[], transcript[], currentQuestion,
  currentTopic, done, feedback), return {reply, done:false}.
- If a session already exists and is done: return the stored feedback idempotently
  instead of erroring (handles duplicate/late requests gracefully).
- If a session exists and is in progress: require `message` in the body; append it to
  history + transcript as the answer to currentQuestion; ask decideFollowUp (but only
  if questionsInCurrentTopic < MAX_QUESTIONS_PER_TOPIC, to guarantee we can never loop
  forever even if the model always says yes); if a follow-up is warranted, ask it and
  stay on the same topic; otherwise advance to the next topic in the plan (generating
  its opening/bridge question) or, if the plan is exhausted, check whether the spec's
  minimums (askedQuestions >= MIN_QUESTIONS, distinct daysCovered >= MIN_DAYS) are met
  — if not yet met, call extendPlan() to pull in more real curriculum days and keep
  going; if met, generate final feedback and return {reply:"Interview completed.",
  done:true, feedback}.

Make MIN_QUESTIONS, MIN_DAYS, MAX_QUESTIONS_PER_TOPIC configurable via env vars with
defaults of 8, 4, 2.

This is the part where correctness matters most — walk me through the exact turn-by-
turn state transitions before generating the file.
```

---

## Prompt 7 — Wire up the endpoint

```
Update server.js: POST /api/interview should call handleInterviewRequest(req.body)
inside a try/catch, respond with the returned status/body, and 500 with a generic
error on unexpected exceptions (log the real error server-side only). Keep GET
/health. Log a startup warning if ANTHROPIC_API_KEY is missing, without crashing —
useful for local iteration without burning API calls.
```

---

## Prompt 8 — Verify the state machine without spending API calls

```
I don't want to burn real API calls just to check the control flow. Temporarily swap
src/llmClient.js for a mock version (deterministic canned questions, a follow-up
decision that alternates true/false, and a canned feedback object), then write a
node -e script that:
1. Starts a session with a real candidate from data/candidates.json.
2. Loops, feeding canned "answer N" messages into handleInterviewRequest until
   done:true.
3. Prints every turn's reply and the final feedback object.
4. Confirms total questions asked >= 8 and distinct days covered >= 4.

Also run a worst-case version where the mock ALWAYS wants a follow-up, to prove the
MAX_QUESTIONS_PER_TOPIC cap prevents an infinite loop.

Do this in a scratch/ directory or similar so it's obviously not part of the real
deliverable, then delete it and restore the real llmClient.js once both tests pass.
```

---

## Prompt 9 — README for submission

```
Write a README.md covering: what this is, the API contract (mirror the technical
spec's request/response shapes exactly), how the personalization works (plan builder
priority logic, in plain English), how the state machine guarantees the 8-question/
4-day minimums even for thin profiles, setup steps (npm install, cp .env.example .env,
add ANTHROPIC_API_KEY, npm start), and 2-3 curl examples showing a start request, a
follow-up turn, and a final done:true response with feedback. Keep it skimmable for a
hackathon judge — short sections, no fluff.
```

---

## Prompt 10 — Optional hardening pass (only if time remains)

```
Review src/interviewController.js and src/llmClient.js for failure modes a judge might
hit live: what happens if the Anthropic API call throws (rate limit, timeout, bad key)?
Right now that would 500 the whole endpoint mid-interview. Add a narrow try/catch
around each LLM call with a graceful fallback (e.g. a generic "Could you expand on
that?" follow-up prompt, or skip straight to the next topic) so a single flaky API call
doesn't kill an in-progress interview. Don't over-engineer retries — one fallback path
per call site is enough for a hackathon demo.
```

---

### Notes on using these prompts in Antigravity

- Keep the three source files (curriculum.json, candidates.json, technical-spec.md)
  attached/pinned for the whole session — several later prompts assume the agent still
  has the real schemas in context rather than re-deriving them from memory.
- Prompts 3, 4, and 6 are the ones worth actually reading the generated code for before
  accepting — they're where the "does this satisfy the spec" risk concentrates. The
  scaffolding and wiring prompts (1, 2, 5, 7) are safe to accept quickly.
- Prompt 8 exists specifically so you're not burning real Anthropic API spend just to
  confirm the plumbing works — don't skip it before your first live test.
