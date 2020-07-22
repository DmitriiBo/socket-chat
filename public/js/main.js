const chatForm = document.getElementById('chat-form');
const chatMessagesContainer = document.querySelector('.chat-messages');
const socket = io();

socket.on('message', (message) => {
    console.log(message);

    renderOutputMessage(message);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
});


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function renderOutputMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p><p class="text">${message}</p>`;

    chatMessagesContainer.appendChild(messageElement);
}
