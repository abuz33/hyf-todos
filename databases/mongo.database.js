'use strict';
const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017/todos';

let collection;

function openDatabase() {
    return mongo.connect(mongoUrl)
        .then(db => {
            collection = db.collection('todos');
            console.log('Connected to Mongo database...');
        })
        .catch(err => {
            console.log('Could not connect to Mongo database');
            throw err;
        });
}

function getTodos() {
    return collection.find().toArray();
}

function addTodo(todo) {
    return collection.find({id: todo.id}).toArray()
        .then(docs => {
            if (docs.length !== 0) {
                throw new Error(`A todo with id ${todo.id} exists already`);
            }
            return collection.insertOne(todo);
        });
}

function updateTodo(todo) {
    return collection.updateOne({
        id: todo.id
    }, {
        $set: {
            text: todo.text,
            done: todo.done
        }
    });
}

function deleteTodo(id) {
    return collection.deleteMany({id: id});
}

function deleteAllTodos() {
    return collection.deleteMany({});
}

module.exports = {
    openDatabase: openDatabase,
    getTodos: getTodos,
    addTodo: addTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo,
    deleteAllTodos: deleteAllTodos
};
