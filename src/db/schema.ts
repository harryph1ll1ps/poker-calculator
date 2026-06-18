import * as SQLite from "expo-sqlite";

const DB_NAME = "poker_calculator.db";
const TABLES = ["Card", "Game", "Player", "Game_Card", "Game_Player"] as const;

export type CardStatus = "in_deck" | "in_play";
export type GameStatus = "ongoing" | "completed";
export type PlayerStatus = "active" | "folded";

export interface Card {
    id: string;
    suit: string;
    rank: string;
}

export interface Game_Card {
    id: string;
    gameId: string;
    playerId: string;
    cardId: string;
    status: CardStatus;
}

export interface Game {
    id: string;
    winnerId: string;
    gameStatus: GameStatus;
    cardId: string;
    status: CardStatus;
}

export interface Game_Player {
    id: string;
    gameId: string;
    playerId: string;
    status: PlayerStatus;
    odds: number;
}

export interface Player {
    id: string;
    name: string;
}


