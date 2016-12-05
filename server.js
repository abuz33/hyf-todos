'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const port = 8080;

let dbtype = process.argv[2] || 'mongo';
let database;

switch (dbtype) {

    case 'mongo':
        database = require('./databases/mongo.database');
        break;

    case 'mysql':
        database = require('./databases/mysql.database');
        break;

    case 'json':
        database = require('./databases/json.database');
        break;

    default:
        console.error('unknown database type: ' + dbtype);
        process.exit(1);
}

// Try and open the database, exit on failure
database.openDatabase()
    .catch((err) => {
        console.log(err);
        process.exit();
    });

// Create a new application
const app = express();

// Use body parser middleware
app.use(bodyParser.json())

//////// Routes

app.get('/', sendIndexHtml);
app.get('/todo', getTodos);
app.post('/todo', addTodo);
app.delete('/todo/:id', deleteTodo);
app.put('/todo', updateTodo);
app.delete('/todo', deleteAllTodos);
app.use(express.static(__dirname));

// Start the server
app.listen(port, (err) => {
    if (err) {
        console.log('could no start server: ', err);
        process.exit();
    }
    console.log('server listening at port ' + port);
});

//////// Request handlers

function sendIndexHtml(req, res) {
    res.sendFile('./index.html', {root: __dirname});
}

function getTodos(req, res) {
    database.getTodos()
        .then(todos => {
            res.json({todos: todos});
        })
        .catch(err => {
            res.status(400).json(err);
        });
}

function addTodo(req, res) {
    let todo = req.body;
    if (!todo.text) {
        res.status(400).send('no text specified');
    } else {
        database.addTodo(todo)
            .then(() => {
                console.log('todo added')
                res.sendStatus(200);
            })
            .catch(err => res.status(400).send(err.message));
    }
}

function deleteTodo(req, res) {
    let id = parseInt(req.params.id, 10);
    if (!id) {
        res.status(400).send('invalid id: ' + req.params.id);
        return;
    }

    database.deleteTodo(id)
        .then(() => {
            console.log('todo deleted')
            res.sendStatus(200);
        })
        .catch(err => res.status(400).send(err.message));
}

function updateTodo(req, res) {
    let todo = req.body;
    if (!todo.text) {
        res.status(400).send('no text specified');
    } else {
        database.updateTodo(todo)
            .then(() => {
                console.log('todo updated')
                res.sendStatus(200);
            })
            .catch(err => res.status(400).send(err.message));
    }
}

function deleteAllTodos(req, res) {
    database.deleteAllTodos()
        .then(() => {
            console.log('all todos deleted')
            res.sendStatus(200);
        })
        .catch(err => res.status(400).send(err.message));
}
