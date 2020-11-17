const Connection = require("../connection/Connection");
const Player = require("../player/Player");
const GameLobby = require("../lobby/GameLobby");
const LobbyBase = require("../Lobby/LobbyBase");
const GameLobbySettings = require("../Lobby/GameLobbySettings");
const User = require("../User");

module.exports = class Server {
    constructor() {
        this.connections = [];
        this.lobbies = [];

        this.lobbies[0] = new LobbyBase(0);
    }

    onUpdate() {
        let server = this;
        for(let id in server.lobbies) {
            server.lobbies[id].onUpdate();
        }

    }

    onConnected(socket) {


        let server = this;
        let connection = new Connection();
        connection.socket = socket;
        let player = new Player();
        player.id = socket.handshake.query['id'];
        player.username = socket.handshake.query['username']

        connection.player = player;//veritabanında çekeceğiz bunu


        connection.server = server;
        console.log('player: ' + connection.player.id)
        let connectedPlayer = connection.player;
        let lobbies = server.lobbies;

        console.log('Added new player to the server (' + connection.player.id +') ('+ connection.player.username+')');
        server.connections[connection.player.id] = connection;
        socket.join(connection.player.lobby);
        connection.lobby = lobbies[connection.player.lobby];
        connection.lobby.onEnterLobby(connection);

        return connection;
    }

    onDisconnected(connection = Connection) {
        let server = this;
        let id = connection.player.id;

        delete server.connections[id];

        console.log('Player ' + connection.player.displayPlayerInformation() + ' has disconnected!');

        connection.socket.broadcast.to(connection.player.lobby).emit('disconnected', {
            id:id
        });

        //perform loby clean up


        server.lobbies[connection.player.lobby].onLeaveLobby(connection);
    }

    onAttemptToJoinGame(connection = Connection) {
        //look through lobbies for a gameLobby
        //check if joinable
        //if not make a new game

        let server = this;
        let lobyFound = false;

        let gameLobbies = server.lobbies.filter(item => {
            return item instanceof GameLobby;
        });


        console.log('Found (' + gameLobbies.length + ') lobbies on the server');

        gameLobbies.forEach(lobby => {
            if(!lobyFound) {
                let canJoin = lobby.canEnterLobby(connection);

                if(canJoin) {
                    lobyFound = true;
                    server.onSwitchLobby(connection, lobby.id);
                }
            }
        });

        // all game lobbies full or have never created one
        
        if(!lobyFound) {
            console.log('Making a new game lobby');

            let gameLobby = new GameLobby(gameLobbies.length + 1, new GameLobbySettings('FF2',2));

            server.lobbies.push(gameLobby);
            server.onSwitchLobby(connection, gameLobby.id);
        }
    }

    onSwitchLobby(connection = Connection, lobbyID) {
        let server = this;
        let lobbies = server.lobbies;

        connection.socket.join(lobbyID);

        connection.lobby = lobbies[lobbyID];

        lobbies[connection.player.lobby].onLeaveLobby(connection);

        lobbies[lobbyID].onEnterLobby(connection);
    }


}