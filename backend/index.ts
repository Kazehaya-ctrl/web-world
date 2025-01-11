import express from "express";
import { Server } from "socket.io";
import cors from "cors";

interface playerCoordiSchema {
	x: number;
	y: number;
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

io.on("connection", function (socket) {
	console.log(`Socket id for current connection esatablised is ${socket.id}`);
	players[socket.id] = { x: Math.random() * 800, y: Math.random() * 600 };
	socket.broadcast.emit("newPlayer", {
		playerId: socket.id,
		...players[socket.id],
	});

	socket.on("message", function (data) {
		console.log(`Message received by the client is ${data}`);
		socket.broadcast.emit(data);
	});

	socket.on("playerMove", function (playerCoordi: playerCoordiSchema) {
		console.log(
			`Player current coordinate x: ${playerCoordi.x}, y: ${playerCoordi.y}`
		);
		socket.broadcast.emit(
			`Player current coordinate x: ${playerCoordi.x}, y: ${playerCoordi.y}`
		);
	});

	socket.on("disconnect", function () {
		console.log(`Client disconnected`);
	});
});
