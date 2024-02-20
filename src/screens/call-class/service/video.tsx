// import React from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   Dimensions,
//   Alert,
// } from "react-native";

// import PropTypes from "prop-types";

// import { RTCView } from "react-native-webrtc";

// import Janus from "./janus.mobile";
// // import InCallManager from 'react-native-incall-manager';

// // import Spinner from "react-native-loading-spinner-overlay";
// import { SERVER } from "constants/class.room.constant";
// import useStore from "@services/zustand/store";
// import { EnumRole } from "constants/system.constant";
// import { useRoute } from "@react-navigation/native";

// const opaqueId = "videoroomtest-" + Janus.randomString(12);

// const server = SERVER;

// let janus;
// const sfutest = null;
// let started = false;

// const myusername = Math.floor(Math.random() * 1000);
// let myid = null;
// let mystream = null;

// const feeds = [];
// const bitrateTimer = [];

// Janus.init({
//   debug: "all",
//   callback: function () {
//     if (started) return;
//     started = true;
//   },
// });

// const roomId = "65c0ab03d7d7ab3a76de4b5b";

// const Video = () => {
//   // constructor(props) {
//   //   super(props);
//   //   this.ds = [];
//   //   this.state = {
//   //     info: "Initializing",
//   //     status: "init",
//   //     roomID: "",
//   //     isFront: true,
//   //     selfViewSrc: null,
//   //     selfViewSrcKey: null,
//   //     remoteList: {},
//   //     remoteListPluginHandle: {},
//   //     textRoomConnected: false,
//   //     textRoomData: [],
//   //     textRoomValue: "",
//   //     publish: false,
//   //     speaker: false,
//   //     audioMute: false,
//   //     videoMute: false,
//   //     visible: false,
//   //   };
//   // }
//   const videoRoom = React.useRef(null);
//   const sfutest = React.useRef(null);
//   // const janus = React.useRef(null);
//   const stream = React.useRef(null);
//   const route = useRoute();
//   const roomId =
//     route.params?.["courseRoom"]?.roomId || "65c0ab03d7d7ab3a76de4b5b";
//   const courseData = route.params?.["courseData"];
//   const userData = useStore((state) => state.userData);
//   const isVideoOneOne = false;
//   const intervalGetPar = React.useRef(null);
//   const [config, setConfig] = React.useState({
//     mute: false,
//     video: true,
//     front: true,
//   });
//   const isTeacherRole = userData?.user_role == EnumRole.Teacher;
//   const peerConnection = React.useRef(null);
//   const [publisher, setPublisher] = React.useState([]);
//   const [publish, setPublish] = React.useState(false);

//   React.useEffect(() => {
//     janusStart();
//     return () => {};
//   }, []);

//   const janusStart = () => {
//     janus = new Janus({
//       server: server,
//       success: () => {
//         janus.attach({
//           plugin: "janus.plugin.videoroom",
//           success: (pluginHandle) => {
//             console.log("new=== pluginHandle", pluginHandle, roomId);
//             sfutest.current = pluginHandle;
//             const create = {
//               request: "create",
//               room: roomId,
//               admin_key: "supersecret",
//               publishers: 20,
//               audiolevel_ext: true,
//               audiolevel_event: true,
//               audio_active_packets: 50,
//               audio_level_average: 40,
//             };
//             sfutest.current.send({
//               message: create,
//               success: function (data) {
//                 console.log("dataaaaaaaaa", data);
//                 const register = {
//                   request: "join",
//                   room: roomId,
//                   ptype: "publisher",
//                   display: "tiennnn",
//                 };
//                 sfutest.current.send({ message: register });
//               },
//             });
//           },
//           error: (error) => {
//             Alert.alert("  -- Error attaching plugin...", error);
//           },
//           consentDialog: (on) => {},
//           mediaState: (medium, on) => {},
//           webrtcState: (on) => {},
//           onmessage: (msg, jsep) => {
//             console.log(123, msg);
//             const event = msg["videoroom"];
//             if (event != undefined && event != null) {
//               if (event === "joined") {
//                 myid = msg["id"];
//                 publishOwnFeed(true);
//                 if (
//                   msg["publishers"] !== undefined &&
//                   msg["publishers"] !== null
//                 ) {
//                   var list = msg["publishers"];
//                   console.log("listlistme", list);
//                   // setPublisher(list)
//                   for (var f in list) {
//                     const id = list[f]["id"];
//                     const display = list[f]["display"];
//                     newRemoteFeed(id, display);
//                   }
//                 }
//               } else if (event === "destroyed") {
//               } else if (event === "event") {
//                 if (
//                   msg["publishers"] !== undefined &&
//                   msg["publishers"] !== null
//                 ) {
//                   var list = msg["publishers"];
//                   console.log("listlist", list);
//                   // setPublisher(list)

