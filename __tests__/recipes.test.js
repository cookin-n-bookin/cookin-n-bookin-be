const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');

// const mockUser = {
//   username: 'dobby2',
//   password: 'chicken'
// };

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;

//   const agent = request.agent(app);

//   const user = await UserService.create({
//     ...mockUser, ...userProps
//   });

//   const { username } = user;
//   await agent.post('api/v1/users/signin')
//     .send({ username, password });
//   return [agent, user]
// }


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

    const res = await request(app)
      .patch(`/api/v1/recipes/${recipe.id}`)
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
    expect(await Recipe.getById(recipe.id)).toEqual(expected);
  });
});
