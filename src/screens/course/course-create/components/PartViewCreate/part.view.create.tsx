import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import Accordion from "react-native-collapsible/Accordion";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { deleteModule, getListModule } from "@services/api/course.api";
import { ICourseModuleItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";

const { width } = Dimensions.get("screen");
interface PartViewCreateProps {
  id: string;
  hide: boolean;
}

const PartViewCreate = ({ id, hide }: PartViewCreateProps) => {
  const userData = useStore((state) => state.userData);
  // const id = "65c0411bb513eeff42783867";
  const param = {
    auth_id: userData?._id,
    course_id: id,
  };

  const [sectionList, setSectionList] = React.useState<ICourseModuleItem[]>([]);
  const [activeSections, setActiveSections] = React.useState<number[]>([0]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const _getListModule = () => {
    getListModule(param).then((res) => {
      if (!res.isError) {
        const data: ICourseModuleItem[] = res.data;
        setIsLoading(false);
        setSectionList(data);
        const arr = [];
        for (let index = 0; index < data.length; index++) {
          arr.push(index);
        }
        setActiveSections(arr);
      }
    });
  };

  React.useEffect(() => {
    eventEmitter.on("reload_part_view", _getListModule);
    return () => {
      eventEmitter.off("reload_part_view", _getListModule);
    };
  });

  React.useEffect(() => {
    _getListModule();
  }, [id]);

  const callAPIDeleteModule = (id: string) => {
    deleteModule(id).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.course.deleteClassSuccess,
        });
        eventEmitter.emit("reload_data_preview");
        _getListModule();
      } else {
        showToast({
          type: "error",
          message: res.message,
        });
      }
    });
  };

  const _renderHeader = (section: ICourseModuleItem, index: number) => {
    console.log(section);

    const deletePart = () => {
      showSuperModal({
        contentModalType: EnumModalContentType.Confirm,
        styleModalType: EnumStyleModalType.Middle,
        data: {
          title: translations.course.deleteModuleDes,
          cb: () => callAPIDeleteModule(section._id),
        },
      });
    };
    const editPart = () => {
      NavigationService.navigate(SCREENS.COURSE_ADD_MODULE, {
        course_id: id,
        data: section,
      });
    };
    return (
      <PressableBtn onPress={() => _updateSections(index)}>
        <Animatable.View
          duration={300}
          transition="backgroundColor"
          style={{
            flexDirection: "row",
            height: 40,
            alignItems: "center",
            justifyContent: "space-between",
            width: width - 32,
            marginTop: 8,
            borderWidth: 1,
            borderColor: palette.borderColor,
            paddingHorizontal: 8,
          }}
        >
          <Text style={styles.headerText}>{section.title}</Text>
          <View style={{ flexDirection: "row" }}>
            <Icon
              onPress={editPart}
              size={24}
              name={"create-outline"}
              type={IconType.Ionicons}
            />
            <Icon
              onPress={deletePart}
              size={24}
              name={"trash-outline"}
              type={IconType.Ionicons}
            />
            <Icon
              size={24}
              name={
                activeSections.indexOf(index) >= 0
                  ? "chevron-up"
                  : "chevron-down"
              }
              type={IconType.Ionicons}
            />
          </View>
        </Animatable.View>
      </PressableBtn>
    );
  };

  const _renderContent = (
    section: ICourseModuleItem,
    i: number,
    isActive: boolean,
  ) => {
    const _addNewLesson = () => {
      // chuyển đến trang thêm bài học truyền xuống part_id, course_id
      // NavigationService.navigate(SCREENS.COURSE_ADD_MODULE, {
      //   course_id: id,
      //   parent_id: section._id,
      // });
      showSuperModal({
        contentModalType: EnumModalContentType.AddLesson,
        styleModalType: EnumStyleModalType.Bottom,
        data: {
          course_id: id,
          parent_id: section._id,
        },
      });
      // console.log("id: ", id, "moduleId....", section._id);
    };
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{
          backgroundColor: palette.background,
          borderWidth: 1,
          borderColor: palette.borderColor,
          paddingHorizontal: 8,
          paddingBottom: 8,
        }}
      >
        <Animatable.View
          key={i}
          duration={300}
          easing="ease-out"
          animation={isActive ? "zoomIn" : "zoomOut"}
        >
          {section.children?.map((item) => {
            return (
              <Lesson
                key={item._id}
                data={item}
                id={id}
                parent_id={section._id}
              />
            );
          })}
          <PressableBtn
            style={{ height: 40, ...CS.center, marginTop: 8 }}
            onPress={_addNewLesson}
          >
            <Text
              style={{
                ...CS.hnMedium,
                fontSize: 14,
                color: palette.primary,
                textDecorationLine: "underline",
              }}
            >
              {translations.course.addLesson}
            </Text>
          </PressableBtn>
        </Animatable.View>
      </Animatable.View>
    );
  };
  const _updateSections = (active: number) => {
    setActiveSections((activeSections) => {
      if (activeSections.indexOf(active) < 0) {
        return [...activeSections, active];
      } else {
        return activeSections.filter((i) => i != active);
      }
    });
  };
  if (hide) {
    return null;
  }

  const _addNewPart = () => {
    // Chuyeenr đến mà hình thêm Part mới
    // truyền course_id
    NavigationService.navigate(SCREENS.COURSE_ADD_MODULE, {
      course_id: id,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          {translations.course.educationProgram}
        </Text>
        <ActivityIndicator size={"large"} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          {translations.course.educationProgram}
        </Text>
        <Accordion
          sections={sectionList}
          activeSections={activeSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={() => {}}
        />
        <PressableBtn style={styles.viewAdd} onPress={_addNewPart}>
          <Text
            style={{
              ...CS.hnMedium,
              fontSize: 14,
              color: palette.primary,
              textDecorationLine: "underline",
            }}
          >
            {translations.course.addModule}
          </Text>
        </PressableBtn>
      </View>
    );
  }
};

export default React.memo(PartViewCreate);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  headerText: {
    ...CS.hnSemiBold,
  },
  viewContent: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    paddingVertical: 4,
  },
  paragraph: {
    ...CS.hnMedium,
  },
  textDetail: {
    ...CS.hnRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  viewAdd: {
    ...CS.center,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: palette.primary,
    height: 80,
    marginTop: 8,
    borderStyle: "dashed",
  },
});

