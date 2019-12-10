const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        //checks if the provided token is valid and unexpired
        //compares it with the secret strign we provided when
        //generating tokens from the server
        const decoded = jwt.verify(token, 'thisismythepayload');

        //once it has been verified, we can find the user from the db
        //the following command finds a user in the DB who has the 
        //correct userid and also the authentication token stored
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        
        if(!user) {
            throw new Error();
        }

        //If we need to delete a specific token used by a user
        //For exaple, if they are logged onto multiple devices
        //And logout of one device, it will not log them
        //out of every single device
        req.token = token;
        req.user = user;
        next(); //transitions to the route handler
    } catch (e) {
        res.status(401).send({error: 'Failed to authenticate'});
    }
}

module.exports = auth;