const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}, {wsEngine: 'ws'});
const db = require('./models');
const Logs = db.logs;


const bodyParser = require('body-parser');

const indexRoute = require('./routes/index');
const userRoute = require('./routes/user');
const logRoute = require('./routes/log');

const cors = require('cors');
app.use(cors());

//handling json data 
app.use(bodyParser.json());
//handling data from forms;
app.use(bodyParser.urlencoded({ extended: true }));

const insertLog = async (data)=>{
    await Logs.create(data)
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {res.send(err)})
}

io.on('connection', async (socket)=>{
    let dataFromCamera = "";
    console.log("socket");
    socket.on('frame', (data)=>{
        //console.log(data);
        dataFromCamera = data;
        socket.broadcast.emit("status", data);
    });
    
    
    await Logs.findAll({
        attributes: ['action'],
        limit: 1,
        order: [['createdAt', 'DESC']]
    })
    .then((data) => {
        const stan = data[0].action;
        if(stan =="Uzbrojenie alarmu"){
            socket.emit('alarmEnabled', true);
        }else{
            socket.emit('alarmEnabled', false);
        }
        //console.log(data[0].action);
    })
    socket.on('alarmData', (data)=>{
        socket.broadcast.emit("alarmStatus", data);
    })
    socket.on('capturedMovement', (data)=>{
        socket.broadcast.emit('captured', data);
    })
    socket.on('setAlarm', (id)=>{
        console.log('Ustaw alarm i id: '+ id);
        Logs.findAll({
            attributes: ['action'],
            limit: 1,
            order: [['createdAt', 'DESC']]
        })
        .then((data) => {
            const stan = data[0].action;
            if(stan =="Uzbrojenie alarmu"){
                //insert do bazy(tabela logs)
                const data = {
                    action: "Rozbrojenie alarmu",
                    UserId: id
                }
                insertLog(data);
                io.emit('alarmEnabled', false);
            }else{
                const data = {
                    action: "Uzbrojenie alarmu",
                    UserId: id
                }
                insertLog(data);
                io.emit('alarmEnabled', true);
            }
            console.log(data[0].action);
        })
    })
})

//handling requests
app.use('/api', indexRoute);
app.use('/user', userRoute);
app.use('/log', logRoute);




//syncing database connection

db.sequelize.sync()
    .then(()=>{
        console.log('DB synced');
    })
    .catch(err => {
        console.log("Error syncing database connection: " + err.message);
    })

server.listen('3000', ()=>{
    console.log('dziala');
})