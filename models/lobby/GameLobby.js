let LobbyBase = require('../lobby/LobbyBase')
let GameLobbySettings = require('../Lobby/GameLobbySettings')
let Connection = require('../Connection/Connection')
let LobbyState = require('../utility/LobbyState')

module.exports = class GameLobby extends LobbyBase {
    constructor(id, settings = GameLobbySettings) {
        super(id);
        this.settings = settings;
        this.lobbyState = new LobbyState();
    }

    onUpdate() {
        let lobby = this;
    }

    canEnterLobby(connection = Connection) {
        let lobby = this;
        let maxPlayerCount = lobby.settings.maxPlayers;
        let currentPlayerCount = lobby.connections.length;

        if (currentPlayerCount + 1 > maxPlayerCount) {
            return false;
        }

        return true;
    }

    onEnterLobby(connection = Connection) {
        let lobby = this;
        let socket = connection.socket;

        super.onEnterLobby(connection);

        //lobby.addPlayer(connection);

        if (lobby.connections.length == lobby.settings.maxPlayers) {
            console.log('We have enough players we can start the game');
            lobby.lobbyState.currentState = lobby.lobbyState.GAME;
            lobby.onSpawnAllPlayersIntoGame();

            lobby.onTurnGameInLobby(connection);
        }

        let returnData = {
            state: lobby.lobbyState.currentState
        };

        socket.emit('loadGame');
        socket.emit('lobbyUpdate', returnData);
        socket.broadcast.to(lobby.id).emit('lobbyUpdate', returnData);

        //Handle spawning any server spawned objects here
        //Example: loot, perhaps flying bullets etc
    }

    onTurnGameInLobby(connection = Connection) {
        let lobby = this;
        let socket = connection.socket;

        super.onTurnGameInLobby(connection);

        var returnData = {
            id: connection.player.id,
            state : lobby.lobbyState.YOUR_TURN
        };

        socket.emit('your_turn', returnData);
        socket.broadcast.to(lobby.id).emit('your_turn', returnData);
    }

    onLeaveLobby(connection = Connection) {
        let lobby = this;

        super.onLeaveLobby(connection);

        lobby.removePlayer(connection);

        //Handle unspawning any server spawned objects here
        //Example: loot, perhaps flying bullets etc
    }

    onSpawnAllPlayersIntoGame() {
        let lobby = this;
        let connections = lobby.connections;

        connections.forEach(connection => {
            lobby.addPlayer(connection);
        });
    }

    addPlayer(connection = Connection) {
        let lobby = this;
        let connections = lobby.connections;
        let socket = connection.socket;

        var returnData = {
            id: connection.player.id
        }

        socket.emit('spawn', returnData); //tell myself I have spawned
        //socket.broadcast.to(lobby.id).emit('spawn', returnData); // Tell others

        //Tell myself about everyone else already in the lobby
        connections.forEach(c => {
            if (c.player.id != connection.player.id) {
                socket.emit('spawn', {
                    id: c.player.id
                });
            }
        });
    }

    removePlayer(connection = Connection) {
        let lobby = this;

        connection.socket.broadcast.to(lobby.id).emit('disconnected', {
            id: connection.player.id
        });
    }
}