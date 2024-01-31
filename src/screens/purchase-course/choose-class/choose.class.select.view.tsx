import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./choose.class.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import CS from "@theme/styles";
import IconBtn from "@shared-components/button/IconBtn";
import { IClass } from "models/course.model";

interface ChooseClassSelectViewProps {
  classData: IClass[];
}

const ChooseClassSelectView: React.FC<ChooseClassSelectViewProps> = ({
  classData,
}: ChooseClassSelectViewProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderClass = (item: IClass, index: number) => {
    const isActive = false;
    const isDisabled = false;
    const colorIcon = isDisabled ? colors.textOpacity4 : colors.text;
    return (
      <View
        key={index}
        style={[
          styles.classBox,
          isDisabled && styles.classBoxDisabled,
          isActive && styles.classBoxActive,
        ]}
      >
        <View style={styles.numberWrap}>
          <Text
            style={[
              styles.titleClass,
              isDisabled && { color: colors.textOpacity4 },
            ]}
          >
            {item?.name}
          </Text>
          <View style={CS.flexStart}>
            <IconBtn
              name={"user"}
              color={colorIcon}
              customStyle={{ marginRight: 8 }}
            />
            <Text style={styles.text}>
              {item.members.length + "/" + item.limit_member}
            </Text>
          </View>

          <View style={CS.flexStart}>
            <IconBtn
              color={colorIcon}
              name={"calendar"}
              customStyle={{ marginRight: 8 }}
            />
            <Text style={styles.text}>
              {item.start_time + " - " + item.end_time}
            </Text>
          </View>
        </View>
        <View style={styles.calendarWrap}>
          {item?.course_calendar_ids?.map((v, index) => (
            <Text
              key={index}
              style={[
                styles.calendarTxt,
                isDisabled && { color: colors.textOpacity4 },
              ]}
            >
              {v.time_start}-{v.time_end}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderPurchaseBtn = () => {
    return (
      <PressableBtn style={styles.btnPurchase}>
        <Text style={styles.txtPurchaseBtn}>
          {translations.purchase.orderNow}
        </Text>
      </PressableBtn>
    );
  };

  console.log("classDataclassData", classData);

  return (
    <ScrollView style={styles.container}>
      {classData.map((item, index) => renderClass(item, index))}
      {renderPurchaseBtn()}
    </ScrollView>
  );
};

export default React.memo(ChooseClassSelectView);
