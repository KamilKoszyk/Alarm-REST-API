const db = require('../models');
const User = db.users;
const bcrypt = require('bcrypt');

exports.login = (req, res)=>{
    User.findAll({
        where: {
            "login": req.body.login
        }
    })
        .then((data)=>{
            console.log(data.password);
        })
        .catch((err)=>{ res.send(err)})
}