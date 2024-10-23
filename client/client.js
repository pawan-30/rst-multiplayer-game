const socket = new WebSocket('ws://localhost:8080');  // Replace with your server address

let playerId = null;
let currentWord = '';
let playersCount = 0;

socket.onopen = function() {
    console.log('Connected to server');
    document.getElementById('status').textContent = 'Waiting for players to join...';
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);

    if (data.type === 'updatePlayers') {
        playersCount = data.count;
        document.getElementById('playerCount').textContent = playersCount;
        if (playersCount >= 12) {
            document.getElementById('status').textContent = 'Game starting...';
        }
    }

    if (data.type === 'newWord') {
        currentWord = data.word;
        document.getElementById('wordDisplay').textContent = `Last Word: ${currentWord}`;
        enableInput();
    }

    if (data.type === 'error') {
        alert(data.message);
    }
};

document.getElementById('submitWord').onclick = function() {
    const word = document.getElementById('wordInput').value.trim();

    if (!word || word.length === 0) {
        alert('Please type a word');
        return;
    }

    if (!/^[^RSTrst]/.test(word)) {
        alert('Word cannot start with R, S, or T');
        return;
    }

    socket.send(JSON.stringify({ type: 'wordSubmit', word }));
    disableInput();
};

function enableInput() {
    document.getElementById('wordInput').disabled = false;
    document.getElementById('submitWord').disabled = false;
}

function disableInput() {
    document.getElementById('wordInput').disabled = true;
    document.getElementById('submitWord').disabled = true;
}
