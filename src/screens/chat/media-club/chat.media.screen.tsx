import React from "react";
import {
  View,
  // SafeAreaView,
  Text,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

/**
 * ? Local Imports
 */

import CommonStyle from "@theme/styles";
import GoBackButton from "@screens/auth/components/GoBackButton";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import ClubMediaImageView from "./chat.media.image.view";
import ClubMediaFilesView from "./chat.media.files.view";
import { SafeAreaView } from "react-native-safe-area-context";

const renderScene = SceneMap({
  file: () => <ClubMediaFilesView />,
  media: () => <ClubMediaImageView />,
});

const ChatRoomMediaScreen = () => {
  const theme = useTheme();
  const { colors } = theme;

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "media", title: "MEDIA" },
    { key: "file", title: "FILES" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primary,
        // width: 50,
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            ...CommonStyle.hnBold,
            fontSize: 12,
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
    <SafeAreaView style={styles.container}>
      <View style={CommonStyle.flexStart}>
        <GoBackButton customStyle={styles.backBtn} />
        <Text
          style={{
            ...CommonStyle.headerTitle,
            flex: 1,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          {translations.chat.mediaFile}
        </Text>
      </View>
      <TabView
        style={CommonStyle.flex1}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    flex: 1,
    padding: 12,
  },
});

export default ChatRoomMediaScreen;
