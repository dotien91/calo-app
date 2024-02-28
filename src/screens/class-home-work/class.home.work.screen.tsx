import React, { useMemo, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
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

interface ClassHomeWorkScreenProps {}

const ClassHomeWorkScreen: React.FC<ClassHomeWorkScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;
  const route = useRoute();
  const class_id = route.params?.["classId"] || "65c09e49d7d7ab3a76dc2fd0";
  const userData = useStore((state) => state.userData);

  const classData = {
    _id: "65c09e49d7d7ab3a76dc2fd0",
    course_id: "65c09dc4d7d7ab3a76dc2e78",
    course_calendar_ids: [
      {
        _id: "65c09e49d7d7ab3a76dc2fcc",
        time_duration: 2,
        day: 5,
        time_start: "16:30",
        time_end: "18:30",
        course_type: "class",
        createdAt: "2024-02-05T08:37:29.817Z",
        updatedAt: "2024-02-05T08:37:29.817Z",
        __v: 0,
      },
      {
        _id: "65c09e49d7d7ab3a76dc2fce",
        time_duration: 2,
        day: 6,
        time_start: "16:30",
        time_end: "18:30",
        course_type: "class",
        createdAt: "2024-02-05T08:37:29.867Z",
        updatedAt: "2024-02-05T08:37:29.867Z",
        __v: 0,
      },
    ],
    name: "Lớp 1.3",
    limit_member: 8,
    start_time: "2024-02-01T03:07:44.655Z",
    end_time: "2024-09-10T03:07:47.000Z",
    members: [
      {
        official_status: false,
        timezone: "",
        _id: "6585460adfde5a433c986c67",
        user_login: "ductienptit91_gmail.com",
        user_avatar:
          "https://files.exam24h.com/upload/2024/01/17_1705483354877/6585460adfde5a433c986c67-1705483354877-89ce30c5-17b8-49e2-b61e-f9fcc92d6c89.jpg",
        user_avatar_thumbnail:
          "https://files.exam24h.com/upload/2024/01/17_1705483354880/6585460adfde5a433c986c67-1705483354880-thumbnail-89ce30c5-17b8-49e2-b61e-f9fcc92d6c89.jpg",
        display_name: "duc 1123123123 à đấyasdsdasdassd",
        user_role: "user",
        user_status: 1,
        last_active: "2024-02-27T04:22:31.000Z",
        user_active: 0,
      },
    ],
    createdAt: "2024-02-05T08:37:29.919Z",
    updatedAt: "2024-02-16T06:45:38.344Z",
    __v: 0,
    user_id: "6590ef713f9a0468c8290eb9",
  };
  // const courseData = route.params?.["courseData"]
  //token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDA1NDM5ODgsImRhdGEiOnsiX2lkIjoiNjU5MGVmNzEzZjlhMDQ2OGM4MjkwZWI5Iiwia2V5IjoiYTI0MTcxYzcxYjNjMjViZWI0OTQzMTQ1NjQyZjJmNTciLCJzaWduYXR1cmUiOiI4ZTJmODFmZjY1NmRjMjUyYzZhNmVlZGFkN2U3ZTc3OCIsInNlc3Npb24iOiI2NWRkNjQ3NDRmZjM5MGU3MjY3NzBhOWIifSwiaWF0IjoxNzA5MDA3OTg4fQ.0_rmwNcfSFzoyZXrb-RHo88mvj0ucLoQGj-QzytVEgo
  const courseData = {
    coupon_id: null,
    _id: "65c09dc4d7d7ab3a76dc2e78",
    user_id: {
      _id: "6590ef713f9a0468c8290eb9",
      user_login: "vuvanan96_gmail.com",
      user_avatar:
        "https://files.exam24h.com/upload/2024/02/06_1707208375367/6590ef713f9a0468c8290eb9-1707208375367-4daab0e0-13ae-42e3-8c27-16f02c7e36f4.jpg",
      user_avatar_thumbnail:
        "https://files.exam24h.com/upload/2024/02/06_1707208375372/6590ef713f9a0468c8290eb9-1707208375372-thumbnail-4daab0e0-13ae-42e3-8c27-16f02c7e36f4.jpg",
      display_name: "Tony Vu",
      user_role: "teacher",
      bio: "Tuyệtbạn'  Thủ tướng òng tin chính trị giữa Việt Nam và hai đối tác. Hai chuyến thăm cũng thể hiện đường lối đối ngoại độc lập, tự chủ, hợp tác, phát triển và thịnh vượng, đa phương hóa, đa dạng hóa của Việt Nam.  Xem toàn màn hình        bạn'  Thủ tướng n",
      description: "Tuyệt",
      user_status: 1,
      official_status: false,
      last_active: "2024-02-27T04:34:27.000Z",
      user_active: 1,
      certificates: [],
      educations: [],
      course_count: 9,
      member_count: 5,
      rating_count: 2,
    },
    title: "Tieu de call group",
    description: "Mo ta",
    long_description: "Chi tiết",
    avatar: {
      _id: "65c09d99d7d7ab3a76dc2e5f",
      media_url:
        "https://files.exam24h.com/upload/2024/02/05_1707122072556/6590ef713f9a0468c8290eb9-1707122072556-1cbc4a78-0503-4cf0-8f62-aff651ce5285.jpg",
      media_url_presign: "",
      media_type: "image",
      media_thumbnail:
        "https://files.exam24h.com/upload/2024/02/05_1707122072559/6590ef713f9a0468c8290eb9-1707122072559-thumbnail-1cbc4a78-0503-4cf0-8f62-aff651ce5285.jpg",
      media_content: "",
      media_square: "",
      media_mime_type: "image/jpeg",
      media_file_name: "1cbc4a78-0503-4cf0-8f62-aff651ce5285.jpg",
      media_status: 0,
      media_meta: [
        {
          key: "width",
          value: "1600",
          _id: "65c09d99d7d7ab3a76dc2e60",
        },
        {
          key: "height",
          value: "900",
          _id: "65c09d99d7d7ab3a76dc2e61",
        },
        {
          key: "size",
          value: "45324",
          _id: "65c09d99d7d7ab3a76dc2e62",
        },
      ],
      createBy: "6590ef713f9a0468c8290eb9",
      createdAt: "2024-02-05T08:34:33.291Z",
      updatedAt: "2024-02-05T08:34:33.807Z",
      __v: 0,
    },
    service_id: "65c09dc4d7d7ab3a76dc2e8a",
    plan_id: "65c09dc4d7d7ab3a76dc2e8c",
    media_id: {
      _id: "65c09d97d7d7ab3a76dc2e52",
      media_url:
        "https://files.exam24h.com/short/2024/02/05_1707122070670/6590ef713f9a0468c8290eb9/1707122066969.mp4",
      media_url_presign: "",
      media_type: "video",
      media_thumbnail:
        "https://files.exam24h.com/2024/02/05/1707122070556/6590ef713f9a0468c8290eb9_xP1fMsCRUPou/video_thumbnail.png",
      media_content: "",
      media_square: "",
      media_mime_type: "video/mp4",
      media_file_name: "1707122066969.mp4",
      media_status: 0,
      media_meta: [
        {
          key: "video_256",
          value: "",
          _id: "65c09d97d7d7ab3a76dc2e53",
        },
        {
          key: "video_480",
          value: "",
          _id: "65c09d97d7d7ab3a76dc2e54",
        },
        {
          key: "width",
          value: "1920",
          _id: "65c09d97d7d7ab3a76dc2e55",
        },
        {
          key: "height",
          value: "1080",
          _id: "65c09d97d7d7ab3a76dc2e56",
        },
        {
          key: "size",
          value: "3826815",
          _id: "65c09d97d7d7ab3a76dc2e57",
        },
        {
          key: "duration",
          value: "7.2318",
          _id: "65c09d97d7d7ab3a76dc2e58",
        },
        {
          key: "video_codec",
          value: "libx264",
          _id: "65c09d97d7d7ab3a76dc2e59",
        },
        {
          key: "audio_codec",
          value: "aac",
          _id: "65c09d97d7d7ab3a76dc2e5a",
        },
        {
          key: "bitrate",
          value: "4233319",
          _id: "65c09d97d7d7ab3a76dc2e5b",
        },
      ],
      createBy: "6590ef713f9a0468c8290eb9",
      createdAt: "2024-02-05T08:34:31.998Z",
      updatedAt: "2024-02-05T08:34:31.998Z",
      __v: 0,
    },
    start_time: "2024-02-05T08:35:08.155Z",
    end_time: "2024-04-05T08:35:00.000Z",
    slug: "",
    language: "en",
    country: "Vietnam",
    version: "",
    product_id: "",
    rating: 0,
    price: 2300000,
    join_number: 1,
    video_count: 0,
    news_count: 0,
    doc_count: 0,
    module_count: 0,
    module_child_count: 0,
    level: "4+",
    skills: ["Listening", "Reading", "Writing"],
    type: "Call group",
    promotion: 0,
    organization_id: null,
    labels: [],
    createdAt: "2024-02-05T08:35:16.462Z",
    updatedAt: "2024-02-16T06:45:38.058Z",
    __v: 0,
    is_join: false,
  };
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

      if (!res.isError) {
        setTasks(res.data);
      }
      console.log("rerererere", res);
    });
  };

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
        onPress={() => NavigationService.navigate(SCREENS.CREATE_WORK)}
      >
        <IconBtn name={"plus"} size={30} color={colors.white} />
      </PressableBtn>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header text={translations.homework.header} />
      <View style={styles.container}>
        <ScrollView>
          <ImageLoad
            source={{ uri: courseData.media_id?.media_thumbnail }}
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
          {tasks.map((item) => (
            <TaskItem data={item} showMore={isTeacher} />
          ))}
        </ScrollView>
        {renderCreateTaskBtn()}
      </View>
    </SafeAreaView>
  );
};

export default ClassHomeWorkScreen;
