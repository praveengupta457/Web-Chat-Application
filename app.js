const express = require ('express')
const app = express();
require ('dotenv').config();
const port = 3000;

const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Chat-App');

const userRoute= require('./routes/userRoute');
const User = require('./models/userModel')
const Chat = require('./models/chatModel')
app.use('/',userRoute);
const http = require("http").Server(app)
const io = require('socket.io')(http);

var username = io.of('/user-namespace');
username.on('connection',async(socket)=>{
 console.log('user connected');

 var userId= socket.handshake.auth.token;
 await User.findByIdAndUpdate({_id:userId},{set: {is_Online:'1'}});

 socket.join('chat');

 socket.on('disconnect',async()=>{
    console.log('user disconnect')
    var userId= socket.handshake.auth.token;
    await User.findByIdAndUpdate({_id:userId},{set: {is_Online:'0'}});
 });

 //chat implementaion
socket.on('newChat',(data)=>{
    socket.broadcast.emit('loadNewChat',data);
})

 // Listen for image uploads
 socket.on('image', (data) => {
    socket.broadcast.emit('image', data);
  });

//load chats

socket.on('availableChat',async(data)=>{
var chats= await Chat.find(
    {$or:[
    {sender_id:data.sender_id,reciever_id:data.reciever_id},
    {sender_id:data.reciever_id,reciever_id:data.sender_id},
 ]});
 socket.emit('loadChats',{chats:chats})
})

});

http.listen (port,()=>{
    console.log(`server is listening on http://localhost:${port}`);
})
