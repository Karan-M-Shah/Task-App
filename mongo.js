//Destructuring shorthand
const { MongoClient, ObjectId } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error) {
        return console.log('Unable to connect');
    }
    //Returns a database reference with the given name
    const db = client.db(databaseName); 

    db.collection('users').deleteOne({
        name: 'test'
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
});


 //Mongo is NOSQL (uses collections, not tables)
    // db.collection('users').insertOne({
    //     name: 'Ricky',
    //     age: '25'
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert');
    //     }
    //     console.log(result.ops);
    // });

    // db.collection('users').insertMany([
    //     {
    //         name: 'carl',
    //         age: 11
    //     }, 
    //     {
    //         name: 'test',
    //         age: 1
    //     }
    // ], (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert');
    //     }
    //     console.log(result.ops);
    // });

    // db.collection('users').findOne({name: 'teste'}, (error, user) => {
    //     if(error || user == null)
    //         return console.log('Unable to find');
    //     console.log(user);
    // });

    //Returns a cursor which can be converted into an array or aggregated
    // db.collection('users').find({age: '25'}).toArray((error, users) => {
    //     console.log(users);
    // });

    // db.collection('tasks').findOne({_id: new ObjectId("5de52500badfb40978b605eb")}, (error, task) => {
    //     if(error || task == null)
    //         console.log('Unable to find');
    //     console.log(task);
    // });

    // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
    //     console.log(tasks);
    // });

    // db.collection('users').updateOne({ age: '22' }, {
    //     $set: {
    //         name: 'Kar'
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });