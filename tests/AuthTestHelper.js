/* istanbul ignore file */
const AuthTestHelper = {
  async makeUserHelper({ server, username = 'bayprime' }) {
    const userPayload = {
      username: username,
      password: 'secret',
    };

    const resUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: 'Bayu Prima Setiawan',
      },
    });

    const { id: userId } = JSON.parse(resUser.payload).data.addedUser;
    return userId;
  },

  async getAccessToken({ server, username = 'bayprime' }) {
    const userPayload = {
      username: username,
      password: 'secret',
    };

    const resAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const { accessToken } = JSON.parse(resAuth.payload).data;

    return accessToken;
  },
};

module.exports = AuthTestHelper;
