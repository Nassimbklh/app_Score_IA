// models/SportsEvent.js

export class SportsEvent {
    constructor(id, team1, team2, odds) {
        this.id = id;
        this.team1 = team1;
        this.team2 = team2;
        this.odds = odds;
    }
}