import { useEffect, useRef } from "react";
import { useGame } from "./useGame";

export const useP2P = () => {
  const { socket } = useGame();
  const peersRef = useRef<{ [key: string]: RTCPeerConnection }>({});

  useEffect(() => {
    if (!socket) return;

    socket.on("signal", async (data) => {
      const { sender, signal } = data;

      if (!peersRef.current[sender]) {
        // eslint-disable-next-line react-hooks/immutability
        createPeer(sender, false);
      }

      const peer = peersRef.current[sender];

      if (signal.type === "offer") {
        await peer.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("signal", { target: sender, signal: answer });
      } else if (signal.type === "answer") {
        await peer.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (signal.candidate) {
        await peer.addIceCandidate(new RTCIceCandidate(signal));
      }
    });

    return () => {
      socket.off("signal");
    };
  }, [socket]);

  const createPeer = (targetId: string, initiator: boolean) => {
    if (!socket) return;

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", { target: targetId, signal: event.candidate });
      }
    };

    peer.onnegotiationneeded = async () => {
      if (initiator) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("signal", { target: targetId, signal: offer });
      }
    };

    // Data Channel for P2P updates
    if (initiator) {
      const channel = peer.createDataChannel("skore-data");
      setupDataChannel(channel);
    } else {
      peer.ondatachannel = (event) => {
        setupDataChannel(event.channel);
      };
    }

    peersRef.current[targetId] = peer;
    return peer;
  };

  const setupDataChannel = (channel: RTCDataChannel) => {
    channel.onopen = () => console.log("Data Channel Open");
    channel.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("P2P Message:", data);
    };
  };

  return { peersRef };
};
