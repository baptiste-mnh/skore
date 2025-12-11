# Skore

**Skore** - Real-time multiplayer score tracker with WebRTC peer-to-peer connections. No account needed, just share a room code and start tracking scores for any game. Built with React, Socket.io signaling, and direct P2P communication.

🎮 **[Try it now at skore.manach.dev](https://skore.manach.dev)**

## Features

- **Peer-to-peer**: Direct WebRTC connections between players—no backend server storing your data
- **Instant rooms**: Create a room in one click and get a shareable 6-character code
- **Real-time sync**: Score updates sync instantly across all connected players
- **Mobile-friendly**: Works seamlessly on phones, tablets, and desktops
- **Animated scores**: Smooth counter animations when scores change
- **Custom profiles**: Choose your avatar and display name

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Real-time**: WebRTC (PeerJS) for peer-to-peer connections
- **Signaling**: Self-hosted Socket.io server for initial peer discovery and room coordination
- **Backend**: Node.js, Express

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
3. **Connect**: Players join via WebRTC peer-to-peer connections
4. **Track Scores**: All score changes sync instantly across all connected devices

## License

MIT License - see [LICENSE](LICENSE) for details

## Author

Made with ♥ by [@baptiste-mnh](https://github.com/baptiste-mnh)
