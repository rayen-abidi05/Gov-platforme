const express = require('express');

const router = express.Router();

const { registerUser,login,logout } = require('../controllers/auth');
const authenticateToken = require('../middleware/authtoek');

router.post('/register',async (req,res)=>{
    if(req.body.role==="EXPORTER"){
        registerUser(req,res,"REJECTED");    
    }else{
        registerUser(req,res);
    }
    
    
})

router.post('/login', login)

router.get('/test',authenticateToken, (req,res)=>{
    res.json({message: "jwk bh" , user: req.user})
})
router.post('/logout', logout)



module.exports = router;