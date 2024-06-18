const server = require('../src/index');
const supertest = require('supertest');
const request = supertest(server);
const db = require('../src/persistence');

afterAll(async () => {
    await db.teardown();
    server.close(() => {});
});

test('shouldGetItems ', async () => {
    const response = await request.get('/items');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([]));
});

test('shouldAddNewItem ', async () => {
    const todo = { name: 'test', completed: false };
    const response = await request
        .post('/items')
        .send(todo)
        .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', todo.name);
    expect(response.body).toHaveProperty('completed', todo.completed);
});

test('shouldUpdateItem ', async () => {
    const todo = { name: 'test', completed: false };
    const { body: newItem } = await request
        .post('/items')
        .send(todo)
        .set('Accept', 'application/json');

    const response = await request
        .put(`/items/${newItem.id}`)
        .send({ ...newItem, completed: !newItem.completed })
        .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', newItem.name);
    expect(response.body).toHaveProperty('completed', !newItem.completed);
});

test('shouldDeleteItem ', async () => {
    const todo = { name: 'test', completed: false };
    const { body: newItem } = await request
        .post('/items')
        .send(todo)
        .set('Accept', 'application/json');

    const response = await request.delete(`/items/${newItem.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([]));
});
