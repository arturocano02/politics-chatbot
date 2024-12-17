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

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
console.log("Firebase initialized successfully.");

// Function to generate unique username
function generateUniqueUsername(baseName) {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return `${baseName}${randomId}`;
}

// Username setup
let username = "";
document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded. Prompting for username...");

    while (!username) {
        username = prompt("Enter your name to start the chat:");
        if (!username || username.trim() === "") {
            alert("Name cannot be empty!");
            username = null;
        }
    }

    username = generateUniqueUsername(username.trim());
    console.log("Generated Username:", username);

    // Update Firebase user count
    database.ref("responses/" + username).set({
        initialized: true
    }).then(() => {
        console.log("Firebase initialized for user:", username);

        // Update the left panel title
        const chatTitle = document.getElementById("chat-title");
        if (chatTitle) {
            chatTitle.textContent = `${username} chatting with Political Representative`;
            console.log("Title updated successfully.");
        } else {
            console.error("Left panel title not found.");
        }
    }).catch((error) => {
        console.error("Error initializing Firebase for user:", error);
    });
});

// Send message
function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();

    if (!userInput) {
        console.warn("Empty message, not sent.");
        return;
    }

    database.ref("responses/" + username).push({
        message: userInput,
        timestamp: Date.now()
    }).then(() => {
        console.log("Message sent:", userInput);

        // Append to chat window
        const chatWindow = document.getElementById("chat-window");
        chatWindow.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
        document.getElementById("user-input").value = "";
    }).catch((error) => {
        console.error("Error sending message:", error);
    });
}

// Fetch user count
database.ref("responses").on("value", (snapshot) => {
    const data = snapshot.val();
    const userCount = data ? Object.keys(data).length : 0;

    console.log("Current user count:", userCount);
    document.getElementById("user-count").textContent = userCount;
});
