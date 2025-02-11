document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  // Initialize conversation history
  let conversationHistory = [];

  // Function to add a message to the chat box
  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    scrollToBottom();
  }

  // Smooth scrolling function
  function scrollToBottom() {
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: 'smooth'
    });
  }

  // Function to send user input to the API and get a response
  async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Add user message to the chat
    addMessage('user', userMessage);

    // Add user message to the conversation history
    conversationHistory.push({ role: "user", content: [{ type: "text", text: userMessage }] });

    // Clear input field
    userInput.value = '';

    try {
      console.log("Sending request to OpenRouter API...");
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'HTTP-Referer': 'https://justin-ii.github.io/AI/',
          'X-Title': 'HOPE-AI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "qwen/qwen2.5-vl-72b-instruct:free",
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: `
                    You are an AI tutor developed by HARINANDAN and powered by HOPE in Core.
                    Your purpose is to assist users in learning and solving problems.
                    Always provide clear, concise, and accurate explanations.
                    If you don't know the answer, say so instead of making things up.
                  `
                }
              ]
            },
            ...conversationHistory
          ]
        })
      });

      console.log("API Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      // Extract bot reply from the API response
      const botReply = data.choices?.[0]?.message?.content?.[0]?.text || "I'm sorry, I couldn't process that.";
      addMessage('bot', botReply);

      // Add bot response to the conversation history
      conversationHistory.push({ role: "assistant", content: [{ type: "text", text: botReply }] });
    } catch (error) {
      console.error("Error fetching bot response:", error);
      addMessage('bot', 'Something went wrong!');
    }
  }

  // Event listener for the send button
  sendBtn.addEventListener('click', sendMessage);

  // Allow pressing "Enter" to send the message
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});