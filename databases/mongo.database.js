'use strict';
const assert = require('assert');
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const mongoUrl = 'mongodb://localhost:27017/hyf-todos';

let linkCollection;
let todoCollection;
let userCollection;

function openDatabase() {
    return mongo.connect(mongoUrl)
        .then(db => {
            todoCollection = db.collection('todos');
            userCollection = db.collection('users');
            linkCollection = db.collection('links');
            console.log('Connected to Mongo database...');
        })
        .catch(err => {
            console.log('Could not connect to Mongo database');
            throw err;
        });
}

function getTodos() {
    return todoCollection.find().toArray();
}

function addTodo(todo) {
    return todoCollection.insertOne(todo);
}

function updateTodo(todo) {
    let todoObjectId = new ObjectID(todo._id);
    return todoCollection.findOneAndUpdate({_id: todoObjectId}, {$set: {text: todo.text, done: todo.done}});
}

function deleteTodo(id) {
    let todoObjectId = new ObjectID(id);
    return linkCollection.deleteMany({todo_id: todoObjectId})
        .then(() => {
            return todoCollection.deleteOne({_id: todoObjectId});
        });
}

function deleteAllTodos() {
    return linkCollection.deleteMany({})
        .then(() => {
            return todoCollection.deleteMany({});
        });
}

function getTodoById(id) {
    let todoObjectId = new ObjectID(id);
    return todoCollection.find({_id: todoObjectId}).toArray()
        .then(todos => {
            if (todos.length === 0) {
                throw new Error('no todo found with id ' + id);
            }
            let todo = todos[0];
            return linkCollection.find({todo_id: todoObjectId}).toArray()
                .then(links => {
                    todo.users = links.map(link => link.user_id);
                    return todo;
                });
        });
}

function getUsers() {
    return userCollection.find().toArray();
}

function addUser(user) {
    return userCollection.insertOne(user);
}

function updateUser(user) {
    let userObjectId = new ObjectID(user._id);
    return userCollection.findOneAndUpdate({_id: userObjectId}, {$set: {name: user.name}});
}

function deleteUser(id) {
    let userObjectId = new ObjectID(id);
    return linkCollection.deleteMany({user_id: userObjectId})
        .then(() => {
            return userCollection.deleteOne({_id: userObjectId});
        });
}

function getUserById(id) {
    let userObjectId = new ObjectID(id);
    return userCollection.find({_id: userObjectId}).toArray()
        .then(users => {
            if (users.length === 0) {
                throw new Error('no user found with id ' + id);
            }
            let user = users[0];
            return linkCollection.find({user_id: userObjectId}).toArray()
                .then(links => {
                    user.todos = links.map(link => link.todo_id);
                    return user;
                });
        });
}

function assignUserToTodo(userId, todoId) {
    let userObjectId = new ObjectID(userId);
    let todoObjectId = new ObjectID(todoId);
    return linkCollection.find({user_id: userObjectId, todo_id: todoObjectId}).toArray()
        .then(links => {
            if (links.length === 0) {
                return linkCollection.insertOne({user_id: userObjectId, todo_id: todoObjectId});
            }
        });
}

function unassignUserFromTodo(userId, todoId) {
    let userObjectId = new ObjectID(userId);
    let todoObjectId = new ObjectID(todoId);
    return linkCollection.deleteMany({user_id: userObjectId, todo_id: todoObjectId});
}

module.exports = {
    openDatabase: openDatabase,
    getTodos: getTodos,
    addTodo: addTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo,
    deleteAllTodos: deleteAllTodos,
    getTodoById: getTodoById,
    getUsers: getUsers,
    addUser: addUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUserById: getUserById,
    assignUserToTodo: assignUserToTodo,
    unassignUserFromTodo: unassignUserFromTodo
};
