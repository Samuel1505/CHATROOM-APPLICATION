(function() {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    // Event Listener for Join Chat button
    app.querySelector(".join-screen #join-user").addEventListener("click", function() {
        const username = app.querySelector(".join-screen #username").value.trim();

        // Check if the username is entered
        if (username.length === 0) {
            alert("Please enter a username.");
            return;
        }

        console.log("Username entered:", username); // Debugging: log the entered username
        uname = username;

        // Emit a new user event to the server
        socket.emit("newuser", username);

        // Switch from join screen to chat screen
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
        console.log("Switched to chat screen"); // Debugging: log screen transition
    });

    // Event Listener for Send Message button
    app.querySelector(".chat-screen #send-message").addEventListener("click", function() {
        const message = app.querySelector(".chat-screen #message-input").value.trim();

        // Check if the message is not empty
        if (message.length === 0) {
            return;
        }

        console.log("Message sent:", message); // Debugging: log the sent message

        // Display the message on the chat screen and emit to server
        renderMessage("my", {
            username: uname,
            text: message
        });

        socket.emit("chat", {
            username: uname,
            text: message
        });

        // Clear input field after sending the message
        app.querySelector(".chat-screen #message-input").value = "";
    });

    // Event Listener for Exit Chat button
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function() {
        socket.emit("exituser", uname);
        window.location.href = window.location.href; // Reload the page
        console.log("User exited chat"); // Debugging: log exit action
    });

    // Listen for updates from the server
    socket.on("update", function(update) {
        console.log("Update from server:", update); // Debugging: log server updates
        renderMessage("update", update);
    });

    // Listen for chat messages from other users
    socket.on("chat", function(message) {
        console.log("New message from server:", message); // Debugging: log incoming messages
        renderMessage("other", message);
    });

    // Function to render messages on the chat screen
    function renderMessage(type, message) {
        const messageContainer = app.querySelector("#messages");

        let el = document.createElement("div");

        if (type === "my") {
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === "other") {
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === "update") {
            el.setAttribute("class", "update");
            el.innerText = message;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight; // Auto-scroll to the latest message
    }
})();
