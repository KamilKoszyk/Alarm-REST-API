const db = require('../models');
const User = db.users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Op = db.Sequelize.Op;
const bodyParser = require('body-parser');
require('dotenv').config();


const secret = process.env.SECRET;


//add user to database
exports.add = (req, res) => {
    console.log(req);
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        console.log(hash);
        const userData = {
            login: req.body.login,
            password: hash,
            role: req.body.role
        }
        
        User.create(userData)
            .then((data) => {
                console.log(data);
                res.json({
                    "message": "Użytkownik dodany."
                });
            })
            .catch((err) => {res.send(err)})
    })
    
}


//get all users data
exports.getAllUsers = (req, res) => {
    User.findAll({attributes : ['id', 'login', 'role']})
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {res.send(err)})
}


//get user data by id
exports.getUserData = (req, res) => {
    User.findAll({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'login', 'createdAt']
    })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {res.send(err)})
}

//handling login
exports.login = (req, res)=>{
    console.log("logowanie");
    User.findAll({
        where: {
            "login": req.body.login
        }
    })
        .then((data)=>{
            const passwordFromDb = data[0].password;
            const isAdmin = data[0].role === "admin" ? '1' : '0';
            //checking password
            
            bcrypt.compare(req.body.password, passwordFromDb, (err, result)=>{
                if(result) {
                    const payload = {
                        id: data[0].id,
                        login: data[0].login,
                        role: data[0].role,
                        firstLogin: data[0].firstLogin
                    }
                    const refreshToken = jwt.sign(payload, secret, { expiresIn: '2h' });
                    jwt.sign(payload, secret, { expiresIn: '20m' },(err, token)=>{
                        
                        res.json({token: token, refreshToken: refreshToken, message: isAdmin, id: data[0].id});
                        
                    })
                }else{
                    res.status(500).json({"message": 'Login lub hasło niepoprawne'});
                }
            })
        })
        .catch((err)=>{ res.status(500).json({"message": "Coś poszło nie tak!"})})
}


exports.changepassword = async (req, res) => {
    
    const token = req.headers.authorization.split(' ')[1];
    console.log("działa")
    let userLogin = ""
    try {
        const decodedToken = jwt.verify(token, secret);
        userLogin = decodedToken.login;
        
    }catch(err){
        return res.status(401).send("Invalid token")
    }

    const oldPass = req.body.oldpassword;
    const newPass = req.body.newpassword;
    console.log(newPass);
    if(!oldPass || !newPass){
        return res.status(500).json({"message": "Brak wszystkich danych"});
    }

    await User.findAll({ 
        attributes : ['password'],
        where: { 
            login: userLogin
        }
    })
        .then((data) =>{
            const passwordFromDb = data[0].password;
            console.log(oldPass);

            bcrypt.compare(oldPass, passwordFromDb, (err, result) =>{
                //old password is correct
                if(result){
                    bcrypt.hash(newPass, 10, (err, hash) =>{
                        if(err){
                            return res.status(500).json({"message": "Coś poszło nie tak!"})
                        }
                        
                        //res.send('Tu zapisujemy nowe hasło w bazie');
                        User.update({password: hash, firstLogin: false}, {
                            where: {
                                login: userLogin
                            }}
                        ).then(()=>{
                            res.json({"message": "Hasło zostało zmienione"})
                        }).catch((err)=>{
                            res.send(err.message);
                        })
                        
                    })


                    
                }else{
                    res.json({"message": "Niepoprawe hasło!"});
                }
            })
                
        })
    
}

exports.checkFirstLogin = async (req,res) =>{

    const token = req.headers.authorization.split(' ')[1];

    let userLogin = ""
    try {
        const decodedToken = jwt.verify(token, secret);
        userLogin = decodedToken.login;
        
    }catch(err){
        return res.status(401).send("Invalid token")
    }

    await User.findAll({ 
        attributes : ['firstLogin'],
        where: { 
            login: userLogin
        }
    }).then((response)=>{
        res.json(response);
        
        console.log(response);
    })
}


exports.resetPassword = async (req, res) => {
    const {id, password} = req.body;
    await User.findAll({ 
        attributes : ['password'],
        where: { 
            id: id
        }
    })
        .then((data) =>{
            bcrypt.hash(password, 10, (err, hash) =>{
                if(err){
                    return res.status(500).json({"message": "Coś poszło nie tak!"})
                }   
                //Tu zapisujemy nowe hasło w bazie;
                User.update({password: hash, firstLogin: true}, {
                    where: {
                        id: id
                    }}
                ).then(()=>{
                    res.json({"message": "Hasło zostało zresetowane"})
                }).catch((err)=>{
                    res.send(err.message);
                })         
            })
    })            
}

exports.refresh = (req, res) =>{
    const refreshToken = req.body.refreshToken;
    if (typeof refreshToken !=  'undefined') {

        // Verifying refresh token
        jwt.verify(refreshToken, secret, 
        (err, decoded) => {
            if (err) {
                // Wrong Refesh Token
                return res.status(406).json({ message: 'Unauthorized' });
            }
            else {
                // Correct token we send a new access token
                
                const accessToken = jwt.sign({
                    id: decoded.id,
                    login: decoded.login,
                    role: decoded.role,
                    firstLogin: decoded.firstLogin
                }, secret, {
                    expiresIn: '20m'
                });
                return res.json({ accessToken });
            }
        })
    } else {
        return res.status(406).json({ message: 'Unauthorized' });
    }

}