import { translations } from "@localization";
import { useTheme, useRoute } from "@react-navigation/native";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import * as React from "react";
import {
  SafeAreaView,
  Text,
  useWindowDimensions,
  View,
  StyleSheet,
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import InstructionTab from "./tab/instruction";
import StudentWorkTab from "./tab/student.work";
import useStore from "@services/zustand/store";

const renderScene = SceneMap({
  first: InstructionTab,
  second: StudentWorkTab,
});

const DetailTaskScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: translations.homework.intructions },
    { key: "second", title: translations.homework.studentWork },
  ]);
  const userData = useStore((state) => state.userData);
  const route = useRoute();
  const data = route.params?.["data"];
  const isTeacher = () => {
    return data.user_id._id == userData._id;
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primary,
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            ...CS.hnBold,
            fontSize: 16,
            color: focused ? colors.primary : colors.text,
          }}
        >
          {route.title}
        </Text>
      )}
      style={{ backgroundColor: colors.background }}
    />
  );

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <View style={styles.container}>
        <Header
          customStyle={{ marginBottom: 0 }}
          text={translations.homework.detailTask}
        />

        {isTeacher() ? (
          <TabView
            style={CS.flex1}
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        ) : (
          <InstructionTab />
        )}
      </View>
    </SafeAreaView>
  );
};

export default DetailTaskScreen;

const styles = StyleSheet.create({
  container: {
    // ...CS.safeAreaView,
    flex: 1,
  },
});
