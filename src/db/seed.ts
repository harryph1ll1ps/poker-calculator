import {SQLiteDatabase, openDatabaseAsync} from "expo-sqlite";
import { Card, Player } from "./schema.ts";

const SEEDED_PLAYERS: readonly Player[] = [
    { id: "player_1", name: "Phil Hellmuth" },
    { id: "player_2", name: "Tony G" },
    { id: "player_3", name: "Phil Ivey" },
    { id: "player_4", name: "Suga Sean" },
    { id: "player_5", name: "Daniel Negreanu" },
    { id: "player_6", name: "Doyle Brunson" },
    { id: "player_7", name: "Tom Dwan" },
    { id: "player_8", name: "Fedor Holz" },
    { id: "player_9", name: "Jason Koon" },
    { id: "player_10", name: "Vanessa Selbst" },
    { id: "player_11", name: "Doug Polk" },
    { id: "player_12", name: "Liv Boeree" }
] as const;

const SEEDED_CARDS: readonly Card[] = [
    // Hearts
    { id: "hearts_2", suit: "hearts", rank: "2" },
    { id: "hearts_3", suit: "hearts", rank: "3" },
    { id: "hearts_4", suit: "hearts", rank: "4" },
    { id: "hearts_5", suit: "hearts", rank: "5" },
    { id: "hearts_6", suit: "hearts", rank: "6" },
    { id: "hearts_7", suit: "hearts", rank: "7" },
    { id: "hearts_8", suit: "hearts", rank: "8" },
    { id: "hearts_9", suit: "hearts", rank: "9" },
    { id: "hearts_10", suit: "hearts", rank: "10" },
    { id: "hearts_J", suit: "hearts", rank: "J" },
    { id: "hearts_Q", suit: "hearts", rank: "Q" },
    { id: "hearts_K", suit: "hearts", rank: "K" },
    { id: "hearts_A", suit: "hearts", rank: "A" },

    // Diamonds
    { id: "diamonds_2", suit: "diamonds", rank: "2" },
    { id: "diamonds_3", suit: "diamonds", rank: "3" },
    { id: "diamonds_4", suit: "diamonds", rank: "4" },
    { id: "diamonds_5", suit: "diamonds", rank: "5" },
    { id: "diamonds_6", suit: "diamonds", rank: "6" },
    { id: "diamonds_7", suit: "diamonds", rank: "7" },
    { id: "diamonds_8", suit: "diamonds", rank: "8" },
    { id: "diamonds_9", suit: "diamonds", rank: "9" },
    { id: "diamonds_10", suit: "diamonds", rank: "10" },
    { id: "diamonds_J", suit: "diamonds", rank: "J" },
    { id: "diamonds_Q", suit: "diamonds", rank: "Q" },
    { id: "diamonds_K", suit: "diamonds", rank: "K" },
    { id: "diamonds_A", suit: "diamonds", rank: "A" },

    // Clubs
    { id: "clubs_2", suit: "clubs", rank: "2" },
    { id: "clubs_3", suit: "clubs", rank: "3" },
    { id: "clubs_4", suit: "clubs", rank: "4" },
    { id: "clubs_5", suit: "clubs", rank: "5" },
    { id: "clubs_6", suit: "clubs", rank: "6" },
    { id: "clubs_7", suit: "clubs", rank: "7" },
    { id: "clubs_8", suit: "clubs", rank: "8" },
    { id: "clubs_9", suit: "clubs", rank: "9" },
    { id: "clubs_10", suit: "clubs", rank: "10" },
    { id: "clubs_J", suit: "clubs", rank: "J" },
    { id: "clubs_Q", suit: "clubs", rank: "Q" },
    { id: "clubs_K", suit: "clubs", rank: "K" },
    { id: "clubs_A", suit: "clubs", rank: "A" },

    // Spades
    { id: "spades_2", suit: "spades", rank: "2" },
    { id: "spades_3", suit: "spades", rank: "3" },
    { id: "spades_4", suit: "spades", rank: "4" },
    { id: "spades_5", suit: "spades", rank: "5" },
    { id: "spades_6", suit: "spades", rank: "6" },
    { id: "spades_7", suit: "spades", rank: "7" },
    { id: "spades_8", suit: "spades", rank: "8" },
    { id: "spades_9", suit: "spades", rank: "9" },
    { id: "spades_10", suit: "spades", rank: "10" },
    { id: "spades_J", suit: "spades", rank: "J" },
    { id: "spades_Q", suit: "spades", rank: "Q" },
    { id: "spades_K", suit: "spades", rank: "K" },
    { id: "spades_A", suit: "spades", rank: "A" }
] as const;


// insert the seed data into the database
export async function seedDatabase(db: SQLiteDatabase) {
	seedPlayers(db);
	seedCards(db);
}

async function seedPlayers(db: SQLiteDatabase) {
	const insertPlayer = db.prepareAsync(`
		INSERT OR IGNORE INTO players (id, name)
		VALUES ($id, $name)
		`);

	for (const player of SEEDED_PLAYERS) {
		await insertPlayer.executeAsync(player.id, player.name);
	}
}
async function seedCards(db: SQLiteDatabase) {
	const insertCards = db.prepareAsync(`
		INSERT OR IGNORE INTO cards (id, suit, rank)
		VALUES ($id, $suit, $rank)
		`);

	for (const card of SEEDED_CARDS) {
		await insertCards.executeAsync(card.id, card.suit, card.rank);
	}
}


