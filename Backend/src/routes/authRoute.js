const express = require('express');

const router = express.Router();

const { registerUser,login,logout , verify, users } = require('../controllers/auth');
const authenticateToken = require('../middleware/authToken');
const refresh = require ("../controllers/refresh")
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
router.post('/refresh', refresh)
router.post('/logout',authenticateToken, logout)
router.get('/verify',authenticateToken, verify)
router.get('/getMe',authenticateToken, verify)
router.get('/users', users)
module.exports = router;