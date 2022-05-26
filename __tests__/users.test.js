const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('cookin-n-bookin-be routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('Should be able to sign up a user', async () => {
    const res = await request(app)
      .post('/api/v1/users/signup')
      .send({ username: 'dobby', password: 'chicken' });

    expect(res.body).toEqual({ id: expect.any(String), username: 'dobby' });
  });

  it('Should be able to sign in a user', async () => {
    const user = {
      username: 'dobby',
      password: 'chicken',
    };

    await UserService.create(user);

    const agent = request.agent(app);

    const res = await agent
      .post('/api/v1/users/signin')
      .send(user);

    expect(res.body).toEqual({ message: 'Signed in successfully!' });
  });

  it('logs out a user', async () => {
    const agent = request.agent(app);
    await UserService.create({
      username: 'dobby',
      password: 'chicken',
    });

    const user = await agent
      .post('/api/v1/users/signin')
      .send({
        username: 'dobby',
        password: 'chicken',
      });

    const res = await agent
      .delete('/api/v1/users/sessions')
      .send({
        username: user.email,
        password: 'chicken',
      });

    expect(res.body).toEqual({
      message: 'Successfully signed out',
    });
  });

});
