import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Linking, StyleSheet, Text, View, ScrollView } from "react-native";
import { useRoute, useNavigation, useTheme } from "@react-navigation/native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import Orientation from "react-native-orientation-locker";
import { getStatusBarHeight } from "react-native-safearea-height";
import * as FileViewer from "react-native-file-viewer";

import VideoPreview from "./components/video.preview";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import CS from "@theme/styles";
import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { HS, MHS, VS } from "@utils/size.utils";
import { Device } from "@utils/device.utils";
import PartView from "../course-preview/components/part.view";
import { updateViewed } from "@services/api/course.api";
import createStyles from "./course.learn.style";
import CourseLearnAction from "./components/course.learn.action";
import { palette } from "@theme/themes";
import Header from "@shared-components/header/Header";
import useStore from "@services/zustand/store";

const CourseLearnScreen = () => {
  const route: any = useRoute();
  const navigation = useNavigation();
  const showFloatButtonDailyMission = useSharedValue(1);
  const theme = useTheme();
  const [source, setSource] = useState(route?.params?.source);
  const [isLanscape, setIsLanscape] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [tabSelected, setTabSelected] = useState(1);
  const detailCourse = route?.params?.detailCourse;
  const course_id = route?.params?.course_id;
  const isTeacher = route?.params?.isTeacher || false;
  const videoRef = useRef<any>();
  const { colors } = theme;

  useLayoutEffect(() => {
    navigation.setOptions({
      showFloatButtonDailyMission,
    });
  }, [navigation]);

  useEffect(() => {
    return () => {
      showFloatButtonDailyMission.value = withTiming(1, { duration: 0 });
      Orientation.lockToPortrait();
    };
  }, []);

  const onPressLanscape = (isFullScreen: boolean) => {
    showFloatButtonDailyMission.value = withTiming(isFullScreen ? 0 : 1, {
      duration: 0,
    });
    setIsLanscape(isFullScreen);
  };

  const onPressMarkDone = (item) => {
    if (item.is_view) {
      return;
    }
    // gọi API đánh đấu đã xong video
    updateViewed({ module_id: item._id });
  };
  const TabSelect = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 16,
          height: 40,
          marginTop: 20,
        }}
      >
        <PressableBtn style={CS.flex1} onPress={() => setTabSelected(1)}>
          <View style={{ ...CS.flex1, ...CS.center }}>
            <Text
              style={tabSelected == 1 ? styles.textTabSelected : styles.textTab}
            >
              {translations.course.Lectures}
            </Text>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor:
                tabSelected == 1 ? palette.primary : palette.background,
            }}
          ></View>
        </PressableBtn>
        <PressableBtn style={CS.flex1} onPress={() => setTabSelected(2)}>
          <View style={{ ...CS.flex1, ...CS.center }}>
            <Text
              style={tabSelected == 2 ? styles.textTabSelected : styles.textTab}
            >
              {translations.course.more}
            </Text>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor:
                tabSelected == 2 ? palette.primary : palette.background,
            }}
          ></View>
        </PressableBtn>
      </View>
    );
  };

  const renderThumbnail = useCallback(() => {
    if (!source?.media_id?.media_url) {
      return (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ ...CS.hnSemiBold, color: colors.primary }}>
            {translations.course.selectVideoModule}
          </Text>
        </View>
      );
    }

    if (!source?._id) {
      const isVideo = detailCourse?.avatar?.media_type == "video";
      if (isVideo) {
        return (
          <VideoPreview
            onPressLanscape={onPressLanscape}
            url={detailCourse?.avatar?.media_url}
            ref={videoRef}
            changeOrientation={true}
            thumbnail={detailCourse?.avatar?.media_thumbnail}
          />
        );
      }
      return (
        <ImageLoad
          source={{
            uri:
              detailCourse?.avatar?.media_thumbnail ||
              detailCourse?.avatar?.media_url,
          }}
          style={{ ...StyleSheet.absoluteFillObject }}
          resizeMode="contain"
        />
      );
    }

    const isVideo = source?.media_id?.media_type == "video";

    if (isVideo) {
      return (
        <VideoPreview
          onPressLanscape={onPressLanscape}
          url={source?.media_id?.media_url}
          ref={videoRef}
          changeOrientation={true}
          markDoneCourse={() => onPressMarkDone(source)}
          thumbnail={source?.media_id?.media_thumbnail}
        />
      );
    }

    const isImage = source?.media_id?.media_type === "image";

    if (isImage) {
      return (
        <ImageLoad
          source={{
            uri:
              source?.media_id?.media_thumbnail || source?.media_id?.media_url,
          }}
          style={{ ...StyleSheet.absoluteFillObject }}
          resizeMode="contain"
        />
      );
    }

    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ ...CS.hnSemiBold, color: colors.primary }}>
          {source?.media_id?.media_file_name}
        </Text>
        <PressableBtn
          style={{
            marginTop: VS._10,
            paddingHorizontal: HS._10,
            paddingVertical: VS._4,
            borderRadius: MHS._10,
          }}
          onPress={() => {
            Linking.openURL(source.media_id?.media_url).catch(console.log);
          }}
        >
          <Text style={{ ...CS.hnSemiBold, color: colors.primary }}>
            {translations.course.openWebsite}
          </Text>
        </PressableBtn>
      </View>
    );
  }, [source?.media_id?._id]);

  const fileCourseLocal = useStore((state) => state.fileCourseLocal);

  const onPressItem = (item: any) => {
    if (item.type === "video") {
      setSource(item);
    } else {
      const isDownload = (fileCourseLocal || []).filter(
        (data) => item._id === data.id,
      );
      if (isTeacher) {
        setSource(item);
      }
      if (isDownload.length > 0) {
        FileViewer.open(isDownload[0].localFile);
      }
    }
  };
  return (
    <View
      style={[
        styles.container,
        !isLanscape && { marginTop: getStatusBarHeight() },
      ]}
    >
      <Header text={detailCourse?.title} />
      <View
        style={[
          styles.styleVideo,
          { height: isLanscape ? "100%" : (Device.width / 16) * 9 },
        ]}
      >
        {Device.isIos ? (
          <View style={isLanscape ? styles.viewLanscape : styles.viewPortrait}>
            {renderThumbnail()}
          </View>
        ) : (
          renderThumbnail()
        )}
      </View>
      <TabSelect />
      <ScrollView style={CS.flex1}>
        <PartView
          hide={tabSelected == 2}
          id={course_id}
          onPressItem={onPressItem}
          itemSelected={source}
          isLearnScreen
        />
        {tabSelected == 2 && (
          <CourseLearnAction item={source} course_id={course_id} />
        )}
      </ScrollView>
    </View>
  );
};

export default CourseLearnScreen;
