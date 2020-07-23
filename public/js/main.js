const chatForm = document.getElementById('chat-form');
const chatMessagesContainer = document.querySelector('.chat-messages');
const socket = io();

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.emit('joinChatRoom', {username, room});

socket.on('roomUsers', ({room, users}) => {
    renderRoomUserNames(users);
    renderRoomName(room);
})

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
    messageElement.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p><p class="text">${message.message}</p>`;

    chatMessagesContainer.appendChild(messageElement);
}

function renderRoomUserNames(users) {
    const usersListEl = document.getElementById('users');

    usersListEl.innerHTML = users.map(user => `<li>${user.username}</li>`).join('');
}

function renderRoomName(roomName) {
    const roomNameEl = document.getElementById('room-name');
    roomNameEl.innerHTML = roomName;
}
