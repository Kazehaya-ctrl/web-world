import express from "express";
import { Server } from "socket.io";
import { playerDetailSchema } from "../src/utils/interface/schema";

const app = express();
const server = app.listen(4000, () => {
	console.log(`${new Date()} backend runnnin on port 4000`);
});

const io = new Server(server);
let players: Map<string, playerDetailSchema> = new Map();

io.on("connection", (socket) => {
	console.log(`Player Connected ${socket.id}`);
	players.set(socket.id, {
		id: socket.id,
		x: 332,
		y: 1216
	})

	console.log(players);
	socket.emit('newPlayer', players.get(socket.id))
	socket.broadcast.emit('currentPlayers', players);

	socket.on('playerMove', (player: playerDetailSchema) => {
		players.set(player.id!, player);
		socket.broadcast.emit('playerMoved', player);
	});

	socket.on('disconnect', () => {
		console.log(`Player Disconnected ${socket.id}`);
		players.delete(socket.id);
		socket.broadcast.emit('playerDisconnected', players);
	});
});
