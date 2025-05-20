const { createUUID } = require('./utils');

class Matchmaking {
  constructor() {
    this.waitingPlayer = null; // { ws, timeoutId }
    this.rooms = new Map();    // roomId -> { players: [ws, ws] }
  }

  join(ws) {
    if (!this.waitingPlayer) {
      // Primer jugador espera
      const id = createUUID();
      ws.matchId = id;
      ws.send(JSON.stringify({ type: 'waiting', message: 'Esperando otro jugador...' }));

      const timeoutId = setTimeout(() => {
        if (this.waitingPlayer && this.waitingPlayer.ws === ws) {
          ws.send(JSON.stringify({ type: 'timeout', message: 'No se encontró jugador. Intenta de nuevo.' }));
          ws.close();
          this.waitingPlayer = null;
        }
      }, 60000);

      this.waitingPlayer = { ws, timeoutId };

    } else {
      // Segundo jugador llega, emparejamos
      const id = this.waitingPlayer.ws.matchId;
      const playerId = 2;
      ws.matchId = id;

      clearTimeout(this.waitingPlayer.timeoutId);

      this.rooms.set(id, { players: [this.waitingPlayer.ws, ws] });
      this.waitingPlayer = null;

      // Avisar a ambos que el juego inicia y pasar posiciones iniciales vacías o por defecto

      this.rooms.get(id).players.forEach((playerWs, i) => {
        const startMsg = JSON.stringify({ type: 'game_start', message: 'Juego iniciado!', matchId: id, opponentPosition: null, playerId : i });
        playerWs.send(startMsg)
      });
    }
  }

  leave(ws) {
    if (this.waitingPlayer && this.waitingPlayer.ws === ws) {
      clearTimeout(this.waitingPlayer.timeoutId);
      this.waitingPlayer = null;
    } else {
      // Buscar y remover jugador de la sala si existe
      for (const [roomId, room] of this.rooms.entries()) {
        if (room.players.includes(ws)) {
          room.players.forEach((playerWs) => {
            if (playerWs !== ws) {
              playerWs.send(JSON.stringify({ type: 'opponent_left', message: 'Tu oponente se desconectó.' }));
            }
          });
          this.rooms.delete(roomId);
          break;
        }
      }
    }
  }

  broadcastPosition(ws, data) {
    const room = this.rooms.get(ws.matchId);
    if (!room) return;

    // Enviar la posición recibida solo al otro jugador
    room.players.forEach(playerWs => {
      if (playerWs.readyState === playerWs.OPEN) {
        // if (playerWs !== ws && playerWs.readyState === playerWs.OPEN) {
        playerWs.send(JSON.stringify(data));
      }
    });
  }


  broadcastGameFinished(ws, data) {
    const room = this.rooms.get(ws.matchId);
    if (!room) return;

    room.players.forEach(playerWs => {
      if (playerWs.readyState === playerWs.OPEN) {
        playerWs.send(JSON.stringify({ type: 'game_finished', data }));
      }
    });
  }
}

module.exports = Matchmaking;
