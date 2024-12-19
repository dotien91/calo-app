import { TypedUser } from "models";
import React, { useEffect, useRef, useState } from "react";
import InCallManager from "react-native-incall-manager";
import { SvgXml } from "react-native-svg";
import {
  MediaStream,
  RTCPeerConnection,
  mediaDevices,
} from "react-native-webrtc";
import negotiateConnectionWithClientOffer from "./components/negotiateConnectionWithClientOffer";

export enum EnumReaction {
  Like = "like",
  Haha = "haha",
  Wow = "wow",
  Heart = "heart",
  Sad = "sad",
}

export interface LiveStream {
  _id: string;
  live_title: string;
  live_description: string;
  live_avatar: string;
  user_id: {
    user_avatar: string;
    user_avatar_thumbnail: string;
    display_name: string;
    _id: string;
  };
  createdAt: string;
  like_number: number;
  is_like: boolean;
  comment_number: number;
  view_number: number;
  reaction_number: number;
  share_number: number;
  reaction_type: EnumReaction[];
}

export interface TypedReaction {
  id: string;
  react_type: string;
  createBy: TypedUser;
}

const ICE_SERVER = {
  iceServers: [
    {
      urls: "stun:stun.cloudflare.com:3478",
    },
  ],
};

export const useLiveStreamAdmin = () => {
  const [streams, setStreams] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] = useState("");
  const isAlreadyConnected = useRef(false);
  const urlLivestreamRef = useRef("");

  useEffect(() => {
    InCallManager.start({ media: "video" });
    return () => {
      InCallManager.stop();
    };
  }, []);

  useEffect(() => {
    accessLocalMediaSources()
      .then((stream) => {
        if (stream) {
          setStreams(stream);
        }
      })
      .catch(console.error);
  }, []);

  const accessLocalMediaSources = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: "user",
          width: { exact: 1920 },
          height: { exact: 1080 },
        },
      });
      return stream;
    } catch (error) {
      return undefined;
    }
  };

  const startLivestream = async ({
    urlLivestream,
  }: {
    urlLivestream: string;
  }) => {
    urlLivestreamRef.current = urlLivestream;
    peerConnectionRef.current = new RTCPeerConnection(ICE_SERVER);
    /**
     * Listen for negotiationneeded events, and use WHIP as the signaling protocol to establish a connection
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/negotiationneeded_event
     * https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html
     */
    peerConnectionRef.current.addEventListener(
      "negotiationneeded",
      async (ev) => {
        console.log("Connection negotiation starting", ev);
        if (peerConnectionRef.current) {
          await negotiateConnectionWithClientOffer(
            peerConnectionRef.current,
            urlLivestream,
          );
        }
        console.log("Connection negotiation ended");
      },
    );

    peerConnectionRef.current.addEventListener(
      "connectionstatechange",
      (ev) => {
        if (peerConnectionRef.current?.connectionState === "connected") {
          isAlreadyConnected.current = true;
        }
        if (
          isAlreadyConnected.current &&
          peerConnectionRef.current?.connectionState === "disconnected"
        ) {
          console.log("vao day", ev);

          isAlreadyConnected.current = false;
          peerConnectionRef.current?.close();
          startLivestream({ urlLivestream });
          return;
        }
        setConnectionState(peerConnectionRef.current?.connectionState || "");
      },
    );
    /**
     * While the connection is being initialized,
     * connect the video stream to the provided <video> element.
     */
    streams?.getTracks().forEach((track) => {
      peerConnectionRef.current?.addTransceiver(track, {
        /** WHIP is only for sending streaming media */
        direction: "sendonly",
      });
      // if (track.kind == "video" && transceiver.sender.track) {
      //   transceiver.sender.track.applyConstraints({
      //     width: 1280,
      //     height: 720,
      //   });
      // }
    });
  };

  const disconnect = async () => {
    fetch(urlLivestreamRef.current, {
      method: "DELETE",
      mode: "cors",
    }).finally(() => {
      urlLivestreamRef.current = "";
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
      releaseCamera();
    });
  };

  const releaseCamera = () => {
    if (streams) {
      streams?.release();
      setStreams(null);
    }
  };

  const switchCamera = () => {
    streams?.getVideoTracks().forEach((track) => {
      track._switchCamera();
    });
  };

  function toggleCamera(status: any) {
    streams?.getVideoTracks().forEach((track) => {
      track.enabled = status;
    });
  }

  function toggleMic(status: any) {
    streams?.getAudioTracks().forEach((track) => {
      track.enabled = status;
    });
  }

  return {
    streams,
    switchCamera,
    releaseCamera,
    toggleCamera,
    toggleMic,
    startLivestream,
    disconnect,
    connectionState,
  };
};

