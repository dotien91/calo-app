import React from "react";
import { View, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";
import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import Button from "@shared-components/button/Button";
import useStore from "@services/zustand/store";
import { levelData } from "constants/task.constant";
import AnimatedLottieView from "lottie-react-native";
import { closeSuperModal } from "@helpers/super.modal.helper";
import { EnumColors } from "models";

interface IRGamificationView {
  receiveData: any;
}

const progressWidth = Device.width - 64 - 8 - 50;

const GamificationView = ({ receiveData }: IRGamificationView) => {
  // {"user_id":"6585460adfde5a433c986c67","point":"43","is_level_up":"false"}
  // receiveData = { "user_id": "6585460adfde5a433c986c67", "point": "1000" }

  const userInfo = useStore((state) => state.userInfo);
  const setUserInfo = useStore((state) => state.setUserInfo);

  const [currentPoint, setCurrentPoint] = React.useState(userInfo?.point || 0);
  const [currentLevel, setCurrentLevel] = React.useState(userInfo?.level || 0);

  const pointRequire = levelData?.[currentLevel + 1] || 0;

  const progress = React.useMemo(() => {
    return currentPoint / pointRequire;
  }, [currentPoint]);

  const [showPointCollectAnimation, setShowPointCollectAnimation] =
    React.useState(false);

  const pointFromSocket = Number(receiveData?.point);

  React.useEffect(() => {
    return () => {
      if (receiveData?.is_level_up == "true") {
        setUserInfo({ ...userInfo, level: userInfo?.level + 1 });
      }
    };
  }, []);

  const onCollectPoint = () => {
    //show animation collect coint
    setShowPointCollectAnimation(true);

    //hide animation collect coint after 1.5s
    setTimeout(() => {
      setShowPointCollectAnimation(false);
      setCurrentPoint(pointFromSocket);
      setUserInfo({ ...userInfo, point: pointFromSocket });
      if (pointFromSocket >= pointRequire) setCurrentLevel((old) => old + 1);
      setTimeout(() => {
        closeSuperModal();
      }, 1000);
    }, 1500);
  };

  const renderLevelBar = () => {
    return (
      <View style={styles.levelBox}>
        {showPointCollectAnimation && (
          <AnimatedLottieView
            source={require("assets/lotties/point_collect.json")}
            style={{
              width: 150,
              height: 600,
              position: "absolute",
              left: "50%",
              top: -650,
              marginLeft: -70,
            }}
            autoPlay
          />
        )}
        <IconSvg
          style={{ marginRight: 8 }}
          name={"icLevel" + currentLevel}
          color={palette.gold}
          size={50}
        />
        <View>
          <View style={CS.flexRear}>
            <TextBase fontWeight="700" fontSize={20}>
              {translations.discover.level} {currentLevel}
            </TextBase>
            <TextBase fontWeight="700" fontSize={14}>
              {currentPoint}/{pointRequire}
            </TextBase>
          </View>
          <Progress.Bar
            style={{ marginTop: 4 }}
            progress={progress}
            width={progressWidth}
            color={progress == 1 ? palette.green : palette.lightBlue}
            unfilledColor={palette.grey3}
            borderWidth={0}
            height={8}
          ></Progress.Bar>
        </View>
      </View>
    );
  };

  if (receiveData?.is_level_up == "true")
    return (
      <View style={styles.container}>
        <IconSvg
          style={{ marginBottom: 16 }}
          name={"icLevel" + (currentLevel + 1)}
          color={palette.gold}
          size={130}
        />
        <TextBase marginBottom={8} fontSize={20} fontWeight="700">
          {translations.gamificaiton.levelUp}
        </TextBase>
        <TextBase textAlign="center" marginBottom={20} fontSize={16}>
          {translations.gamificaiton.levelUpDes}
        </TextBase>
        <Button
          isFullWidth
          text={translations.continue}
          type="primary"
          onPress={closeSuperModal}
        />
      </View>
    );

  return (
    <View style={styles.container}>
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

      <IconSvg
        style={{ marginBottom: 32 }}
        name={"icCoinStar"}
        color={palette.gold}
        size={50}
      />
      <View style={CS.flexCenter}>
        <TextBase fontSize={20} fontWeight="700">
          {translations.gamificaiton.youEarn} 10{" "}
        </TextBase>
        <IconSvg
          style={{ marginTop: -4 }}
          name={"icCoinStar"}
          color={palette.gold}
          size={22}
        />
      </View>
      {renderLevelBar()}
      <Button
        isFullWidth
        text={translations.gamificaiton.collectPoint}
        type="primary"
        onPress={onCollectPoint}
      />
    </View>
  );
};

export default GamificationView;

const styles = StyleSheet.create({
  pointWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -470,
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
  container: {
    ...CS.center,
    paddingVertical: 16,
  },
  levelBox: {
    padding: 16,
    backgroundColor: palette.grey1,
    borderRadius: 10,
    ...CS.flexStart,
    alignItems: "flex-center",
    marginTop: 16,
    marginBottom: 32,
  },
});
