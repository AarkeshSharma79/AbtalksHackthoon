
<div align="center">
# AbtalksHackthon

# 🤖 InterviewMind AI

### Build the Interviewer, Not the Interview.

An AI-powered technical interviewer that conducts personalized, adaptive interviews based on a candidate's learning journey and generates detailed performance feedback.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)]()
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)]()
[![Express](https://img.shields.io/badge/Express.js-000000?logo=express)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)]()
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5.5-412991?logo=openai)]()

</div>

---

# 📌 Overview

InterviewMind AI is an intelligent interview platform that simulates real technical interviews instead of asking static questions.

Using curriculum data and candidate progress, it dynamically generates interview questions, follows up based on previous answers, maintains conversation context, and produces a comprehensive performance report.

---

# ✨ Features

## 🎯 Personalized Interviews

- Candidate-specific interview generation
- Adaptive question difficulty
- Curriculum-aware question selection
- Dynamic follow-up questions

---

## 🧠 AI Interviewer

- Multi-turn conversation
- Context memory
- Intelligent probing
- Technical evaluation
- Human-like interview experience

---

## 📚 Curriculum-Based Assessment

- Questions generated only from completed topics
- Covers multiple curriculum modules
- Tracks topic coverage
- Avoids skipped concepts

---

## 📊 Performance Analytics

- Technical score
- Communication score
- Reasoning evaluation
- Topic-wise performance
- Improvement suggestions
- Downloadable report

---

# 🏗️ Architecture

```
                    Frontend

                        │

                        ▼

                Express REST API

                        │

        ┌───────────────┴────────────────┐

        ▼                                ▼

 Candidate Loader                 Curriculum Loader

        │                                │

        └───────────────┬────────────────┘

                        ▼

                 Interview Engine

                        │

      ┌─────────────────┼─────────────────┐

      ▼                 ▼                 ▼

 Memory          Question Generator    Evaluator

                        │

                        ▼

                    GPT-5.5

                        │

                        ▼

                 Interview Report
```

---

# 🚀 Tech Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand
- TanStack Query
- React Markdown
- Recharts

---

## Backend

- Node.js
- Express.js
- TypeScript
- LangChain
- OpenAI SDK
- Zod
- Mongoose

---

## AI

- GPT-5.5
- LangChain Agents
- OpenAI Embeddings

---

## Database

- MongoDB Atlas

---

## Vector Database

- Pinecone
- ChromaDB

---

## Deployment

- Vercel
- Railway
- Docker

---

# 📂 Folder Structure

```
AI-Interview-Agent/

├── frontend/
│
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
│
├── backend/
│
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── prompts/
│   ├── agents/
│   ├── memory/
│   ├── vector/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── server.ts
│
├── docs/
├── docker/
├── data/
└── README.md
```

---

# ⚡ Workflow

```
Candidate

↓

Analyze Learning Progress

↓

Retrieve Curriculum Topics

↓

Generate Question

↓

Candidate Response

↓

Evaluate Response

↓

Generate Follow-up

↓

Update Memory

↓

Repeat

↓

Generate Feedback
```

---

# 🎨 Screenshots

## Landing Page

> Add Screenshot Here

---

## Candidate Dashboard

> Add Screenshot Here

---

## AI Interview

> Add Screenshot Here

---

## Feedback Dashboard

> Add Screenshot Here

---

# 📡 API

## Start Interview

```http
POST /api/interview
```

Request

```json
{
  "sessionId":"abc123",
  "candidate":{}
}
```

---

Continue Interview

```json
{
  "sessionId":"abc123",
  "message":"..."
}
```

---

Response

```json
{
  "reply":"...",
  "done":false
}
```

---

Final Response

```json
{
  "reply":"Interview completed",
  "done":true,
  "feedback":{
      "summary":"",
      "strengths":[],
      "gaps":[],
      "next":[]
  }
}
```

---

# ⚙️ Installation

Clone Repository

```bash
git clone https://github.com/yourusername/AI-Interview-Agent.git
```

Move inside project

```bash
cd AI-Interview-Agent
```

Install dependencies

```bash
npm install
```

Run Frontend

```bash
cd frontend
npm run dev
```

Run Backend

```bash
cd backend
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file.

```env
OPENAI_API_KEY=

MONGODB_URI=

PINECONE_API_KEY=

PINECONE_INDEX=

JWT_SECRET=
```

---

# 📈 Roadmap

- [x] Personalized Interview Flow
- [x] Dynamic Question Generation
- [x] Conversation Memory
- [x] Curriculum-aware Interview
- [x] AI Evaluation
- [ ] Voice Interview
- [ ] Coding Interview
- [ ] Resume Analysis
- [ ] Company-specific Interview Modes
- [ ] Multi-language Support

---

# 🧪 Testing

- Unit Testing
- Integration Testing
- API Testing
- Prompt Evaluation
- Interview Simulation
- Performance Testing

---

# 🌟 Why This Project?

Unlike traditional interview bots, InterviewMind AI:

- Understands what the candidate has already learned.
- Adapts questions based on previous responses.
- Simulates a realistic technical interview.
- Evaluates both knowledge and reasoning.
- Provides actionable feedback for improvement.

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Aarkesh Sharma**

GitHub: https://github.com/AarkeshSharma79

LinkedIn: https://linkedin.com/in/aarkesh-sharma-2536b8372

---

<div align="center">

### ⭐ If you like this project, don't forget to star the repository!

Made with ❤️ using AI

</div>
