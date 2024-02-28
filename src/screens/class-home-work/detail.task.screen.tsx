import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import * as React from "react";
import { Text, useWindowDimensions } from "react-native";
import { View, StyleSheet } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import InstructionTab from "./tab/instruction";
import StudentWorkTab from "./tab/student.work";

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
    <View style={styles.container}>
      <Header
        customStyle={{ marginBottom: 0 }}
        text={translations.homework.detailTask}
      />
      <TabView
        style={CS.flex1}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

export default DetailTaskScreen;

const styles = StyleSheet.create({
  container: {
    ...CS.safeAreaView,
  },
});
