const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


describe('recipe routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('Should insert a recipe according to the books id', async () => {
    const newUser = {
      username: 'dobby2',
      password: 'chicken',
    };

    const agent = request.agent(app);
    await agent
      .post('/api/v1/users/signup')
      .send(newUser);

    const recipe = {
      title: 'Hot Dog',
      bookId: '1',
      pageNumber: '40',
      ingredients: ['buns', 'hotdog', 'mustard', 'jalapenos'],
      rating: 5,
      imageId: 'this is a hotdog'
    };

    request.agent(app);
    const res = await agent
      .post('/api/v1/recipes')
      .send(recipe);

    expect(res.body).toEqual({
      id: expect.any(String),
      ...recipe
    });
  });

  it('Should get all the recipes from a book', async () => {
    const newUser = {
      username: 'dobby3',
      password: 'chicken',
    };

    const agent = request.agent(app);
    await agent
      .post('/api/v1/users/signup')
      .send(newUser);

    const recipe = {
      title: 'Hot Dog',
      bookId: '1',
      pageNumber: '40',
      ingredients: ['buns', 'hotdog', 'mustard', 'jalapenos'],
      rating: 5,
      imageId: 'this is a hotdog'
    };

    request.agent(app);
    await agent
      .post('/api/v1/recipes')
      .send(recipe);
    const res = await agent
      .get('/api/v1/recipes');

    expect(res.body).toEqual([{
      id: expect.any(String),
      ...recipe,
    }]);
  });

  it.only('should update a recipe by id', async () => {
    const newUser = {
      username: 'dobby3',
      password: 'chicken',
    };

    const agent = request.agent(app);
    await agent
      .post('/api/v1/users/signup')
      .send(newUser);

    request.agent(app);

    const recipe = await agent
      .post('/api/v1/recipes')
      .send({
        title: 'Hot Dog',
        bookId: '1',
        pageNumber: '40',
        ingredients: ['buns', 'hotdog', 'mustard', 'jalapenos'],
        rating: 5,
        imageId: 'this is a hotdog'
      });

    const res = await request(app)
      .patch(`/api/v1/recipes/${recipe.body.id}`)
      .send({ pageNumber: '20' });

    const expected = {
      id: expect.any(String),
      title: 'Hot Dog',
      bookId: '1',
      pageNumber: '20',
      ingredients: ['buns', 'hotdog', 'mustard', 'jalapenos'],
      rating: 5,
      imageId: 'this is a hotdog'
    };

    expect(res.body).toEqual(expected);
  });
});
