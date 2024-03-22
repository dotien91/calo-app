import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Header from "@shared-components/header/Header";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import CS from "@theme/styles";
import { getMyCourse } from "@services/api/course.api";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseItem } from "models/course.model";
import LoadingItem from "@shared-components/loading.item";
import useStore from "@services/zustand/store";
import CourseItem from "@screens/course-tab/components/course.item";
import { useUserHook } from "@helpers/hooks/useUserHook";
import { translations } from "@localization";
import EmptyResultView from "@shared-components/empty.data.component";
import { palette } from "@theme/themes";

const MyCourse = () => {
  const theme = useTheme();
  const { colors } = theme;
  // const styles = useMemo(() => createStyles(theme), [theme]);
  const [index, setIndex] = React.useState(0);
  const layout = useWindowDimensions();
  const userData = useStore((state) => state.userData);
  const { isLoggedIn, renderViewRequestLogin } = useUserHook();
  const [routes] = React.useState([
    { key: "first", title: translations.inprogress },
    { key: "second", title: translations.complete },
  ]);

  const { listData, isLoading } = useListData<ICourseItem>(
    {
      auth_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
      // public_status: "active",
    },
    getMyCourse,
  );

  console.log("listData", {
    listData,
  });

  const renderScene = SceneMap({
    first: () => <ListData listData={listData} isLoading={isLoading} />,
    second: () => (
      <ListData listData={listData} isTabComplete isLoading={false} />
    ),
  });

  if (!isLoggedIn()) {
    return (
      <View style={{ ...CS.safeAreaView }}>
        <Header text={translations.course.myCourse} />
        {renderViewRequestLogin()}
      </View>
    );
  }

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
          style={[
            styles.txtLabel,
            { color: focused ? colors.primary : colors.text },
          ]}
        >
          {route.title}
        </Text>
      )}
      style={{ backgroundColor: colors.background }}
    />
  );

  return (
    <SafeAreaView style={{ ...CS.safeAreaView }}>
      <Header text={translations.settingUser.purchaseCouse} />
      <TabView
        style={{ flex: 1 }}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
};

const ListData = React.memo(({ listData, isTabComplete, isLoading }) => {
  const data = React.useMemo(() => {
    return listData.filter((item) =>
      isTabComplete
        ? item.module_view?.length > 0 &&
          item.module_view?.length == item.module_child_count
        : item.module_view?.length == 0 ||
          item.module_view?.length != item.module_child_count,
    );
  }, [listData]);

  const renderItemSelected = ({
    item,
    index,
  }: {
    item: ICourseItem;
    index: number;
  }) => {
    return <CourseItem data={item} key={index} />;
  };

  const renderEmpty = () => {
    return (
      <EmptyResultView
        title={translations.course.emptyCourse}
        // desc={isTabComplete?translations.course.emptyCourse: }
        // showLottie={false}
        style={styles.viewEmpty}
      />
    );
  };
  console.log(data.length);

  return (
    <View>
      {isLoading && <LoadingItem />}
      {data.length < 1 ? (
        renderEmpty()
      ) : (
        <FlatList
          contentContainerStyle={styles.viewFlatList}
          data={data}
          renderItem={renderItemSelected}
          onEndReachedThreshold={0}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
});

export default MyCourse;

const styles = StyleSheet.create({
  viewEmpty: {
    ...CS.center,
    ...CS.flex1,
    backgroundColor: palette.background,
    paddingVertical: 40,
    minHeight: 200,
  },
  viewFlatList: {
    marginTop: 16,
  },
  txtLabel: {
    ...CS.hnBold,
    fontSize: 16,
    margin: 8,
  },
});
