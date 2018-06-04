import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bodyParser from 'body-parser';

import * as dbTools from './app/DatabaseToolkit';

const port = 4000;
const salt = 'uewqfjh27849hdibjeqwf8ygqbo23';

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json() );

app.use(cors({ 
    origin: '*',
    allowedHeaders: ['origin', 'content-type', 'authorization'],
    optionsSuccessStatus: 200,
  }));

dbTools.ConnectToDB();

/*

Dev'n'test Zone

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/set', function (req, res) {
    dbTools.SetSession(crypto).then( data => res.send(data));
});

app.get('/clean', function (req, res) {
    dbTools.ClearOldSessions().then( data => res.send('cleaning...'));
});
*/

//Protected Zone

app.get('/check', function (req, res){

    /*
    const hash = crypto.createHmac('sha256', salt)
    .update(req.get('authorization'))
    .digest('hex');
    */ 
    
    //dbTools.CheckPassword(hash).then(data => res.send(data));
    dbTools.CheckSession(req.get('authorization')).then(data => res.send(data));

});

app.get('/login', function (req, res){

    const hash = crypto.createHmac('sha256', salt)
    .update(req.get('authorization'))
    .digest('hex');
    
    dbTools.CheckPassword(hash).then(data => {
        if (data) dbTools.SetSession(crypto).then( data2 => res.send(data2));
        else res.send('no');
    });

})

app.post('/edit', function (req,res){

    dbTools.CheckSession(req.get('authorization')).then(data => {
        if (data) dbTools.EditPost(req.body.id, req.body.title, req.body.post, req.body.header, req.body.category).then( () => res.send('ok'));
        else res.send('no');
    });
});

app.post('/new', function (req,res){


    dbTools.CheckSession(req.get('authorization')).then(data => {
        if (data) dbTools.NewPost(req.body.title, req.body.post, req.body.header, req.body.category).then( () => res.send('ok'));
        else res.send('no');
    });
});

app.post('/delete', function (req,res){

    dbTools.CheckSession(req.get('authorization')).then(data => {
        if (data) dbTools.DeletePost(req.body.id).then( () => res.send('ok'));
        else res.send('no');
    });
});



//FFA Zone

app.post('/getbytitle', function (req,res){

    dbTools.GetPostByTitle(req.body.title).then( data => res.send(data));
});

app.post('/getbyid', function (req,res){

    dbTools.GetPostByID(req.body.id).then( data => res.send(data));
});

app.get('/getpostscount', function (req,res){

    dbTools.GetPostsCount().then( data => res.status(200).send(data.toString()));

});


app.post('/getposts', function (req,res){
    dbTools.GetPostsList(req.body.skip, req.body.limit).then( data => res.status(200).send(data));
});

app.post('/getincategory', function (req,res){
    dbTools.GetPostsInCategory(req.body.skip, req.body.limit, req.body.category, req.body.skip, req.body.limit).then( data => res.send(data));
});

app.post('/countincategory', function (req,res){
    console.log(req.body.category)
    dbTools.GetPostsCountInCategory(req.body.category).then( data => res.send(data.toString()));
});

app.listen(port, function () {
  console.log('Server is on ' + port);
});
