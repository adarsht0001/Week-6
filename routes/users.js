var express = require('express');
const { response } = require('../app');
var router = express.Router();
const userHelper=require('../helper/user-helper')

var userauth=(req,res,next)=>{
  if(req.session.userLogIn){
    res.redirect('/');
  }else{
    next();
  }
};

/* GET home page. */
router.get('/',function(req, res, next) {
  let user=req.session.user;
  res.render('user/index',{user});
});

router.get('/login',userauth,function(req,res,next){
  res.render('user/login',{errorMessage:req.session.invalid})
  req.session.invalid=false;
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.userLogIn=true;
      req.session.user=response.user;
      console.log(req.session);
      res.redirect('/');
    }
    else{
      req.session.invalid="Invalid Password or Email";
      res.redirect('/login')
    }
  })

})

router.get('/signup',userauth,(req,res)=>{
    res.render('user/signUp',{errorMessage:req.session.emailUsed});
    req.session.emailUsed=false;
})
router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    if(response.email){
      req.session.emailUsed="Email Already Exists";
      res.redirect('/signup')
    }
    else{
      res.redirect('/login');
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.userLogIn=null;
  req.session.user=null;
  res.redirect('/')
})

module.exports = router;
