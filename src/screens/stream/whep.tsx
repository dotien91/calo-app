import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { RTCPeerConnection, RTCView, MediaStream } from "react-native-webrtc";

const ViewLivestreamCloudflare = ({ url }: { url: string }) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const client = useRef(null);

  useEffect(() => {
    const initializeWHEPClient = async () => {
      try {
        // 1. Tạo RTCPeerConnection
        peerConnection.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }],
        });

        // 2. Nhận stream video từ server
        peerConnection.current.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            remoteStream.current = event.streams[0];
          }
        };

        // 3. Tạo SDP Offer
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        // 4. Gửi SDP Offer tới server
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sdp: offer.sdp, type: offer.type }),
        });

        console.log("res.1..", response);

        const { sdp: answerSDP } = await response.json();
        await peerConnection.current.setRemoteDescription({
          type: "answer",
          sdp: answerSDP,
        });
      } catch (error) {
        console.error("Error initializing WHEPClient:", error);
      }
    };

    initializeWHEPClient();

    return () => {
      // Cleanup PeerConnection khi component bị unmount
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [url]);

  return (
    <View style={styles.container}>
      {remoteStream.current && (
        <RTCView
          streamURL={remoteStream.current.toURL()}
          style={styles.video}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default ViewLivestreamCloudflare;
