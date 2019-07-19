require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authCtrl = require('./controllers/authController');
const treausreCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());

const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('db connected');
});

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET,
    })
);

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treausreCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treausreCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treausreCtrl.addUserTreasure);

app.listen(SERVER_PORT, () => {
    console.log(`I assure you, this battle station is fully operational! ✴ ${SERVER_PORT}`)
})