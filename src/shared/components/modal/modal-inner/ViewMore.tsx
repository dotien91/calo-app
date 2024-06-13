import React from "react";
import { StyleSheet, View } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

import CS from "@theme/styles";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import { EnumColors } from "models";
import IconBtn from "@shared-components/button/IconBtn";

const ViewMore = ({ listItem }: any) => {
  const Item = ({
    onPress,
    title,
    icon = "",
  }: {
    onPress: () => void;
    title: string;
    icName?: string;
  }) => {
    return (
      <PressableBtn onPress={onPress} style={styles.containerFull}>
        <IconBtn name={icon} size={20} color={palette.textOpacity8} />
        <TextBase
          fontSize={16}
          fontWeight="500"
          color={EnumColors.textOpacity8}
        >
          {title}
        </TextBase>
      </PressableBtn>
    );
  };

  return (
    <View style={styles.container}>
      {listItem.map((item) => (
        <Item
          key={item.icon}
          icon={item.icon}
          onPress={item.onPress}
          title={item.title}
        />
      ))}
    </View>
  );
};

export default ViewMore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: getBottomSpace(),
  },
  containerFull: {
    ...CS.row,
    height: 40,
    gap: 8,
    marginBottom: 10,
  },
});
