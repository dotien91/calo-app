import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Animatable from "react-native-animatable";

import Accordion from "react-native-collapsible/Accordion";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { getListModule } from "@services/api/course.api";
import { ICourseModuleItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { translations } from "@localization";

const { width } = Dimensions.get("screen");
interface PartViewProps {
  id: string;
  hide: boolean;
}

const PartView = ({ id, hide }: PartViewProps) => {
  const userData = useStore((state) => state.userData);

  const param = {
    auth_id: userData?._id,
    course_id: id,
  };

  const [sectionList, setSectionList] = React.useState<ICourseModuleItem[]>([]);
  const [activeSections, setActiveSections] = React.useState<number[]>([0]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const getFullData = async (data: ICourseModuleItem[]) => {
    const dataFull = data;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      param.parent_id = element._id;
      await getListModule(param).then((res) => {
        dataFull[index].child = res.data;
      });
    }
    return [...dataFull];
  };

  const _getListModule = async () => {
    getListModule(param).then(async (res) => {
      const data: ICourseModuleItem[] = res.data;
      const dataFull = await getFullData(data);
      setIsLoading(false);
      setSectionList(dataFull);
    });
  };

  React.useEffect(() => {
    _getListModule();
  }, [id]);

  const _renderHeader = (section: ICourseModuleItem, index: number) => {
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
          <Text style={styles.moreLess}>
            {activeSections.indexOf(index) < 0 ? "+" : "-"}
          </Text>
        </Animatable.View>
      </PressableBtn>
    );
  };

  const _renderContent = (
    section: ICourseModuleItem,
    i: number,
    isActive: boolean,
  ) => {
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
          {section.child?.map((item) => (
            <Lession key={item._id} data={item} />
          ))}
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
      </View>
    );
  }
};

export default React.memo(PartView);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  headerText: {
    ...CS.textCourse,
  },
  moreLess: {
    ...CS.textCourse,
    fontSize: 20,
    lineHeight: 24,
  },
  viewContent: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  paragraph: {
    ...CS.hnMedium,
  },
});

interface LessionProps {
  data: any;
}

const Lession = ({ data }: LessionProps) => {
  return (
    <PressableBtn style={styles.viewContent} onPress={() => console.log(data)}>
      <Animatable.Text style={CS.textCourse}>{data.title}</Animatable.Text>
    </PressableBtn>
  );
};
