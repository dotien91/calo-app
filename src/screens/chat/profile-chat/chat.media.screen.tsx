import React, { useMemo } from "react";
import { View, SafeAreaView, Text, useWindowDimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

/**
 * ? Local Imports
 */
import createStyles from "./chat.profile.style";

import { EnumMediaChat } from "models/chat.model";
import { ScrollView } from "react-native-gesture-handler";
import CommonStyle from "@theme/styles";
import useStore from "@services/zustand/store";
import GoBackButton from "@screens/auth/components/GoBackButton";
import MessageAudio from "../room-chat/components/audio/MessageAudio";
import MessageMediaView from "../room-chat/components/message/message.media.view";

interface MediaChatScreenProps {}

const MediaChatScreen: React.FC<MediaChatScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;
  const currentMediaIds = useStore((state) => state.currentMediaIds);
  const mediaIds = currentMediaIds;

  const files = mediaIds.filter(
    (item) => item.media_mime_type == EnumMediaChat.Audio,
  );
  const medias = mediaIds.filter(
    (item) => item.media_mime_type == EnumMediaChat.Image,
  );

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "media", title: "MEDIA" },
    { key: "file", title: "FILES" },
  ]);

  const renderMedia = () => {
    return (
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        <MessageMediaView data={medias} />
      </ScrollView>
    );
  };

  const renderFile = (item) => {
    return (
      <View style={CommonStyle.flex1}>
        <MessageAudio
          isMyMessage={true}
          itemAudio={item}
          // onLongPress={onLongPressMediaMessage}
        />
      </View>
    );
  };

  const renderFiles = () => {
    return (
      <ScrollView contentContainerStyle={{ padding: 12, maxWidth: 250 }}>
        {files.map((item) => renderFile(item))}
      </ScrollView>
    );
  };

  const renderScene = SceneMap({
    media: renderMedia,
    file: renderFiles,
  });

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
          Media, files
        </Text>
      </View>
      <TabView
        style={CommonStyle.flex1}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
};

export default MediaChatScreen;
