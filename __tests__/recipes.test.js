const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  username: 'dobby2',
  password: 'chicken'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({
    ...mockUser, ...userProps
  });

  const { username } = user;
  await agent.post('api/v1/users/signin')
    .send({ username, password });
  return [agent, user]
}


describe('recipe routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('Should insert a recipe according to the books id', async () => {
    const [agent] = await registerAndLogin();

    const recipe = {
      title: 'Hot Dog',
      book_id: '1',
      page_number: '40',
      ingredients: ['buns', 'hotdog', 'mustard', 'jalapenos'],
      rating: '5',
      image_id: 'this is a hotdog'
    }

    request.agent(app);
    let res = await agent
      .post('/api/v1/recipes')
      .send(recipe);

    expect(res.body).toEqual({
      id: expect.any(String),
      ...recipe
    });





  })
});