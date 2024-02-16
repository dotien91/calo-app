import React from "react";
import { View, Text, ViewStyle } from "react-native";

import styles from "./LiveBadge.styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";

const LiveBadge = ({ customStyle }: { customStyle: ViewStyle }) => {
  const viewNumber = useStore((state) => state.viewNumber);
  return (
    <>
      <View style={[styles.container, customStyle && customStyle]}>
        <View style={styles.dot} />
        <Text style={styles.title}>LIVE</Text>
      </View>
      {!!viewNumber && (
        <View style={styles.viewCountBox}>
          <Icon
            type={IconType.Ionicons}
            color={palette.white}
            name={"eye"}
            size={18}
          />
          <Text style={styles.viewCountTxt}>{viewNumber}</Text>
        </View>
      )}
    </>
  );
};

export default React.memo(LiveBadge);
