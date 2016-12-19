'use strict';
const assert = require('assert');
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
let mongoUrl;

let linkCollection;
let todoCollection;
let userCollection;

function openDatabase(dbname) {
    mongoUrl = 'mongodb://localhost:27017/' + dbname;

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
    return todoCollection.insertOne(todo)
        .then(result => result.insertedId);
}

function updateTodo(id, todo) {
    return hexStringToObjectID(id)
        .then(objectID => {
            let todoFilter = {_id: objectID};
            let todoUpdate = {$set: {text: todo.text, done: todo.done}};
            return todoCollection.findOneAndUpdate(todoFilter, todoUpdate);
        });
}

function deleteTodo(id) {
    return hexStringToObjectID(id)
        .then(objectID => {
            let todoFilter = {todo_id: objectID};
            return linkCollection.deleteMany(todoFilter)
                .then(() => todoCollection.deleteOne(todoFilter));
        });
}

function deleteAllTodos() {
    return linkCollection.deleteMany({})
        .then(() => todoCollection.deleteMany({}));
}

function getTodoById(id) {
    return hexStringToObjectID(id)
        .then(objectID => {
            let todoFilter = {_id: objectID};
            return todoCollection.find(todoFilter).toArray()
                .then(todos => {
                    if (todos.length === 0) {
                        throw new Error('no todo found with id ' + id);
                    }
                    let todo = todos[0];
                    let linkFilter = {todo_id: objectID};
                    return linkCollection.find(linkFilter).toArray()
                        .then(links => {
                            todo.assignedUsers = links.map(link => link.user_id);
                            return todo;
                        });
                });
        });
}

function getUsers() {
    return userCollection.find().toArray();
}

function addUser(user) {
    return userCollection.insertOne(user)
        .then(result => result.insertedId);
}

function updateUser(id, user) {
    return hexStringToObjectID(id)
        .then(objectID => {
            let userFilter = {_id: objectID};
            let userUpdate = {$set: {name: user.name}};
            return userCollection.findOneAndUpdate(userFilter, userUpdate);
        });
}

function deleteUser(id) {
    return hexStringToObjectID(id)
        .then(objectID => {
            let userFilter = {user_id: objectID};
            return linkCollection.deleteMany(userFilter)
                .then(() => userCollection.deleteOne(userFilter));
        });
}

function deleteAllUsers() {
    return linkCollection.deleteMany({})
        .then(() => userCollection.deleteMany({}));
}

function getUserById(id) {
    return hexStringToObjectID(id)
        .then(objectID => {
            let userFilter = {_id: objectID};
            return userCollection.find(userFilter).toArray()
                .then(users => {
                    if (users.length === 0) {
                        throw new Error('no user found with id ' + id);
                    }
                    let user = users[0];
                    let linkFilter = {user_id: objectID};
                    return linkCollection.find(linkFilter).toArray()
                        .then(links => {
                            user.assignedTodos = links.map(link => link.todo_id);
                            return user;
                        });
                })
        });
}

function assignUserToTodo(userId, todoId) {
    return hexStringToObjectID(userId)
        .then(userObjectID => {
            return hexStringToObjectID(todoId)
                .then(todoObjectID => {
                    let linkFilter = {user_id: userObjectID, todo_id: todoObjectID};
                    return linkCollection.find(linkFilter).toArray()
                        .then(links => {
                            if (links.length === 0) {
                                let linkDoc = {user_id: userObjectID, todo_id: todoObjectID};
                                return linkCollection.insertOne(linkDoc);
                            }
                        });
                });
        });
}

function unassignUserFromTodo(userId, todoId) {
    return hexStringToObjectID(userId)
        .then(userObjectID => {
            return hexStringToObjectID(todoId)
                .then(todoObjectID => {
                    let linkFilter = {user_id: userObjectID, todo_id: todoObjectID};
                    return linkCollection.deleteMany(linkFilter);
                });
        });
}

function hexStringToObjectID(hexString) {
    return new Promise((resolve, reject) => {
        try {
            resolve(new ObjectID(hexString));
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    openDatabase,
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    deleteAllTodos,
    getTodoById,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
    getUserById,
    assignUserToTodo,
    unassignUserFromTodo
};
