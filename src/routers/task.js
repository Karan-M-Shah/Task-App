const express = require('express');
const Task = require('../models/task')
const auth = require('../middleware/auth');
const router = new express.Router();

//Creating a new task
router.post('/tasks', auth, async (req,res) => {
    const task = new Task({
        ...req.body, //operator to copy all of req.body data into the object
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

//List all your tasks
router.get('/tasks', auth, async (req,res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.send(tasks);
    } catch(e) {
        res.status(500).send();
    }
});

//Get a specific task
router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;

    try {
        //Can only get a task if you're logged in 
        //and the task is one which you have created
        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task)
            return res.status(404).send();
        res.send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every(update => {
        return allowedUpdates.includes(update);
    });

    if(!isValid)
        return res.status(400).send({error: 'Invalid updates!'});

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if(!task)
            return res.status(404).send();
        
        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await task.save();
        return res.send(task);
    } catch(e) {
        return res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req,res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id});

        if(!task)
            return res.status(404).send();
        res.send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

module.exports = router;