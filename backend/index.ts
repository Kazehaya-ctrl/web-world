import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { playerDetailSchema } from "../src/utils/interface/schema";

const app = express();
app.use(cors());
const port = 3000;
let players: { [id: string]: playerDetailSchema } = {};

const server = app.listen(port, function () {
	console.log(new Date() + ` port Running: ${port}`);
});

const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(`Connection established ${socket.id}`);
	players[socket.id] = {
		x: Math.random() * 800,
		y: Math.random() * 600,
		id: socket.id,
	};

	console.log(players);
	io.emit("currentPlayers", players);
	socket.broadcast.emit("newPlayer", players[socket.id]);

	socket.on("playerPosition", (playerDetail: playerDetailSchema) => {
		console.log(
			`Player Position of ${playerDetail.id} x: ${playerDetail.x} and y: ${playerDetail.y}`
		);
		for (let key in players) {
			if (playerDetail.id == key) {
				players[playerDetail.id] = {
					x: playerDetail.x,
					y: playerDetail.y,
				};
				socket.broadcast.emit("playersMove", playerDetail);
			}
		}
	});

	socket.on("disconnect", () => {
		console.log(`Client disconnected: ${socket.id}`);
		delete players[socket.id];
		io.emit("playerDisconnected", socket.id);
	});
});
