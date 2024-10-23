const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let players = [];
let words = [];

server.on('connection', (socket) => {
    if (players.length >= 12) {
        socket.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
        socket.close();
        return;
    }

    players.push(socket);
    updatePlayerCount();

    socket.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'wordSubmit') {
            const word = data.word;

            if (/^[RSTrst]/.test(word)) {
                socket.send(JSON.stringify({ type: 'error', message: 'Word cannot start with R, S, or T' }));
                return;
            }

            words.push(word);
            broadcast({ type: 'newWord', word });
        }
    });

    socket.on('close', () => {
        players = players.filter(player => player !== socket);
        updatePlayerCount();
    });
});

function updatePlayerCount() {
    broadcast({ type: 'updatePlayers', count: players.length });
}

function broadcast(data) {
    players.forEach(player => {
        player.send(JSON.stringify(data));
    });
}

console.log('Server is running on ws://localhost:8080');