export const useLiveStreamUser = () => {
  const [remoteStream] = useState<MediaStream>(new MediaStream(undefined));
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] = useState("");
  const isAlreadyConnected = useRef(false);

  useEffect(() => {
    InCallManager.start({ media: "video" });
    return () => {
      InCallManager.stop();
    };
  }, []);

  const startWatch = ({ urlLiveStream }: { urlLiveStream: string }) => {
    peerConnectionRef.current = new RTCPeerConnection(ICE_SERVER);
    peerConnectionRef.current.addTransceiver("video", {
      direction: "recvonly",
    });
    peerConnectionRef.current.addTransceiver("audio", {
      direction: "recvonly",
    });
    /**
     * When new tracks are received in the connection, store local references,
     * so that they can be added to a MediaStream, and to the <video> element.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event
     */

    peerConnectionRef.current?.addEventListener("track", (event: any) => {
      const track = event.track;
      const currentTracks = remoteStream.getTracks();
      const streamAlreadyHasVideoTrack = currentTracks.some(
        (track) => track.kind === "video",
      );
      const streamAlreadyHasAudioTrack = currentTracks.some(
        (track) => track.kind === "audio",
      );
      switch (track.kind) {
        case "video":
          if (streamAlreadyHasVideoTrack) {
            break;
          }
          remoteStream.addTrack(track);
          break;
        case "audio":
          if (streamAlreadyHasAudioTrack) {
            break;
          }
          remoteStream.addTrack(track);
          break;
        default:
          console.log("got unknown track " + track);
      }
    });
    peerConnectionRef.current.addEventListener(
      "connectionstatechange",
      (ev) => {
        if (peerConnectionRef.current?.connectionState === "connected") {
          isAlreadyConnected.current = true;
        }
        if (
          isAlreadyConnected.current &&
          peerConnectionRef.current?.connectionState === "disconnected"
        ) {
          console.log("vao day", ev);

          isAlreadyConnected.current = false;
          peerConnectionRef.current?.close();
          startWatch({ urlLiveStream });
          return;
        }

        setConnectionState(peerConnectionRef.current?.connectionState || "");
      },
    );
    peerConnectionRef.current.addEventListener(
      "negotiationneeded",
      async (ev) => {
        console.log("negotiationneeded", ev);

        if (peerConnectionRef.current) {
          try {
            await negotiateConnectionWithClientOffer(
              peerConnectionRef.current,
              urlLiveStream,
            );
          } catch (error) {
            setConnectionState("disconnected");
          }
        }
      },
    );

    peerConnectionRef.current.addEventListener(
      "signalingstatechange",
      (event) => {
        console.log(
          "signalingstatechange",
          peerConnectionRef.current?.signalingState,
          event,
        );
      },
    );
  };

  const disconnect = () => {
    remoteStream?.release();
    peerConnectionRef.current?.close();
  };

  function toggleMic(status) {
    remoteStream?.getAudioTracks().forEach((track) => {
      track.enabled = status;
    });
  }

  return { startWatch, remoteStream, connectionState, disconnect, toggleMic };
};
interface SizeIconType {
  width: number;
  height: number;
}
export const IconLike = ({ width, height }: SizeIconType) => {
  const xml = `
  <svg width="101" height="101" viewBox="0 0 101 101" xmlns="http://www.w3.org/2000/svg">
<path d="M100.8 50.4C100.8 78.2 78.3 100.8 50.4 100.8C22.6 100.8 0 78.2 0 50.4C0 22.6 22.6 0 50.4 0C78.3 0 100.8 22.6 100.8 50.4Z" fill="#4080FF"/>
<path d="M22.2 42.6H35.3V72.2H22.2V42.6Z" fill="white"/>
<path d="M76.5 50.4C76.5 52.7 74.8 54.6 72.5 55C73.3 55.8 73.8 56.9 73.8 58.2C73.8 60.5 72.1 62.4 69.9 62.8C70.7 63.6 71.2 64.7 71.2 66C71.2 68.6 69.1 70.6 66.6 70.6H40.3V46.7C40.3 46.7 53 30.7 48.9 21.7C48.9 21.7 56.7 18.4 57.5 25.8C58 30.3 57.9 35 57.7 38H71.9C74.4 38 76.5 40 76.5 42.6C76.5 44.2 75.6 45.7 74.3 46.5C75.6 47.3 76.5 48.8 76.5 50.4V50.4Z" fill="white"/>
</svg>

`;
  return <SvgXml xml={xml} width={width} height={height} />;
};

export const IconLove = ({ width, height }: SizeIconType) => {
  const xml = `
  <svg width="101" height="101" viewBox="0 0 101 101" xmlns="http://www.w3.org/2000/svg">
<path d="M100.8 50.4C100.8 78.2 78.2 100.8 50.4 100.8C22.6 100.8 1.52588e-05 78.2 1.52588e-05 50.4C1.52588e-05 22.6 22.6 0 50.4 0C78.2 0 100.8 22.6 100.8 50.4Z" fill="#F25268"/>
<path d="M25.6 60.4C22.9 58.2 20.7 55.2 19.6 51.8C15.1 37.5 28 22.3 43.3 28.2C47.4 29.9 50.4 35.3 50.4 35.3C50.4 35.3 53.4 29.9 57.5 28.2C72.8 22.3 85.7 37.5 81.2 51.8C80.1 55.2 77.9 58.2 75.2 60.4L50.4 80.4L25.6 60.4Z" fill="white"/>
</svg>
`;
  return <SvgXml xml={xml} width={width} height={height} />;
};

export const IconHaHa = ({ width, height }: SizeIconType) => {
  const xml = `
  <svg width="101" height="101" viewBox="0 0 101 101" xmlns="http://www.w3.org/2000/svg">
<path d="M100.8 50.4C100.8 78.2 78.2 100.8 50.4 100.8C22.5 100.8 1.52588e-05 78.2 1.52588e-05 50.4C1.52588e-05 22.6 22.5 0 50.4 0C78.2 0 100.8 22.6 100.8 50.4Z" fill="#FDDA74"/>
<path d="M87.6 51C87.6 71.6 70.9 88.2 50.4 88.2C29.8 88.2 13.1 71.6 13.1 51H87.6Z" fill="#3C3C3B"/>
<path d="M77.4 76.6C70.6 83.7 61 88.2 50.4 88.2C39.7 88.2 30.1 83.7 23.3 76.6C30.1 69.4 39.7 64.9 50.4 64.9C61 64.9 70.6 69.4 77.4 76.6Z" fill="#F25268"/>
<path d="M15.7 40.1C14.7 40.1 13.9 39.5 13.7 38.6C13.5 37.5 14.2 36.4 15.2 36.2L30.5 33.1L18.9 26.6C18 26 17.6 24.8 18.2 23.9C18.7 22.9 19.9 22.6 20.9 23.1L37 32.2C37.7 32.6 38.1 33.4 38 34.2C37.9 35 37.2 35.7 36.4 35.8L16.1 40.1C15.9667 40.1 15.8333 40.1 15.7 40.1V40.1Z" fill="#3C3C3B"/>
<path d="M85.1 40.1C84.9667 40.1 84.8333 40.1 84.7 40.1L64.3 35.8C63.5 35.7 62.9 35 62.7 34.2C62.6 33.4 63 32.6 63.7 32.2L79.9 23.1C80.8 22.6 82 22.9 82.5 23.9C83.1 24.8 82.7 26 81.8 26.6L70.3 33.1L85.5 36.2C86.5 36.4 87.2 37.5 87 38.6C86.8 39.5 86 40.1 85.1 40.1V40.1Z" fill="#3C3C3B"/>
</svg>
`;
  return <SvgXml xml={xml} width={width} height={height} />;
};

