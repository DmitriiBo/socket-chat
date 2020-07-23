const users = [];

function joinNewUser(userId, userName, room) {
    const user = {id: userId, username: userName, room};

    users.push(user);

    return user;
}

function getCurrentUserById(userId) {
    return users.find(user => user.id === userId);
}

function leaveUser(userId) {
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        return users.splice(userIndex, 1)[0];
    }
}

function getUsersByRoom(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    getCurrentUserById, joinNewUser, leaveUser, getUsersByRoom,
};
