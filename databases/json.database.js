'use strict'

const fs = require('fs');
const path = require('path');

const fileName = path.join(__dirname, './todos.json');

let jsonData = {
    todos: []
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            try {
                jsonData = JSON.parse(data);
                console.log('The JSON database was succesfully loaded...');
                resolve();
            } catch (err) {
                reject(new Error('There was a problem loading the JSON database'));
            }
        });
    });
}

function persistTodos() {
    return new Promise((resolve, reject) => {
        let data = JSON.stringify(jsonData)
        fs.writeFile(fileName, data, 'utf-8', (err) => {
            if (err) {
                reject(new Error('could not persist the database'));
            } else {
                resolve();
            }
        });

    });
}

function getTodos() {
    return Promise.resolve(jsonData.todos);
}

function addTodo(todo) {
    if (jsonData.todos.filter(t => t.id === todo.id).length !== 0) {
        return Promise.reject(new Error(`A todo with id ${todo.id} exists already`));
    }
    jsonData.todos.push(todo);
    return persistTodos();
}

function updateTodo(todo) {
    let todos = jsonData.todos.filter(t => t.id === todo.id);
    if (todos.length < 1) {
        return Promise.reject(new Error(`A todo with id ${todo.id} does not exist`));
    }
    todos[0].text = todo.text;
    todos[0].done = todo.done;
    return persistTodos();

}
function deleteTodo(id) {
    jsonData.todos = jsonData.todos.filter(t => t.id !== id);
    return persistTodos();
}

function deleteAllTodos() {
    jsonData.todos = [];
    return persistTodos();
}

module.exports = {
    openDatabase: openDatabase,
    getTodos: getTodos,
    addTodo: addTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo,
    deleteAllTodos: deleteAllTodos
}