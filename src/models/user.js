const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({ 
    name: {
    type: String,
    required: true,
    trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: function(value) {
            if (!validator.isEmail(value)) 
                throw new Error('Email is invalid');
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: function (value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word "password"');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate: function(value) {
            if(value < 0)
                throw new Error('Age must be a positive number');
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

//A way to link two related models
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

//This method is automatically called when returning JSON data
//This will remove certain properties that we do not want included
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

//method functions are accessible on the instances
//rather than the model itself
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismythepayload');

    user.tokens = user.tokens.concat({ token: token });
    await user.save();
    return token;
};

//statics means that this function can be accessed
//directly on the model (User.findByCredentials)
//this method finds the user by the provided email and 
//compares the provided password to login or not
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });

    if(!user) 
        throw new Error('Unable to login');
    
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
        throw new Error('Unable to login');

    return user;
}

//Mongoose middleware allows us to perform functions
//before or after a certain event. The code below
//executes a function BEFORE the save event
//We use standard function terminology because arrow
//functions don't use the 'this' binding properly

//Hashes plaintext password before saving it
userSchema.pre('save', async function (next) {
    const user = this; //this is equal to the user about to be saved

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    //next is used to end the process and save the user
    next();
});

//Delete user tasks when a user is removed
userSchema.pre('remove', async function(next) {
    const user = this;

    await Task.deleteMany({ owner: user._id });
    next();
});

//passing object in as the second argument
//mongoose converts the object into a schema
//we make the schema beforehand so we can apply middleware
//such as hashing
const User = mongoose.model('User', userSchema);

module.exports = User;