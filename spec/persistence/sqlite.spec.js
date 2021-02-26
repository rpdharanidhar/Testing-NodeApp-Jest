const db = require('../../src/persistence/sqlite');
const fs = require('fs');

const ITEM = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test',
    completed: false,
};

beforeEach(async () => {
    if (fs.existsSync('./../../todos/todo.db')) {
        fs.unlinkSync('./../../todos/todo.db');
    }
    await db.init();
});

afterEach(async () => {
    await db.teardown();
});

test('whenInitializeDB_ThenSuccesfull', async () => {
    await db.init();
});

test('givenAnItem_WhenSaveOnDB_ThenRetriveItems', async () => {
    await db.storeItem(ITEM);
    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(ITEM);
});

test('givenAnItem_WhenUpdateItem_ThenItemCompleted', async () => {
    const initialItems = await db.getItems();
    expect(initialItems.length).toBe(0);

    await db.storeItem(ITEM);
    await db.updateItem(ITEM.id, { ...ITEM, completed: !ITEM.completed });

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0].completed).toBe(!ITEM.completed);
});

test('givenAnItemId_WhenDeleteItem_ThenNoItems', async () => {
    await db.storeItem(ITEM);
    await db.removeItem(ITEM.id);
    const items = await db.getItems();
    expect(items.length).toBe(0);
});
