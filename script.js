console.log("Script loaded. Checking Firebase availability...");

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

// Debugging: Check if Firebase is loaded
if (typeof firebase === "undefined") {
    console.error("Firebase is not loaded. Check the script order.");
} else {
    console.log("Firebase object is available.");
}

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully.");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

const database = firebase.database();
console.log("Firebase database initialized.");

// Prompt for username
let username = "";
document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded. Prompting for username...");
    while (!username) {
        username = prompt("Enter a username to start the chat:");
        if (!username) console.warn("Username is empty. Prompting again...");
    }
    console.log("Username set to:", username);
});

// Function to send a message
function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    console.log("Send button clicked. User input:", userInput);

    if (!userInput) {
        console.warn("Input is empty. No message sent.");
        return;
    }

    console.log("Saving message to Firebase...");
    database.ref("responses/" + username).push({
        message: userInput,
        timestamp: Date.now()
    }).then(() => {
        console.log("Message saved successfully.");
    }).catch((error) => {
        console.error("Error saving message:", error);
    });

    // Display message
    const chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
    document.getElementById("user-input").value = "";
}

// Function to display aggregated data
function displayAggregatedData() {
    console.log("Fetching aggregated data from Firebase...");
    const bubbleContainer = document.getElementById("bubble-container");
    const topics = {};

    database.ref("responses").on("value", (snapshot) => {
        const data = snapshot.val();
        console.log("Data received from Firebase:", data);

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

        console.log("Processed topics:", topics);

        // Update bubbles
        bubbleContainer.innerHTML = "";
        for (let topic in topics) {
            const size = 50 + topics[topic] * 20;
            bubbleContainer.innerHTML += `<div class="bubble" style="width:${size}px; height:${size}px;">
                                            ${topic} (${topics[topic]})
                                          </div>`;
        }

        document.getElementById("user-count").textContent = Object.keys(data).length;
        console.log("User count updated:", Object.keys(data).length);
    });
}

displayAggregatedData();
