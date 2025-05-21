# Eventology Game Server

This repository contains the **multiplayer game server** for the **Eventology** platform — a cultural event and activity management system developed in collaboration with the local city council to power interactive experiences at the “Edifici de la Cultura.” This server handles real-time multiplayer games, such as the classic **“tag” (pilla-pilla)** game, where players chase and evade each other within a defined game area.

The game server is developed in **Node.js** and manages game logic, role assignment, player movement synchronization, and communication with clients over WebSockets.

## 🎮 Features

### **Game Session Management**
- Create and manage game rooms dynamically.
- Assign roles to players (e.g., **tagger** and **runners**).
- Define win conditions and time limits.
- Handle player disconnections and reconnections.

### **Real-Time Synchronization**
- Track and update player positions in real time.
- Detect collisions (e.g., when a player is tagged).
- Sync game state across all connected clients instantly.

### **Client Communication**
- WebSocket-based API for real-time bidirectional communication.
- Broadcast important events (e.g., "Player X has been tagged") to all connected clients.
- Lightweight message protocol for performance and scalability.

## 🧱 Technical Requirements

- Built in **Node.js** using a modular architecture.
- Uses the **`ws`** library for WebSocket handling.
- Server state managed in-memory, optimized for short-lived game sessions.
- Future extensibility planned for:
  - REST API with **Express**
  - Game state persistence (e.g., MongoDB or Redis)
  - Multi-room orchestration

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Eventolog/game-server.git
   ```

2. Enter the project directory:
   ```bash
   cd game-server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   node index.js
   ```

The server runs by default on port `8080`. You can modify the port in the configuration file or `index.js` as needed.

## 📦 Dependencies

- [`ws`](https://github.com/websockets/ws): WebSocket server for real-time communication.
- (Optional) [`express`](https://expressjs.com/): REST API integration.
- Lightweight architecture with minimal dependencies to keep latency low.

## 👥 Contributing

Contributions are welcome! Feel free to fork the repository, report issues, or submit pull requests to help improve the server or add new features.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions, suggestions, or bug reports, you can contact the development team at:  [148581386+rwxce@users.noreply.github.com](mailto:148581386+rwxce@users.noreply.github.com)
