const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {type: String, unique: true},
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    createdDate: {type: Date, default: Date.now}
});

const user = mongoose.model('userCollection', userSchema);
mongoose.connect('mongodb://localhost/userManagement', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('db connected');
});
let direction = 1;

app.get('/', (req, res) => {
    user.find({}, (err, data) => {
        if (err) return console.log('oops');
        if (data.length) {

        }
        res.render('index', {userList:data});

    })
});

app.get('/search/:string', (req, res) => {
    // user.find({$or:[ {'first_name': req.params.string}, {'last_name':req.params.string}, {'age ':req.params.string} ]}, (err, data) => {
    //     if (err) return console.log('oops');
    //     if (data.length) {
    //
    //     }
    //     res.render('index', {userList:data});
    //     console.log(data);
    //
    // })
    console.log(user.where('first_name').$regex(/^test/));
});


app.get('/user/:name', (req, res) => {
    let userName = req.params.name;
    console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
    user.findOne({ name: userName }, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name : ${userName} role : ${data.role}`;
        console.log(returnMsg);
        res.send(returnMsg);
    });
});

app.get('/edit/:name', (req, res) => {
    let userName = req.params.name;
    console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
    user.findOne({ username: userName }, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name : ${userName} role : ${data.role}`;
        console.log(returnMsg);
        res.render('edit', {user: data});
    });
});

app.post('/edit/:name', (req, res) => {
    let userName = req.params.name;
    console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
    const newUser = new user();
    newUser.username = req.body.username;
    newUser.first_name = req.body.first;
    newUser.last_name = req.body.last;
    newUser.email = req.body.email;
    newUser.age = req.body.age;
    user.updateOne({username : req.body.username},
        {
            username: req.body.username,
            first_name: req.body.first,
            last_name: req.body.last,
            email: req.body.email,
            age: req.body.age,
        }, {new: true}, (err, data) => {
        if(err) {
            res.send('Duplicate User iD already exists!');
            return console.log(err);

        }
        console.log(`new user save: ${data}`);
        res.redirect('/');
    });
});

app.get('/adduser', (req, res) => {
    res.render('adduser');
});

app.get('/delete/:user', (req, res) => {
    let username = req.params.username;
    user.remove({ username: req.params.user }, function(err) {
        if (!err) {
            res.redirect('/');
        }
        else {
            res.send('error');
        }
    });
});

app.post('/newUser', (req, res) => {
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    const newUser = new user();
    newUser.username = req.body.username;
    newUser.first_name = req.body.first;
    newUser.last_name = req.body.last;
    newUser.email = req.body.email;
    newUser.age = req.body.age;
    newUser.save((err, data) => {
        if(err) {
            res.send('Duplicate User iD already exists!');
            return console.log(err);

        }
        console.log(`new user save: ${data}`);
        res.redirect('/');
    });
});

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log('App Server listening on port: 8080');
});

