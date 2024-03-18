import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "./style.class.home.work";
import useStore from "@services/zustand/store";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import TaskItem from "./task.item";
import { Device } from "@utils/device.ui.utils";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconBtn from "@shared-components/button/IconBtn";
import CS from "@theme/styles";
import { getListThread } from "@services/api/course.api";
import eventEmitter from "@services/event-emitter";
import LoadingList from "@shared-components/loading.list.component";
import { SCREENS } from "constants";
import { getBottomSpace } from "react-native-iphone-screen-helper";

interface ClassHomeWorkScreenProps {}

const ClassHomeWorkScreen: React.FC<ClassHomeWorkScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;
  const route = useRoute();
  const class_id = route.params?.["class_id"];
  const courseData = route.params?.["courseData"];
  const userData = useStore((state) => state.userData);

  const isTeacher = userData._id == courseData.user_id._id;
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const _getListThread = () => {
    setLoading(true);
    getListThread(
      {
        class_id,
      },
      {
        "Class-ID": class_id,
      },
    ).then((res) => {
      setLoading(false);
      console.log("res...", res);

      if (!res.isError) {
        setTasks(res.data);
      }
      console.log("_getListThread", res);
    });
  };

  console.log(3333, {
    class_id,
  });

  React.useEffect(() => {
    _getListThread();
    eventEmitter.on("reload_data", _getListThread);
    return () => {
      eventEmitter.off("reload_data", _getListThread);
    };
  }, []);

  const renderCreateTaskBtn = () => {
    if (!isTeacher) return null;
    return (
      <PressableBtn
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          backgroundColor: colors.boldYellow,
          ...CS.center,
          borderRadius: 25,
          bottom: 10,
          right: 10,
          zIndex: 1,
        }}
        onPress={() =>
          NavigationService.navigate(SCREENS.CREATE_WORK, {
            class_id,
          })
        }
      >
        <IconBtn name={"plus"} size={30} color={colors.white} />
      </PressableBtn>
    );
  };

  return (
    <SafeAreaView
      style={{ ...CS.safeAreaView, marginBottom: getBottomSpace() }}
    >
      <Header text={translations.homework.header} />
      <View style={styles.container}>
        <ScrollView>
          <ImageLoad
            source={{
              uri:
                courseData.media_id?.media_thumbnail ||
                courseData?.avatar?.media_thumbnail,
            }}
            style={{
              width: Device.width - 32,
              height: (Device.width - 32) / 3,
              borderRadius: 4,
              marginBottom: 16,
            }}
          />
          <Text style={styles.label}>{translations.homework.assignment}</Text>
          <View style={{ height: 4 }} />
          {loading && <LoadingList />}
          {tasks.map((item, index) => (
            <TaskItem key={index} data={item} showMore={isTeacher} />
          ))}
        </ScrollView>
        {renderCreateTaskBtn()}
      </View>
    </SafeAreaView>
  );
};

export default ClassHomeWorkScreen;