export const IconWow = ({ width, height }: SizeIconType) => {
  const xml = `
  <svg width="102" height="101" viewBox="0 0 102 101" xmlns="http://www.w3.org/2000/svg">
<path d="M101.4 50.4C101.4 78.2 78.8 100.8 51 100.8C23.1 100.8 0.599976 78.2 0.599976 50.4C0.599976 22.6 23.1 0 51 0C78.8 0 101.4 22.6 101.4 50.4Z" fill="#FDDA74"/>
<path d="M64 71.8C64 82.6 58.2 91.5 51 91.5C43.8 91.5 37.9 82.6 37.9 71.8C37.9 60.9 43.8 52 51 52C58.2 52 64 60.9 64 71.8Z" fill="#3C3C3B"/>
<path d="M33.7 38.5C33.7 43.9 30.8 48.2 27.3 48.2C23.8 48.2 21 43.9 21 38.5C21 33.2 23.8 28.9 27.3 28.9C30.8 28.9 33.7 33.2 33.7 38.5Z" fill="#3C3C3B"/>
<path d="M81 38.5C81 43.9 78.1 48.2 74.6 48.2C71.1 48.2 68.2 43.9 68.2 38.5C68.2 33.2 71.1 28.9 74.6 28.9C78.1 28.9 81 33.2 81 38.5Z" fill="#3C3C3B"/>
<path d="M35.4 19.1C34.9 19.1 34.4 19 34 18.6C31 15.6 25.8 15.6 22.8 18.6C22 19.3 20.7 19.3 20 18.6C19.2 17.8 19.2 16.5 20 15.8C22.2 13.5 25.2 12.3 28.4 12.3C31.5 12.3 34.5 13.5 36.8 15.8C37.5 16.5 37.5 17.8 36.8 18.6C36.4 19 35.9 19.1 35.4 19.1Z" fill="#3C3C3B"/>
<path d="M79.8 19.1C79.3 19.1 78.7999 19 78.3999 18.6C75.3999 15.6 70.2 15.6 67.2 18.6C66.4 19.3 65.1999 19.3 64.3999 18.6C63.6999 17.8 63.6999 16.5 64.3999 15.8C66.6999 13.5 69.7 12.3 72.8 12.3C76 12.3 79 13.5 81.2 15.8C82 16.5 82 17.8 81.2 18.6C80.8 19 80.3 19.1 79.8 19.1Z" fill="#3C3C3B"/>
</svg>
`;
  return <SvgXml xml={xml} width={width} height={height} />;
};

