const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


describe('cookin-n-bookin-be routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });


  it('Should be able to sign up a user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'dobby', password: 'chicken' });

    expect(res.body).toEqual({ id: expect.any(String), username: 'dobby' });
  });
});
