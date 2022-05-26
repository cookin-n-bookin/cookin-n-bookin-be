const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


describe('book routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should insert a new book', async () => {
    const book = {
      title: 'cookin',
      author: 'bookin',
      image_id: expect.any(String),
    };
    const res = await request(app)
      .post('/api/v1/books')
      .send(book);
    expect(res.body).toEqual({
      id: expect.any(String),
      ...book,
    });
  })
});