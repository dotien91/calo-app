import React from "react";
import { View, StyleSheet } from "react-native";

import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import TextBase from "@shared-components/TextBase";
import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import AnimatedLottieView from "lottie-react-native";
import { closeSuperModal } from "@helpers/super.modal.helper";
import { EnumColors } from "models";
import { getStatusBarHeight } from "react-native-safearea-height";

interface IEarnPointView {
  receiveData: any;
}

const EarnPointView = ({ receiveData }: IEarnPointView) => {
  const userInfo = useStore((state) => state.userInfo);
  const [currentPoint, setCurrentPoint] = React.useState(userInfo?.point || 0);
  const setUserInfo = useStore((state) => state.setUserInfo);

  const [showPointCollectAnimation, setShowPointCollectAnimation] =
    React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setCurrentPoint(receiveData.point);
      setUserInfo({ ...userInfo, point: receiveData.point });
      setShowPointCollectAnimation(false);
      setTimeout(() => {
        closeSuperModal();
      }, 1000);
    }, 1500);
  }, []);

  return (
    <View
      onLayout={(e) => console.log(e.nativeEvent.layout.y)}
      style={styles.container}
    >
      <View style={styles.pointWrap}>
        <View style={styles.pointBox}>
          <TextBase fontWeight="600" color={EnumColors.textOpacity6}>
            {" "}
            {currentPoint}
          </TextBase>
          <IconSvg
            style={{ marginLeft: 4 }}
            name={"icCoinStar"}
            color={palette.gold}
            size={22}
          />
        </View>
      </View>
      {showPointCollectAnimation && (
        <AnimatedLottieView
          source={require("assets/lotties/point_collect.json")}
          style={{
            width: 80,
            height: 250,
            position: "absolute",
            left: "50%",
            top: -10,
            marginLeft: -40,
          }}
          autoPlay
        />
      )}
    </View>
  );
};

export default EarnPointView;

const styles = StyleSheet.create({
  pointWrap: {
    ...CS.flexCenter,
  },
  pointBox: {
    backgroundColor: palette.grey3,
    zIndex: 1,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 3,
    ...CS.flexCenter,
  },
  //   boxPoint: {
  //     backgroundColor: palette.white,
  //   },
  container: {
    ...CS.center,
    position: "absolute",
    top: getStatusBarHeight(),
    left: 0,
    right: 0,
  },
});
