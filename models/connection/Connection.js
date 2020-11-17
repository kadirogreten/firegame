module.exports = class Connection {
    constructor() {
        this.socket;
        this.player;
        this.server;
        this.lobby;
    }

    //Handles all our io events and where we should route them too to be handled
    createEvents() {
        let connection = this;
        let socket = connection.socket;
        let server = connection.server;
        let player = connection.player;

        socket.on('disconnect', function() {
            server.onDisconnected(connection);
        });

        socket.on('joinGame', function() {
            console.log('join game' + player.id);
            server.onAttemptToJoinGame(connection);
            socket.emit('joinGame', player);
        });

        // socket.on('fireBullet', function(data) {
        //     connection.lobby.onFireBullet(connection, data);
        // });

        // socket.on('collisionDestroy', function(data) {
        //     connection.lobby.onCollisionDestroy(connection, data);
        // });

        socket.on('updatePosition', function(data) {
            player.position.x = data.position.x;
            player.position.y = data.position.y;
            player.position.z = data.position.z;

            // position list add

            socket.broadcast.to(connection.lobby.id).emit('updatePosition', player);
        });

        socket.on('updateRotation', function(data) {
            player.carRotation = data.carRotation;

            // rotation list

            socket.broadcast.to(connection.lobby.id).emit('updateRotation', player);
        });
    }
}