export const IconSad = ({ width, height }: SizeIconType) => {
  const xml = `
  <svg width="102" height="101" viewBox="0 0 102 101" xmlns="http://www.w3.org/2000/svg">
<path d="M101.3 50.4C101.3 78.2 78.8 100.8 50.9 100.8C23.1 100.8 0.5 78.2 0.5 50.4C0.5 22.6 23.1 0 50.9 0C78.8 0 101.3 22.6 101.3 50.4Z" fill="#FDDA74"/>
<path d="M32.9 47.1C32.9 51.4 30.1 54.9 26.6 54.9C23.1 54.9 20.2 51.4 20.2 47.1C20.2 42.9 23.1 39.4 26.6 39.4C30.1 39.4 32.9 42.9 32.9 47.1Z" fill="#3C3C3B"/>
<path d="M16.1 40.2C15.8333 40.2 15.6 40.1667 15.4 40.1C14.4 39.6 13.9 38.5 14.3 37.5C15.5 34.5 17.8 32.3 20.7 31C23.6 29.8 26.9 29.8 29.8 31C30.8 31.4 31.3 32.6 30.9 33.6C30.5 34.6 29.3 35.1 28.3 34.7C26.3 33.9 24.2 33.9 22.2 34.7C20.3 35.5 18.8 37 18 39C17.6 39.7 16.9 40.2 16.1 40.2V40.2Z" fill="#3C3C3B"/>
<path d="M75.3 39.4C78.8 39.4 81.7 42.9 81.7 47.1C81.7 51.4 78.8 54.9 75.3 54.9C71.8 54.9 68.9 51.4 68.9 47.1C68.9 42.9 71.8 39.4 75.3 39.4Z" fill="#3C3C3B"/>
<path d="M85.7 40.2C85 40.2 84.2 39.7 83.9 39C83.1 37 81.6 35.5 79.6 34.7C77.7 33.9 75.5 33.9 73.6 34.7C72.5 35.1 71.4 34.6 71 33.6C70.6 32.6 71 31.4 72.1 31C75 29.8 78.2 29.8 81.1 31C84.1 32.3 86.4 34.5 87.6 37.5C88 38.5 87.5 39.6 86.5 40.1C86.2333 40.1667 85.9667 40.2 85.7 40.2V40.2Z" fill="#3C3C3B"/>
<path d="M65.7 77.7C65.1 77.7 64.5 77.4 64.1 76.9C60.7 72.2 55.4 69.5 49.6 69.5C43.8 69.5 38.5 72.2 35.1 76.9C34.4 77.8 33.2 78 32.3 77.3C31.4 76.7 31.2 75.5 31.9 74.6C36 68.9 42.6 65.6 49.6 65.6C56.5 65.6 63.2 68.9 67.3 74.6C67.9 75.5 67.7 76.7 66.9 77.3C66.5 77.5667 66.1 77.7 65.7 77.7V77.7Z" fill="#3C3C3B"/>
<path d="M83.5999 99.4C76.8999 99.4 72.3 92.6 74.8 86.4L83.5999 64.3L92.3999 86.4C94.8999 92.6 90.2999 99.4 83.5999 99.4Z" fill="#4F90FC"/>
</svg>
`;
  return <SvgXml xml={xml} width={width} height={height} />;
};

