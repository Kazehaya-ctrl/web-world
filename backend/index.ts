import express from "express";
import { Server } from "socket.io";

const app = express();
const port = 3000;

const server = app.listen(port, function () {
	console.log(new Date() + ` port Running: ${port}`);
});

const io = new Server(server);

io.on("connection", function (socket) {
	console.log(`Socket id for current connection esatablised is ${socket.id}`);

	socket.on("message", function (data) {
		console.log(`Message received by the client is ${data}`);
		socket.broadcast.emit(data);
	});

	socket.on("disconnect", function () {
		console.log(`Client disconnected`);
	});
});
