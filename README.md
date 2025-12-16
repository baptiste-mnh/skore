# Skore

**Skore** - Real-time multiplayer score tracker with Socket.io synchronization. No account needed, just share a room code and start tracking scores for any game. Built with React, TypeScript, and Socket.io infrastructure for future peer-to-peer features.

> 🚧 **Roadmap**:
>
> - Removing WebRTC to use onlySocket.io for all synchronization.
> - Add optional Redis persistence for rooms.

🎮 **[Try it now at skore.manach.dev](https://skore.manach.dev)**

## Features

- **Real-time sync**: Score updates sync instantly across all connected players via Socket.io
- **Instant rooms**: Create a room in one click and get a shareable 6-character code
- **Reconnection support**: Reload the page and automatically rejoin with your same player state
- **Mobile-friendly**: Works seamlessly on phones, tablets, and desktops
- **Animated scores**: Smooth counter animations when scores change
- **Custom profiles**: Choose your avatar and display name
- **WebRTC ready**: Infrastructure in place for future P2P data synchronization

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Vite 7
- **Real-time Communication**: Socket.io for game state synchronization
- **P2P Infrastructure**: Native WebRTC with data channels (ready for future use)
- **Backend**: Node.js, Express, Socket.io server for room management and signaling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/baptiste-mnh/skore.git
cd skore

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Running Locally

```bash
# Start the signaling server
cd server
npm run dev

# In another terminal, start the client
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

### Self-Hosting with Docker

You can easily self-host Skore using Docker:

```bash
# Build and run with Docker Compose
docker-compose up -d
```

The app will be available at `http://localhost:3000`

## How It Works

1. **Create a Room**: One player creates a room and gets a unique 6-character code
2. **Share the Link**: Share the room URL or code with other players
3. **Connect**: Players join the room via Socket.io (WebRTC connections are established for future features)
4. **Track Scores**: All score changes sync instantly across all connected devices through the Socket.io server

### Architecture

- **Current**: Game state synchronized via Socket.io server for reliability and simplicity
- **In-memory rooms**: Rooms persist for 10 minutes after all players disconnect, but are wiped on server restart
- **Reconnection**: Players can reload and automatically rejoin with their saved state (stored in localStorage)
- **Future**: WebRTC data channels are set up and ready for direct peer-to-peer game state synchronization

## License

MIT License - see [LICENSE](LICENSE) for details

## Author

Made with ♥ by [@baptiste-mnh](https://github.com/baptiste-mnh)
