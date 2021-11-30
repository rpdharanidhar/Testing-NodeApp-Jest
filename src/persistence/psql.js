const waitPort = require('wait-port');
const fs = require('fs');
const { Pool } = require('pg');

const {
    PSQL_HOST: HOST,
    POSTGRES_USER: USER,
    POSTGRES_PASSWORD: PASSWORD,
    POSTGRES_DB: DB,
} = process.env;

let pool;

async function init() {
    const host = HOST;
    const user = USER;
    const password = PASSWORD;
    const database = DB;
    await waitPort({ host, port: 5432 });

    pool = new Pool({
        host,
        user,
        max: 20,
        password,
        database,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    return new Promise((resolve, reject) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
            (err, res) => {
                if (err) return reject(err);
                console.log(`Connected to PSQL db at host ${HOST}`);
                resolve(res);
            },
        );
    });
}

async function teardown() {
    return new Promise((resolve, reject) => {
        pool.end((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function getItems() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM todo_items', (err, res) => {
            if (err) return reject(err);
            resolve(res.rows);
        });
    });
}

async function getItem(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM todo_items WHERE id=$1', [id], (err, res) => {
            if (err) return reject(err);
            resolve(res.rows[0]);
        });
    });
}

async function storeItem(item) {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO todo_items (id, name, completed) VALUES ($1, $2, $3)',
            [item.id, item.name, item.completed],
            (err) => {
                if (err) return reject(err);
                resolve();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE todo_items SET name=$1, completed=$2 WHERE id=$3',
            [item.name, item.completed, id],
            (err) => {
                if (err) return reject(err);
                resolve();
            },
        );
    });
}

async function removeItem(id) {
    return new Promise((resolve, rej) => {
        pool.query('DELETE FROM todo_items WHERE id = $1', [id], (err) => {
            if (err) return rej(err);
            resolve();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
