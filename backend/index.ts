import express from "express";
import { Server } from "socket.io";
import cors from "cors";

interface playerCoordiSchema {
	x: number;
	y: number;
	id?: string;
}

const app = express();
app.use(cors());
const port = 3000;

const server = app.listen(port, function () {
	console.log(new Date() + ` port Running: ${port}`);
});

const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

let players: { [id: string]: playerCoordiSchema } = {};

io.on("connection", (socket) => {
	console.log(`Socket id for current connection esatablised is ${socket.id}`);
	players[socket.id] = { x: Math.random() * 800, y: Math.random() * 600 };
	console.log(players);

	socket.emit("currentPlayers", players);

	socket.broadcast.emit("newPlayer", {
		id: socket.id,
		...players[socket.id],
	});

	socket.on("message", (data) => {
		console.log(`Message received by the client is ${data}`);
	});

	socket.on("playerMove", (playerCoordi: playerCoordiSchema) => {
		console.log(
			`Player: ${socket.id} current coordinate x: ${playerCoordi.x}, y: ${playerCoordi.y}`
		);
		if (players[socket.id]) {
			players[socket.id] = playerCoordi;
			socket.broadcast.emit("playerMove", { id: socket.id, ...playerCoordi });
		}
	});

	socket.on("disconnect", () => {
		console.log(`Client disconnected ${socket.id}`);
		delete players[socket.id];
		io.emit("playerDisconnect", socket.id);
	});
});
