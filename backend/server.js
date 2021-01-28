const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors')
const passport = require('passport')
const passportLocal = require('passport-local');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')
const session = require('express-session')
const bodyParser = require('body-parser')

const app = express();
const User = require('./user')

mongoose.connect("mongodb+srv://brandonaustin:5Lawsofgold!@parkingpal.pqajr.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("Mongoose Connected")
})

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}

app.use(
    cors(corsOptions)
);


app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser("secretcode"))

// Routes
app.post("/login", (req, res) => {
    console.log(req.body)
})

app.post("/register", (req, res) => {
    User.findOne({ username: req.body.username },
        async (err, doc) => {
            if (err) throw err;
            if (doc) res.send('User Already Exists')
            if (!doc) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                const newUser = new User({
                    username: req.body.username,
                    password: hashedPassword,
                });
                await newUser.save();
                res.send("User Created!")
            }
        })
})

app.get("/getUser", (req, res) => {
    console.log(req.body)
})


// Start Server
app.listen(4000, () => {
    console.log('SERVER RUNNING ON PORT 4000')
})