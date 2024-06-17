import React from "react";
import { FlatList, View, Text, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, useRoute } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import { ICourseItem } from "models/course.model";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";
import CS from "@theme/styles";
import lotieNoResult from "assets/lotties/no-result.json";

import LoadingList from "@shared-components/loading.list.component";
import StreamCard from "@screens/home/components/list-livestream/stream.card";
import { getListLiveStream } from "@services/api/stream.api";
import { useListData } from "@helpers/hooks/useListData";
import Header from "@shared-components/header/Header";

const FirstRoute = () => <ListSearch type={["live", "schedule"]} />;
const SecondRoute = () => <ListSearch type={["schedule"]} />;
const ThirdRoute = () => <ListSearch type={["live"]} />;

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});

interface LivestreamListScreenProps {}

const LivestreamListScreen: React.FC<LivestreamListScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const layout = useWindowDimensions();

  const route = useRoute();
  const defaultIndex = route.params?.["defaultIndex"] || 0;
  const [index, setIndex] = React.useState(defaultIndex);
  const _index = React.useRef(index);
  const [routes] = React.useState([
    { key: "first", title: translations.all },
    { key: "second", title: translations.updateLivestream.makePlan },
    { key: "third", title: translations.updateLivestream.happenning },
  ]);

  //reset params after change tab
  React.useEffect(() => {
    if (index != _index.current) {
      _index.current = index;
    }
  }, [index]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primary,
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            ...CS.hnSemiBold,
            fontSize: 14,
            color: focused ? colors.primary : colors.text,
          }}
        >
          {route.title}
        </Text>
      )}
      style={{
        backgroundColor: colors.background,
        shadowColor: "rgba(0,0,0,0.8)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        elevation: 1,
        shadowRadius: 5,
        marginBottom: 4,
      }}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header text="Danh sách Livestream" />
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
};

const ListSearch = ({ type }: { type: string[] }) => {
  const paramRequest = React.useMemo(() => {
    return {
      limit: "5",
      livestream_status: type,
    };
  }, []);

  const { noData, listData, isLoading, onEndReach, renderFooterComponent } =
    useListData<ICourseItem>(paramRequest, getListLiveStream, []);

  const renderItem = ({ item }: { item: ICourseItem }, index: number) => {
    return <StreamCard data={item} key={index} isSliderItem={false} />;
  };

  console.log("typetype", type, listData);

  const renderLoading = () => {
    if (!isLoading) return null;
    return (
      <View style={{ marginTop: 10 }}>
        <LoadingList />
      </View>
    );
  };

  return (
    <View>
      {renderLoading()}
      {!listData?.length && !isLoading && noData && (
        <EmptyResultView
          title={translations.noResult}
          lottieJson={lotieNoResult}
        />
      )}
      <FlatList
        contentContainerStyle={{ paddingBottom: 32 }}
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + "" || item?.last_active}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};

export default LivestreamListScreen;
