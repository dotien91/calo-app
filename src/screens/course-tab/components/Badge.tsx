import { View, Text, TouchableOpacity } from "react-native";
import React, { memo } from "react";

import { palette } from "@theme/themes";
import CS from "@theme/styles";

interface IBadge {
  title: string;
  _onPress?: () => void;
}

const Badge = ({ title, _onPress }: IBadge) => {
  return (
    <>
      {_onPress ? (
        <TouchableOpacity
          onPress={_onPress}
          style={{
            padding: 8,
            paddingVertical: 1,
            borderRadius: 99,
            backgroundColor: palette.bgBestSeller,
            alignSelf: "flex-start",
          }}
        >
          <Text
            style={{ ...CS.hnMedium, color: palette.primary, fontSize: 12 }}
          >
            {title}
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            padding: 8,
            paddingVertical: 1,
            borderRadius: 99,
            backgroundColor: palette.bgBestSeller,
            alignSelf: "flex-start",
          }}
        >
          <Text
            style={{ ...CS.hnMedium, color: palette.primary, fontSize: 12 }}
          >
            {title}
          </Text>
        </View>
      )}
    </>
  );
};

export default memo(Badge);
