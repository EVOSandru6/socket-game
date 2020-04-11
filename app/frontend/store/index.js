export const state = () => ({
    user: {},
    messages: [],
    users: []
});

export const mutations = {
    setUser(state, user) {
        state.user = user
    },
    clearData(state) {
        state.user = {};
        state.messages = [];
        state.users = [];
    },
    SOCKET_newMessage(state, message) {
        console.log('SOCKET_newMessage');
        state.messages.push(message)
    },
    SOCKET_updateUsers(state, users) {
        console.log('SOCKET_updateUsers');
        state.users = users
    },
    SOCKET_setUser(state, user) {
        console.log('SOCKET_setUser');
        state.user = user
    },
};

export const actions = {
    // SOCKET_setUser(state, user) {
    //     state.user = user
    // },

    SOCKET_hello(ctx, data) {
        console.log('Message Recieved', data);
    }
};
