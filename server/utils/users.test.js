const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
    let users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '123',
            name: 'Mateus',
            room: 'Test room'
        },{
            id: '124',
            name: 'Jhon',
            room: 'Test room'
        },{
            id: '125',
            name: 'Jen',
            room: 'Test 2 room'
        }];
    })

    it('should add new user', () => {
        let { id, name, room } = users.users[0];
        let resUser = users.addUser(id, name, room);
        expect([users.users[0]]).toEqual([resUser]);
    });

    it('should remove an user', () => {
        let user = users.users[0];
        let resUser = users.removeUser(user.id);
        expect(resUser[0]).toEqual(user);
    });

    it('should get an user', () => {
        let { id, name, room } = users.users[0];
        users.addUser(id, name, room);
        let resUser = users.getUser(id);
        expect(resUser).toEqual(users.users[0]);
    });

    it('should get user list by room', () => {
        let userList = users.getUserList('Test room');
        expect(userList).toEqual(['Mateus', 'Jhon']);
    });
});