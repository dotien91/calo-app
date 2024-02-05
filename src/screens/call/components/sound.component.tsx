import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import isEqual from "react-fast-compare";
import Sound from "react-native-sound";

const SoundComponent = ({ source }: { source: any }, ref: any) => {
  const soundRef = useRef<Sound>();
  const mounted = useRef(true);

  useEffect(() => {
    Sound.setCategory("Playback", true);
    return () => {
      mounted.current = false;
      soundRef.current?.stop().release();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    playSound: playSound,
    stopSound: () => {
      soundRef.current?.stop().release();
    },
  }));

  const playSound = () => {
    soundRef.current = new Sound(source, (error) => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
      // loaded successfully

      // Play the sound with an onEnd callback
      setTimeout(() => {
        if (!mounted.current) {
          return;
        }
        soundRef.current?.play((success) => {
          if (success) {
            console.log("successfully finished playing1");
          } else {
            console.log("playback failed due to audio decoding errors");
          }
        });
      }, 1000);
    });
    // Reduce the volume by half
    soundRef.current?.setVolume(0.5);
    // Position the sound to the full right in a stereo field
    soundRef.current?.setPan(1);
    // Loop indefinitely until stop() is called
    soundRef.current?.setNumberOfLoops(-1);
  };

  return null;
};

export default memo(forwardRef(SoundComponent), isEqual);
