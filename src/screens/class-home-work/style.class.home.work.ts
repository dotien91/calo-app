import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";
import CS from "@theme/styles";

interface Style {
  container: ViewStyle;
  userContainer: ViewStyle;
  userButton: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    placeholderTxt: {
      ...CS.hnRegular,
      color: colors.textOpacity4
    },
    labelInput: {
      ...CS.hnSemiBold,
      color: colors.text
    },
    label: {
      ...CS.hnSemiBold,
      color: colors.text
    },
    labelInput: {
      ...CS.hnSemiBold,
      color: colors.text,
      marginBottom: 12,
    },
    text: {
      ...CS.hnRegular,
      color: colors.text
    },
    text64: {
      ...CS.hnRegular,
      color: colors.textOpacity6,
      fontSize: 12,
    },
    textTab: {
      ...CS.hnMedium,
      fontSize: 14,
      color: colors.textOpacity6
    },
    textTab: {
      ...CS.hnMedium,
      fontSize: 14,
      color: colors.textOpacity6
    },
    taskBox: {
      padding: 16,
      backgroundColor: colors.white,
      shadowColor: "rgba(0,0,0,0.8)",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      elevation: 1,
      shadowRadius: 5,
      ...CS.flexRear,
    },
    taskInner: {
      ...CS.flexStart,
      paddingBottom: 12,
      ...CS.borderBottomStyle
    },
    wrapIconTask: {
      padding: 9,
      borderRadius: 4,
      backgroundColor: colors.grey2,
      marginRight: 12
    },
    moreIcon: {
      position: 'absolute',
      right: 12,
      top: 30,
    }
//     <PressableBtn onPress={gotoTaskDetail} style={styles.taskBox}>
//     <View style={styles.taskInner}>
//         <View style={styles.wrapIconTask}>
//             <IconBtn name="file" />
//         </View>
//         <View>
//             <Text style={styles.label}>{data.title}</Text>
//             <Text style={styles.text64}>{data.time}</Text>
//         </View>
//     </View>

// </PressableBtn>
  });
};
