import ImageLoad from "@shared-components/image-load/ImageLoad";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { MHS } from "@utils/size.utils";
import uuid from "react-native-uuid";
// import useStore from "@services/zustand/store";

interface TypedReaction {}
interface Props {
  item: TypedReaction;
  finishedAnimation: (id: string) => void;
}

const ItemDonateLivestream = ({ item, finishedAnimation }: Props) => {
  const animation = useSharedValue(1);
  useEffect(() => {
    animation.value = withTiming(0, { duration: 10000 }, (finished) => {
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
      bottom: getRandom(170, 270),
      left: getRandom(150, 300),
    };
  };

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            animation.value,
            [1, 0],
            [1, 2],
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

  return (
    <Animated.View
      style={[
        styles.container,
        { right: randomPosition().left, bottom: randomPosition().bottom },
        style,
      ]}
    >
      <ImageLoad
        source={{
          uri: item?.gift_code?.image,
        }}
        style={styles.viewDonate}
      />
      {/* <ImageLoad
        source={{
          uri:
            item?.user_id?.user_avatar_thumbnail || item?.user_id?.user_avatar,
        }}
        style={styles.avatar}
      /> */}
    </Animated.View>
  );
};

const ReactionLiveStreamComponent = (_, ref) => {
  const [queueReactions, setQueueReactions] = useState<TypedReaction[]>([]);
  // const userData = useStore((state) => state.userData);

  useImperativeHandle(ref, () => ({
    newDonate: (data) => {
      console.log("zzzz....", data);
      setQueueReactions((prev) => [
        ...prev,
        { id: uuid.v4(), user_id: data.user_id, gift_code: data.gift_code },
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
    <ItemDonateLivestream
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
  // avatar: {
  //   position: "absolute",
  //   width: MHS._28,
  //   height: MHS._28,
  //   borderRadius: MHS._28,
  //   bottom: -MHS._8,
  //   right: -MHS._8,
  // },
  viewDonate: {
    position: "absolute",
    width: MHS._60,
    height: MHS._60,
    borderRadius: MHS._10,
  },
});

export default forwardRef(ReactionLiveStreamComponent);
