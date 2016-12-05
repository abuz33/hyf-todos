'use strict';
const mysql = require('mysql');

let databaseOpened = false;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    database: 'todos'
});

function connectToDatabase() {
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) {
                console.log('Could not connect to MySQL database...');
                reject(err);
            } else {
                console.log('Connected to MySQL database...');
                databaseOpened = true;
                resolve();
            }
        })
    })
}

function createTables() {
    return new Promise((resolve, reject) => {
        const sql =
            `CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY,
                text VARCHAR(255),
                done TINYINT
            )`;
        connection.query(sql, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function openDatabase() {
    return connectToDatabase()
        .then(() => createTables());
}

function execQuery(sql, args) {
    return new Promise((resolve, reject) => {
        args = args || [];
        connection.query(sql, args, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

}
function getTodos() {
    return execQuery('SELECT id, text, done FROM todos');
}

function addTodo(todo) {
    return execQuery('INSERT INTO todos (id, text, done) VALUES(?,?,?)', [todo.id, todo.text, todo.done]);
}

function updateTodo(todo) {
    return execQuery('UPDATE todos SET text=?, done=? WHERE id=?', [todo.text, todo.done, todo.id]);
}

function deleteTodo(id) {
    return execQuery('DELETE FROM todos WHERE id=?', [id]);
}

function deleteAllTodos(id) {
    return execQuery('DELETE FROM todos', [id]);
}

module.exports = {
    openDatabase: openDatabase,
    getTodos: getTodos,
    addTodo: addTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo,
    deleteAllTodos: deleteAllTodos
}