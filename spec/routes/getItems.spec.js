const db = require('../../src/persistence');
const getItems = require('../../src/routes/getItems');
const ITEMS = [{ id: 12345 }];

jest.mock('../../src/persistence', () => ({
    getItems: jest.fn(),
}));

test('shouldGetItemsCorrectly', async () => {
    const req = {};
    const res = { send: jest.fn() };
    db.getItems.mockResolvedValue(ITEMS);

    await getItems(req, res);

    expect(db.getItems.mock.calls.length).toBe(1);
    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send).toHaveBeenCalledWith(ITEMS);
});
