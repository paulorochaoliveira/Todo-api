var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNext = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API root');
});

// GET /todos?completed=true&q=work
app.get('/todos', function (req, res) {
    var queryParams = req.query;
    var where = {};
    const Op = db.Sequelize.Op;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        where.completed = true;
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        where.completed = false;
    }
        
    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
        where.description = {
            [Op.like] : '%'+ queryParams.q + '%'
        };
    }
    db.todo.findAll({ where : where})
        .then(function(todos) {
            res.json(todos);
    }, function(e) {
        res.status(500).json(e);
    });

    // var filterTodos = todos;
    // var filterCompleted = [];
    
    // if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    //     filterTodos = _.where(filterTodos, {completed: true});
    // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    //     filterTodos = _.where(filterTodos, {completed: false});
    // }
    
    // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
    //     filterTodos = _.filter(filterTodos, function(todo){ 
    //         return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1; 
    //     });
    // }
    // if (filterTodos.length === 0) {
    //     return res.status(404).send();
    // } 
    // res.json(filterTodos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    
    db.todo.findByPk(todoId).then(function (todo) {
        if(todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).json({"error":"No todo found with that id"});
        }
    }, function (e) {
        res.status(500).send();
    });
//    var todoItem = _.findWhere(todos, {id: todoId});
//    todos.forEach(function(todo) {
//        if (todo.id === todoId){
//            todoItem = todo;
//        }
//    });
//    res.send(typeof todoItem)
//    if (todoItem){
//        res.json(todoItem);
//    } else {
//        res.status(404).send();
//    }
});

//POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    db.todo.create(body).then(function(todo) {
        res.json(todo);
    }, function(){
        res.status(400).send();
    });
    
//    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
//        return res.status(400).send();
//    }
//    
//    body.description = body.description.trim();
//    
//    body.id = todoNext++;
//    
//    todos.push(body);
//    
//    res.json(todos);
});


//DELETE /todos/:id
app.delete('/todos/:id', function (req, res){
    var todoId = parseInt(req.params.id, 10);
    var todoItem = _.findWhere(todos, {id: todoId});
    
    if (!todoItem) {
        res.status(404).json({"error":"no todo found with that id"})
    } else {
        todos = _.without(todos, todoItem);
        res.json(todoItem);
    }   
});


//PUT /todos/:id
app.put('/todos/:id', function (req,res) {
    
    var todoId = parseInt(req.params.id, 10);
    var todoItem = _.findWhere(todos, {id: todoId});
    
    if (!todoItem){
        return res.status(404).json({"error":"Id not found"})
    }
    
    var body = _.pick(req.body, 'description', 'completed');
    var valideProperties = {};
    
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        valideProperties.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }
    
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        valideProperties.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }
    
    _.extend(todoItem, valideProperties);
    
    res.json(todoItem);
    
})

db.sequelize.sync().then(function() {
    app.listen(PORT, function () {
        console.log('Express listening on port ' + PORT)
    });
});












































