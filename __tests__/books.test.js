const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');
const UserService = require('../lib/services/UserService');


describe('book routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should insert a new book', async () => {
    const newUser = {
      username: 'dobby',
      password: 'chicken',
    };
    const book = {
      title: 'cookin',
      author: 'bookin',
      imageId: expect.any(String),
    };
    await UserService.create(newUser);

    const agent = request.agent(app);
    let res = await agent
      .post('/api/v1/books')
      .send(book);

    expect(res.body).toEqual({ message: 'You need to sign in to continue', status: 401 });
    await agent
      .post('/api/v1/users/signin')
      .send(newUser)

    res = await agent
      .post('/api/v1/books')
      .send(book);
    expect(res.body).toEqual({
      id: expect.any(String),
      ...book,
    });
  });

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

  it('should get a book by its id', async () => {

    const user = {
      username: 'dobby',
      password: 'chicken'
    };


    await UserService.create(user);

    const agent = request.agent(app);
    await agent
      .post('/api/v1/users/signin')
      .send(user)


    const book = await agent
      .post(`/api/v1/books`)
      .send({
        title: 'cookin',
        author: 'bookin',
        imageId: 'it is an image'
      });


    console.log('|||', book.body);
    const res = await agent
      .get(`/api/v1/books/${book.body.id}`);

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'cookin',
      author: 'bookin',
      imageId: expect.any(String),
      users: [{
        user_id: '1',
        username: 'dobby',
      }]
    });
  });

  it('should update a book by its id', async () => {
    const book = await Book.insert({
      title: 'cookin',
      author: 'bookin',
      imageId: expect.any(String),
    });

    const res = await request(app)
      .patch(`/api/v1/books/${book.id}`)
      .send({ title: 'chicken' });
    const expected = {
      id: book.id,
      title: 'chicken',
      author: 'bookin',
      imageId: expect.any(String),
    };

    expect(res.body).toEqual(expected);
    expect(await Book.getById(book.id)).toEqual(expected);
  });
});
