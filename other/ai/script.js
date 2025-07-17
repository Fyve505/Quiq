document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  const userMessage = userInput.value.trim();

  if (!userMessage) {
    console.warn("Empty input — ignoring.");
    return;
  }

  appendMessage("user", userMessage);
  userInput.value = "";

  appendMessage("ai", "Typing...");

  try {
    const aiResponse = await callCohereChatAPI(userMessage);

    // Replace last AI "Typing..." message with real response
    const aiMessages = document.querySelectorAll(".message.ai");
    aiMessages[aiMessages.length - 1].textContent = aiResponse;
  } catch (error) {
    console.error("API call error:", error);
    const aiMessages = document.querySelectorAll(".message.ai");
    aiMessages[aiMessages.length - 1].textContent = `Error: ${error.message}`;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  document.getElementById("chat-box").appendChild(msg);
  msg.scrollIntoView({ behavior: "smooth" });
}

async function callCohereChatAPI(userMessage) {
  if (!userMessage || userMessage.trim().length === 0) {
    throw new Error("Empty user message");
  }

  const systemPrompt = "You are a helpful assistant.";

  // Build prompt string for Cohere's chat API (single string)
  const prompt = `${systemPrompt}\nUser: ${userMessage}\nAssistant:`;

  if (prompt.trim().length === 0) {
    throw new Error("Prompt is empty after construction");
  }

  console.log("Sending prompt to Cohere:", JSON.stringify(prompt));

  const response = await fetch("https://api.cohere.ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer I_WILL_PUT__API_HERE" // <<< REPLACE THIS WITH YOUR REAL API KEY!
    },
    body: JSON.stringify({
      model: "command-xlarge-nightly",
      message: prompt
    })
  });

  if (!response.ok) {
    let errorMessage = "Cohere Chat API error";
    try {
      const errData = await response.json();
      if (errData.message) errorMessage = errData.message;
    } catch {}
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log("Cohere response:", data);

  // Return the main text from response:
  return data.text?.trim() || "No response from Cohere.";
}
