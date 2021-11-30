const db = require('../persistence');

module.exports = async (req, res) => {
    const { id } = req.params;
    const item = await db.getItem(id);
    res.send(item);
};
