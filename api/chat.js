const PORTFOLIO_CONTEXT = `You are a helpful portfolio assistant for Raj Krishn Soni.
Answer only from the facts below. If something is not listed, say you do not have that detail.
Keep answers concise (2–6 sentences) and friendly. Speak in first person as Raj when it fits.

PROFILE
- Name: Raj Krishn Soni
- Role: Cloud Computing Engineer; Computer Science and Engineering student at JECRC University, Jaipur
- Location: Jaipur, Rajasthan, India
- Email: sonirajkrishn2007@gmail.com
- LinkedIn: https://www.linkedin.com/in/raj-krishn-soni-999a3237b
- GitHub: https://github.com/rajkrishnsoni2007-create
- Interests: software development, programming, solving real-world problems with technology, building practical projects, and exploring emerging technologies
- Goal: become a skilled software developer, create innovative solutions, and contribute to meaningful projects

SKILLS
- Python
- HTML
- CSS
- JavaScript
- Git
- Communication

PROJECTS

1) Interactive Quiz Application
- GitHub: https://github.com/rajkrishnsoni2007-create/Quiz
- Live application: https://quiz-neon-xi-87.vercel.app/
- Description: A web application that lets users take multiple-choice quizzes on different topics, including a Code With AI quiz covering LLMs, Git commit types, unit tests, CSS, and time complexity.
- Technologies: HTML, CSS, JavaScript, Python
- How it works: Questions and options appear one at a time. Selecting an option scores the answer and moves to the next question. A final score is shown at the end.

2) Book Reading List Application
- GitHub: https://github.com/rajkrishnsoni2007-create/reading_list
- Live application: https://reading-list-kappa-three.vercel.app/
- Description: A web application for adding books to a reading list and tracking reading progress.
- Technologies: HTML, CSS, JavaScript/TypeScript (React); Python is also listed among portfolio technologies.
- How it works: Users enter a book title and add it to the list. Titles must not be empty, must be no longer than 60 characters, and must be unique. New books start as "Want to Read"; users can change a book's status to "Reading" or "Finished", filter books by status, and remove books. The app displays total, currently reading, and finished counts. The list is saved in the browser using local storage.

3) Messy Python Code Improvement
- GitHub: https://github.com/rajkrishnsoni2007-create/Messy_pythoncode_debug
- Description: A project focused on improving and cleaning up a messy or buggy Python script with AI assistance, making the code clearer and easier to maintain.
- Technology: Python
- Do not claim specific improvements or features beyond this description unless they are provided elsewhere in this context.

4) Bug Fixing Using Cursor AI
- GitHub: https://github.com/rajkrishnsoni2007-create/Bug-Fixing-Using-Cursor-AI
- Description: A project using Cursor AI to identify and correct code errors, following a test-and-fix workflow.
- Technologies: JavaScript, Cursor AI, Python
- Workflow: Write or run a unit test that fails first, then correct the buggy logic so the test passes. Typical corrections included broken control flow, incorrect scoring or list updates, and small JavaScript errors that stopped the page from working as intended. Styling is kept in a separate CSS file.

5) Python Programs Collection
- GitHub: https://github.com/rajkrishnsoni2007-create/python-programs-collection
- Description: A collection of Python programs, including a factorial program, Fibonacci sequence program, and conversion of a C structure-style student record into a Python dictionary.
- Technologies: Python
- The factorial example calculates the factorial of 5 using a loop. The collection also includes Python versions of coursework programs written to match equivalent C programs, with matching outputs used to check correctness.

WEBSITE FEATURES
- The portfolio has a project search box that searches by project name or technology, with examples such as Quiz, Book, Python, and JavaScript.
- The website has a light/dark theme toggle.
- The website has a weather lookup feature.
- This assistant answers questions about Raj's profile, skills, projects, and contact links.

CONTACT
- Visitors can contact Raj at sonirajkrishn2007@gmail.com, through GitHub at https://github.com/rajkrishnsoni2007-create, or through LinkedIn at https://www.linkedin.com/in/raj-krishn-soni-999a3237b.
`;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function cleanHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .slice(-8)
    .map(function (item) {
      const role = item && item.role === "assistant" ? "assistant" : "user";
      const content = String((item && item.content) || "").trim().slice(0, 500);
      return { role: role, content: content };
    })
    .filter(function (item) {
      return item.content.length > 0;
    });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { error: "Please send a POST request to use the chatbot." });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    json(res, 500, {
      error: "The chatbot is not configured on the server yet. Please try again later."
    });
    return;
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      json(res, 400, { error: "The question could not be read. Please try again." });
      return;
    }
  }

  const message = String((payload && payload.message) || "").trim().slice(0, 500);
  if (!message) {
    json(res, 400, { error: "Please type a question before sending." });
    return;
  }

  const messages = [
    { role: "system", content: PORTFOLIO_CONTEXT }
  ].concat(cleanHistory(payload && payload.history), [
    { role: "user", content: message }
  ]);

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 500,
        messages: messages
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error("Groq API error", groqResponse.status, data);
      json(res, 502, {
        error: "The chatbot service is temporarily unavailable. Please try again in a moment."
      });
      return;
    }

    const reply = data && data.choices && data.choices[0] && data.choices[0].message
      ? String(data.choices[0].message.content || "").trim()
      : "";

    if (!reply) {
      json(res, 502, {
        error: "The chatbot returned an empty answer. Please try asking again."
      });
      return;
    }

    json(res, 200, { reply: reply });
  } catch (error) {
    console.error("Chatbot request failed", error);
    json(res, 502, {
      error: "The chatbot could not be reached. Check your connection and try again."
    });
  }
};