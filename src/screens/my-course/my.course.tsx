import React from "react";
import { FlatList, Text, View, useWindowDimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import Header from "@shared-components/header/Header";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import CS from "@theme/styles";
import { getCourseList } from "@services/api/course.api";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseItem } from "models/course.model";
import LoadingItem from "@shared-components/loading.item";
import CourseItem from "@screens/course-tab/components/course.item";

const MyCourse = () => {
  const theme = useTheme();
  const { colors } = theme;
  // const styles = useMemo(() => createStyles(theme), [theme]);
  const [index, setIndex] = React.useState(0);
  const layout = useWindowDimensions();
  const [routes] = React.useState([
    { key: "first", title: "Improgess" },
    { key: "second", title: "Complete" },
  ]);

  const { listData, isLoading } = useListData<ICourseItem>(
    { limit: "5" },
    getCourseList,
  );

  const renderScene = SceneMap({
    first: () => <View style={{ marginTop: 20 }}>{renderListImprogess()}</View>,
    second: () => <View></View>,
  });

  const renderListImprogess = () => {
    {
      isLoading && <LoadingItem />;
    }
    return (
      <FlatList
        data={listData}
        renderItem={renderItemSelected}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      />
    );
  };

  const renderItemSelected = ({
    item,
    index,
  }: {
    item: ICourseItem;
    index: number;
  }) => {
    return <CourseItem {...item} key={index} />;
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primary,
        width: layout.width / 2,
        left: 0,
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            ...CS.hnBold,
            fontSize: 16,
            color: focused ? colors.primary : colors.text,
            margin: 8,
          }}
        >
          {route.title}
        </Text>
      )}
      style={{ backgroundColor: colors.background }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Header text="My Course" />
      <TabView
        style={{ flex: 1 }}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};
export default MyCourse;