interface LessonProps {
  data: any;
  id: string;
  parent_id: string;
}

const Lesson = ({ data, id, parent_id }: LessonProps) => {
  const callAPIDeleteModule = (id: string) => {
    deleteModule(id).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.course.deleteClassSuccess,
        });
        eventEmitter.emit("reload_part_view");
        eventEmitter.emit("reload_data_preview");
      } else {
        showToast({
          type: "error",
          message: res.message,
        });
      }
    });
  };
  const deletePart = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.course.deleteModuleDes,
        cb: () => callAPIDeleteModule(data._id),
      },
    });
  };
  const viewVideo = () => {
    NavigationService.navigate(SCREENS.COURSE_LEARN_VIDEO_SCREEN, {
      source: data,
      course_id: id,
    });
  };

  const editLesson = () => {
    NavigationService.navigate(SCREENS.COURSE_ADD_MODULE, {
      course_id: id,
      parent_id: parent_id,
      type: data.type,
      data: data,
    });
  };
  return (
    <PressableBtn style={styles.viewContent} onPress={viewVideo}>
      <Animatable.Text style={[styles.textDetail, { flex: 1 }]}>
        {data.title}
      </Animatable.Text>
      <Icon
        onPress={editLesson}
        size={24}
        name={"create-outline"}
        type={IconType.Ionicons}
      />
      <Icon
        onPress={deletePart}
        size={24}
        name={"trash-outline"}
        type={IconType.Ionicons}
      />
      <Icon
        onPress={viewVideo}
        size={24}
        name={data.type === "file" ? "document-outline" : "play-circle-outline"}
        type={IconType.Ionicons}
      />
    </PressableBtn>
  );
};
