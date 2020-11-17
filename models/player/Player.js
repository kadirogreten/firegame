var Vector3 = require('../vectors/Vector3');

module.exports = class Player {
  constructor() {
    this.id = '';
    this.username = 'Default_Player';
    this.lobby = 0;
    this.position = new Vector3();
    this.carRotation = new Number(0);
    this.health = new Number(100);
    this.isDead = false;
    this.respawnTicker = new Number(0);
    this.respawnTime = new Number(0);
  }


  displayPlayerInformation() {
    let player = this;

    return '(' + player.username + ':' + player.id + ')';
  }


  respawnCounter() {
    this.respawnTicker = this.respawnTicker + 1;

    if (this.respawnTicker >= 3) {
      this.health = new Number(100);
      this.isDead = false;
      this.respawnTicker = new Number(0);
      this.respawnTime = new Number(0);
      this.position = new Vector3(-8, 3, 0);

      return true;
    }

    return false;
  }


  dealDamage(amount = Number) {
    this.health = this.health - amount;

    if (this.health <= 0) {
      this.isDead = true;
      this.respawnTicker = new Number(0);
      this.respawnTime = new Number(0);
    }

    return this.isDead;
  }
}