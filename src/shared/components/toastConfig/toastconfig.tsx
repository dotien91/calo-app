import { StyleSheet, View } from "react-native";

import TextBase from "@shared-components/TextBase";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <View style={styles.viewFull}>
      <View style={props.text2 ? styles.containerFull : styles.container}>
        <View style={[styles.iconSize, props.text2 && { marginTop: 12 }]}>
          <IconSvg color={palette.green} size={24} name="icSuccess" />
        </View>
        <View style={CS.flex1}>
          {props.text2 && (
            <TextBase
              fontSize={14}
              fontWeight="600"
              color="text"
              style={{ marginTop: 12 }}
            >
              {props.text2}
            </TextBase>
          )}
          <TextBase
            fontSize={14}
            color={props.text2 ? "textOpacity8" : "text"}
            numberOfLines={2}
            style={{ paddingVertical: 8 }}
          >
            {props.text1}
          </TextBase>
        </View>
      </View>
    </View>
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <View style={styles.viewFull}>
      <View style={props.text2 ? styles.containerFull : styles.container}>
        <View style={[styles.iconSize, props.text2 && { marginTop: 12 }]}>
          <IconSvg color={palette.red} size={24} name="icError" />
        </View>
        <View style={CS.flex1}>
          {props.text2 && (
            <TextBase
              fontSize={14}
              fontWeight="600"
              color="text"
              style={{ marginTop: 12 }}
            >
              {props.text2}
            </TextBase>
          )}
          <TextBase
            fontSize={14}
            color={props.text2 ? "textOpacity8" : "text"}
            numberOfLines={2}
            style={{ paddingVertical: 8 }}
          >
            {props.text1}
          </TextBase>
        </View>
      </View>
    </View>
  ),

  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  info: (props) => (
    <View style={styles.viewFull}>
      <View style={props.text2 ? styles.containerFull : styles.container}>
        <View style={[styles.iconSize, props.text2 && { marginTop: 12 }]}>
          <IconSvg color={palette.blue} size={24} name="icInfo" />
        </View>
        <View style={CS.flex1}>
          {props.text2 && (
            <TextBase
              fontSize={14}
              fontWeight="600"
              color="text"
              style={{ marginTop: 12 }}
            >
              {props.text2}
            </TextBase>
          )}
          <TextBase
            fontSize={14}
            color={props.text2 ? "textOpacity8" : "text"}
            numberOfLines={2}
            style={{ paddingVertical: 8 }}
          >
            {props.text1}
          </TextBase>
        </View>
      </View>
    </View>
  ),
  warning: (props) => (
    <View style={styles.viewFull}>
      <View style={props.text2 ? styles.containerFull : styles.container}>
        <View style={[styles.iconSize, props.text2 && { marginTop: 12 }]}>
          <IconSvg color={palette.boldYellow} size={24} name="icWarning" />
        </View>
        <View style={CS.flex1}>
          {props.text2 && (
            <TextBase
              fontSize={14}
              fontWeight="600"
              color="text"
              style={{ marginTop: 12 }}
            >
              {props.text2}
            </TextBase>
          )}
          <TextBase
            fontSize={14}
            color={props.text2 ? "textOpacity8" : "text"}
            numberOfLines={2}
            style={{ paddingVertical: 8 }}
          >
            {props.text1}
          </TextBase>
        </View>
      </View>
    </View>
  ),
};

export default toastConfig;

const styles = StyleSheet.create({
  viewFull: {
    paddingHorizontal: 16,
    width: "100%",
    marginTop: 10,
  },
  container: {
    flexDirection: "row",
    minHeight: 48,
    width: "100%",
    backgroundColor: palette.white,
    borderRadius: 8,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    elevation: 0,
    shadowRadius: 2,
    paddingHorizontal: 16,
    gap: 12,
    ...CS.center,
  },
  containerFull: {
    flexDirection: "row",
    minHeight: 73,
    width: "100%",
    backgroundColor: palette.white,
    borderRadius: 8,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    elevation: 0,
    shadowRadius: 2,
    paddingHorizontal: 16,
    gap: 12,
  },

  iconSize: {
    width: 24,
    height: 24,
    ...CS.center,
  },
});