export const IconCare = ({ width, height }: SizeIconType) => {
  const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="care">
  <linearGradient id="a" x1="-2.313" x2="-2.313" y1="19.862" y2="20.738" gradientTransform="matrix(16 0 0 -16 45 333)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f28a2d"></stop><stop offset="1" stop-color="#fde86f"></stop></linearGradient><path fill="url(#a)" fill-rule="evenodd" d="M16 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z" clip-rule="evenodd"></path><radialGradient id="b" cx="-2.313" cy="20.313" r=".5" gradientTransform="matrix(16 0 0 -16 45 333)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f28a2d" stop-opacity="0"></stop><stop offset="1" stop-color="#f08423" stop-opacity=".34"></stop></radialGradient><path fill="url(#b)" fill-rule="evenodd" d="M16 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z" clip-rule="evenodd"></path><radialGradient id="c" cx="-2.644" cy="20.358" r=".101" gradientTransform="matrix(14.5998 6.5456 5.063 -11.2928 -62.74 255.526)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f28a2d" stop-opacity=".5"></stop><stop offset="1" stop-color="#f28a2d" stop-opacity="0"></stop></radialGradient><path fill="url(#c)" fill-rule="evenodd" d="M16 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z" clip-rule="evenodd"></path><radialGradient id="d" cx="-2.227" cy="19.541" r=".283" gradientTransform="matrix(12.5663 -9.904 -3.6032 -4.5717 110.263 79.053)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f28a2d" stop-opacity=".5"></stop><stop offset="1" stop-color="#f28a2d" stop-opacity="0"></stop></radialGradient><path fill="url(#d)" fill-rule="evenodd" d="M16 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z" clip-rule="evenodd"></path><radialGradient id="e" cx="-2.531" cy="19.776" r=".107" gradientTransform="matrix(15.7394 -2.8762 -.572 -3.1299 56.242 56.647)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d45f00" stop-opacity=".15"></stop><stop offset="1" stop-color="#f28a2d" stop-opacity="0"></stop></radialGradient><path fill="url(#e)" fill-rule="evenodd" d="M16 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z" clip-rule="evenodd"></path><radialGradient id="f" cx="-2.098" cy="20.131" r=".106" gradientTransform="matrix(15.6768 3.1995 .6363 -3.1176 30.972 71.62)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d45f00" stop-opacity=".15"></stop><stop offset="1" stop-color="#d45f00" stop-opacity="0"></stop></radialGradient><path fill="url(#f)" fill-rule="evenodd" d="M16 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z" clip-rule="evenodd"></path><linearGradient id="g" x1="-1.619" x2="-1.619" y1="18.2" y2="16.681" gradientTransform="matrix(3.4035 0 0 -.9374 13.51 22.37)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#482314"></stop><stop offset="1" stop-color="#9a4111"></stop></linearGradient><path fill="url(#g)" fill-rule="evenodd" d="M9.7 5.9c-.1-.3-3.3-.3-3.4 0-.1.3.6.7 1.7.7s1.8-.4 1.7-.7z" clip-rule="evenodd"></path><radialGradient id="h" cx="-3.9" cy="18.924" r=".872" gradientTransform="matrix(0 -2.1326 -2.1327 0 45.352 -4.046)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3b446b"></stop><stop offset=".688" stop-color="#202340"></stop></radialGradient><path fill="url(#h)" fill-rule="evenodd" d="M6 4.1c0 .7-.4.9-1 1-.6.1-1.1-.2-1.1-1 0-.6.3-1.4 1.1-1.4.7 0 1 .8 1 1.4z" clip-rule="evenodd"></path><path fill="#4e506a" fill-rule="evenodd" d="M4.9 3.1c.1.1.1.4-.1.5-.1.1-.3.2-.4 0s-.1-.3 0-.5c.2-.1.4-.1.5 0z" clip-rule="evenodd"></path><radialGradient id="i" cx="-3.914" cy="18.924" r=".872" gradientTransform="matrix(0 -2.1326 -2.1327 0 51.366 -4.077)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3b446b"></stop><stop offset=".688" stop-color="#202340"></stop></radialGradient><path fill="url(#i)" fill-rule="evenodd" d="M10 4.1c0 .7.4.9 1.1 1 .6.1 1.1-.2 1.1-1 0-.6-.3-1.4-1.1-1.4S10 3.5 10 4.1z" clip-rule="evenodd"></path><path fill="#4e506a" fill-rule="evenodd" d="M11 3.1c.1.1 0 .3-.1.5-.1.1-.3.1-.4 0s0-.3.1-.5c.2-.2.3-.2.4 0z" clip-rule="evenodd"></path><radialGradient id="j" cx="-5.202" cy="20.231" r=".298" gradientTransform="matrix(-.339 -1.3177 -6.1081 1.5713 126.811 -36.933)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e38200"></stop><stop offset="1" stop-color="#cd6700"></stop></radialGradient><path fill="url(#j)" fill-rule="evenodd" d="M3.4 2.1c-.2.2 0 .5.3.4.6-.3 1.8-.6 2.8-.5.3 0 .4 0 .3-.4 0-.3-.4-.5-1.2-.4-1.2.1-2 .7-2.2.9z" clip-rule="evenodd"></path><radialGradient id="k" cx="-4.247" cy="20.267" r=".314" gradientTransform="matrix(.2577 -1.3359 -7.9278 -1.5293 172.702 26.852)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e38200"></stop><stop offset="1" stop-color="#cd6700"></stop></radialGradient><path fill="url(#k)" fill-rule="evenodd" d="M10.4 1.2c-.8-.1-1.2.1-1.2.4-.1.4 0 .4.3.4 1.1-.1 2.3.2 2.8.5.4.2.5-.2.3-.4s-1-.8-2.2-.9z" clip-rule="evenodd"></path><linearGradient id="l" x1="-2.17" x2="-2.407" y1="20.358" y2="19.647" gradientTransform="matrix(9.7496 0 0 -9.079 27.91 194.578)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f34462"></stop><stop offset="1" stop-color="#cc0820"></stop></linearGradient><path fill="url(#l)" fill-rule="evenodd" d="M9.7 8.5c-2.1-.6-2.8.8-2.8.8S7.1 7.7 5 7c-2-.6-3.2 1.3-3.3 2.4-.2 2.5 2 5.3 2.8 6.3.1.3.4.3.7.3 1.2-.3 4.6-1.4 5.9-3.6.5-1.1.6-3.3-1.4-3.9z" clip-rule="evenodd"></path><radialGradient id="m" cx="-1.839" cy="20.363" r=".29" gradientTransform="matrix(8.51 3.1636 3.1637 -8.51 -39.932 190.042)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff7091" stop-opacity=".7"></stop><stop offset="1" stop-color="#fe6d8e" stop-opacity="0"></stop></radialGradient><path fill="url(#m)" fill-rule="evenodd" d="M9.7 8.5c-2.1-.6-2.8.8-2.8.8S7.1 7.7 5 7c-2-.6-3.2 1.3-3.3 2.4-.2 2.5 2 5.3 2.8 6.3.1.3.4.3.7.3 1.2-.3 4.6-1.4 5.9-3.6.5-1.1.6-3.3-1.4-3.9z" clip-rule="evenodd"></path><radialGradient id="n" cx="-2.308" cy="20.509" r=".29" gradientTransform="matrix(8.51 3.1636 3.1637 -8.51 -40.975 191.442)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff7091" stop-opacity=".7"></stop><stop offset="1" stop-color="#fe6d8e" stop-opacity="0"></stop></radialGradient><path fill="url(#n)" fill-rule="evenodd" d="M9.7 8.5c-2.1-.6-2.8.8-2.8.8S7.1 7.7 5 7c-2-.6-3.2 1.3-3.3 2.4-.2 2.5 2 5.3 2.8 6.3.1.3.4.3.7.3 1.2-.3 4.6-1.4 5.9-3.6.5-1.1.6-3.3-1.4-3.9z" clip-rule="evenodd"></path><radialGradient id="o" cx="-2.505" cy="20.75" r=".249" gradientTransform="matrix(-1.8271 8.8932 12.246 2.5158 -254.697 -18.163)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9c0600"></stop><stop offset="1" stop-color="#9c0600" stop-opacity="0"></stop></radialGradient><path fill="url(#o)" fill-rule="evenodd" d="M9.7 8.5c-2.1-.6-2.8.8-2.8.8S7.1 7.7 5 7c-2-.6-3.2 1.3-3.3 2.4-.2 2.5 2 5.3 2.8 6.3.1.3.4.3.7.3 1.2-.3 4.6-1.4 5.9-3.6.5-1.1.6-3.3-1.4-3.9z" clip-rule="evenodd"></path><radialGradient id="p" cx="-1.547" cy="20.349" r=".15" gradientTransform="matrix(7.812 4.6261 5.8059 -9.8043 -94.645 218.657)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9c0600" stop-opacity=".5"></stop><stop offset="1" stop-color="#9c0600" stop-opacity="0"></stop></radialGradient><path fill="url(#p)" fill-rule="evenodd" d="M9.7 8.5c-2.1-.6-2.8.8-2.8.8S7.1 7.7 5 7c-2-.6-3.2 1.3-3.3 2.4-.2 2.5 2 5.3 2.8 6.3.1.3.4.3.7.3 1.2-.3 4.6-1.4 5.9-3.6.5-1.1.6-3.3-1.4-3.9z" clip-rule="evenodd"></path><radialGradient id="q" cx="-2.763" cy="20.429" r=".13" gradientTransform="matrix(8.5228 -3.1289 -4.0321 -10.983 107.977 224.84)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9c0600" stop-opacity=".5"></stop><stop offset="1" stop-color="#9c0600" stop-opacity="0"></stop></radialGradient><path fill="url(#q)" fill-rule="evenodd" d="M9.7 8.5c-2.1-.6-2.8.8-2.8.8S7.1 7.7 5 7c-2-.6-3.2 1.3-3.3 2.4-.2 2.5 2 5.3 2.8 6.3.1.3.4.3.7.3 1.2-.3 4.6-1.4 5.9-3.6.5-1.1.6-3.3-1.4-3.9z" clip-rule="evenodd"></path><radialGradient id="r" cx="-1.795" cy="20.148" r=".175" gradientTransform="matrix(7.5205 5.0863 5.5088 -8.1451 -88.557 187.152)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9c0600" stop-opacity=".999"></stop><stop offset="1" stop-color="#9c0600" stop-opacity="0"></stop></radialGradient><path fill="url(#r)" fill-rule="evenodd" d="M9.7 8.5c-2.1-.6-2.8.8-2.8.8S7.1 7.7 5 7c-2-.6-3.2 1.3-3.3 2.4-.2 2.5 2 5.3 2.8 6.3.1.3.4.3.7.3 1.2-.3 4.6-1.4 5.9-3.6.5-1.1.6-3.3-1.4-3.9z" clip-rule="evenodd"></path><defs><filter id="s" width="6.9" height="5.4" x="-.2" y="7.2" filterUnits="userSpaceOnUse"><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask id="u" width="6.9" height="5.4" x="-.2" y="7.2" maskUnits="userSpaceOnUse"><path fill="#fff" fill-rule="evenodd" d="M16 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z" clip-rule="evenodd" filter="url(#s)"></path></mask><radialGradient id="t" cx="-2.204" cy="20.844" r="1.226" gradientTransform="matrix(4.3582 3.2271 3.227 -4.3582 -57.739 105.424)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#eda83a"></stop><stop offset="1" stop-color="#ffdc5e"></stop></radialGradient><path fill="url(#t)" fill-rule="evenodd" d="M1.3 7.7c-.5-.5-1.4-.8-1.5.4-.1.9.3 2.5 1.4 3.4 2.8 2.2 5.3 1 5.4-.6.1-1.2-1.4-1.1-1.8-1.1v-.1c.1-.1.3-.2.4-.3.4-.3.2-.8-.3-.7-.1 0-1.3.4-2.1.1-.8-.3-.9-.6-1.5-1.1z" clip-rule="evenodd" mask="url(#u)"></path><radialGradient id="v" cx="15.654" cy="7.737" r="8.846" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#eda83a"></stop><stop offset="1" stop-color="#ffdc5e"></stop></radialGradient><path fill="url(#v)" d="M14.3 7.8c.3-.6.8-.4 1.1-.3.4.1.7.4.7 1 0 1.5-.2 2.9-1.5 4.3-2.3 2.6-6.2 2.2-6.6.6-.3-1.2 1.1-1.4 1.6-1.4v-.1c-.2-.1-.3-.2-.5-.3-.4-.3-.3-.9.2-.8.6.1 1.4.3 2 .2 1.9-.2 2.2-1.7 3-3.2z">
  </path>
  </svg>
`;
  return <SvgXml xml={xml} width={width} height={height} />;
};
