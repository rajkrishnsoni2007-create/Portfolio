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
- Interests: software development, programming, solving real-world problems with technology, building practical projects, exploring emerging technologies
- Goal: become a skilled software developer, create innovative solutions, and contribute to meaningful projects

SKILLS
- Python
- CSS
- JavaScript
- Git
- Communication
- Also uses HTML on web projects

PROJECTS
1) Interactive Quiz Application
   - GitHub: https://github.com/rajkrishnsoni2007-create/Interactive-Quiz-Application
   - A web quiz where users answer multiple-choice questions on various topics (including a Code With AI quiz covering LLMs, git commit types, unit tests, CSS, and time complexity).
   - Technologies: HTML, CSS, JavaScript, Python
   - How it works: questions and options are shown one at a time; selecting an option scores the answer and moves to the next question; a final score is shown at the end.

2) Book Reading List Application
   - GitHub: https://github.com/rajkrishnsoni2007-create/reading_list
   - A web app to add books and track reading progress.
   - Technologies: HTML, CSS, JavaScript/TypeScript (React), Python listed among portfolio technologies
   - How it works: visitors type a book title and add it. Titles must be non-empty, at most 60 characters, and unique. New books start as "Want to Read". Status can be changed to Reading or Finished. Books can be filtered (All, Want to Read, Reading, Finished) and removed. Counts of total, currently reading, and finished books are shown. The list is saved in the browser with local storage.

3) Bug Fixing Using Cursor AI
   - A web application project where bugs in code were found and corrected with Cursor AI.
   - Technologies: JavaScript, Cursor AI, Python
   - What was corrected: Cursor AI was used to locate defects, then apply fixes following the course workflow—write or run a unit test that fails first, then correct the buggy logic so the test passes. Typical corrections included broken control flow, incorrect scoring or list updates, and small JavaScript errors that stopped the page from working as intended. Styling belongs in a separate CSS file, which was kept in mind during the fix.

PYTHON PROGRAMS
- Python is one of Raj's core skills.
- Course Python programs were written to match equivalent C programs; the outputs were the same, which confirmed the Python versions were correct.
- Portfolio projects also use Python alongside HTML, CSS, and JavaScript. When asked to "explain Python programs," describe the quiz and reading-list logic at a high level and mention the C-to-Python coursework.

CONTACT
- Prefer email sonirajkrishn2007@gmail.com, GitHub, or LinkedIn.
- This website also has a weather lookup and a project search box (search by name or technology such as Quiz, Book, or Python).`;

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
