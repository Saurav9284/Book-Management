const express = require('express');
const UserModel = require('../Models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../Config/db');

const UserController = express.Router();

// Signup

UserController.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ msg: 'All fields required!' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).send({ msg: 'Invalid email format!' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).send({ msg: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
    }
    try {
        const exist = await UserModel.findOne({ email });
        if (exist) {
            return res.status(400).send({ msg: 'User already exists, please login!' });
        }
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                return res.status(500).send({ msg: 'Internal server error!' });
            }
            try {
                const user = await UserModel.create({
                    name: name,
                    email: email,
                    password: hash
                });
                console.log(user);
                res.send({ msg: 'Signup successful!' });
            } catch (error) {
                console.error(error);
                res.status(500).send({ msg: 'Internal server error!' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error!' });
    }
});


// Login

UserController.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ msg: 'All fields required!' });
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ msg: 'User not found, please signup first!' });
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                const token = jwt.sign({ userId: user._id }, JWT_SECRET);
                res.send({
                    msg: 'Login successful!',
                    token: token,
                    userData: {
                        name: user.name,
                        email: user.email
                    }
                });
            } else {
                res.status(400).send({ msg: 'Invalid credentials!' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error!' });
    }
});

// validate email function

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// validate password function

function isValidPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).{8,}$/;
    return passwordRegex.test(password);
}

module.exports = UserController;
