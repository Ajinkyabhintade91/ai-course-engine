#!/usr/bin/env node
/**
 * Seeds content/blueprint.json from the syllabus transcription below.
 * Transcribed from the 14 images in /syllabus (12 syllabus modules + bonus resources).
 * Each syllabus "Module N" becomes a unit; each numbered lesson becomes a course module MOD-N.M.
 * Re-running is safe: the "status" of modules already present in blueprint.json is preserved.
 *
 * Usage: node scripts/seed-blueprint.js
 */
const fs = require('fs');
const path = require('path');

const F = 'Foundational';
const I = 'Intermediate';
const A = 'Advanced';

// [title, difficulty, search keyword phrase, subTopics[]]
const UNITS = [
  {
    title: 'Understanding AI from Basics',
    modules: [
      ['What is Artificial Intelligence?', F, 'what is artificial intelligence definition history', ['Definitions of AI: rational agents, the Turing test, narrow vs general intelligence', 'A short history: symbolic AI, expert systems, AI winters, the statistical and deep learning eras', 'Where AI shows up today: search, recommendations, perception, language, and decision systems']],
      ['AI vs Machine Learning vs Deep Learning', F, 'AI vs machine learning vs deep learning difference', ['The nested hierarchy: AI contains ML contains deep learning contains generative models', 'Learning paradigms: supervised, unsupervised, self-supervised, and reinforcement learning', 'Why deep neural networks displaced hand-engineered features: data, compute, and representation learning']],
      ['What are Large Language Models?', F, 'large language models explained transformer next token prediction', ['Language modeling as next-token prediction and the chain rule of probability', 'Tokens, embeddings, parameters, and context windows', 'Pre-training, fine-tuning, and instruction tuning: how a raw model becomes an assistant']],
      ['How ChatGPT, Claude and Gemini work?', F, 'how ChatGPT Claude Gemini work transformer attention inference', ['The transformer architecture: self-attention, layers, and autoregressive decoding', 'From prompt to reply: tokenization, the forward pass, sampling with temperature and top-p', 'What differs between vendors: training data, alignment methods (RLHF, constitutional approaches), tools, and context size']],
      ['What is Generative AI?', F, 'generative AI explained diffusion models GANs LLMs', ['Generative vs discriminative models: modeling p(x) versus p(y|x)', 'Model families: autoregressive transformers, diffusion models, GANs, and VAEs', 'Modalities: text, image, audio, video, and code generation and where each is production-ready']],
      ['What are AI Agents?', F, 'AI agents explained LLM agent loop tools', ['The agent loop: perceive, reason, act, observe', 'What separates a chatbot from an agent: tools, memory, goals, and autonomy', 'Levels of autonomy and realistic examples of agents in production']],
      ['Open Source vs Closed Source AI', F, 'open source vs closed source AI models open weights licensing', ['Open weights vs open source vs API-only: what is actually released', 'Trade-offs: cost, privacy, control, capability, and support', 'Licenses and governance: Apache/MIT, Llama and Gemma terms, and how to read a model card']],
      ['AI Models Explained', F, 'AI model types parameters benchmarks model cards', ['What a model is: architecture plus learned weights, and what parameter counts mean', 'Model categories: base, chat, reasoning, embedding, multimodal, and small models', 'Reading benchmarks and model cards without being misled']],
      ['How AI Processes Information', F, 'how LLMs process information tokenization embeddings attention', ['Tokenization: byte-pair encoding and why models see sub-word pieces', 'Embeddings and vector similarity: meaning as geometry', 'Attention and the context window: how a model reads everything at once and why position matters']],
      ['Limitations of Artificial Intelligence', F, 'limitations of large language models reasoning knowledge cutoff bias', ['Knowledge cutoffs, context limits, and non-determinism', 'Weaknesses in arithmetic, counting, long-horizon planning, and out-of-distribution reasoning', 'Bias, privacy, security (prompt injection), and the cost and energy footprint']],
      ['AI Hallucinations', F, 'LLM hallucinations causes detection mitigation', ['Why hallucinations happen: likelihood training, missing knowledge, and overconfident decoding', 'A taxonomy: factual, fabricated citations, faithfulness, and instruction-following errors', 'Mitigations: grounding with retrieval, citations, abstention, verification, and self-consistency checks']],
      ['The Future of AI', F, 'future of AI scaling laws agents regulation safety', ['Scaling trends: compute, data, algorithmic efficiency, and inference cost curves', 'Near-term directions: agents, multimodality, on-device models, and reasoning models', 'Economics, jobs, regulation (EU AI Act), and AI safety as engineering disciplines']],
    ],
  },
  {
    title: 'Mastering ChatGPT',
    modules: [
      ['ChatGPT Introduction', F, 'ChatGPT introduction interface features plans', ['The ChatGPT product surface: chats, projects, canvas, voice, file uploads, and search', 'Plans and limits: Free, Plus, Pro, Team, and Enterprise', 'How a conversation is assembled: system instructions, history, tools, and the context window']],
      ['Models and Model Selection', F, 'ChatGPT model selection GPT reasoning models comparison', ['The OpenAI model lineup: general, reasoning, and mini models and what each is for', 'Choosing by task: speed, depth of reasoning, context size, cost, and modality', 'A repeatable model-selection procedure with a small evaluation set']],
      ['Custom Instructions', F, 'ChatGPT custom instructions best practices', ['What custom instructions are and where they sit in the prompt stack', 'Writing durable instructions: role, audience, format, tone, and things to avoid', 'Testing and iterating instructions; when a project or custom GPT is the better home']],
      ['Memory and Personalization', F, 'ChatGPT memory personalization saved memories chat history', ['Saved memories vs chat-history reference: how personalization is stored and recalled', 'Managing, auditing, and deleting memories; temporary chats', 'Privacy and data-control settings and when to turn memory off']],
      ['Advanced Prompt Engineering', I, 'advanced prompt engineering ChatGPT chain of thought techniques', ['Structured prompts: goal, context, constraints, examples, and output format', 'Reasoning techniques: step-by-step decomposition, self-critique, and prompting reasoning models differently', 'Iterative refinement and prompt debugging inside a conversation']],
      ['Custom GPTs', I, 'custom GPTs builder instructions knowledge actions', ['Anatomy of a GPT: instructions, conversation starters, knowledge files, and capabilities', 'Actions: connecting a GPT to external APIs with an OpenAPI schema', 'Publishing, sharing, versioning, and protecting instructions and knowledge']],
      ['Deep Research', I, 'ChatGPT deep research agentic research reports', ['How deep research works: planning, multi-step browsing, synthesis, and citations', 'Writing a research brief: scope, sources, time range, and deliverable format', 'Verifying reports: source quality, citation checking, and known failure modes']],
      ['Data Analysis', I, 'ChatGPT data analysis code interpreter CSV pandas', ['The code execution sandbox: uploading files, pandas, and chart generation', 'An analysis workflow: profile, clean, explore, model, and report', 'Validating results: checking the code, sampling rows, and avoiding silent data errors']],
      ['Image Generation', I, 'ChatGPT image generation prompting editing', ['How image generation in ChatGPT works and what it is good and bad at', 'Prompt structure for images: subject, composition, style, lighting, and text rendering', 'Iterative editing, reference images, consistency, and usage rights']],
      ['ChatGPT for Business', I, 'ChatGPT for business enterprise use cases governance', ['Team and Enterprise workspaces: admin controls, data handling, and connectors', 'High-value business use cases: support, sales, marketing, operations, and analysis', 'Rollout: policy, training, measuring ROI, and managing risk']],
      ['ChatGPT for Productivity', F, 'ChatGPT productivity workflows email meetings planning', ['Personal productivity patterns: writing, summarizing, planning, and learning', 'Tasks, projects, and connectors for recurring work', 'Building a reusable prompt library and measuring time saved']],
      ['Practical ChatGPT Workflows', I, 'practical ChatGPT workflows end to end examples', ['End-to-end workflows: research to brief to draft to review', 'Combining features: projects, files, canvas, data analysis, and custom GPTs', 'Quality control: checklists, human review, and knowing when not to use ChatGPT']],
    ],
  },
  {
    title: 'Mastering Claude & Gemini',
    modules: [
      ['Claude: Overview and Setup', F, 'Claude AI overview setup models plans', ['The Claude model family and what each tier is for', 'Surfaces: claude.ai, desktop and mobile apps, the API, and Claude Code', 'Account setup, plans, styles, and first-run configuration']],
      ['Claude Projects', F, 'Claude Projects knowledge base custom instructions', ['Projects as persistent workspaces: instructions plus a knowledge base', 'Loading documents and how project knowledge uses the context window and retrieval', 'Organizing projects for clients, codebases, and recurring work']],
      ['Claude Artifacts', F, 'Claude Artifacts interactive apps documents', ['What artifacts are: standalone documents, code, diagrams, and interactive apps', 'Prompting for artifacts and iterating on them in place', 'Sharing, publishing, and the limits of the artifact sandbox']],
      ['Claude Code', I, 'Claude Code CLI agentic coding CLAUDE.md', ['What Claude Code is: an agentic coding tool in the terminal, IDE, desktop, and web', 'Core mechanics: the tool loop, permissions, CLAUDE.md memory, and slash commands', 'Everyday workflows: explore, plan, implement, test, and commit']],
      ['Claude Skills', I, 'Claude Skills SKILL.md agent skills', ['What a skill is: a folder of instructions, scripts, and resources loaded on demand', 'Anatomy of SKILL.md: frontmatter, description triggering, and progressive disclosure', 'Writing, testing, and sharing your own skills']],
      ['Model Context Protocol (MCP)', I, 'Model Context Protocol MCP servers clients tools', ['The problem MCP solves: one protocol between models and external systems', 'Architecture: hosts, clients, servers, and the tools, resources, and prompts primitives', 'Connecting MCP servers to Claude and evaluating server trust']],
      ['Computer Use', I, 'Claude computer use tool screenshots GUI automation', ['How computer use works: screenshot, reason, click and type, repeat', 'Good and bad use cases versus APIs and browser automation', 'Safety: sandboxing, prompt injection from screen content, and human confirmation']],
      ['Coding with Claude', I, 'coding with Claude best practices prompts review', ['Prompting for code: specifications, constraints, examples, and tests', 'Working patterns: plan first, small diffs, test-driven loops, and code review', 'Reading and verifying generated code before trusting it']],
      ['Practical Claude Workflows', I, 'practical Claude workflows writing research analysis', ['Long-document analysis, writing, and research workflows', 'Combining projects, artifacts, skills, and connectors', 'Quality control and reusable workflow templates']],
      ['Gemini: Overview and Gemini Models', F, 'Google Gemini overview models Pro Flash', ['The Gemini model family: Pro, Flash, and lightweight tiers and their trade-offs', 'Surfaces: the Gemini app, AI Studio, Vertex AI, and Workspace', 'Strengths: long context, multimodality, and Google Search grounding']],
      ['Gems', F, 'Gemini Gems custom assistants', ['What Gems are and how they compare with custom GPTs and Claude Projects', 'Writing Gem instructions and attaching knowledge files', 'Useful Gem patterns for study, writing, and work']],
      ['Gemini Deep Research', I, 'Gemini Deep Research reports sources', ['How Gemini Deep Research plans, browses, and writes a report', 'Steering the research plan and exporting results to Docs', 'Checking sources and comparing with other deep research tools']],
      ['Google Workspace Integration', I, 'Gemini Google Workspace Gmail Docs Sheets integration', ['Gemini in Gmail, Docs, Sheets, Slides, Drive, and Meet', 'Workspace extensions and grounding answers in your own files', 'Admin controls, data privacy, and practical limits']],
      ['NotebookLM', F, 'NotebookLM source grounded notebook audio overview', ['Source-grounded answers: how NotebookLM restricts itself to your documents', 'Notebooks, sources, citations, and Audio Overviews', 'Study and research workflows and where grounding still fails']],
    ],
  },
  {
    title: '100+ AI Tools Directory',
    modules: [
      ['How to use this directory', F, 'how to evaluate AI tools criteria framework', ['A taxonomy of AI tools by job to be done', 'Evaluation criteria: capability, cost, privacy, lock-in, and integration', 'A fast trial protocol for deciding whether a tool earns a place in your work']],
      ['The directory', F, 'best AI tools list by category', ['Assistants, research, writing, and productivity tools', 'Image, video, audio, and presentation tools', 'Coding, automation, agent, data, and local-model tools']],
      ['Build your personal AI stack', F, 'build personal AI stack workflow tools', ['Mapping your weekly tasks to tool categories', 'Choosing a minimal stack and avoiding overlapping subscriptions', 'Costing, reviewing, and evolving the stack over time']],
    ],
  },
  {
    title: 'Complete Prompt Engineering Master Class',
    modules: [
      ['Anatomy of a Perfect Prompt', F, 'prompt engineering anatomy structure components', ['The components: role, task, context, constraints, examples, and output format', 'Why specificity works: prompts as conditioning on a probability distribution', 'A prompt template and a checklist for reviewing prompts']],
      ['Role-Based Prompting', F, 'role prompting persona prompting effectiveness', ['What role prompts change and what they do not', 'Designing roles: expertise, audience, stance, and boundaries', 'Evidence on persona prompting and common misuse']],
      ['Context Engineering', I, 'context engineering LLM context window management', ['Context as the real interface: what goes in the window and in what order', 'Selecting, compressing, and ordering context; long-context failure modes', 'Context for agents: memory, retrieval, and tool results']],
      ['Few-Shot Prompting', I, 'few-shot prompting in-context learning examples', ['In-context learning: how examples steer a model without training', 'Choosing, ordering, and formatting examples; label and recency bias', 'Zero-shot vs few-shot vs fine-tuning']],
      ['Structured Output', I, 'LLM structured output JSON schema constrained decoding', ['Why structure matters for software that consumes model output', 'Techniques: format instructions, schemas, constrained decoding, and tool calls', 'Validation and repair loops']],
      ['Prompt Chaining', I, 'prompt chaining LLM pipelines decomposition', ['Decomposing a task into a pipeline of focused prompts', 'Chain patterns: sequential, routing, parallel, and evaluator-optimizer', 'Passing state between steps and handling failures']],
      ['System Prompts', I, 'system prompts design best practices', ['The role of the system prompt and the instruction hierarchy', 'Structure of production system prompts: identity, rules, tools, and format', 'Testing, versioning, and prompt-leak considerations']],
      ['Multi-Step Instructions', I, 'multi-step instructions prompting sequential tasks', ['Writing unambiguous procedures: numbered steps, conditions, and stop rules', 'Why models skip or merge steps and how to prevent it', 'Checklists, intermediate outputs, and verification steps']],
      ['Prompt Optimization', A, 'prompt optimization evaluation A/B testing DSPy', ['Treating prompts as code: test sets, metrics, and regression checks', 'Manual and automatic optimization methods', 'Cost, latency, and token optimization including prompt caching']],
      ['Working with JSON', I, 'JSON LLM prompts parsing validation schema', ['JSON syntax and JSON Schema essentials for prompt writers', 'Getting reliable JSON out of a model and parsing it safely', 'Feeding JSON into prompts and nested data pitfalls']],
      ['Prompting for Images', I, 'image generation prompting guide diffusion', ['How text conditions an image model', 'The image prompt formula: subject, medium, style, composition, lighting, and parameters', 'Negative prompts, reference images, seeds, and consistency']],
      ['Prompting for Coding', I, 'prompting LLM for code generation best practices', ['Specifying code tasks: inputs, outputs, constraints, and tests', 'Supplying codebase context and asking for diffs', 'Review, debugging, and refactoring prompts']],
      ['Prompting for AI Agents', A, 'prompting AI agents tool descriptions system prompt', ['How agent prompts differ: goals, tools, stopping conditions, and autonomy', 'Writing tool descriptions and delegation briefs', 'Guardrails, escalation, and long-running task guidance']],
      ['100 Ready-to-Use Prompts', F, 'prompt library templates reusable prompts', ['A categorized prompt library and how to adapt each template', 'Parameterizing prompts with variables', 'Maintaining and testing a personal prompt library']],
    ],
  },
  {
    title: 'AI Content Creation Masterclass',
    modules: [
      ['The AI Content Creation Pipeline', F, 'AI content creation pipeline workflow', ['The pipeline stages: ideate, script, produce, edit, publish, and analyze', 'Where AI helps and where human judgment stays essential', 'Brand voice, consistency, and a content calendar']],
      ['AI Images', F, 'AI image generation tools Midjourney Flux comparison', ['How diffusion image models work at a practical level', 'Tool landscape and choosing a model for the job', 'Style consistency, upscaling, editing, and licensing']],
      ['AI Videos', I, 'AI video generation tools text to video', ['Text-to-video and image-to-video: capabilities and limits', 'Shot planning, prompts, and stitching clips into a sequence', 'Cost, duration limits, and artifacts']],
      ['AI Voiceovers', F, 'AI voiceover text to speech voice cloning', ['How neural text-to-speech and voice cloning work', 'Writing for the ear, pacing, pronunciation control, and SSML', 'Consent, disclosure, and commercial rights']],
      ['AI Avatars', I, 'AI avatars talking head video generation', ['Talking-head avatar generation and lip sync', 'Stock avatars vs a custom digital twin', 'Use cases, uncanny-valley risks, and disclosure']],
      ['AI Scripts', F, 'AI script writing video hooks structure', ['Script structure: hook, promise, body, and call to action', 'Prompting for scripts in your own voice', 'Editing AI drafts into something worth watching']],
      ['AI Thumbnails', F, 'AI thumbnail design click through rate', ['What makes a thumbnail work: contrast, faces, text, and curiosity', 'Generating and compositing thumbnails with AI tools', 'Testing thumbnails against click-through rate']],
      ['Instagram Reels', F, 'Instagram Reels AI workflow short form video', ['Short-form video structure and retention', 'An AI workflow for Reels: idea, script, edit, and captions', 'Posting cadence, analytics, and iteration']],
      ['Instagram Carousels', F, 'Instagram carousel design AI workflow', ['Carousel structure: cover hook, slide flow, and final call to action', 'Generating copy and slide designs with AI', 'Templates, batching, and repurposing']],
      ['YouTube Videos', I, 'YouTube video production AI workflow', ['Long-form workflow: research, script, record or generate, edit, and package', 'Titles, descriptions, chapters, and search optimization with AI', 'Retention analytics and iteration']],
      ['AI Presentations', F, 'AI presentation tools slide generation', ['Generating decks with AI presentation tools', 'From outline to narrative to slides', 'Editing for clarity and avoiding generic AI slides']],
      ['Automated Content Pipelines', A, 'automated content pipeline n8n AI repurposing', ['Automating repurposing: one source into many formats', 'Orchestrating with workflow tools and LLM APIs', 'Human approval gates, scheduling, and quality control']],
    ],
  },
  {
    title: 'AI Automation Masterclass',
    modules: [
      ['What is Automation?', F, 'what is automation business process automation basics', ['Automation defined: rules, triggers, and repeatable processes', 'What to automate: frequency, time cost, and error rate', 'Classic automation vs AI automation']],
      ['Workflow Automation', F, 'workflow automation concepts nodes data flow', ['Workflows as directed graphs of steps', 'Data passing between steps, branching, loops, and merging', 'Mapping a manual process into a workflow diagram']],
      ['APIs Explained', F, 'REST API explained HTTP methods status codes', ['Clients, servers, requests, and responses', 'HTTP methods, endpoints, headers, query parameters, and status codes', 'Reading API documentation and making a first request']],
      ['Webhooks Explained', F, 'webhooks explained vs polling signature verification', ['Push vs pull: webhooks compared with polling', 'Anatomy of a webhook delivery: URL, payload, signature, and retries', 'Testing, securing, and deduplicating webhooks']],
      ['JSON Fundamentals', F, 'JSON fundamentals syntax data types nested', ['JSON syntax and data types', 'Nested objects and arrays and path expressions', 'Parsing, transforming, and validating JSON']],
      ['Triggers and Actions', F, 'automation triggers and actions event driven', ['Trigger types: schedule, webhook, polling, and app event', 'Actions, searches, filters, and conditional paths', 'Idempotency and avoiding duplicate runs']],
      ['n8n Introduction', I, 'n8n introduction workflow automation self hosted', ['n8n concepts: nodes, connections, items, expressions, and credentials', 'Self-hosted vs cloud and the fair-code license', 'Building a first workflow with AI nodes']],
      ['Make Introduction', I, 'Make.com introduction scenarios modules', ['Scenarios, modules, bundles, operations, and routers', 'Iterators, aggregators, and data mapping', 'Pricing by operation and designing efficient scenarios']],
      ['Zapier Introduction', F, 'Zapier introduction zaps triggers actions', ['Zaps, triggers, actions, filters, and paths', 'Tasks, pricing, and when Zapier is the right choice', 'Zapier AI features and tables']],
      ['Connecting LLMs with APIs', I, 'LLM API integration chat completions messages API', ['Anatomy of an LLM API call: model, messages, and parameters', 'Tokens, pricing, rate limits, and streaming', 'Calling LLM APIs from workflow tools with an HTTP request']],
      ['Gmail Automation', I, 'Gmail automation API triage labels drafts', ['Gmail triggers and actions: read, label, draft, and send', 'AI email triage: classify, summarize, and draft', 'OAuth scopes, quotas, and safe-send design']],
      ['Google Sheets Automation', I, 'Google Sheets automation API append update', ['Sheets as a lightweight database: rows, ranges, and keys', 'Read, append, update, and lookup operations', 'Concurrency, rate limits, and schema drift']],
      ['WhatsApp Automation', I, 'WhatsApp Business API automation Cloud API templates', ['The WhatsApp Business Platform: Cloud API, templates, and the 24-hour window', 'Building an inbound and outbound message flow', 'Opt-in rules, policy compliance, and costs']],
      ['Error Handling', I, 'automation error handling retries exponential backoff idempotency', ['Failure types: transient, permanent, and data errors', 'Retries with exponential backoff, timeouts, and dead-letter handling', 'Alerting, logging, and idempotent design']],
      ['Authentication and API Keys', I, 'API authentication API keys OAuth 2.0 secrets management', ['API keys, bearer tokens, and OAuth 2.0 flows', 'Storing secrets: credential stores and environment variables', 'Rotation, least privilege, and leak response']],
      ['Project 1: Automated Email Assistant', I, 'AI email assistant automation project', ['Requirements and architecture for an AI inbox assistant', 'Classification, drafting, and a human approval step', 'Testing, monitoring, and cost control']],
      ['Project 2: Lead Generation Workflow', I, 'lead generation automation workflow enrichment scoring', ['Lead capture, enrichment, scoring, and routing', 'AI personalization of outreach', 'CRM sync, deduplication, and compliance']],
      ['Project 3: AI Customer Support', A, 'AI customer support automation RAG escalation', ['Support architecture: intake, retrieval, answer, and escalation', 'Grounding answers in a knowledge base', 'Handoff rules, tone, and quality measurement']],
      ['Project 4: Automated Reporting', I, 'automated reporting workflow LLM summary', ['Scheduled data collection and aggregation', 'AI-written summaries built on verified numbers', 'Delivery by email, chat, or dashboard and alert thresholds']],
      ['Project 5: Content to Content Automation', I, 'content repurposing automation workflow', ['Repurposing long content into many formats', 'Transcription, chunking, and summarization pipeline', 'Review queue and publishing']],
      ['Project 6: Social Media Content Automation', I, 'social media content automation scheduling AI', ['Idea backlog to drafted posts', 'Platform-specific formatting and scheduling APIs', 'Approval, analytics feedback, and brand safety']],
      ['Bonus: 10+ Ready-to-Use Automation Templates', I, 'automation templates n8n Make Zapier', ['A catalog of reusable automation templates', 'How to import and adapt a template safely', 'Parameterizing and documenting templates']],
    ],
  },
  {
    title: 'Build Your Own AI Agents',
    modules: [
      ['What is an AI Agent?', F, 'what is an AI agent LLM agents definition', ['A working definition: an LLM using tools in a loop toward a goal', 'Workflows vs agents and when each fits', 'A minimal agent in fifty lines']],
      ['AI Agent Architecture', I, 'AI agent architecture components planning ReAct', ['Components: model, prompt, tools, memory, planner, and executor', 'Control-loop patterns: ReAct, plan-and-execute, and reflection', 'State management and termination conditions']],
      ['LLM + Tools + Memory', I, 'LLM agent tools memory short term long term', ['The LLM as a reasoning engine and its limits', 'Tools as the agent\'s hands and eyes', 'Short-term, long-term, episodic, and semantic memory']],
      ['Function Calling', I, 'LLM function calling JSON schema', ['How function calling works: schema in, structured call out', 'Writing JSON Schema for functions and handling arguments', 'Parallel calls, forced tool choice, and error returns']],
      ['Tool Calling', I, 'tool calling agents tool design best practices', ['Tool use across providers and the tool-result loop', 'Designing good tools: names, descriptions, and granularity', 'Validation, timeouts, and safe execution']],
      ['MCP', I, 'Model Context Protocol build MCP server', ['MCP inside an agent stack: servers as reusable tool providers', 'Building a simple MCP server and choosing a transport', 'Security: trust boundaries and tool poisoning']],
      ['RAG', I, 'retrieval augmented generation RAG pipeline chunking', ['Retrieval-augmented generation: index, retrieve, augment, generate', 'Chunking, embeddings, hybrid search, and reranking', 'Evaluating retrieval and answer faithfulness']],
      ['Vector Databases', I, 'vector databases similarity search HNSW embeddings', ['Embeddings and similarity metrics: cosine, dot product, and Euclidean', 'Approximate nearest neighbor indexes: HNSW and IVF', 'Choosing a vector store and metadata filtering']],
      ['Multi-Agent Systems', A, 'multi-agent systems LLM orchestrator subagents', ['Why multiple agents: context isolation, specialization, and parallelism', 'Topologies: orchestrator-worker, pipeline, and debate', 'Coordination cost, failure modes, and when a single agent wins']],
      ['Agentic Workflows', I, 'agentic workflows patterns routing parallelization evaluator', ['Workflow patterns: chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer', 'Choosing a pattern for a given task', 'Implementing patterns in code and in workflow tools']],
      ['Human-in-the-Loop', I, 'human in the loop AI agents approval', ['Where humans belong: approval, review, and escalation', 'Designing interrupts, checkpoints, and resumable state', 'Balancing autonomy against risk']],
      ['AI Agent Evaluation', A, 'AI agent evaluation evals benchmarks LLM judge', ['What to measure: task success, trajectory quality, cost, and latency', 'Building eval sets and graders: code-based, LLM-judge, and human', 'Regression testing and tracing']],
      ['Deployment', A, 'deploying AI agents production hosting observability', ['Deployment shapes: serverless, containers, queues, and schedulers', 'State, concurrency, and long-running tasks', 'Observability, cost control, and rollouts']],
      ['Security and Permissions', A, 'AI agent security prompt injection permissions least privilege', ['The agent threat model: prompt injection and data exfiltration', 'Least privilege, sandboxing, and approval gates', 'Secrets, audit logs, and incident response']],
      ['Agent Project 1: AI Research Agent', I, 'build AI research agent web search synthesis', ['Planning a research agent: search, read, and synthesize', 'Source tracking and citation discipline', 'Evaluating report quality']],
      ['Agent Project 2: AI Sales Agent', I, 'AI sales agent lead qualification outreach', ['Lead research and qualification', 'Personalized outreach drafting and CRM updates', 'Guardrails, approval, and compliance']],
      ['Agent Project 3: AI Customer Support Agent', A, 'AI customer support agent RAG tools escalation', ['RAG over help content plus account tools', 'Escalation and handoff design', 'Measuring resolution rate and satisfaction']],
      ['Agent Project 4: AI Content Creation Agent', I, 'AI content creation agent pipeline', ['A research, outline, draft, and edit pipeline', 'Brand-voice memory and style guides', 'Review and publishing tools']],
      ['Agent Project 5: AI Personal Assistant', A, 'AI personal assistant agent calendar email', ['Calendar, email, and task tools', 'Persistent memory and user preferences', 'Permissions, confirmation, and proactive behavior']],
    ],
  },
  {
    title: 'Coding with AI',
    modules: [
      ['AI-Assisted Coding', F, 'AI assisted coding tools productivity research', ['The spectrum from autocomplete to chat to autonomous agents', 'What AI coding tools do well and poorly', 'A productive human-AI coding loop']],
      ['Vibe Coding', F, 'vibe coding meaning risks best practices', ['What vibe coding means and where the term came from', 'When it works: prototypes and personal tools; when it fails', 'Guardrails: version control, tests, and reviewing diffs']],
      ['Claude Code', I, 'Claude Code workflow subagents hooks MCP', ['Installing and configuring Claude Code for a project', 'CLAUDE.md, permissions, plan mode, subagents, hooks, and MCP', 'A feature-building workflow from start to finish']],
      ['Cursor', I, 'Cursor AI editor agent rules', ['Cursor fundamentals: tab completion, inline edit, chat, and agent', 'Rules, codebase indexing, and context control', 'Model choice, cost, and privacy mode']],
      ['Windsurf (now Devin Desktop)', I, 'Windsurf editor Cascade Devin', ['Windsurf and its Cascade agent, and its move under Cognition and Devin', 'Flows, rules, and memories', 'Comparing agentic IDEs']],
      ['Replit', F, 'Replit Agent build deploy apps', ['Replit as a cloud IDE with an agent that builds and deploys', 'Databases, secrets, and deployments on Replit', 'When to graduate from Replit to your own stack']],
      ['Building Websites', F, 'building websites with AI HTML CSS static site', ['How websites work: HTML, CSS, JavaScript, and hosting', 'Prompting AI to build and refine a static site', 'Responsive design, accessibility, and performance']],
      ['Building Web Applications', I, 'building web applications with AI full stack', ['Web app architecture: frontend, backend, database, and auth', 'Specifying an app for an AI builder', 'Data modeling, APIs, and state']],
      ['Debugging with AI', I, 'debugging with AI assistant techniques', ['A debugging method: reproduce, isolate, hypothesize, and verify', 'Giving the AI the right evidence: errors, logs, and a minimal reproduction', 'Avoiding fix loops and regression']],
      ['Git and GitHub', F, 'git and GitHub basics branches pull requests', ['Git fundamentals: commits, branches, merges, and remotes', 'The GitHub flow: pull requests, reviews, and issues', 'Using Git as a safety net for AI-generated changes']],
      ['Deployment', I, 'web app deployment Vercel environment variables CI', ['Deployment targets: static hosts, serverless, containers, and VPS', 'Environment variables, domains, and HTTPS', 'Continuous deployment basics and rollback']],
      ['Understanding Code Generated by AI', I, 'understanding AI generated code review security', ['A method for reading unfamiliar code', 'Spotting common defects in AI-written code', 'Security review: secrets, injection, and dependencies']],
      ['Project 1: Personal Portfolio Website', F, 'personal portfolio website project build with AI', ['Planning content and structure', 'Building with AI and iterating on design', 'Deploying and attaching a custom domain']],
      ["Project 2: Full Web App, 'Client Lead Tracker'", I, 'lead tracker CRM web app project CRUD', ['Requirements and data model for a lead tracker', 'CRUD, authentication, and pipeline views', 'Testing and deployment']],
      ["Project 3: AI-Powered Tool, 'Proposal Generator'", A, 'AI proposal generator app LLM API project', ['Designing an LLM-backed feature', 'Prompt templates, structured output, and document rendering', 'API-key safety, cost limits, and evaluation']],
    ],
  },
  {
    title: 'Run AI Locally',
    modules: [
      ['What are Local LLMs?', F, 'local LLMs explained quantization GGUF', ['Running models on your own hardware: why and why not', 'Open-weight models, quantization, and the GGUF format', 'The runtime landscape: llama.cpp, Ollama, LM Studio, and vLLM']],
      ['Ollama Introduction', F, 'Ollama introduction architecture Modelfile', ['What Ollama is: a model runner with a registry and a local API', 'Architecture: server, CLI, model library, and Modelfile', 'Ollama compared with the alternatives']],
      ['Installing Ollama', F, 'install Ollama Windows macOS Linux', ['Installing on Windows, macOS, and Linux', 'Verifying GPU acceleration', 'Configuration: model directory, host, port, and environment variables']],
      ['Downloading Models', F, 'Ollama pull models tags quantization sizes', ['Pulling, listing, and removing models', 'Reading tags: parameter size and quantization level', 'Disk and memory budgeting']],
      ['Qwen', I, 'Qwen models Alibaba local', ['The Qwen family from Alibaba: general, coder, and vision models', 'Strengths: multilingual ability, coding, and tool calling', 'Sizes, licenses, and recommended variants']],
      ['Llama', I, 'Meta Llama models local license', ['Meta\'s Llama lineage and its role in the ecosystem', 'Model sizes and capabilities', 'The Llama license and acceptable-use policy']],
      ['Gemma', I, 'Google Gemma models local', ['Google\'s Gemma family and its relationship to Gemini', 'Multimodal and small-footprint variants', 'License terms and best uses']],
      ['Mistral', I, 'Mistral models open weight local', ['Mistral AI\'s open-weight and commercial models', 'Efficiency focus and function-calling support', 'Licensing differences across models']],
      ['DeepSeek', I, 'DeepSeek models R1 reasoning local', ['DeepSeek chat and reasoning models', 'Distilled reasoning variants for local use', 'Thinking tokens, performance, and caveats']],
      ['Hardware Requirements', I, 'local LLM hardware requirements VRAM estimation', ['Estimating memory from parameters and quantization', 'GPU vs CPU vs Apple Silicon unified memory', 'Tokens-per-second expectations and upgrade paths']],
      ['Connecting Local Models to Applications', I, 'Ollama API OpenAI compatible endpoint integration', ['The Ollama REST API and the OpenAI-compatible endpoint', 'Calling local models from Python and JavaScript', 'Front ends and integrations']],
      ['Running Local AI Agents', A, 'local AI agents Ollama tool calling', ['Tool calling with local models', 'Building a small local agent loop', 'Reliability limits and mitigation']],
      ['Privacy and Offline Usage', F, 'local LLM privacy offline air gapped', ['What stays on your machine and what does not', 'Fully offline setups', 'Compliance use cases and remaining risks']],
      ['Troubleshooting', I, 'Ollama troubleshooting slow GPU not used', ['Diagnosing slow generation and out-of-memory errors', 'GPU not detected, context truncation, and prompt-template issues', 'Logs, environment variables, and a systematic checklist']],
      ['Model Selection Guide', I, 'choose local LLM model selection guide', ['Selecting by task, hardware, and license', 'Building a personal benchmark', 'A decision table of recommended picks']],
    ],
  },
  {
    title: 'Make Money with AI',
    modules: [
      ['The Honest Truth First', F, 'AI freelancing reality AI automation agency honest', ['Realistic expectations: effort, timelines, and competition', 'Hype and scams to avoid', 'What clients actually pay for']],
      ['The 10 Monetization Models', F, 'ways to monetize AI skills business models', ['Services: freelancing, agency, and consulting', 'Products: templates, tools, courses, and content', 'Comparing models on effort, margin, and scalability']],
      ['How to Identify Business Problems', I, 'identify business problems process mapping automation opportunity', ['Process mapping and finding bottlenecks', 'Quantifying a problem in time and money', 'Prioritizing by impact and feasibility']],
      ['Finding Potential Clients', I, 'find clients freelance outreach lead generation', ['Ideal client profile and niche selection', 'Channels: network, outbound, content, and marketplaces', 'Outreach that earns replies']],
      ['Building a Portfolio', F, 'build portfolio case studies freelance', ['Portfolio projects that demonstrate outcomes', 'Writing case studies', 'Demos, proof, and social presence']],
      ['Creating Service Packages', I, 'productized services packages freelance', ['Productized services and tiered packages', 'Defining scope, deliverables, and exclusions', 'Naming and positioning an offer']],
      ['Pricing Frameworks', I, 'pricing frameworks value based pricing freelance', ['Hourly, project, retainer, and value-based pricing', 'Calculating costs, margin, and return on investment', 'Anchoring and presenting options']],
      ['Writing Proposals', I, 'writing client proposals structure', ['Proposal structure: problem, solution, scope, timeline, price, and next step', 'Mirroring the discovery call', 'Follow-up and handling objections']],
      ['Discovery Calls', I, 'discovery call questions framework consulting', ['Call structure and question frameworks', 'Qualifying budget, authority, need, and timing', 'Taking notes and closing with clear next steps']],
      ['Client Onboarding', I, 'client onboarding process freelance agency', ['Contracts, invoices, and kickoff', 'Access, credentials, and security hygiene', 'Setting communication cadence and expectations']],
      ['Delivering Projects', I, 'project delivery scope management freelance', ['Milestones, demos, and feedback loops', 'Scope-creep management and change requests', 'Documentation, handover, and training']],
      ['Retaining Clients', I, 'client retention retainers upsell', ['Retainers, maintenance, and support plans', 'Reporting value and return on investment', 'Upsells, referrals, and long-term relationships']],
    ],
  },
  {
    title: '30 Day AI Mastery Roadmap',
    modules: [
      ['How the roadmap works', F, 'learning plan deliberate practice spaced repetition', ['Roadmap principles: daily practice, projects, and review', 'Time budgeting and tracking', 'Adapting the plan to your starting level']],
      ['The 30-day plan', F, '30 day AI learning plan roadmap', ['Week 1: foundations and prompting', 'Weeks 2 and 3: tools, automation, agents, and coding projects', 'Week 4: portfolio, offer, and outreach']],
      ['After Day 30', F, 'continuous learning AI skills staying current', ['Specialization paths', 'Staying current without drowning in news', 'Compounding: projects, audience, and clients']],
    ],
  },
  {
    title: 'Bonus Resources',
    modules: [
      ['20 AI Agent Project Ideas', I, 'AI agent project ideas', ['Twenty agent ideas grouped by difficulty', 'Scoping each idea into a minimum viable version', 'Choosing a project that fits your goals']],
      ['10 AI Automation Workflow Ideas', I, 'AI automation workflow ideas business', ['Ten workflow ideas across business functions', 'Trigger, steps, and tools for each', 'Estimating the value of each workflow']],
      ['100+ AI Terminology Glossary', F, 'AI terminology glossary', ['Core machine learning and LLM terms', 'Agent, RAG, and automation terms', 'Business and deployment terms']],
      ['AI Learning Roadmap', F, 'AI learning roadmap beginner to advanced', ['Skill tree from beginner to builder', 'Resources mapped to each stage', 'Milestones and self-assessment']],
      ['Client Proposal Template', I, 'client proposal template consulting', ['A fill-in proposal template', 'Section-by-section guidance', 'Variations for small and large projects']],
      ['Discovery Call Framework', I, 'discovery call framework script', ['A call agenda with timing', 'A question bank', 'A post-call summary template']],
      ['AI Project Portfolio Checklist', F, 'project portfolio checklist AI', ['A checklist for each portfolio piece', 'Presentation and proof', 'Maintenance and updates']],
      ['AI Tool Selection Cheat Sheet', F, 'AI tool selection comparison cheat sheet', ['A decision matrix by task', 'Cost and capability quick reference', 'Red flags when choosing tools']],
    ],
  },
];

