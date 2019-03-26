var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description : 'Comprar leite',
    completed: false
}, {
    id: 2,
    description: 'Ir pro jogo do Sport',
    completed: false
}, {
    id: 3,
    description: 'Terminar curso de Node',
    completed: true
}];

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

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT)
});