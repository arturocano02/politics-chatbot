// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBImTB7fyMBzhY0etBFlrT89IoIo50SK0Q",
    authDomain: "politics-chatbot.firebaseapp.com",
    databaseURL: "https://politics-chatbot-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "politics-chatbot",
    storageBucket: "politics-chatbot.appspot.com",
    messagingSenderId: "513016874323",
    appId: "1:513016874323:web:6cd1ccbbc250267fc7cda6",
    measurementId: "G-M8YR67RG2V"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// Prompt for username
let username = "";
document.addEventListener("DOMContentLoaded", () => {
    while (!username) {
        username = prompt("Enter a username to start the chat:");
        if (!username) alert("Username cannot be empty!");
    }
});

// Function to send a message
function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    // Save message to Firebase
    database.ref("responses/" + username).push({
        message: userInput,
        timestamp: Date.now()
    });

    // Display message
    const chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
    document.getElementById("user-input").value = "";
}

// Display Aggregated Data
function displayAggregatedData() {
    const bubbleContainer = document.getElementById("bubble-container");
    const topics = {};

    database.ref("responses").on("value", (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        for (let user in data) {
            for (let response in data[user]) {
                const message = data[user][response].message.toLowerCase();
                ["economy", "healthcare", "education", "environment"].forEach(topic => {
                    if (message.includes(topic)) {
                        topics[topic] = (topics[topic] || 0) + 1;
                    }
                });
            }
        }

        bubbleContainer.innerHTML = "";
        for (let topic in topics) {
            const size = 50 + topics[topic] * 20;
            bubbleContainer.innerHTML += `<div class="bubble" style="width:${size}px; height:${size}px;">
                                            ${topic} (${topics[topic]})
                                          </div>`;
        }
        document.getElementById("user-count").textContent = Object.keys(data).length;
    });
}

displayAggregatedData();
