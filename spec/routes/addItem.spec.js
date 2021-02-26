const db = require('../../src/persistence');
const addItem = require('../../src/routes/addItem');
const ITEM = { id: 12345 };
const uuid = require('uuid').v4;

jest.mock('uuid');

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
    storeItem: jest.fn(),
    getItem: jest.fn(),
}));

test('shouldStoreItemCorrectly', async () => {
    const id = 'something-not-a-uuid';
    const name = 'A sample item';
    const req = { body: { name } };
    const res = { send: jest.fn() };

    uuid.mockReturnValue(id);
    await addItem(req, res);

    const expectedItem = { id, name, completed: false };
    // The function was called exactly once
    expect(db.storeItem.mock.calls.length).toBe(1);
    console.log('db', db.storeItem.mock.calls);
    // The first arg of the first call to the function was expect item
    expect(db.storeItem.mock.calls[0][0]).toEqual(expectedItem);
    expect(res.send.mock.calls[0].length).toBe(1);
    console.log('response', res.send.mock.calls);
    expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
});
