const db = require('../models');
const User = db.users;
const Log = db.logs;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Op = db.Sequelize.Op;
const bodyParser = require('body-parser');

exports.getAllLogs = (req, res) =>{
    Log.findAll({
        attributes: ['log_id', 'action', 'createdAt'],
        limit: 10,
        order: [["createdAt", "DESC"]],
        include: {
            model: User,
            attributes: ['login']
        }
    })
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            return res.status(err.status).json({'message': 'Coś poszło nie tak'});
        })
}

exports.getLastLog = (req, res) => {
    Log.findAll({
        attributes: ['action'],
        limit: 1,
        order: [['createdAt', 'DESC']]
    })
    .then((data) => {
        res.json(data);
    })
}

exports.changeStatus = async (req, res) => {
    const token =req.headers.authorization.split(' ')[1];

}