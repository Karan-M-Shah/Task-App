const express = require('express');
//Doesn't grab anything from the file, but runs it
//to ensure that we connect to the database
require('./db/mongoose'); 
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

//PURPOSE OF MIDDLEWARE

//Without middleware: new request -> run route handler
//With middlewar: new request -> do something -> run route handler
//Do something is a function, such as checking logs or auth tokens

//App.use is for middlewares (it will apply to all GETs, POSTs etc)
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
