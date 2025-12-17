export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-prussian mb-6">Privacy Policy</h1>

        <p className="text-sm text-slate-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-prussian mb-3">
            Data We Collect
          </h2>
          <p className="text-slate-700 mb-3">
            Skore collects minimal data to provide the score tracking service:
          </p>
          <ul className="list-disc ml-6 space-y-2 text-slate-700">
            <li>
              <strong>Player name</strong> - The name you choose when joining a
              room
            </li>
            <li>
              <strong>Avatar</strong> - Your selected avatar emoji
            </li>
            <li>
              <strong>Score</strong> - Your game score within a room
            </li>
            <li>
              <strong>Room code</strong> - The 6-character code identifying your
              game room
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-prussian mb-3">
            How Data is Stored
          </h2>
          <p className="text-slate-700 mb-3">
            All game data is stored temporarily using Keyv with Redis backend (in production) or in-memory storage (in development).
          </p>
          <div className="bg-slate-50 p-4 rounded-lg mb-3">
            <p className="text-sm text-slate-600 mb-2">
              <strong>What we store:</strong>
            </p>
            <ul className="list-disc ml-6 space-y-1 text-sm text-slate-600">
              <li>
                <strong>Room data:</strong> Player names, avatars, scores, room codes, and password hashes (for private rooms)
              </li>
              <li>
                <strong>Socket mappings:</strong> Temporary connection IDs to enable reconnection after page refresh
              </li>
              <li>
                <strong>Access tokens:</strong> HMAC-SHA256 tokens for password-protected rooms (stateless, no session storage)
              </li>
            </ul>
          </div>
          <ul className="list-disc ml-6 space-y-2 text-slate-700">
            <li>
              Data is <strong>not</strong> linked to any personal account or
              email
            </li>
            <li>
              Data is <strong>not</strong> shared with third parties
            </li>
            <li>No cookies are used for tracking purposes</li>
            <li>
              All sensitive data (passwords) is hashed using bcrypt before storage
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-prussian mb-3">
            Automatic Data Deletion
          </h2>
          <div className="bg-gold/10 p-4 rounded-lg border border-gold/20 mb-3">
            <p className="font-semibold text-prussian mb-2">
              All data is automatically deleted based on activity:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-sm text-prussian">
              <li>
                <strong>Room data:</strong> Deleted after 1 hour of inactivity
              </li>
              <li>
                <strong>Socket mappings:</strong> Deleted after 24 hours or immediately upon disconnect
              </li>
            </ul>
          </div>
          <p className="text-slate-700 mb-3">
            Every interaction (score update, player join, name change, etc.)
            resets the 1-hour timer for room data. If no activity occurs in a room for 1 hour,
            all data associated with that room is permanently and automatically
            deleted from our servers.
          </p>
          <p className="text-slate-700">
            Connection tracking data (socket mappings) is cleaned up immediately when you disconnect,
            with a 24-hour safety TTL to prevent any data leaks if cleanup fails.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-prussian mb-3">
            Local Storage (Your Device Only)
          </h2>
          <p className="text-slate-700 mb-3">
            Skore uses browser localStorage to enable automatic reconnection when you refresh the page.
            This data stays <strong>only on your device</strong> and is never sent to our servers except when reconnecting.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">
              <strong>What's stored in your browser:</strong>
            </p>
            <ul className="list-disc ml-6 space-y-1 text-sm text-slate-600">
              <li>
                <strong>Player ID per room:</strong> <code className="bg-white px-1 py-0.5 rounded">skore_user_[ROOMID]</code> - Your socket ID for reconnection
              </li>
              <li>
                <strong>Access tokens:</strong> <code className="bg-white px-1 py-0.5 rounded">skore_access_token_[ROOMID]</code> - For password-protected rooms
              </li>
              <li>
                <strong>Your name:</strong> <code className="bg-white px-1 py-0.5 rounded">skore_name</code> - The last name you used
              </li>
              <li>
                <strong>Recent rooms:</strong> <code className="bg-white px-1 py-0.5 rounded">skore_recent_rooms</code> - List of your 3 most recent room codes
              </li>
            </ul>
          </div>
          <p className="text-slate-700 mt-3 text-sm">
            You can clear this data at any time by clearing your browser's local storage or site data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-prussian mb-3">
            Data Security
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-slate-700">
            <li>Connections are encrypted via HTTPS/WSS</li>
            <li>Room codes are randomly generated</li>
            <li>Players can only interact within their own room</li>
            <li>Rate limiting prevents abuse and DoS attacks</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-prussian mb-3">Contact</h2>
          <p className="text-slate-700">
            For questions about this privacy policy, you can open an issue on the{" "}
            <a
              href="https://github.com/baptiste-mnh/skore"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline font-semibold"
            >
              GitHub repository
            </a>
            .
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-alabaster">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gold text-white rounded-xl font-bold hover:bg-gold/90 active:scale-95 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};
