const users = [];

// Додає користувача до чату
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// Отримує поточного користувача
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// Користувач залишає чат
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0]; // видаляємо користувача з масиву
    }
}

// Отримує всіх користувачів в кімнаті
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
