let userCount = 0;
const responses = {}; // Example: {"Economy": 3, "Healthcare": 5}

function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    // Display the user message
    const chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    // Example chatbot response (replace with real logic/API)
    const botResponse = "Thank you for sharing your opinion!";
    chatWindow.innerHTML += `<p><strong>Bot:</strong> ${botResponse}</p>`;
    
    // Simulate storing and analyzing data
    analyzeResponse(userInput);
    updateUI();
    document.getElementById("user-input").value = "";
}

function analyzeResponse(input) {
    // Example: Keyword detection to categorize topics
    const keywords = ["economy", "healthcare", "education", "environment"];
    for (let keyword of keywords) {
        if (input.toLowerCase().includes(keyword)) {
            responses[keyword] = (responses[keyword] || 0) + 1;
        }
    }
    userCount++;
}

function updateUI() {
    // Update user count
    document.getElementById("user-count").textContent = userCount;

    // Update bubbles
    const bubbleContainer = document.getElementById("bubble-container");
    bubbleContainer.innerHTML = "";

    for (let topic in responses) {
        const size = 50 + responses[topic] * 20; // Increase size dynamically
        const bubble = `<div class="bubble" style="width:${size}px; height:${size}px;">
                          ${topic} (${responses[topic]})
                        </div>`;
        bubbleContainer.innerHTML += bubble;
    }
}
