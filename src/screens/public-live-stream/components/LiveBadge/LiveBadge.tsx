import React from "react";
import { View, Text } from "react-native";

import styles from "./LiveBadge.styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";

const LiveBadge = () => {
  const viewNumber = useStore((state) => state.viewNumber);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.dot} />
        <Text style={styles.title}>LIVE</Text>
      </View>
      <View style={styles.viewCountBox}>
        <Icon
          type={IconType.Ionicons}
          color={palette.white}
          name={"eye"}
          size={18}
        />
        <Text style={styles.viewCountTxt}>{viewNumber}</Text>
      </View>
    </>
  );
};

export default LiveBadge;
