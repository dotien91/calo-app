import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import createStyles from "./club.screen.style";
import { useTheme } from "@react-navigation/native";
import { palette } from "@theme/themes";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import FeatureClubScreen from "../components/feature.club.screen";
import ManagedClubScreen from "../components/managed.club.screen";
import JoinClubSceen from "../components/join.club.sceen";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import { quickFilterCourse } from "constants/course.constant";
import PressableBtn from "@shared-components/button/PressableBtn";

const renderScene = SceneMap({
  first: FeatureClubScreen,
  second: ManagedClubScreen,
  third: JoinClubSceen,
});

const ClubScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const routes = [
    { key: "first", title: translations.club.tab1 },
    { key: "second", title: translations.club.tab2 },
    { key: "third", title: translations.club.tab3 },
  ];

  const onPressHeaderRight = () => {
    navigate(SCREENS.SEARCH_CLUB);
  };

  const renderTabBar = (props) => (
    <View>
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: palette.primary,
        }}
        renderLabel={({ route, focused }) => (
          <Text
            numberOfLines={1}
            style={focused ? styles.txtTabBarForcusd : styles.txtTabBar}
          >
            {route.title}
          </Text>
        )}
        style={styles.viewTabBar}
      />
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.wrapBtnFilter}
      >
        {quickFilterCourse.map((item, index) => renderItem(item, index))}
      </ScrollView>
    </View>
  );

  const onPressBtnFilter = (item: string) => {
    navigate(SCREENS.CLUB_BY_CATEGORY, {
      skills: [item.id],
    });
  };

  const renderItem = (item, key) => {
    return (
      <PressableBtn
        key={key}
        onPress={() => onPressBtnFilter(item)}
        style={styles.btnFilter}
      >
        <Text style={styles.txtFilter}>{item.name}</Text>
      </PressableBtn>
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        text={translations.club.club}
        iconNameRight="search"
        onPressRight={onPressHeaderRight}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

export default ClubScreen;
