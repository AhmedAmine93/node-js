require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const pug =  require("pug");
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const path = require('path');
const { isBuffer } = require('util');
const md5 = require('md5');
const server = require('http').Server(app)
const io = require("socket.io")(server)




app.set('view engine','pug');
app.use('/client',express.static(__dirname + '/views/client'))
app.use('/css',express.static(__dirname + '/views/css'));
app.use('/icon',express.static(__dirname + '/views/icon'));
app.use('/images',express.static(__dirname + '/views/images'));
app.use('/js',express.static(__dirname + '/views/js'));
app.use(bodyParser.urlencoded({
  extended: true
}));





mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true}, (err, client) => {
  if (err) {
      console.log(err);
  } else {
      console.log("connected");
  }
});
const userSchema =new mongoose.Schema( {
name: String,
email: String,
motDePasse : String,
phone : Number,
message : String
});


const User = new mongoose.model("User", userSchema);

app.get('/',function(req,res){
  res.render("base",{root:'views'});
  });

app.get("/signup",(err,res)=>{
  res.render('formulaire')
})
app.get("/login",(err,res)=>{
  res.render('login')
});
app.post("/signup",(req,res)=>{
  const newUser = new User({
    Name: req.body.name,
    email: req.body.email,
    motDePasse : md5(req.body.motDePasse),
    phone : req.body.phone,
    message : req.body.message
  });
  newUser.save((err)=>{
    if(err){console.log(err)}
    else{
      res.sendFile('C:/Users/amine/Desktop/projet back-end/jackpiro/server/views/client/client.html')
      io.on('connection', (socket) => {

        //Displaying a message on the terminal
          console.log('a user connected');
          //Sending a message to the client
          socket.emit('serverToClient', "Hello, client!");
          //Receiving a message from the client and putting it on the terminal
          socket.on('clientToServer', data => {
              console.log(data);
          })
          //When the client sends a message via the 'clientToClient' event
          //The server forwards it to all the other clients that are connected
          socket.on('clientToClient', data => {
              socket.broadcast.emit('serverToClient', data);
          })
          
      });
    
          
     
    }
      })

    
  
})
app.post('/login' , (req , res)=>{
  const Name = req.body.name;
  const email = req.body.email;
  const motDePasse = md5(req.body.motDePasse);
  const phone = req.body.phone;
  const message = req.body.message;
  User.findOne({email: email} ,(err, foundUser)=>{
    if(err){console.log(err)}else{
      if(foundUser){
        if(foundUser.motDePasse === motDePasse){
          res.sendFile('C:/Users/amine/Desktop/projet back-end/jackpiro/server/views/client/client.html')
          io.on('connection', (socket) => {

            //Displaying a message on the terminal
              console.log('a user connected');
              //Sending a message to the client
              socket.emit('serverToClient', "Hello, client!");
              //Receiving a message from the client and putting it on the terminal
              socket.on('clientToServer', data => {
                  console.log(data);
              })
              //When the client sends a message via the 'clientToClient' event
              //The server forwards it to all the other clients that are connected
              socket.on('clientToClient', data => {
                  socket.broadcast.emit('serverToClient', data);
              })
              
          });
        
              
          
        }else{
          res.send("<h1> mot de passe pas bon</h1>")
          console.log('mot de passe pas bon')}
      }
    }
  })

  

})







 
server.listen(port, ()=>{
    console.log("lisning on port: "+ port);
})





