# Raj Krishn Soni — Personal Portfolio

A professional personal portfolio website showcasing my background, technical skills, projects, and interests as a Computer Science and Engineering student at JECRC University, Jaipur. The website also features an AI-powered chatbot that helps visitors learn more about my profile and projects. 

## 🌐 Live Website

**Portfolio:** `YOUR_LIVE_VERCEL_URL`

## 📌 Project Overview

This portfolio serves as my personal space on the web to present my technical journey, demonstrate practical projects, and make it easy for recruiters, developers, and collaborators to connect with me.

The website combines a clean interface with interactive features, including project search, light/dark mode, and an AI chatbot.

## ✨ Features

- **Personal Introduction:** Displays my name, profile photo, professional headline, location, and contact links.
- **About Section:** Introduces my background, interests, and career goals.
- **Projects Showcase:** Presents five projects with descriptions and relevant GitHub repositories or live demos where available.
- **Project Search:** Helps visitors find projects by name or technology.
- **Light/Dark Mode:** Allows visitors to switch between display themes.
- **AI-Powered Chatbot:** Answers questions about my portfolio, skills, and projects using the Groq API.
- **Responsive Design:** Uses responsive CSS to support different screen sizes.
- **Contact Links:** Provides quick access to my email, GitHub, and LinkedIn.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure and content |
| CSS3 | Styling, layout, responsive design, and themes |
| JavaScript | Interactivity, project search, and chatbot communication |
| Vercel Functions | Server-side API endpoint for the chatbot |
| Groq API | AI-powered conversational responses |
| GPT-OSS 20B | AI model accessed through Groq |
| Git & GitHub | Version control and source code management |
| Vercel | Website hosting and deployment |

## 🚀 Projects Featured

### 1. Interactive Quiz Application
An interactive quiz application that presents questions and answer options, tracks responses, and displays the final score.

- **Technologies:** HTML, CSS, JavaScript, Python
- **GitHub:** https://github.com/rajkrishnsoni2007-create/Quiz
- **Live Demo:** https://quiz-neon-xi-87.vercel.app/

### 2. Book Reading List Application
A reading-list application for organizing books and tracking reading progress.

- **Technologies:** HTML, CSS, JavaScript, React/TypeScript
- **Features:** Add books, manage reading statuses, filter entries, delete books, and track counts.
- **GitHub:** https://github.com/rajkrishnsoni2007-create/reading_list
- **Live Demo:** https://reading-list-kappa-three.vercel.app/

### 3. Messy Python Code Improvement
A Python project focused on improving code readability and addressing problems in messy or buggy scripts.

- **Technology:** Python
- **GitHub:** https://github.com/rajkrishnsoni2007-create/Messy_pythoncode_debug

### 4. Bug Fixing Using Cursor AI
A project exploring AI-assisted debugging and code improvement with Cursor AI.

- **Technologies:** JavaScript, Python, Cursor AI
- **GitHub:** https://github.com/rajkrishnsoni2007-create/Bug-Fixing-Using-Cursor-AI

### 5. Python Programs Collection
A collection of Python programs developed to practise programming fundamentals and problem-solving.

- **Technology:** Python
- **Examples:** Factorial calculation, Fibonacci sequence, student-record handling, and other programming exercises.
- **GitHub:** https://github.com/rajkrishnsoni2007-create/python-programs-collection

## 💬 AI Chatbot Architecture

The chatbot uses a server-side API workflow to keep the Groq API key out of the public frontend.

1. A visitor submits a message through the website.
2. Frontend JavaScript sends a `POST` request to `/api/chat`.
3. The Vercel backend validates the input and prepares the portfolio context.
4. The backend calls the Groq Chat Completions API using the configured model.
5. The backend returns the generated answer as JSON.
6. Frontend JavaScript reads the response and displays it in the chat window.

### Environment Variables

Configure these variables in Vercel under **Project Settings → Environment Variables**:

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Secret API key used by the backend |
| `GROQ_MODEL` | AI model identifier, configured as `openai/gpt-oss-20b` |

**Security:** Never hardcode the API key in frontend JavaScript or commit it to GitHub. For local development, use a `.env` file excluded by `.gitignore` and load it using an appropriate environment-variable loader.

## 💻 Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- A Groq API key for chatbot functionality
- [Vercel CLI](https://vercel.com/docs/cli)

### 1. Clone the repository

Replace the placeholder with your actual portfolio repository URL.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_REPOSITORY_NAME
```

### 2. Install the Vercel CLI

```bash
npm install -g vercel
```

### 3. Configure environment variables

Create a `.env` file in the project root for local development:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Replace `your_groq_api_key` with your own secret key. Do not share or commit this file.

### 4. Run the project locally

From the project root, run:

```bash
vercel dev
```

Open the local URL shown in your terminal, commonly `http://localhost:3000`.

If your project uses a different local development setup, follow the corresponding scripts and configuration in the repository.

## ☁️ Deployment

This project is deployed on Vercel.

To deploy updates:

1. Commit and push your changes to the connected GitHub repository.
2. Vercel builds and deploys the latest changes automatically when Git integration is configured.
3. Open the production deployment URL to verify the updated website.
4. Ensure the required environment variables are configured in Vercel.

## 🔒 Security and Best Practices

- Store API credentials in environment variables.
- Keep `.env` files out of version control.
- Make AI API calls from the backend instead of exposing credentials in the browser.
- Validate incoming chatbot requests and handle API errors safely.
- Avoid including secrets in logs, screenshots, or public documentation.

## 📬 Contact

**Raj Krishn Soni**  
Computer Science and Engineering Student  
JECRC University, Jaipur, Rajasthan

- **Email:** sonirajkrishn2007@gmail.com
- **GitHub:** https://github.com/rajkrishnsoni2007-create

## 📄 License

This project is intended to showcase my personal portfolio and learning projects. Add a `LICENSE` file if you wish to distribute it under a specific open-source license.

---

*Built to showcase my skills, projects, and continued growth in software development.*
