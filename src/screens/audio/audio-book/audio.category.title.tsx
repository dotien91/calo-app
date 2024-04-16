import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import CS from "@theme/styles";
import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import PressableBtn from "@shared-components/button/PressableBtn";
import createStyles from "../audio.style";

interface AudioCategoryTitleProps {
  title: string;
  onPress?: () => void;
  hideViewAll: boolean;
}
const AudioCategoryTitle = ({
  title,
  onPress = () => {},
  hideViewAll,
}: AudioCategoryTitleProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={{ ...CS.flexRear, paddingHorizontal: 16, marginBottom: 8 }}>
      <Text style={styles.typeLearningLabel}>{title}</Text>
      {!hideViewAll && (
        <PressableBtn onPress={onPress} style={{ ...CS.flexEnd }}>
          <Text style={styles.txtViewMore}>{translations.seeAll}</Text>
          <Icon
            name={"chevron-right"}
            type={IconType.Feather}
            size={16}
            style={{ color: colors.textOpacity6 }}
          />
        </PressableBtn>
      )}
    </View>
  );
};

export default AudioCategoryTitle;
