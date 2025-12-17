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
            All game data is stored temporarily in our database (Redis).
          </p>
          <ul className="list-disc ml-6 space-y-2 text-slate-700">
            <li>
              Data is <strong>not</strong> linked to any personal account or
              email
            </li>
            <li>
              Data is <strong>not</strong> shared with third parties
            </li>
            <li>No cookies are used for tracking purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-prussian mb-3">
            Automatic Data Deletion
          </h2>
          <div className="bg-gold/10 p-4 rounded-lg border border-gold/20 mb-3">
            <p className="font-semibold text-prussian">
              All room data is automatically deleted after 1 hour of inactivity.
            </p>
          </div>
          <p className="text-slate-700">
            Every interaction (score update, player join, name change, etc.)
            resets the 1-hour timer. If no activity occurs in a room for 1 hour,
            all data associated with that room is permanently and automatically
            deleted from our servers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-prussian mb-3">
            Local Storage
          </h2>
          <p className="text-slate-700">
            Skore uses browser localStorage to remember your player ID for
            reconnection purposes. This data stays on your device and can be
            cleared by clearing your browser data.
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
