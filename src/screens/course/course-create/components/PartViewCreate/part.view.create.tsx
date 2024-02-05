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
import { getListModule } from "@services/api/course.api";
import { ICourseModuleItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";

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

  const _getListModule = async () => {
    getListModule(param).then(async (res) => {
      if (!res.isError) {
        const data: ICourseModuleItem[] = res.data;
        setIsLoading(false);
        setSectionList(data);
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

  const _renderHeader = (section: ICourseModuleItem, index: number) => {
    // const _showActionPart = () => {
    //   showSuperModal({
    //     contentModalType: EnumModalContentType.PostAction,
    //     styleModalType: EnumStyleModalType.Bottom,
    //   });
    // };
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
          }}
        >
          <Text style={styles.headerText}>{section.title}</Text>
          <View style={{ flexDirection: "row" }}>
            <Icon
              size={24}
              name={
                activeSections.indexOf(index) >= 0
                  ? "chevron-up"
                  : "chevron-down"
              }
              type={IconType.Ionicons}
            />
            {/* <Icon
              onPress={_showActionPart}
              size={24}
              name={"more"}
              type={IconType.Ionicons}
            /> */}
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
      NavigationService.navigate(SCREENS.COURSE_ADD_MODULE, {
        course_id: id,
        parent_id: section._id,
      });
      // console.log("id: ", id, "moduleId....", section._id);
    };
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{
          backgroundColor: palette.background,
        }}
      >
        <Animatable.View
          key={i}
          duration={300}
          easing="ease-out"
          animation={isActive ? "zoomIn" : "zoomOut"}
        >
          {section.children?.map((item) => (
            <Lesson key={item._id} data={item} />
          ))}
          <PressableBtn
            style={{ borderWidth: 1, height: 40, ...CS.center }}
            onPress={_addNewLesson}
          >
            <Text style={{ ...CS.hnMedium, fontSize: 14 }}>
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
          <Text style={{ ...CS.hnMedium, fontSize: 14 }}>
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
    height: 40,
    marginTop: 8,
  },
});

interface LessonProps {
  data: any;
}

const Lesson = ({ data }: LessonProps) => {
  return (
    <PressableBtn style={styles.viewContent} onPress={() => console.log(data)}>
      <Animatable.Text style={styles.textDetail}>{data.title}</Animatable.Text>
    </PressableBtn>
  );
};
