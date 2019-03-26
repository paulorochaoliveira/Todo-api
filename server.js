var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNext = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API root');
});

// GET /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
//    res.send(typeof todoId);
    var todoItem;
    todos.forEach(function(todo) {
        if (todo.id === todoId){
            todoItem = todo;
        }
    });
//    res.send(typeof todoItem)
    if (todoItem){
        res.json(todoItem);
    } else {
        res.status(404).send();
    }
});

//POST /todos
app.post('/todos', function (req, res) {
    var body = req.body;
    body.id = todoNext++;
    
    todos.push(body);
    
    res.json(todos);
})


app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT)
});