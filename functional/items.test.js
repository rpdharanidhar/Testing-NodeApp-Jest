// const server = require('../src/index');
// const supertest = require('supertest');
// const request = supertest(server);
// const db = require('../src/persistence');

// afterEach(async () => {
//     await db.teardown();
//     server.close(() => {});
// });

// test('should ', async () => {
//     const response = await request.get('/items');
//     expect(response.status).toBe(200);
// });

// test('should ', async () => {
//     const todo = { name: 'test', completed: false };
//     const response = await request
//         .post('/items')
//         .send(todo)
//         .set('Accept', 'application/json');

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('name', todo.name);
//     expect(response.body).toHaveProperty('completed', todo.completed);
// });
