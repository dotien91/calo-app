import ImageLoad from "@shared-components/image-load/ImageLoad";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet } from "react-native";
// import Animated, {
//   Extrapolate,
//   interpolate,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated"; // Removed reanimated
import { Animated } from "react-native"; // Fallback to React Native Animated

import { MHS } from "@utils/size.utils";
import {
  IconCare,
  IconHaHa,
  IconLike,
  IconLove,
  IconSad,
  IconWow,
} from "./utils";
import uuid from "react-native-uuid";
// import useStore from "@services/zustand/store";

interface TypedReaction {}
interface Props {
  item: TypedReaction;
  finishedAnimation: (id: string) => void;
}

const ItemReactionLivestream = ({ item, finishedAnimation }: Props) => {
  const animation = useSharedValue(1);
  useEffect(() => {
    animation.value = withTiming(0, { duration: 4000 }, (finished) => {
      if (finished) {
        runOnJS(finishedAnimation)(item.id);
      }
    });
  }, []);

  const getRandom = (max, min) => {
    // and the formula is:
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const randomPosition = () => {
    console.log("getRandom(40, 10)getRandom(40, 10)", getRandom(200, 100));
    return {
      bottom: getRandom(20, 0),
      left: getRandom(200, 100),
    };
  };

  const getIcon = () => {
    switch (item.react_type) {
      case "love":
        return <IconLove width={MHS._40} height={MHS._40} />;
      case "haha":
        return <IconHaHa width={MHS._40} height={MHS._40} />;
      case "wow":
        return <IconWow width={MHS._40} height={MHS._40} />;
      case "sad":
        return <IconSad width={MHS._40} height={MHS._40} />;
      case "care":
        return <IconCare width={MHS._40} height={MHS._40} />;
      default:
        return <IconLike width={MHS._40} height={MHS._40} />;
    }
  };

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            animation.value,
            [1, 0],
            [1, 0.5],
            Extrapolate.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            animation.value,
            [1, 0],
            [0, -300],
            Extrapolate.CLAMP,
          ),
        },
      ],
      opacity: interpolate(
        animation.value,
        [0.75, 0.2],
        [1, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  const getRightPosition = () => {
    switch (item.react_type) {
      case "love":
        return 10;
      case "haha":
        return 20;
      case "wow":
        return 40;
      case "sad":
        return 50;
      case "care":
        return 60;
      default:
        return 70;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { right: getRightPosition(), bottom: randomPosition.bottom },
        style,
      ]}
    >
      {getIcon()}
      <ImageLoad
        source={{
          uri:
            item?.createBy?.user_avatar_thumbnail ||
            item?.createBy?.user_avatar,
        }}
        style={styles.avatar}
      />
    </Animated.View>
  );
};

const ReactionLiveStreamComponent = (_, ref) => {
  const [queueReactions, setQueueReactions] = useState<TypedReaction[]>([]);
  // const userData = useStore((state) => state.userData);

  useImperativeHandle(ref, () => ({
    newReaction: (data) => {
      setQueueReactions((prev) => [
        ...prev,
        { react_type: data.react_type, id: uuid.v4(), createBy: data.user_id },
      ]);
    },
  }));

  const finishedAnimation = useCallback(
    (id) => {
      setQueueReactions((prev) => prev.filter((i) => i.id !== id));
    },
    [queueReactions],
  );

  return queueReactions.map((item) => (
    <ItemReactionLivestream
      item={item}
      key={item.id}
      finishedAnimation={finishedAnimation}
    />
  ));
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  avatar: {
    position: "absolute",
    width: MHS._28,
    height: MHS._28,
    borderRadius: MHS._28,
    bottom: -MHS._8,
    right: -MHS._8,
    borderRadius: 99,
  },
});

export default forwardRef(ReactionLiveStreamComponent);
