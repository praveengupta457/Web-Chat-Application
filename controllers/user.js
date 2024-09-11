const User = require ('../models/userModel');
const bcrypt = require('bcrypt')
const Chat = require('../models/chatModel');
const Group = require('../models/grpModel');

const registerLoad = async(req,res)=>{
try{
  res.render('register')
//   res.redirect('/')
}catch(error){
    console.log(error.message);
}
}
const register = async(req,res)=>{
    try{
        const passwords = await bcrypt.hash(req.body.password,10);
       const user = new User({
            name: req.body.name,
            email:req.body.email,
            image: 'images/'+req.file.filename,
            password:passwords,
        })
        await user.save();
        res.render('register',{message: "registration success."});

    }catch(error){
        console.log(error.message);
    }
}

const loginLoad =  async(req,res)=>{

try{   
     res.render('login'); 
}
catch(error){
    console.log(error.message);
    }
}

const login = async(req,res)=>{

    try{   
          
         const email= req.body.email;
         const password = req.body.password
          const userData = await User.findOne({email:email});
          if(userData){

            const passMatch = await bcrypt.compare(password,userData.password)
         
            if(passMatch){
            req.session.user = userData;
            res.cookie('user',JSON.stringify(userData))
            res.redirect('/dashboard');
            }else{
                res.render('login',{message:'wrong cradentials'})

            }
          }else{
            res.render('login',{message:'wrong cradentials'})

          }
    }
    catch(error){
        console.log(error.message);
        }
    }

    const logout= (req,res)=>{
     try{
req.session.destroy();
res.clearCookie('user');
res.redirect('/');

    }catch(error){
            console.log(error.message);
        }
    }

    const dashboardLoad =  async(req,res)=>{

        try{   


           var users= await User.find({_id:{$nin:[req.session.user._id]}});
           
             res.render('dashboard',{user:req.session.user,users:users}); 
        }
        catch(error){
            console.log(error.message);
        }
        }

    const universal = (req,res)=>res.redirect('/');

    const saveChat = async(req,res)=>{
        try{
           var chat= new Chat({
                sender_id:req.body.sender_id,
                reciever_id:req.body.reciever_id,
                message:req.body.message,
                // image:'images/'+req.file.filename,
            });
            var newChat = await chat.save();
         
        
            res.send({success:true,msg:'done',data:newChat});

        }catch(error){
                res.send({success:false,msg:error.message})
        }
    }

    const loadGroups = async(req,res)=>{
        // res.render('groupchat')
        try{
             console.log("group called")
            
        //  const groups = await Group.find({creator_id:req.session.user._id});
            res.render('groupchat',{groups:groups});
            console.log('..Load Groups function is called');
        }catch(error){
            console.log("error occured")
        }
      }

    const image = (req,res)=>{
            // Emit the image path to the connected clients
            io.emit('image', `/images/${req.file.filename}`);
            res.sendStatus(200);
          }

          const createGroup =async (req,res)=>{
            const group = new Group({
                creator_id: req.session.user._id ,
                name:req.body.name,
                image: "images/"+req.file.filename,  
                limits:req.body.limit,
                     });
                     await group.save();
                     const groups = await Group.find({creator_id:req.session.user._id});
 
//  res.render('groupchat')
                 res.render('groupchat',{message:req.body.name+'group created..', groups:groups});
                 console.log(' Groups function is called');
        //     try{
            
        //     }catch(error){
        //         console.log("error occured")
        //     }
          }

module.exports={

    registerLoad,
    register,
    login,
    loginLoad,
    logout,
    dashboardLoad,
    universal,
    saveChat, 
    image,
    createGroup,
    loadGroups,
}