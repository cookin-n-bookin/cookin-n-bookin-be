const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Note = require('../lib/models/Note');


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

  it('Should update a note by the id', async () => {
    const newUser = {
      username: 'dobby3',
      password: 'chicken',
    };

    const agent = request.agent(app);
    await agent
      .post('/api/v1/users/signup')
      .send(newUser);

    request.agent(app);
    const recipe = {
      title: 'Hot Dog',
      bookId: '1',
      pageNumber: '40',
      ingredients: ['buns', 'hotdog', 'mustard', 'jalapenos'],
      rating: 5,
      imageId: 'this is a hotdog'
    };

    await agent
      .post('/api/v1/recipes')
      .send(recipe);

    const note = await agent
      .post('/api/v1/notes')
      .send({
        content: 'Cook until frozen',
        isPrivate: false,
        userId: '1',
        recipeId: '1'
      });

    const res = await agent
      .patch(`/api/v1/notes/${note.body.id}`)
      .send({ content: 'Cook until hot' });

    const expected = {
      id: expect.any(String),
      content: 'Cook until hot',
      isPrivate: false,
      userId: '1',
      recipeId: '1'
    };

    expect(res.body).toEqual(expected);
  })

  it('Should be able to delete a note', async () => {
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

    const note = await agent
      .post('/api/v1/notes')
      .send({
        content: 'This book is about billiards!!!!!',
        isPrivate: false,
        userId: '1',
        recipeId: '1'
      });


    const getAllNotes = await Note.getAll();

    const res = await agent
      .delete(`/api/v1/notes/${note.id}`)
  });

  expect(res.body).toEqual({
    id: expect.any(String),
    content: 'This book is about billiards!!!!!',
    isPrivate: false,
    userId: '1',
    recipeId: '1'
  });
  const getAllNotes2 = await Note.getAll();
  expect(getAllNotes2.length).toEqual(getAllNotes.length - 1);

});
