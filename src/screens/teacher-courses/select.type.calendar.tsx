import { isIos } from "@helpers/device.info.helper";
import { translations } from "@localization";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import React, { memo } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { styles } from "./styles";

const SelectTypeCalendar = () => {
  const ItemCheck = ({ item }: { item: { color: string; title: string } }) => {
    return (
      <View style={styles.itemSelectTypeCalendar}>
        <IconSvg name="icCheck" color={item.color} size={20} />
        <Text style={CS.hnRegular}>{item.title}</Text>
      </View>
    );
  };
  return (
    <View style={styles.bottomInner}>
      {isIos() && <SafeAreaView />}
      <View>
        <View style={styles.viewBorder} />
        <View style={styles.viewBtn}>
          <Text style={CS.hnSemiBold}>{translations.course.note}</Text>
        </View>
        <View>
          <ItemCheck
            item={{
              color: palette.callGroup,
              title: translations.course.callGroup,
            }}
          />
          <ItemCheck
            item={{
              color: palette.newClass,
              title: translations.course.newClass,
            }}
          />
          <ItemCheck
            item={{
              color: palette.call11,
              title: translations.course.callOneVsOne,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(SelectTypeCalendar);
