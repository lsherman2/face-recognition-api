const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl : { rejectUnauthorized: false },
        host : process.env.DATABASE_HOST,
        port : 5432,
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PW,
        database : process.env.DATABASE_DB
    }
});

const signIn = require('./controllers/signIn');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('success') });

app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, knex, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, knex) });

app.put('/image', (req, res) => { image.handleImage(req, res, knex) });

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(process.env.PORT || 3000, () => { console.log(`App is running on port ${process.env.PORT}`) });