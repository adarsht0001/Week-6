var express = require('express');
const { response } = require('../app');
const adminHelper = require('../helper/admin-helper');
var router = express.Router();

let name="admin"
let pass="123"


var auth=function(req,res,next){
  if(req.session.adminLoged){
    next()
  }
  else{
    res.redirect('/admin/adminLogin')
  }
}
/* GET users listing. */
router.get('/',auth, function(req, res, next) {
  adminHelper.viewUser().then((users)=>{
    res.render('admin/admin_main',{users,email:req.session.failedEmail})
    req.session.failedEmail=false
  })
});

router.get('/adminLogin',(req,res)=>{
  if(req.session.adminLoged){
    res.redirect('/admin')
  }
  else{
    res.render('admin/adminLogin',{errorMessage:req.session.invalid})
    req.session.invalid=false;
  }
})

router.post('/adminLogin',(req,res)=>{
  let name1=req.body.name;
  let pass1=req.body.password;
  console.log(req.body)
  if(name1===name&&pass1===pass){
    req.session.adminLoged=true;
   res.redirect('/admin')
  }
  else{
    req.session.invalid="Invalid Name or password"
    res.redirect("/admin/adminLogin")
  }
})

router.get('/addUser',auth,(req,res)=>{
  res.render('admin/admin-create',{errorMessage:req.session.emailUsed});
  req.session.emailUsed=false;
})

router.post('/addUser',(req,res)=>{
  adminHelper.doSignup(req.body).then((response)=>{
    if(response.email){
      req.session.emailUsed="Email Already Exists";
      res.redirect('/admin/addUser')
    }
    else{
      res.redirect('/admin');
    }
  })
})


router.get('/deleteUser/:id',(req,res)=>{
  let userId=req.params.id;
  adminHelper.deleteUser(userId).then((response)=>{
    res.redirect('/admin');
  })
});

router.get('/editUser/:id',auth,async(req,res)=>{
  let user=await adminHelper.getUserDetails(req.params.id)
  res.render('admin/admin-edit',{user})
});

router.post('/editUser/:id',(req,res)=>{
  adminHelper.updateDetails(req.params.id,req.body).then((response)=>{
    console.log(response);
    if(response.email){
      req.session.failedEmail="email already exist"
      res.redirect('/admin');
    }
    else{
      res.redirect('/admin');
    }
  })
});

router.get('/adminLogout',(req,res)=>{
  req.session.adminLoged=null;
  res.redirect('/admin/adminLogin')
})

module.exports = router;
