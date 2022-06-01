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

  it('should insert a note for a recipe according to recipe id and user id', async () => {
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
    await agent
      .post('/api/v1/recipes')
      .send(recipe);

    const note = {
      content: 'bake til cooked', 
      isPrivate: false,
      userId: '1',
      recipeId: '1'
    };

    const res = await agent
      .post('/api/v1/notes')
      .send(note);

    expect(res.body).toEqual({
      id: expect.any(String),
      ...note
    });
  });

  it('should get all notes for a recipe by recipe id', async () => {
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
    await agent
      .post('/api/v1/recipes')
      .send(recipe);
  
    const note = {
      content: 'bake til cooked', 
      isPrivate: false,
      userId: '1',
      recipeId: '1'
    };
  
    await agent
      .post('/api/v1/notes')
      .send(note);

    const res = await agent
      .get('/api/v1/notes');

    expect(res.body).toEqual([{
      id: expect.any(String),
      ...note
    }]);


  });

});
