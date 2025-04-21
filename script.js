const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const regenerateBtn = document.getElementById('regenerate-btn');
const clearBtn = document.getElementById('clear-btn');

let messages = [];
let isLoading = false;
let lastUserMessage = null;

function createMessageElement(message) {
  const div = document.createElement('div');
  div.classList.add('flex', 'flex-col');
  if (message.role === 'user') {
    div.classList.add('user-message', 'self-end');
  } else {
    div.classList.add('ai-message', 'self-start');
  }
  div.textContent = message.content;
  return div;
}

function createLoadingIndicator() {
  const div = document.createElement('div');
  div.classList.add('ai-message', 'self-start', 'loading-dots');
  div.innerHTML = '<span></span><span></span><span></span>';
  return div;
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  if (isLoading) return;
  const userInput = chatInput.value.trim();
  if (!userInput) return;

  lastUserMessage = userInput;
  messages.push({ role: 'user', content: userInput });
  renderMessages();

  chatInput.value = '';
  isLoading = true;

  const loadingIndicator = createLoadingIndicator();
  chatContainer.appendChild(loadingIndicator);
  scrollToBottom();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await response.json();
    messages.push({ role: 'assistant', content: data.message });
  } catch (error) {
    messages.push({ role: 'assistant', content: 'Error: Unable to get response.' });
  }

  isLoading = false;
  renderMessages();
  scrollToBottom();
}

function renderMessages() {
  chatContainer.innerHTML = '';
  messages.forEach((msg) => {
    const msgEl = createMessageElement(msg);
    chatContainer.appendChild(msgEl);
  });
}

function clearChat() {
  messages = [];
  renderMessages();
}

async function regenerateResponse() {
  if (isLoading || !lastUserMessage) return;
  // Remove last assistant message if any
  if (messages.length && messages[messages.length - 1].role === 'assistant') {
    messages.pop();
  }
  isLoading = true;
  renderMessages();

  const loadingIndicator = createLoadingIndicator();
  chatContainer.appendChild(loadingIndicator);
  scrollToBottom();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await response.json();
    messages.push({ role: 'assistant', content: data.message });
  } catch (error) {
    messages.push({ role: 'assistant', content: 'Error: Unable to get response.' });
  }

  isLoading = false;
  renderMessages();
  scrollToBottom();
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
clearBtn.addEventListener('click', () => {
  clearChat();
  lastUserMessage = null;
});
regenerateBtn.addEventListener('click', regenerateResponse);

renderMessages();
