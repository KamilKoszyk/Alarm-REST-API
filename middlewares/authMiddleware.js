const jwt = require('jsonwebtoken');
require('dotenv').config();



const secret = process.env.SECRET;

//czy użytkownik jest zalogowany
exports.isLoggedIn = (req, res , next)=>{
    //czy zapytania posiada token
    if (!req.headers.authorization) {
        return res.status(403).send("A token is required for authentication");
    }
    const token = req.headers.authorization.split(' ')[1];
    //sprawdzanie tokenu
    try {
        jwt.verify(token, secret);
        //console.log(token);
    }catch(err){
        return res.status(401).send("Invalid token")
    }
    next();
}

//czy użytkownik jest adminem
exports.isAdmin = (req, res , next)=>{
    //czy zapytania posiada token
    if(!req.headers.authorization){
        return res.status(403).send("No token was send to server!");
    }
    const token = req.headers.authorization.split(' ')[1];

    //sprawdzanie tokenu
    try {
        const decodedToken = jwt.verify(token, secret);
        if(decodedToken.role == "admin"){ 
            next();
        }else{
            return res.status(401).send("No permisions");
        }
    }catch(err){
        return res.status(401).send("Invalid token")
    }  
}

exports.rasp = (req, res, next) => {
    if(req.query.apiKey === '1185937e-757a-484e-a538-3f8f2abb2b59'){
        next();
    }else{
        res.json({message: 'Invalid API Key'});
    }
}