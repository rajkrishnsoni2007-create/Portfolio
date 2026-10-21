console.log("JavaScript connected");
const themeButton = document.getElementById("themeToggle");

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeButton.textContent = "Switch to Light Mode";
    } else {
        themeButton.textContent = "Switch to Dark Mode";
    }

});
const cityInput = document.getElementById("cityInput");
const weatherButton = document.getElementById("weatherButton");
const weatherResult = document.getElementById("weatherResult");
async function getWeather() {

    const city = cityInput.value.trim();

    if (!city) {
        weatherResult.textContent = "Please enter a city.";
        return;
    }

    weatherResult.textContent = "Loading weather...";

    const apiKey = "64354cca99dd062dbfa4d265ed29f17b";

    const url =
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        weatherResult.innerHTML = `
            <h3>${data.name}</h3>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Condition: ${data.weather[0].description}</p>
        `;

    } catch (error) {

        weatherResult.textContent =
            "Unable to fetch weather. Please try again.";

        console.error(error);
    }
}
weatherButton.addEventListener("click", getWeather);

const projectSearch = document.getElementById("projectSearch");
const projectItems = document.querySelectorAll("#projectList li");
const projectSearchStatus = document.getElementById("projectSearchStatus");

function filterProjects() {
    const term = projectSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    projectItems.forEach(function (item) {
        const text = item.textContent.toLowerCase();
        const tech = (item.getAttribute("data-tech") || "").toLowerCase();
        const matches = !term || text.includes(term) || tech.includes(term);

        item.hidden = !matches;
        if (matches) {
            visibleCount += 1;
        }
    });

    if (!term) {
        projectSearchStatus.textContent = "";
        return;
    }

    if (visibleCount === 0) {
        projectSearchStatus.textContent = "No projects match \"" + projectSearch.value.trim() + "\".";
    } else {
        projectSearchStatus.textContent =
            visibleCount + (visibleCount === 1 ? " project found." : " projects found.");
    }
}

projectSearch.addEventListener("input", filterProjects);

// ===== Floating Portfolio Chatbot =====

const chatToggle = document.getElementById("chatToggle");
const chatWidget = document.getElementById("chatWidget");
const chatClose = document.getElementById("chatClose");

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatLog = document.getElementById("chatLog");

const chatHistory = [];

function openChat() {
    chatWidget.hidden = false;
    chatToggle.setAttribute("aria-expanded", "true");
    chatToggle.setAttribute("aria-label", "Close portfolio chatbot");
    chatInput.focus();
}

function closeChat() {
    chatWidget.hidden = true;
    chatToggle.setAttribute("aria-expanded", "false");
    chatToggle.setAttribute("aria-label", "Open portfolio chatbot");
    chatToggle.focus();
}

chatToggle.addEventListener("click", function () {
    if (chatWidget.hidden) {
        openChat();
    } else {
        closeChat();
    }
});

chatClose.addEventListener("click", closeChat);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !chatWidget.hidden) {
        closeChat();
    }
});

function addChatBubble(role, message) {
    const bubble = document.createElement("p");

    bubble.className = "chat-bubble " + role;
    bubble.textContent = message;

    chatLog.appendChild(bubble);
    chatLog.scrollTop = chatLog.scrollHeight;

    return bubble;
}

async function sendChatMessage(question) {
    const message = (
        typeof question === "string" ? question : chatInput.value
    ).trim();

    if (!message || chatSend.disabled) {
        return;
    }

    openChat();

    addChatBubble("user", message);
    chatInput.value = "";
    chatSend.disabled = true;

    const loadingBubble = addChatBubble(
        "assistant",
        "Thinking..."
    );

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory
            })
        });

        const data = await response.json().catch(function () {
            return {};
        });

        if (!response.ok || !data.reply) {
            throw new Error(
                data.error ||
                "The chatbot is temporarily unavailable. Please try again."
            );
        }

        loadingBubble.textContent = data.reply;

        chatHistory.push(
            { role: "user", content: message },
            { role: "assistant", content: data.reply }
        );

        // Keep recent messages for conversational context.
        if (chatHistory.length > 16) {
            chatHistory.splice(0, chatHistory.length - 16);
        }

    } catch (error) {
        loadingBubble.className = "chat-bubble error";
        loadingBubble.textContent =
            error.message ||
            "Unable to connect. Please check your internet connection.";

        console.error("Chatbot error:", error);

    } finally {
        chatSend.disabled = false;
        chatLog.scrollTop = chatLog.scrollHeight;
        chatInput.focus();
    }
}

chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    sendChatMessage();
});

document.querySelectorAll(".chat-example").forEach(function (button) {
    button.addEventListener("click", function () {
        sendChatMessage(button.textContent);
    });
});