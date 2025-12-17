import { LogOut, RefreshCw, Share2, UserPlus, Trophy } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import type { Player } from "./context/GameContext";
import { useGame } from "./hooks/useGame";
import { usePeerConnections } from "./hooks/usePeerConnections";
import AlertModal from "./components/AlertModal";
import ConfirmModal from "./components/ConfirmModal";
import AddOfflinePlayerModal from "./components/AddOfflinePlayerModal";
import TakeControlModal from "./components/TakeControlModal";
import ErrorToast from "./components/ErrorToast";
import NumpadModal from "./components/NumpadModal";
import DeltaInputModal from "./components/DeltaInputModal";
import ShareModal from "./components/ShareModal";
import EditProfileModal from "./components/EditProfileModal";
import LeaderboardModal from "./components/LeaderboardModal";
import PlayerCard from "./components/PlayerCard";
import SocketStatus from "./components/SocketStatus";
import Logo from "./components/Logo";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import PasswordPromptModal from "./components/PasswordPromptModal";

function App() {
  const {
    gameState,
    createRoom,
    joinRoom,
    rejoinRoom,
    checkRoom,
    updateScore,
    resetGame,
    updatePlayerName,
    removePlayer,
    addOfflinePlayer,
    roomStatus,
    clearRoomStatus,
    error,
    clearError,
    socket,
    isConnected,
  } = useGame();
  usePeerConnections(); // Initialize P2P listeners

  const [inputName, setInputName] = useState(
    () => localStorage.getItem("skore_name") || ""
  );
  const [inputRoomId, setInputRoomId] = useState("");
  const [view, setView] = useState<"lobby" | "game">("lobby");

  // Password-protected rooms
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [createRoomPassword, setCreateRoomPassword] = useState("");
  const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
  const [pendingJoinAction, setPendingJoinAction] = useState<{
    roomId: string;
    takeControlOfPlayerId?: string;
  } | null>(null);

  // Numpad State
  const [numpadOpen, setNumpadOpen] = useState(false);
  const [deltaInputOpen, setDeltaInputOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isDeltaPositive, setIsDeltaPositive] = useState(true);

  // Offline Player Modals
  const [addOfflinePlayerOpen, setAddOfflinePlayerOpen] = useState(false);
  const [availableOfflinePlayers, setAvailableOfflinePlayers] = useState<
    Player[]
  >([]);
  const [showTakeControlModal, setShowTakeControlModal] = useState(false);

  // Alert & Confirm Modals
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("Info");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("Confirm");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmVariant, setConfirmVariant] = useState<"default" | "danger">(
    "default"
  );
  const [confirmTexts, setConfirmTexts] = useState({
    confirm: "Confirm",
    cancel: "Cancel",
  });

  // Room from URL
  const [hasRoomInUrl, setHasRoomInUrl] = useState(false);

  const animalMap = {
    Lion: "🦁",
    Tiger: "🐯",
    Bear: "🐻",
    Eagle: "🦅",
    Fox: "🦊",
    Panda: "🐼",
    Wolf: "🐺",
    Dinosaur: "🦖",
    Unicorn: "🦄",
    Dragon: "🐉",
  };

  const generateAdjective = () => {
    const adj = ["Happy", "Strong", "Fast", "Brave", "Wise", "Cool", "Silly"];

    return adj[Math.floor(Math.random() * adj.length)];
  };

  const generateAnimal = () => {
    const animals = Object.keys(animalMap);
    return animals[
      Math.floor(Math.random() * animals.length)
    ] as keyof typeof animalMap;
  };

  // Fallback/Helper functions for random generation without specific mapping requirement
  // or when we just need a name/avatar quickly
  const generateName = () => {
    const adjective = generateAdjective();
    const animal = generateAnimal();
    return `${adjective} ${animal}`;
  };

  const getRandomAvatar = () => {
    const animals = Object.keys(animalMap) as (keyof typeof animalMap)[];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return animalMap[randomAnimal];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate default placeholder name once
  const [defaultName] = useState<{
    adjective: string;
    animal: keyof typeof animalMap;
  }>(() => ({
    adjective: generateAdjective(),
    animal: generateAnimal(),
  }));

  const handleJoinClick = () => {
    if (!inputRoomId) return;

    // Always check room first to see available offline players
    checkRoom(inputRoomId);
  };

  const proceedWithJoin = (takeControlOfPlayerId?: string) => {
    // Use inputName if provided, otherwise use default placeholder name
    const name = inputName || `${defaultName.adjective} ${defaultName.animal}`;
    const avatar = inputName
      ? getRandomAvatar()
      : animalMap[defaultName.animal];
    localStorage.setItem("skore_name", name);

    // Get access token from localStorage
    const accessToken =
      localStorage.getItem(`skore_access_token_${inputRoomId}`) || undefined;

    if (takeControlOfPlayerId) {
      // Take control of offline player
      rejoinRoom(inputRoomId, takeControlOfPlayerId, undefined, accessToken);
      localStorage.setItem(`skore_user_${inputRoomId}`, takeControlOfPlayerId);
    } else {
      // Create new player
      joinRoom(inputRoomId, name, avatar, undefined, accessToken);
    }

    setShowTakeControlModal(false);
    setAvailableOfflinePlayers([]);
  };

  const handlePasswordSubmit = (password: string) => {
    const name = inputName || `${defaultName.adjective} ${defaultName.animal}`;
    const avatar = inputName
      ? getRandomAvatar()
      : animalMap[defaultName.animal];
    localStorage.setItem("skore_name", name);

    if (pendingJoinAction?.takeControlOfPlayerId) {
      rejoinRoom(
        inputRoomId,
        pendingJoinAction.takeControlOfPlayerId,
        password
      );
      localStorage.setItem(
        `skore_user_${inputRoomId}`,
        pendingJoinAction.takeControlOfPlayerId
      );
    } else {
      joinRoom(inputRoomId, name, avatar, password);
    }

    setPasswordPromptOpen(false);
    setPendingJoinAction(null);
  };

  const handleProfileUpdate = (name: string, avatar: string) => {
    localStorage.setItem("skore_name", name);
    if (gameState.roomId) {
      updatePlayerName(gameState.roomId, name, avatar);
    }
  };

  const openNumpad = (player: Player) => {
    setSelectedPlayer(player);
    setNumpadOpen(true);
  };

  const openDeltaInput = (player: Player, isPositive: boolean) => {
    setSelectedPlayer(player);
    setIsDeltaPositive(isPositive);
    setDeltaInputOpen(true);
  };

  const handleNumpadSubmit = (val: number) => {
    if (selectedPlayer) {
      // Calculate delta to set exact score
      const delta = val - selectedPlayer.score;
      updateScore(selectedPlayer.id, delta);
    }
  };

  const handleDeltaSubmit = (delta: number) => {
    if (selectedPlayer) {
      updateScore(selectedPlayer.id, delta);
    }
  };

  // Alert & Confirm helpers
  const showAlert = (message: string, title: string = "Info") => {
    setAlertMessage(message);
    setAlertTitle(title);
    setAlertOpen(true);
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      variant?: "default" | "danger";
    }
  ) => {
    setConfirmMessage(message);
    setConfirmTitle(options?.title || "Confirm");
    setConfirmAction(() => onConfirm);
    setConfirmVariant(options?.variant || "default");
    setConfirmTexts({
      confirm: options?.confirmText || "Confirm",
      cancel: options?.cancelText || "Cancel",
    });
    setConfirmOpen(true);
  };

  // Check for privacy route
  const isPrivacyRoute = window.location.pathname === "/privacy";

  // Simple: Check URL for room ID on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let roomParam = params.get("room");

    const pathSegment = window.location.pathname.slice(1);
    if (!roomParam && pathSegment && /^[A-Z0-9]{6}$/i.test(pathSegment)) {
      roomParam = pathSegment;
    }

    if (roomParam) {
      setInputRoomId(roomParam.toUpperCase());
      setHasRoomInUrl(true);
    } else {
      setHasRoomInUrl(false);
    }
  }, []);

  // Auto-reconnect when page loads with room URL (only if user was previously in this room)
  useEffect(() => {
    if (hasRoomInUrl && inputRoomId && isConnected && !gameState.roomId) {
      const savedUserId = localStorage.getItem(`skore_user_${inputRoomId}`);

      // Only auto-reconnect if we have a saved user ID (returning user)
      // New users should see the name input form first
      if (savedUserId) {
        console.debug("🔄 Auto-reconnecting to room:", inputRoomId);
        checkRoom(inputRoomId);
      }
    }
  }, [hasRoomInUrl, inputRoomId, isConnected, gameState.roomId]);

  useEffect(() => {
    if (gameState.roomId) {
      setView("game");

      // Save current user ID for this room
      if (gameState.currentPlayer) {
        localStorage.setItem(
          `skore_user_${gameState.roomId}`,
          gameState.currentPlayer.id
        );
      }

      // Add to recent rooms
      const saved = localStorage.getItem("skore_recent_rooms");
      const prev = saved ? JSON.parse(saved) : [];
      const newHistory = [
        gameState.roomId!,
        ...prev.filter((id: string) => id !== gameState.roomId),
      ].slice(0, 3);
      localStorage.setItem("skore_recent_rooms", JSON.stringify(newHistory));

      // Clean URL (update path to room ID for clean sharing)
      window.history.replaceState({}, "", `/${gameState.roomId}`);
    }
  }, [gameState.roomId, gameState.currentPlayer]);

  // Handle room status for offline player selection
  useEffect(() => {
    if (roomStatus) {
      console.debug("🔍 roomStatus received:", roomStatus);
      console.debug("🔍 inputRoomId:", inputRoomId);

      const savedUserId = localStorage.getItem(`skore_user_${inputRoomId}`);
      const accessToken =
        localStorage.getItem(`skore_access_token_${inputRoomId}`) || undefined;
      console.debug("🔍 savedUserId:", savedUserId);
      console.debug("🔍 hasAccessToken:", !!accessToken);

      // If private room and no access token, prompt for password
      if (roomStatus.isPrivate && !accessToken) {
        console.debug("🔍 Private room without token, showing password prompt");
        setPendingJoinAction({
          roomId: inputRoomId,
          takeControlOfPlayerId: savedUserId || undefined,
        });
        setPasswordPromptOpen(true);
        clearRoomStatus();
        return;
      }

      // Check if saved user ID exists (reconnection scenario)
      if (savedUserId) {
        const savedPlayer = roomStatus.players.find(
          (p) => p.id === savedUserId
        );
        console.debug("🔍 savedPlayer:", savedPlayer);

        // If saved player exists in room, always try to rejoin (regardless of online status)
        // This handles page refresh where the player might still appear online
        if (savedPlayer) {
          console.debug("🔍 Rejoining with saved player (auto-reconnect)");
          rejoinRoom(inputRoomId, savedUserId, undefined, accessToken);
          clearRoomStatus();
          return;
        }

        // If saved player doesn't exist in room anymore, continue with normal join flow
      }

      // Filter offline players
      const offlinePlayers = roomStatus.players.filter((p) => !p.isOnline);
      console.debug("🔍 offlinePlayers:", offlinePlayers);

      if (offlinePlayers.length > 0) {
        console.debug("🔍 Showing TakeControlModal");
        setAvailableOfflinePlayers(offlinePlayers);
        setShowTakeControlModal(true);
      } else {
        console.debug("🔍 No offline players, proceeding with join");
        proceedWithJoin();
      }

      clearRoomStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomStatus]);

  // Note: "Room not found" errors are now displayed in the ErrorToast component

  // Show Privacy Policy if on /privacy route
  if (isPrivacyRoute) {
    return <PrivacyPolicy />;
  }

  if (view === "lobby") {
    // Simple version: if room in URL, show join interface only
    if (hasRoomInUrl) {
      return (
        <div className="min-h-screen bg-white flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
            <Logo className="text-4xl text-gold mb-2" />
            <p className="text-slate-500 mb-8 text-center">
              Join Room{" "}
              <span className="font-mono font-bold">#{inputRoomId}</span>
            </p>

            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-prussian mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder={`${defaultName.adjective} ${defaultName.animal}`}
                  className="w-full p-3 rounded-xl border border-alabaster focus:ring-2 focus:ring-gold outline-none transition-all"
                  maxLength={20}
                  autoFocus
                />
              </div>

              <button
                onClick={handleJoinClick}
                className="w-full py-4 bg-gold text-white rounded-xl font-bold shadow-lg shadow-gold/20 active:scale-95 transition-transform"
              >
                Join Room
              </button>

              <div className="text-center mt-6">
                <a
                  href="/"
                  className="text-sm text-slate-500 hover:text-gold underline"
                >
                  Create or join a room instead
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-slate-400 text-xs pb-8 px-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <a
                href="https://github.com/baptiste-mnh/skore"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-600 transition-colors"
              >
                <SiGithub size={16} />
              </a>
              <span>•</span>
              <a
                href="https://github.com/baptiste-mnh/skore/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-600 transition-colors"
              >
                MIT License
              </a>
              <span>•</span>
              <a
                href="/privacy"
                className="hover:text-slate-600 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
            <p>
              Made with <span className="text-red-400">♥</span> by{" "}
              <a
                href="https://github.com/baptiste-mnh"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:text-gold transition-colors"
              >
                @baptiste-mnh
              </a>
            </p>
          </div>

          {/* TakeControlModal for joining with offline players */}
          <TakeControlModal
            isOpen={showTakeControlModal}
            onClose={() => {
              setShowTakeControlModal(false);
              setAvailableOfflinePlayers([]);
            }}
            offlinePlayers={availableOfflinePlayers}
            onTakeControl={(playerId) => proceedWithJoin(playerId)}
            onCreateNew={() => proceedWithJoin()}
          />

          {/* PasswordPromptModal for private rooms */}
          <PasswordPromptModal
            isOpen={passwordPromptOpen}
            onClose={() => {
              setPasswordPromptOpen(false);
              setPendingJoinAction(null);
            }}
            onSubmit={handlePasswordSubmit}
            roomId={inputRoomId}
          />

          {/* Error Toast */}
          {error && (
            <ErrorToast message={error} onClose={clearError} duration={5000} />
          )}
        </div>
      );
    }

    // Normal lobby: no room ID in URL
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
          <Logo className="text-4xl text-[#fca311] mb-2" />
          <p className="text-slate-500 mb-2 text-center">
            Real-time multiplayer score sharing
          </p>

          <div className="w-full space-y-4">
            {/* Private Room Toggle */}
            <div className="flex items-center gap-2 p-3 bg-alabaster rounded-xl">
              <input
                type="checkbox"
                id="private-room"
                checked={isPrivateRoom}
                onChange={(e) => setIsPrivateRoom(e.target.checked)}
                className="w-4 h-4 text-gold focus:ring-gold rounded cursor-pointer"
              />
              <label
                htmlFor="private-room"
                className="text-sm text-prussian cursor-pointer select-none"
              >
                Private Room (password protected)
              </label>
            </div>

            {/* Password Input (shown if private room selected) */}
            {isPrivateRoom && (
              <div>
                <label className="block text-sm font-medium text-prussian mb-1">
                  Room Password
                </label>
                <input
                  type="password"
                  value={createRoomPassword}
                  onChange={(e) => setCreateRoomPassword(e.target.value)}
                  placeholder="Enter password (4-20 characters)"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                  minLength={4}
                  maxLength={20}
                  autoFocus
                />
              </div>
            )}

            <button
              onClick={() => {
                const name = inputName || generateName();
                const avatar = getRandomAvatar();
                localStorage.setItem("skore_name", name);

                // Validate password if private room
                if (isPrivateRoom) {
                  if (!createRoomPassword || createRoomPassword.length < 4) {
                    showAlert(
                      "Password must be at least 4 characters",
                      "Invalid Password"
                    );
                    return;
                  }
                  if (createRoomPassword.length > 20) {
                    showAlert(
                      "Password must be 20 characters or less",
                      "Invalid Password"
                    );
                    return;
                  }
                }

                createRoom(
                  name,
                  avatar,
                  isPrivateRoom ? createRoomPassword : undefined
                );
              }}
              className="w-full py-4 bg-gold text-white rounded-xl font-bold shadow-lg shadow-gold/20 active:scale-95 transition-transform"
            >
              Create New Room
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-alabaster"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-500">
                  or join existing
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Room ID"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                className="flex-1 p-3 rounded-xl border border-alabaster focus:ring-2 focus:ring-gold outline-none transition-all font-mono"
                maxLength={6}
              />
              <button
                onClick={handleJoinClick}
                disabled={!inputRoomId || inputRoomId.length !== 6}
                className="px-6 py-3 bg-alabaster text-black rounded-xl font-bold hover:bg-prussian/10 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join
              </button>
            </div>

            {localStorage.getItem("skore_recent_rooms") &&
              JSON.parse(localStorage.getItem("skore_recent_rooms") || "[]")
                .length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-slate-500 mb-2">Recent Rooms</p>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(
                      localStorage.getItem("skore_recent_rooms") || "[]"
                    ).map((roomId: string) => (
                      <button
                        key={roomId}
                        onClick={() => {
                          setInputRoomId(roomId);
                          handleJoinClick();
                        }}
                        className="px-3 py-1.5 bg-white border border-alabaster rounded-lg text-xs font-mono text-black hover:border-gold hover:text-gold transition-colors"
                      >
                        #{roomId}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-xs pb-8 px-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <a
              href="https://github.com/baptiste-mnh/skore"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 transition-colors"
            >
              <SiGithub size={16} />
            </a>
            <span>•</span>
            <a
              href="https://github.com/baptiste-mnh/skore/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 transition-colors"
            >
              MIT License
            </a>
            <span>•</span>
            <a
              href="/privacy"
              className="hover:text-slate-600 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
          <p>
            Made with <span className="text-red-400">♥</span> by{" "}
            <a
              href="https://github.com/baptiste-mnh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-indigo-500 transition-colors"
            >
              @baptiste-mnh
            </a>
          </p>
        </div>

        {/* TakeControlModal for joining with offline players */}
        <TakeControlModal
          isOpen={showTakeControlModal}
          onClose={() => {
            setShowTakeControlModal(false);
            setAvailableOfflinePlayers([]);
          }}
          offlinePlayers={availableOfflinePlayers}
          onTakeControl={(playerId) => proceedWithJoin(playerId)}
          onCreateNew={() => proceedWithJoin()}
        />

        {/* PasswordPromptModal for private rooms */}
        <PasswordPromptModal
          isOpen={passwordPromptOpen}
          onClose={() => {
            setPasswordPromptOpen(false);
            setPendingJoinAction(null);
          }}
          onSubmit={handlePasswordSubmit}
          roomId={inputRoomId}
        />

        {/* Error Toast */}
        {error && (
          <ErrorToast message={error} onClose={clearError} duration={5000} />
        )}
      </div>
    );
  }

  if (view === "game") {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="bg-white border-b border-alabaster p-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {/* Logo (Top Left) */}
            <Logo className="text-xl text-gold" />

            <div className="flex items-center gap-2">
              {gameState.currentPlayer?.isHost && (
                <button
                  onClick={() => {
                    showConfirm(
                      "Reset all scores? This action cannot be undone.",
                      () => resetGame(),
                      {
                        title: "Reset Scores",
                        confirmText: "Reset",
                        variant: "danger",
                      }
                    );
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 active:scale-95"
                >
                  <RefreshCw size={20} />
                </button>
              )}
              <button
                onClick={() => {
                  showConfirm(
                    "Are you sure you want to exit this room?",
                    () => {
                      window.location.href = "/";
                    },
                    {
                      title: "Exit Room",
                      confirmText: "Exit",
                    }
                  );
                }}
                className="p-2 text-slate-400 hover:text-slate-600 active:scale-95"
              >
                <LogOut size={20} />
              </button>
              {/* Profile Bubble (Top Right) */}
              <button
                onClick={() => setEditProfileOpen(true)}
                className="flex items-center gap-2 p-1 pr-3 bg-alabaster hover:bg-gold/10 rounded-full transition-colors active:scale-95"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-lg">
                  {gameState.currentPlayer?.avatar}
                </div>
                {/* Mobile: initiales seulement */}
                <span className="sm:hidden text-sm font-bold text-prussian">
                  {gameState.currentPlayer?.name
                    ? getInitials(gameState.currentPlayer.name)
                    : ""}
                </span>
                {/* Desktop: nom complet */}
                <span className="hidden sm:inline text-sm font-bold text-prussian max-w-[120px] truncate">
                  {gameState.currentPlayer?.name &&
                  gameState.currentPlayer.name.length > 15
                    ? `${gameState.currentPlayer.name.slice(0, 15)}...`
                    : gameState.currentPlayer?.name}
                </span>
              </button>
              <button
                onClick={() => setLeaderboardOpen(true)}
                className="p-2 text-gold bg-gold/10 rounded-full hover:bg-gold/20 active:scale-95 transition-transform"
                title="View leaderboard"
              >
                <Trophy size={20} />
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="p-2 text-gold bg-gold/10 rounded-full hover:bg-gold/20 active:scale-95 transition-transform"
                title="Share room"
              >
                <Share2 size={20} />
              </button>
              {gameState.currentPlayer?.isHost && (
                <button
                  onClick={() => setAddOfflinePlayerOpen(true)}
                  className="p-2 text-gold bg-gold/10 rounded-full hover:bg-gold/20 active:scale-95 transition-transform"
                  title="Add offline player"
                >
                  <UserPlus size={20} />
                </button>
              )}
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="px-2 py-1 bg-alabaster rounded-md text-xs font-mono text-slate-500">
              #{gameState.roomId}
            </span>
          </div>
        </div>

        {/* Room Info / QR (Only for Host initially) */}
        {gameState.currentPlayer?.isHost && gameState.players.length === 1 && (
          <div className="bg-gold/10 p-6 text-center border-b border-gold/20">
            <p className="text-sm text-prussian mb-3 font-medium">
              Invite Players
            </p>
            <button
              onClick={() => setShareOpen(true)}
              className="px-4 py-2 bg-white text-gold rounded-lg text-sm font-bold shadow-sm inline-flex items-center gap-2"
            >
              <QRCode value={`skore://${gameState.roomId}`} size={20} />
              Show QR Code
            </button>
          </div>
        )}

        {/* Players */}
        <div className="relative z-20 p-4 space-y-3 max-w-md mx-auto">
          {gameState.players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isMe={player.id === gameState.currentPlayer?.id}
              isHost={gameState.currentPlayer?.isHost || false}
              onOpenNumpad={openNumpad}
              onOpenDeltaInput={openDeltaInput}
              onRemovePlayer={removePlayer}
              onShowConfirm={showConfirm}
            />
          ))}
        </div>

        {/* Logs (Simple) */}
        <div className="fixed bottom-0 left-0 right-0 from-white via-white to-transparent p-4 pointer-events-none h-32 flex flex-col items-center justify-end z-0">
          <div className="max-w-md mx-auto w-full">
            <div className="text-xs text-slate-400 text-center py-2 animate-pulse">
              {gameState.logs.length > 0
                ? gameState.logs[gameState.logs.length - 1]
                : "Waiting for players..."}
            </div>
            {/* Footer - Single Line */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2 pointer-events-auto">
              <Logo className="text-xs text-slate-300" />
              <span>•</span>
              <SocketStatus isConnected={isConnected} socketId={socket?.id} />
              <span>•</span>
              <a
                href="https://github.com/baptiste-mnh/skore"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-600 transition-colors"
              >
                <SiGithub size={14} />
              </a>
              <span>•</span>
              <a
                href="https://github.com/baptiste-mnh/skore/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-600 transition-colors"
              >
                MIT
              </a>
              <span>•</span>
              <a
                href="/privacy"
                className="hover:text-slate-600 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        <NumpadModal
          key={numpadOpen ? "numpad-open" : "numpad-closed"}
          isOpen={numpadOpen}
          onClose={() => setNumpadOpen(false)}
          onSubmit={handleNumpadSubmit}
          initialValue={selectedPlayer?.score || 0}
        />

        <DeltaInputModal
          key={deltaInputOpen ? "delta-open" : "delta-closed"}
          isOpen={deltaInputOpen}
          onClose={() => setDeltaInputOpen(false)}
          onSubmit={handleDeltaSubmit}
          isPositive={isDeltaPositive}
        />

        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          roomId={gameState.roomId}
          onShowAlert={showAlert}
        />

        <EditProfileModal
          key={editProfileOpen ? "open" : "closed"}
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          onSubmit={handleProfileUpdate}
          initialName={gameState.currentPlayer?.name || ""}
          initialAvatar={gameState.currentPlayer?.avatar || "🦁"}
        />

        <LeaderboardModal
          isOpen={leaderboardOpen}
          onClose={() => setLeaderboardOpen(false)}
          players={gameState.players}
          currentPlayerId={gameState.currentPlayer?.id || null}
        />

        <AlertModal
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
          message={alertMessage}
          title={alertTitle}
        />

        <ConfirmModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmAction}
          message={confirmMessage}
          title={confirmTitle}
          confirmText={confirmTexts.confirm}
          cancelText={confirmTexts.cancel}
          variant={confirmVariant}
        />

        <AddOfflinePlayerModal
          isOpen={addOfflinePlayerOpen}
          onClose={() => setAddOfflinePlayerOpen(false)}
          onSubmit={(name, avatar) => {
            if (gameState.roomId) {
              addOfflinePlayer(gameState.roomId, name, avatar);
            }
          }}
        />

        <TakeControlModal
          isOpen={showTakeControlModal}
          onClose={() => {
            setShowTakeControlModal(false);
            setAvailableOfflinePlayers([]);
          }}
          offlinePlayers={availableOfflinePlayers}
          onTakeControl={(playerId) => proceedWithJoin(playerId)}
          onCreateNew={() => proceedWithJoin()}
        />

        {/* PasswordPromptModal for private rooms */}
        <PasswordPromptModal
          isOpen={passwordPromptOpen}
          onClose={() => {
            setPasswordPromptOpen(false);
            setPendingJoinAction(null);
          }}
          onSubmit={handlePasswordSubmit}
          roomId={inputRoomId}
        />

        {/* Error Toast */}
        {error && (
          <ErrorToast message={error} onClose={clearError} duration={5000} />
        )}
      </div>
    );
  }

  return (
    <>
      {/* Error Toast for lobby view */}
      {error && (
        <ErrorToast message={error} onClose={clearError} duration={5000} />
      )}
    </>
  );
}

export default App;
