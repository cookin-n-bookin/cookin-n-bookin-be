const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');


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
      imageId: expect.any(String),
    };
    const res = await request(app)
      .post('/api/v1/books')
      .send(book);
    expect(res.body).toEqual({
      id: expect.any(String),
      ...book,
    });
  })

  it('should get all of the books', async () => {
    const book = await Book.insert({
      title: 'cookin',
      author: 'bookin',
      imageId: expect.any(String),
    });

    const res = await request(app)
      .get('/api/v1/books');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        ...book
      }]);
  });

  it('should get a book by its Id', async () => {
    const book = await Book.insert({
      title: 'cookin',
      author: 'bookin',
      imageId: expect.any(String),
    });

    const res = await request(app)
      .get('/api/v1/books/1');

    expect(res.body).toEqual({
      id: '1',
      ...book,
    });
  })
});