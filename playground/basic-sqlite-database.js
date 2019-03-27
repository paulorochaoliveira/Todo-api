var Sequelize = require('sequilize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect' : 'sqlite',
    'storage' : 'basic-sqlite-database.sqlite'
});

sequelize.sync().then(function () {
    console.log('Everything is synced');
})