//                   for (var f in list) {
//                     const id = list[f]["id"];
//                     const display = list[f]["display"];
//                     newRemoteFeed(id, display);
//                   }
//                 } else if (
//                   msg["leaving"] !== undefined &&
//                   msg["leaving"] !== null
//                 ) {
//                   const leaving = msg["leaving"];
//                   const remoteFeed = null;
//                   const numLeaving = parseInt(msg["leaving"]);
//                   if (this.state.remoteList.hasOwnProperty(numLeaving)) {
//                     delete this.state.remoteList.numLeaving;
//                     this.setState({ remoteList: this.state.remoteList });
//                     this.state.remoteListPluginHandle[numLeaving].detach();
//                     delete this.state.remoteListPluginHandle.numLeaving;
//                   }
//                 } else if (
//                   msg["unpublished"] !== undefined &&
//                   msg["unpublished"] !== null
//                 ) {
//                   const unpublished = msg["unpublished"];
//                   if (unpublished === "ok") {
//                     sfutest.current.hangup();
//                     return;
//                   }
//                   const numLeaving = parseInt(msg["unpublished"]);
//                   if (this.state.remoteList.hasOwnProperty(numLeaving)) {
//                     delete this.state.remoteList.numLeaving;
//                     this.setState({ remoteList: this.state.remoteList });
//                     this.state.remoteListPluginHandle[numLeaving].detach();
//                     delete this.state.remoteListPluginHandle.numLeaving;
//                   }
//                 } else if (
//                   msg["error"] !== undefined &&
//                   msg["error"] !== null
//                 ) {
//                 }
//               }
//             }
//             if (jsep !== undefined && jsep !== null) {
//               sfutest.current.handleRemoteJsep({ jsep: jsep });
//             }
//           },
//           onlocalstream: (stream) => {
//             // this.setState({ selfViewSrc: stream.toURL() });
//             // this.setState({ selfViewSrcKey: Math.floor(Math.random() * 1000) });
//             // this.setState({
//             //   status: "ready",
//             //   info: "Please enter or create room ID",
//             // });
//           },
//           onremotestream: (stream) => {
//             setPublisher([{ stream }]);
//             console.log("streamstream", stream);
//           },
//           oncleanup: () => {
//             mystream = null;
//           },
//         });
//       },
//       error: (error) => {
//         Alert.alert("  Janus Error", error);
//       },
//       destroyed: () => {
//         Alert.alert("  Success for End Call ");
//         setPublish(false);
//       },
//     });
//   };

//   const switchVideoType = () => {
//     sfutest.current.changeLocalCamera();
//   };

//   const toggleAudioMute = () => {
//     this.props.App.test();
//     const muted = sfutest.current.isAudioMuted();
//     if (muted) {
//       sfutest.current.unmuteAudio();
//       this.setState({ audioMute: false });
//     } else {
//       sfutest.current.muteAudio();
//       this.setState({ audioMute: true });
//     }
//   };

