// Your Firebase Config
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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Prompt for username
let username = "";
while (!username) {
    username = prompt("Enter a username to start the chat:");
}

// Function to send a message
function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    // Save the message to Firebase
    const userRef = database.ref("responses/" + username);
    userRef.push({
        message: userInput,
        timestamp: Date.now()
    });

    // Display user message
    const chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    // Example bot response
    const botResponse = "Thank you for sharing!";
    chatWindow.innerHTML += `<p><strong>Bot:</strong> ${botResponse}</p>`;

    // Clear input
    document.getElementById("user-input").value = "";
}

// Function to display aggregated data
function displayAggregatedData() {
    const bubbleContainer = document.getElementById("bubble-container");
    const topics = {};

    // Fetch data from Firebase
    database.ref("responses").on("value", (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // Analyze keywords
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

        // Update bubbles
        bubbleContainer.innerHTML = "";
        for (let topic in topics) {
            const size = 50 + topics[topic] * 20;
            const bubble = `<div class="bubble" style="width:${size}px; height:${size}px;">
                                ${topic} (${topics[topic]})
                            </div>`;
            bubbleContainer.innerHTML += bubble;
        }

        // Update user count
        document.getElementById("user-count").textContent = Object.keys(data).length;
    });
}

// Call the function to display data
displayAggregatedData();
