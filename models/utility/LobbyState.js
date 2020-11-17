module.exports = class LobbyState {
    constructor() {
        //Predefined States
        this.GAME = 'Game';
        this.LOBBY = 'Lobby';
        this.ENDGAME = 'EndGame';
        this.YOUR_TURN = 'YourTurn';
        this.ENEMY_TURN = 'EnemyTurn';

        //Current state of the lobby
        this.currentState = this.LOBBY;

    }
}