//   const toggleVideoMute = () => {
//     const muted = sfutest.current.isVideoMuted();
//     if (muted) {
//       this.setState({ videoMute: false });
//       sfutest.current.unmuteVideo();
//     } else {
//       this.setState({ videoMute: true });
//       sfutest.current.muteVideo();
//     }
//   };

//   const toggleSpeaker = () => {
//     if (this.state.speaker) {
//       // this.setState({ speaker: false });
//       // InCallManager.setForceSpeakerphoneOn(false)
//     } else {
//       // this.setState({ speaker: true });
//       // InCallManager.setForceSpeakerphoneOn(true)
//     }
//   };

//   const endCall = () => {
//     janus.destroy();
//   };

//   const publishOwnFeed = (useAudio) => {
//     if (!publish) {
//       // this.setState({ publish: true });
//       setPublish(true);

//       sfutest.current.createOffer({
//         media: {
//           audioRecv: true,
//           videoRecv: true,
//           audioSend: true,
//           videoSend: true,
//         },
//         success: (jsep) => {
//           const publish = {
//             request: "configure",
//             audio: useAudio,
//             video: true,
//           };
//           sfutest.current.send({ message: publish, jsep: jsep });
//         },
//         error: (error) => {
//           Alert.alert("WebRTC error:", error);
//           if (useAudio) {
//             // this.publishOwnFeed(false);
//           } else {
//           }
//         },
//       });
//     } else {
//       // this.setState({ publish: false });
//       setPublish(false);
//       const unpublish = { request: "unpublish" };
//       sfutest.current.send({ message: unpublish });
//     }
//   };

