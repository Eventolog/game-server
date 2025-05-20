const WebSocket = require('ws');
const Matchmaking = require('./src/matchmaking');

const wss = new WebSocket.Server({ port: 3000 });
const matchmaking = new Matchmaking();

wss.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');

  matchmaking.join(ws);

  ws.on('message', (message) => {
    let msg;
    try {
      msg = JSON.parse(message);
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'JSON inválido' }));
      return;
    }

    if (!msg.type) {
      ws.send(JSON.stringify({ type: 'error', message: 'Falta propiedad type en el mensaje' }));
      return;
    }
    switch (msg.type) {
      case 'position':
        if (msg.data) {
          matchmaking.broadcastPosition(ws, msg);
        }
        break;

      case 'game_finished':
        if (msg.data) {
          matchmaking.broadcastGameFinished(ws, msg.data);
        }
        break;

      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Tipo de mensaje no reconocido' }));
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
    matchmaking.leave(ws);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

console.log('Servidor WebSocket escuchando en puerto 3000');
