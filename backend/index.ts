import express from "express";
import { Server } from "socket.io";
import { playerDetailSchema } from "../src/utils/interface/schema";

const app = express();
const server = app.listen(4000, () => {
    console.log(`${new Date()} backend runnnin on port 4000`);
});

const io = new Server(server, {
    transports: ['websocket'],
    pingTimeout: 60000,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    connectTimeout: 5000,
    // Add these new options
    allowEIO3: true,
    serveClient: false,
    allowUpgrades: false
});
let players: Map<string, playerDetailSchema> = new Map();

io.on("connection", (socket) => {
    console.log('--------------------');
    console.log(`New connection attempt ${socket.id}`);
    console.log('Connection details:');
    console.log('IP:', socket.handshake.address);
    console.log('Headers:', socket.handshake.headers);
    console.log('Query params:', socket.handshake.query);
    console.log('User Agent:', socket.handshake.headers['user-agent']);
    console.log(`Total active connections: ${io.engine.clientsCount}`);
    console.log(`Connection transport: ${socket.conn.transport.name}`);
    console.log('--------------------');

    // Force disconnect unknown connections
    if (!socket.handshake.headers['user-agent']) {
        console.log(`Rejecting connection without user agent: ${socket.id}`);
        socket.disconnect();
        return;
    }
    console.log(`Player Connected ${socket.id}`);
    players.set(socket.id, {
        id: socket.id,
        x: 332,
        y: 1216
    })

    console.log(players);
    socket.broadcast.emit('newPlayer', players.get(socket.id))
    socket.emit('currentPlayers', Object.fromEntries(players));

    socket.on('playerMove', (player: playerDetailSchema) => {
        if (player && player.id && players.has(player.id)) {
            players.set(player.id, player);
            socket.broadcast.emit('playerMoved', player);
        }
    });

    socket.on('playerAreNear', (playersInvolved: { player1id: string, player2id: string, distance: number }) => {
        const isNear = playersInvolved.distance < 100
        socket.to(playersInvolved.player1id).emit('enableInteration', { playerid: playersInvolved.player1id, isNear })
        socket.to(playersInvolved.player2id).emit('enableInteration', { playerid: playersInvolved.player2id, isNear })
    })

    socket.on('disconnect', () => {
        console.log(`Player Disconnected ${socket.id}`);
        players.delete(socket.id);
        socket.broadcast.emit('playerDisconnected', socket.id);
    });
});
