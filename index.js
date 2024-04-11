/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer, { Event } from 'react-native-track-player';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export const PlaybackService = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, TrackPlayer.play);
  TrackPlayer.addEventListener(Event.RemotePause, TrackPlayer.pause);
  TrackPlayer.addEventListener(Event.RemoteNext, TrackPlayer.skipToNext);
  TrackPlayer.addEventListener(Event.RemotePrevious, TrackPlayer.skipToPrevious);
  TrackPlayer.addEventListener(Event.RemoteSeek, TrackPlayer.seekTo);
  TrackPlayer.addEventListener(Event.RemoteStop, TrackPlayer.reset)
  // TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, TrackPlayer)
};

TrackPlayer.registerPlaybackService(() => PlaybackService);

AppRegistry.registerComponent(appName, () => App);
