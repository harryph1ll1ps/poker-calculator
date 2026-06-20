import {SQLiteDatabase, openDatabaseAsync} from "expo-sqlite";

const DB_NAME = "poker_calculator.db";
export const TABLES = ["Card", "Game", "Player", "Game_Card", "Game_Player"] as const;

export type CardLocation = "deck" | "player" | "community" | "burned";
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
    playerId: string | null;
    cardId: string;
    location: CardLocation;
}

export interface Game {
    id: string;
    winnerId: string | null;
    start_at: string;
    end_at: string | null;
    status: GameStatus;
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

const SCHEMA_SQL = `
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS card (
        id TEXT PRIMARY KEY NOT NULL,
        suit TEXT NOT NULL,
        rank TEXT NOT NULL,
        UNIQUE (suit, rank),
        CHECK (suit IN ('hearts', 'diamonds', 'clubs', 'spades')),
        CHECK (rank IN ('2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'))
    );

    CREATE TABLE IF NOT EXISTS player (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS game (
        id TEXT PRIMARY KEY NOT NULL,
        winnerId TEXT,
        status TEXT NOT NULL,
        start_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        end_at TEXT,
        FOREIGN KEY (winnerId) REFERENCES player(id),
        CHECK (end_at IS NULL OR start_at < end_at),
        CHECK (status IN ('ongoing', 'completed'))
    );

    CREATE TABLE IF NOT EXISTS game_card (
        id TEXT PRIMARY KEY NOT NULL,
        gameId TEXT NOT NULL,
        playerId TEXT,
        cardId TEXT NOT NULL,
        location TEXT NOT NULL,
        FOREIGN KEY (cardId) REFERENCES card(id),
        FOREIGN KEY (playerId) REFERENCES player(id),
        FOREIGN KEY (gameId) REFERENCES game(id) ON DELETE CASCADE,
        CHECK (location IN ('deck', 'player', 'community', 'burned')),
        CHECK (
            (location = 'player' AND playerId IS NOT NULL)
            OR
            (location IN ('deck', 'community', 'burned') AND playerId IS NULL)
        ),
        UNIQUE (gameId, cardId)
    );

    CREATE TABLE IF NOT EXISTS game_player (
        id TEXT PRIMARY KEY NOT NULL,
        gameId TEXT NOT NULL,
        playerId TEXT NOT NULL,
        status TEXT NOT NULL,
        odds REAL,
        FOREIGN KEY (playerId) REFERENCES player(id),
        FOREIGN KEY (gameId) REFERENCES game(id) ON DELETE CASCADE,
        CHECK (status IN ('active', 'folded')),
        CHECK (odds IS NULL OR (odds >= 0 AND odds <= 1)),
        UNIQUE (gameId, playerId)
    );

    CREATE INDEX IF NOT EXISTS idx_game_card_gameId 
    ON game_card(gameId);

    CREATE INDEX IF NOT EXISTS idx_game_card_playerId 
    ON game_card(playerId);

    CREATE INDEX IF NOT EXISTS idx_game_player_gameId 
    ON game_player(gameId);

    CREATE INDEX IF NOT EXISTS idx_game_player_playerId 
    ON game_player(playerId);
`;

let dbPromise: Promise<SQLiteDatabase> | null = null;

export function createDatabase(): Promise<SQLiteDatabase> {
    if (dbPromise) return dbPromise;
    dbPromise = (async () => {
        const db = await openDatabaseAsync(DB_NAME);
        await db.execAsync(SCHEMA_SQL);
        return db;
    })();
    return dbPromise;
};


// // immediately lock db for writing, then only commit if successful, otherwise rollback
// export function concurrencySafeTransaction<T>(db: DatabaseClient, handler: () => T): T {
// 	db.exec("BEGIN IMMEDIATE");
// 	try {
// 		const result = handler();
// 		db.exec("COMMIT");
// 		return result;
// 	} catch (error) {
// 		db.exec("ROLLBACK");
// 		throw error;
// 	}
// }





