const db = require('../persistence');
const uuid = require('uuid');

module.exports = async (req, res) => {
    const item = {
        id: uuid.v4(),
        name: req.body.name,
        completed: false,
    };
    await db.storeItem(item);
    res.send(item);
};