//   const newRemoteFeed = (id, display, audio, video) => {
//     const myroom = "65c0ab03d7d7ab3a76de4b5b";
//     // A new feed has been published, create a new plugin handle and attach to it as a subscriber
//     let remoteFeed = null;
//     janus.attach({
//       plugin: "janus.plugin.videoroom",
//       opaqueId: opaqueId,
//       success: function (pluginHandle) {
//         remoteFeed = pluginHandle;
//         remoteFeed.simulcastStarted = false;
//         Janus.log(
//           "Plugin attached! (" +
//             remoteFeed.getPlugin() +
//             ", id=" +
//             remoteFeed.getId() +
//             ")",
//         );
//         Janus.log("  -- This is a subscriber", pluginHandle);
//         // We wait for the plugin to send us an offer
//         const subscribe = {
//           request: "join",
//           room: myroom.toString(),
//           ptype: "subscriber",
//           feed: id,
//           // private_id: mypvtid
//         };
//         // In case you don't want to receive audio, video or data, even if the
//         // publisher is sending them, set the 'offer_audio', 'offer_video' or
//         // 'offer_data' properties to false (they're true by default), e.g.:
//         // 		subscribe["offer_video"] = false;
//         // For example, if the publisher is VP8 and this is Safari, let's avoid video
//         // if(Janus.webRTCAdapter.browserDetails.browser === "safari" &&
//         //     ((video === "vp9" && !Janus.safariVp9) || (video === "vp8" && !Janus.safariVp8))) {
//         //   if(video)
//         //     video = video.toUpperCase()
//         //   toastr.warning("Publisher is using " + video + ", but Safari doesn't support it: disabling video");
//         //   subscribe["offer_video"] = false;
//         // }
//         remoteFeed.videoCodec = video;
//         remoteFeed.send({ message: subscribe });
//       },
//       error: function (error) {
//         console.error("  -- Error attaching plugin...", error);
//       },
//       onmessage: function (msg, jsep) {
//         const event = msg["videoroom"];
//         console.log("Event:===== ", {
//           msg,
//           jsep,
//         });
//         // if(msg["error"]) {
//         //   bootbox.alert(msg["error"]);
//         // } else if(event) {
//         //   if(event === "attached") {
//         //     // Subscriber created and attached
//         //     for(var i=1;i<6;i++) {
//         //       if(!feeds[i]) {
//         //         feeds[i] = remoteFeed;
//         //         remoteFeed.rfindex = i;
//         //         break;
//         //       }
//         //     }
//         //     remoteFeed.rfid = msg["id"];
//         //     remoteFeed.rfdisplay = escapeXmlTags(msg["display"]);
//         //     if(!remoteFeed.spinner) {
//         //       var target = document.getElementById('videoremote'+remoteFeed.rfindex);
//         //       remoteFeed.spinner = new Spinner({top:100}).spin(target);
//         //     } else {
//         //       remoteFeed.spinner.spin();
//         //     }
//         //     Janus.log("Successfully attached to feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") in room " + msg["room"]);
//         //     $('#remote'+remoteFeed.rfindex).removeClass('hide').html(remoteFeed.rfdisplay).show();
//         //   } else if(event === "event") {
//         //     // Check if we got a simulcast-related event from this publisher
//         //     var substream = msg["substream"];
//         //     var temporal = msg["temporal"];
//         //     if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
//         //       if(!remoteFeed.simulcastStarted) {
//         //         remoteFeed.simulcastStarted = true;
//         //         // Add some new buttons
//         //         addSimulcastButtons(remoteFeed.rfindex, remoteFeed.videoCodec === "vp8");
//         //       }
//         //       // We just received notice that there's been a switch, update the buttons
//         //       updateSimulcastButtons(remoteFeed.rfindex, substream, temporal);
//         //     }
//         //   } else {
//         //     // What has just happened?
//         //   }
//         // }
//         if (jsep) {
//           Janus.debug("Handling SDP as well...", jsep);
//           const stereo = jsep.sdp.indexOf("stereo=1") !== -1;
//           // Answer and attach
//           console.log("answer");
//           remoteFeed.createAnswer({
//             jsep: jsep,
//             // Add data:true here if you want to subscribe to datachannels as well
//             // (obviously only works if the publisher offered them in the first place)
//             media: { audioSend: false, videoSend: false }, // We want recvonly audio/video
//             customizeSdp: function (jsep) {
//               if (stereo && jsep.sdp.indexOf("stereo=1") == -1) {
//                 // Make sure that our offer contains stereo too
//                 jsep.sdp = jsep.sdp.replace(
//                   "useinbandfec=1",
//                   "useinbandfec=1;stereo=1",
//                 );
//               }
//             },
//             success: function (jsep) {
//               Janus.debug("Got SDP!", jsep);
//               const body = { request: "start", room: myroom.toString() };
//               remoteFeed.send({ message: body, jsep: jsep });
//             },
//             error: function (error) {
//               Janus.error("WebRTC error:", error);
//             },
//           });
//         }
//       },
//       iceState: function (state) {
//         Janus.log(
//           "ICE state of this WebRTC PeerConnection (feed #" +
//             remoteFeed.rfindex +
//             ") changed to " +
//             state,
//         );
//       },
//       webrtcState: function (on) {
//         Janus.log(
//           "Janus says this WebRTC PeerConnection (feed #" +
//             remoteFeed.rfindex +
//             ") is " +
//             (on ? "up" : "down") +
//             " now",
//         );
//       },
//       onlocalstream: function (stream) {
//         // The subscriber stream is recvonly, we don't expect anything here
//       },
//       onremotestream: function (stream) {
//         // setPublisher(old => [...old, {stream}])
//         console.log("streamstream", stream);

//         // Janus.debug("Remote feed #" + remoteFeed.rfindex + ", stream:", stream);
//         const addButtons = false;