const target = path.join(__dirname, '..', 'content', 'blueprint.json');
const previous = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, 'utf8')) : { modules: [] };
const statusBySlug = Object.fromEntries((previous.modules || []).map((m) => [m.slug, m.status]));

const modules = [];
UNITS.forEach((unit, u) => {
  const unitNumber = u + 1;
  unit.modules.forEach(([moduleTitle, difficulty, kw, subTopics], m) => {
    const slug = `mod-${unitNumber}-${m + 1}`;
    modules.push({
      moduleId: `MOD-${unitNumber}.${m + 1}`,
      slug,
      unitId: `UNIT-${unitNumber}`,
      unitTitle: `Unit ${unitNumber}: ${unit.title}`,
      moduleTitle,
      difficulty,
      subTopics,
      searchQueries: {
        arxivAndTheory: `${kw} survey paper arXiv OR university lecture notes`,
        docsAndRepos: `${kw} official documentation OR GitHub repository`,
        communityWisdom: `${kw} pitfalls lessons learned reddit OR "hacker news" OR stackoverflow`,
        youtubeFree: `${kw} explained tutorial YouTube`,
        courseraPaid: `Coursera course ${kw}`,
      },
      status: statusBySlug[slug] || 'pending',
    });
  });
});

const blueprint = {
  courseTitle: 'The Complete AI Mastery Course: Learn, Build, Earn',
  courseDescription:
    'A three-stage curriculum (Stage 1: Learn, Stage 2: Build, Stage 3: Earn) across 12 syllabus modules plus bonus resources. It runs from AI fundamentals and mastery of ChatGPT, Claude, and Gemini, through prompt engineering, AI content creation, workflow automation, building AI agents, coding with AI, and running models locally, to monetizing AI skills with clients and a 30-day mastery roadmap.',
  availablePaidPlatforms: ['Coursera Plus'],
  stages: ['Stage 1: Learn', 'Stage 2: Build', 'Stage 3: Earn'],
  modules,
};

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(blueprint, null, 2) + '\n', 'utf8');
const units = new Set(modules.map((m) => m.unitId)).size;
console.log(`Wrote ${path.relative(process.cwd(), target)}: ${modules.length} modules across ${units} units.`);
