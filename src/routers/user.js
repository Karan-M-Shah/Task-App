const express = require('express');
const User = require('../models/user')
const router = new express.Router();
const auth = require('../middleware/auth');

//Signing up
router.post('/users', async (req,res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
});

//Logging in
router.post('/users/login', async(req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
    
        res.send({ user, token });
    } catch(e) {
        res.status(400).send();
    }
});

//Logging out
router.post('/users/logout', auth, async(req,res) => {
    //Remove the token from the user's array of tokens
    try {
        //Use the filter method to return any token EXCEPT
        //for the currently used token (which is to be removed)
        req.user.tokens = req.user.tokens.filter(index => {
            return index.token !== req.token;
        });
        
        //To save the changes to the database
        await req.user.save();
        res.send(); //default status of 200
    } catch(e) {
        res.status(500).send();
    }
});

//Logging out of ALL SESSIONS
router.post('/users/logoutAll', auth, async(req,res) => {
    try {
        //Set the tokens array to empty
        req.user.tokens = [];

        //To save the changes to the database
        await req.user.save();
        res.send(); //default status of 200
    } catch(e) {
        res.status(500).send();
    }
});

//GET your profile (once authenticated)
//authentication middleware is called before this route handler
//this means that this route will only run IF the user
//has been properly authenticated
router.get('/users/me', auth, async (req,res) => {
    res.send(req.user);
});

//UPDATE AN EXISTING USER
router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    //every checks whether every element in an array satisfies
    //some requirement. If not, it will return false
    const isValid = updates.every((update) => {
        //Checks whether the allowed commands include the current command
        return allowedUpdates.includes(update);
    });

    if(!isValid)
        return res.status(400).send({error: 'Invalid updates!'});

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });

        await req.user.save();
        res.send(req.user);
    } catch(e) { //Error could be a DB issue or validation issue
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async (req,res) => {
    try {
        //remove is a mongoose function like 'save'
        await req.user.remove();
        res.send(user);
    } catch(e) {
        res.status(500).send(e);
    }
});

module.exports = router;