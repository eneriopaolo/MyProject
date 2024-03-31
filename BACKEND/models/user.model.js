const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// User Schema Model:
const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail]
    },
    username: {
        type: String,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    friends: [mongoose.SchemaType.ObjectId],
    profile: {
        bio: {
            type: String
        },
        birthdate: {
            type: Date
        }
    }
});

// Hashing of Password Prior to Creation in DB:
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Validation of User Credentials for Login:
userSchema.statics.login = async function(username, password) {
    if (isEmail(username)) {
        const user = await this.findOne({email});
    } else {
        const user = await this.findOne({username});
    };
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user;
        } throw Error('Incorrect Password.')
    } throw Error('Incorrect Email or Username.')
};

// Function for searching particular users by name:
userSchema.statics.findByName = function(name) {
    return this.find({name: new RegExp(name, "i")});
};

const UserSchema = mongoose.model('User', userSchema);
module.exports = UserSchema;