//         // Janus.attachMediaStream($('#remotevideo'+remoteFeed.rfindex).get(0), stream);
//         const videoTracks = stream.getVideoTracks();
//         console.log("videoTracksvideoTracks", videoTracks);
//         if (!videoTracks || videoTracks.length === 0) {
//         } else {
//         }
//       },
//       oncleanup: function () {
//         Janus.log(
//           " ::: Got a cleanup notification (remote feed " + id + ") :::",
//         );
//         // if(remoteFeed.spinner)
//         //   remoteFeed.spinner.stop();
//         // remoteFeed.spinner = null;
//         // $('#remotevideo'+remoteFeed.rfindex).remove();
//         // $('#waitingvideo'+remoteFeed.rfindex).remove();
//         // $('#novideo'+remoteFeed.rfindex).remove();
//         // $('#curbitrate'+remoteFeed.rfindex).remove();
//         // $('#curres'+remoteFeed.rfindex).remove();
//         // if(bitrateTimer[remoteFeed.rfindex])
//         //   clearInterval(bitrateTimer[remoteFeed.rfindex]);
//         // bitrateTimer[remoteFeed.rfindex] = null;
//         // remoteFeed.simulcastStarted = false;
//         // $('#simulcast'+remoteFeed.rfindex).remove();
//       },
//     });
//   };
//   console.log("publisher", publisher);

//   // render() {
//   // console.log("this.state.remoteList", this.state.remoteList)
//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         {/* {this.state.selfViewSrc && (
//             <RTCView
//               key={this.state.selfViewSrcKey}
//               streamURL={this.state.selfViewSrc}
//               style={styles.remoteView}
//             />
//           )} */}
//         <Text>{publisher.length}</Text>
//         {publisher.map((item, index) => {
//           console.log("itemmmm", item);
//           // return null
//           return (
//             <RTCView
//               key={index + ""}
//               streamURL={item.stream.toURL()}
//               style={styles.remoteView}
//             />
//           );
//         })}
//       </View>
//       <View style={{ flex: 1, flexDirection: "row" }}>
//         {/* { this.state.audioMute ?
//             <Icon
//               raised
//               name='microphone-off'
//               type='material-community'
//               color='grey'
//               onPress={() => this.toggleAudioMute()} /> :
//             <Icon
//               raised
//               name='microphone'
//               type='material-community'
//               color='black'
//               onPress={() => this.toggleAudioMute()} /> } */}

//         {/* { this.state.videoMute ?
//             <Icon
//               raised
//               name='video-off'
//               type='material-community'
//               color='grey'
//               onPress={() => this.toggleVideoMute()} /> :
//             <Icon
//               raised
//               name='video'
//               type='material-community'
//               color='black'
//               onPress={() => this.toggleVideoMute()} /> } */}

//         {/* { this.state.speaker ?
//             <Icon
//               raised
//               name='volume-up'
//               type='FontAwesome'
//               color='black'
//               onPress={() => this.toggleSpeaker()} /> :
//             <Icon
//                 raised
//                 name='volume-down'
//                 type='FontAwesome'
//                 color='black'
//                 onPress={() => this.toggleSpeaker()} /> } */}

//         {/* <Icon
//             raised
//             name='video-switch'
//             type='material-community'
//             color='black'
//             onPress={() => this.switchVideoType()} />
//           <Icon
//             raised
//             name='phone-hangup'
//             type='material-community'
//             color='red'
//             onPress={() => this.endCall()} /> */}
//       </View>
//       <View style={{ flex: 1 }}>
//         {/* <Spinner visible={this.state.visible} textContent={"Connecting..."} textStyle={{color: '#FFF'}} /> */}
//       </View>
//     </ScrollView>
//   );
//   // }
// };

// const styles = StyleSheet.create({
//   selfView: {
//     width: 200,
//     height: 150,
//   },
//   remoteView: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height / 2.35,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "#F5FCFF",
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: "center",
//     margin: 10,
//   },
//   listViewContainer: {
//     height: 150,
//   },
// });

// Video.propTypes = {
//   App: PropTypes.object.isRequired,
// };

// function select(store) {
//   return {
//     App: store.App,
//   };
// }

// export default Video;
