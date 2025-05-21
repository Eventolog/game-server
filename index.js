const WebSocket = require('ws');
const Matchmaking = require('./src/matchmaking');
const express = require('express');
const { sequelize } = require('./src/models');
const httpRouter = require('./src/httpRouter');
require('dotenv').config(); // Load env variables from .env

// START HTTP SERVER
const app = express();
const port = process.env.HTTP_PORT || 3001;
const WS_PORT =  process.env.WS_PORT || 3000;
app.use(express.json());
app.use('/', httpRouter);

console.log('Connecting to DB with', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});


sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync DB:', err);
  });


// START WS SERVER
const wss = new WebSocket.Server({ port: WS_PORT });
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

console.log('Servidor WebSocket escuchando en puerto: ' + WS_PORT);
