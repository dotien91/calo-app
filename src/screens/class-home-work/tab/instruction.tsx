import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import * as React from "react";
import * as NavigationService from "react-navigation-helpers";

import { openUrl } from "@helpers/file.helper";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import Button from "@shared-components/button/Button";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatFullDate } from "@utils/date.utils";
import IconSvg from "assets/svg";
import ThreadCommentsView from "../thread.comments.view";
import { SCREENS } from "constants";
import { getDetailThread } from "@services/api/course.api";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import eventEmitter from "@services/event-emitter";

const InstructionTab = () => {
  const route = useRoute();
  const data = route.params?.["data"];
  const userData = useStore((state) => state.userData);
  const [detailThread, setDetailThread] = React.useState(null);

  React.useEffect(() => {
    _getDetailThread();
    eventEmitter.on("reload_data_thread", _getDetailThread);
    return () => {
      eventEmitter.off("reload_data_thread", _getDetailThread);
    };
  }, []);

  const _getDetailThread = () => {
    getDetailThread(data._id, {
      "Class-ID": data.class_id,
    }).then((res) => {
      if (!res.isError) {
        setDetailThread(res.data);
      }
    });
  };

  const isTeacher = () => {
    return data.user_id._id == userData._id;
  };

  const openAddWorkScreen = () => {
    NavigationService.navigate(SCREENS.ADD_WORK_STUDENT, {
      data,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...CS.hnMedium, fontSize: 14, marginTop: 16 }}>
        {formatFullDate(data.createdAt)}
      </Text>
      <Text style={{ ...CS.hnSemiBold, fontSize: 20, marginTop: 4 }}>
        {data.thread_title}
      </Text>
      <Text style={{ ...CS.hnRegular, fontSize: 16, marginTop: 4 }}>
        {data.thread_content}
      </Text>
      {!!data.max_mark && (
        <Text style={{ ...CS.hnRegular, fontSize: 16, marginTop: 8 }}>
          {`100 ${translations.homework.points}`}
        </Text>
      )}
      {!!data?.expired && (
        <Text style={{ ...CS.hnRegular, fontSize: 16, marginTop: 4 }}>
          {translations.homework.dueDate + ": " + formatFullDate(data?.expired)}
        </Text>
      )}
      <View style={{ marginBottom: 12 }}>
        {data.attach_files.map((item, index) => (
          <PressableBtn
            key={index}
            onPress={() => openUrl(item.media_url)}
            style={styles.viewImage}
          >
            <IconSvg size={20} name="icCreatePostImage" />
            <Text style={{ ...CS.flex1, ...CS.hnRegular }}>
              {item.media_file_name}
            </Text>
            {/* <Icon
          onPress={deleteImage}
          type={IconType.Ionicons}
          name={"close"}
          style={{ color: colors.text }}
        /> */}
          </PressableBtn>
        ))}
      </View>
      <ThreadCommentsView />
      {!isTeacher() && (
        <StudentWorkView
          data={data}
          userData={userData}
          detailThread={detailThread}
          openAddWorkScreen={openAddWorkScreen}
        />
      )}
    </View>
  );
};

const StudentWorkView = ({
  detailThread,
  userData,
  openAddWorkScreen,
  data,
}) => {
  let myWork = (detailThread?.handed_in_user_ids || []).find(
    (item) => item.user_id._id == userData._id,
  );
  if (!myWork)
    myWork = (detailThread?.marked_user_ids || []).find(
      (item) => item.user_id._id == userData._id,
    );

  console.log("detailThreaddetailThread", detailThread, myWork, userData);
  const openMyWork = () => {
    NavigationService.navigate(SCREENS.ADD_WORK_STUDENT, {
      studentWork: myWork,
      data,
    });
  };

  if (myWork)
    return (
      <PressableBtn onPress={openMyWork} style={styles.bottomView}>
        <View style={CS.flexRear}>
          <TextBase fontWeight="600" color={EnumColors.text}>
            {translations.homework.yourWork}
          </TextBase>
          {!!data.max_mark && (
            <TextBase fontWeight="500" color={EnumColors.text}>
              {myWork.mark > -1 ? myWork.mark : "-"}
              <TextBase fontWeight="500" color={EnumColors.textOpacity4}>
                /100
              </TextBase>
            </TextBase>
          )}
        </View>
        <ScrollView contentContainerStyle={{ maxHeight: 100 }}>
          {myWork.attach_files.map((item, index) => (
            <View key={index} style={styles.viewImage}>
              <IconSvg size={20} name="icCreatePostImage" />
              <Text style={{ ...CS.flex1, ...CS.hnRegular }}>
                {item.media_file_name}
              </Text>
              {/* <Icon
          onPress={deleteImage}
          type={IconType.Ionicons}
          name={"close"}
          style={{ color: colors.text }}
        /> */}
            </View>
          ))}
        </ScrollView>
      </PressableBtn>
    );

  return (
    <View style={styles.bottomView}>
      <Button
        onPress={openAddWorkScreen}
        type={"primary"}
        text={translations.homework.addWork}
        iconName="plus"
      />
    </View>
  );
};

export default InstructionTab;

const styles = StyleSheet.create({
  bottomView: {
    position: "absolute",
    left: 0,
    bottom: 16,
    right: 0,
    padding: 12,
    paddingBottom: 0,
    backgroundColor: palette.white,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    elevation: 1,
    shadowRadius: 5,
  },
  container: {
    ...CS.flex1,
    paddingHorizontal: 16,
  },
  viewImage: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    ...CS.row,
    backgroundColor: palette.grey2,
    gap: 12,
    marginTop: 8,
  },
});
