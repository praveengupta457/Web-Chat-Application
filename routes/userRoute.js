const express=require('express');
const user_route= express();
const bodyParser= require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
// const session = require('express-session');

const session = require('express-session');



user_route.use(session({secret:"secret"}));

const cookieParser=require('cookie-parser');
user_route.use(cookieParser());
user_route.use(express.static('public'));

const auth = require('../middlewares/authentication');
const usesrController= require('../controllers/user');

user_route.set('view engine','ejs');
user_route.set('views','./views');

const path = require('path');
const multer= require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../images"))
    },
    filename:(req,file,cb)=>{
      
      const name=Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});
const upload = multer({storage:storage});

//registration
user_route.get('/register', auth.isLogout ,usesrController.registerLoad)
user_route.post('/register',upload.single('image'),usesrController.register);

//login
user_route.get('/',auth.isLogout,usesrController.loginLoad);
user_route.post('/',usesrController.login);

//logout
user_route.get('/logout',auth.isLogin,usesrController.logout);

//dashboard
user_route.get('/dashboard',auth.isLogin,usesrController.dashboardLoad);

//any
user_route.get('*',usesrController.universal)

user_route.post('/save-chat',usesrController.saveChat);
user_route.get('/groups', auth.isLogin,usesrController.loadGroups);
user_route.post('/groups',upload.single('image') , auth.isLogin,usesrController.createGroup);
user_route.post('/upload',upload.single('image'),usesrController.image);

module.exports= user_route;
