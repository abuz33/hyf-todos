'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const port = 8080;

let dbtype;
let password = null;

if (process.argv.length == 3 && process.argv[2] === 'mongo') {
    dbtype = 'mongo';
} else if (process.argv.length == 4 && process.argv[2] === 'mysql') {
    dbtype = 'mysql';
    password = process.argv[3];
} else {
    console.log('to run, type: node server.js [mongo | mysql <password>]');
    process.exit();
}

let database;

switch (dbtype) {
    case 'mongo':
        database = require('./databases/mongo.database');
        break;
    case 'mysql':
        database = require('./databases/mysql.database');
        break;
    default:
        console.error('unsupported database type: ' + dbtype);
        process.exit(1);
}

// Try and open the database, exit on failure
database.openDatabase(password)
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

app.get('/todo/:id', getTodoById);
app.get('/todo', getTodos);
app.post('/todo', addTodo);
app.put('/todo', updateTodo);
app.delete('/todo/:id', deleteTodo);
app.delete('/todo', deleteAllTodos);

app.get('/user/:id', getUserById);
app.put('/user/:id/:todo_id', assignTodoToUser);
app.delete('/user/:id/:todo_id', unassignTodoFromUser);
app.get('/user', getUsers);
app.post('/user', addUser);
app.put('/user', updateUser);
app.delete('/user/:id', deleteUser);

app.use(express.static(__dirname));

// Start the server

app.listen(port, (err) => {
    if (err) {
        console.log('could no start server: ', err);
        process.exit(1);
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

function getTodoById(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }

    database.getTodoById(req.params.id)
        .then(todo => {
            res.json(todo);
        })
        .catch(err => {
            res.status(400).json(err);
        });
}

function addTodo(req, res) {
    let todo = req.body;
    if (!todo.text) {
        res.status(400).send('no text specified');
        return;
    }

    database.addTodo(todo)
        .then(() => {
            console.log('todo added')
            res.sendStatus(200);
        })
        .catch(err => res.status(400).send(err.message));
}

function deleteTodo(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }

    database.deleteTodo(req.params.id)
        .then(() => {
            console.log(`todo with id ${req.params.id} deleted`)
            res.sendStatus(200);
        })
        .catch(err => res.status(400).send(err.message));
}

function updateTodo(req, res) {
    let todo = req.body;
    if (!todo.text) {
        res.status(400).send('no text specified');
        return;
    }

    database.updateTodo(todo)
        .then(() => {
            console.log('todo updated')
            res.sendStatus(200);
        })
        .catch(err => res.status(400).send(err.message));
}

function deleteAllTodos(req, res) {
    database.deleteAllTodos()
        .then(() => {
            console.log('all todos deleted')
            res.sendStatus(200);
        })
        .catch(err => res.status(400).send(err.message));
}

function getUsers(req, res) {
    database.getUsers()
        .then(users => {
            res.json({users: users});
        })
        .catch(err => {
            res.status(400).json(err);
        });
}

function getUserById(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }

    database.getUserById(req.params.id)
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            res.status(400).json(err);
        });
}

function addUser(req, res) {
    let user = req.body;
    if (!user.name) {
        res.status(400).send('no name specified');
        return;
    }

    database.addUser(user)
        .then(() => {
            console.log(`user ${user.name} added`);
            res.sendStatus(200);
        })
        .catch(err => res.status(400).send(err.message));
}

function deleteUser(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }

    database.deleteUser(req.params.id)
        .then(() => {
            console.log(`user with id ${req.params.id} deleted`);
            res.sendStatus(200);
        })
        .catch(err => res.status(400).send(err.message));
}

function updateUser(req, res) {
    let user = req.body;
    if (!user.name) {
        res.status(400).send('no name specified');
        return;
    }

    database.updateUser(user)
        .then(() => {
            console.log(`user ${user.name} updated`);
            res.sendStatus(200);
        })
        .catch(err => res.status(400).send(err.message));
}

function assignTodoToUser(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }
    if (!req.params.todo_id) {
        res.status(400).send('todo_id parameter is required');
        return;
    }

    database.assignUserToTodo(req.params.id, req.params.todo_id)
        .then(user => {
            console.log(`assigned user #${req.params.id} to todo #${req.params.todo_id}`);
            res.json(user);
        })
        .catch(err => {
            res.status(400).json(err);
        });
}

function unassignTodoFromUser(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }
    if (!req.params.todo_id) {
        res.status(400).send('todo_id parameter is required');
        return;
    }

    database.unassignUserFromTodo(req.params.id, req.params.todo_id)
        .then(user => {
            console.log(`unassigned user #${req.params.id} from todo #${req.params.todo_id}`);
            res.json(user);
        })
        .catch(err => {
            res.status(400).json(err);
        });
}