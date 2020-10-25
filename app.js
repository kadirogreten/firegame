const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

//// swagger ////

const swaggerDocument = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');

//// end swagger ////

const authRoute = require('./controllers/authControllers');
const playerRoute = require('./controllers/playerControllers');


const app = express();

const server = http.createServer(app);


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


app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.use('/api/user', authRoute);

app.use('/api/player', playerRoute);





server.listen(80, () => console.log('server started on port ' + 'http://localhost:80'));