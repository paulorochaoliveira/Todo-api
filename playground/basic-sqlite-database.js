var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect' : 'sqlite',
    'storage' : __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description : {
        type : Sequelize.STRING, 
        allowNull : false,
        validate : {
            len : [1, 250]
        }
    }, 
    completed : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
    }
})

sequelize.sync().then(function () {
    console.log('Everything is synced');
    
    Todo.create({
        description : 'Comprar o pao',
    }).then(function(todo) {
        console.log(todo.toJSON());
        console.log('Finished');
    })
    .catch(function (e) {
        console.log(e);
    });
});