const express = require('express');
const app = express();
const server = require('http').Server(app);
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const path = require('path');

const Server = require('./models/server/Server');

//// swagger ////

const swaggerDocument = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');

//// end swagger ////

const authRoute = require('./controllers/authControllers');
const playerRoute = require('./controllers/playerControllers');




var options = {
    swaggerOptions: {
        authAction: {
            JWT: {
                name: "JWT",
                schema: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization",
                    description: ""
                },
                value: "<JWT>"
            }
        }
    }
};


var io = socketIo(server, {
    transports: ['websocket', 'polling']
});

mongoose.connect('mongodb+srv://kadirogreten:89892dbc@gamecluster.l7pqg.mongodb.net/gamedb?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, () =>
    console.log('connected to db! ' + new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul'
    }))
);


app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.use('/api/user', authRoute);

app.use('/api/player', playerRoute);

let gameServer = new Server();

setInterval(() => {
    gameServer.onUpdate();
}, 100, 0);


io.on('connection', (socket) => {


    let connection = gameServer.onConnected(socket);

    //console.log(connection);

    connection.createEvents();

    connection.socket.emit('register', {
        'id': connection.player.id,
        'username': connection.player.username
    });

    connection.socket.broadcast.emit('register', {
        'id': connection.player.id,
        'username': connection.player.username
    });

    console.log('io connected: ' + new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul'
    }) + ' id: ' + socket.handshake.query['id']);

});



server.listen(80, () => console.log('server started on port ' + 'http://localhost:80'));