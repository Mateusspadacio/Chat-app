class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        let userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex >= 0) {
            return this.users.splice(userIndex, 1)[0];
        }
        return {};
    }

    getUser(id) {
        return this.users.find(user => user.id === id);
    }

    getUserList(room) {
        let users = this.users.filter(user => user.room === room);
        return users;
    }
}

module.exports = { Users };