/* eslint-disable no-console */

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

    const user = {
      id: '1',
      username: 'dobby'
    };

    expect(res.body).toEqual({ user, message: 'Signed up successfully!' });
  });

  it('Should be able to sign in a user', async () => {
    const newUser = {
      username: 'dobby',
      password: 'chicken',
    };

    await UserService.create(newUser);

    const agent = request.agent(app);

    const res = await agent
      .post('/api/v1/users/signin')
      .send(newUser);

    const user = {
      id: '1',
      username: 'dobby'
    };

    expect(res.body).toEqual({ user, message: 'Signed in successfully!' });
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

  it('Should be able to return the current user', async () => {
    const user = {
      username: 'dobby',
      password: 'chicken',
    };

    // signs up user
    await UserService.create(user);

    const agent = request.agent(app);

    // logs in user
    await agent
      .post('/api/v1/users/signin')
      .send(user);

    const me = await agent
      .get('/api/v1/users/me');

    expect(me.body).toEqual({
      id: expect.any(String),
      username: 'dobby',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });

  });

  it('should get a user by id', async () => {
    const newUser = {
      username: 'dobby',
      password: 'chicken',
    };

    await UserService.create(newUser);

    const agent = request.agent(app);

    const res = await agent
      .post('/api/v1/users/signin')
      .send(newUser);

    const user = {
      id: '1',
      username: 'dobby'
    };

    expect(res.body).toEqual({ user, message: 'Signed in successfully!' });

    await agent
      .post('/api/v1/books')
      .send({
        title: 'cookin',
        author: 'bookin',
        imageId: 'it is an image'
      });

    console.log('USER ID', user.id);
    const res2 = await agent

      .get(`/api/v1/users/${user.id}`);

    expect(res2.body).toEqual({
      id: '1',
      username: 'dobby',
      books: [{
        book_id: expect.any(String),
        title: 'cookin',
        author: 'bookin',
        image_id: 'it is an image',
      }]
    });

  });

});
