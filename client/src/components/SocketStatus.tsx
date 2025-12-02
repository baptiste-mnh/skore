interface SocketStatusProps {
  isConnected: boolean;
  socketId: string | undefined;
}

export default function SocketStatus({
  isConnected,
  socketId,
}: SocketStatusProps) {
  return (
    <div className="flex items-center gap-1 text-[10px] text-slate-400">
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="font-mono truncate max-w-[80px]">
        {socketId ? socketId.slice(0, 8) : "N/A"}
      </span>
    </div>
  );
}
