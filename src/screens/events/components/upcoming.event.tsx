import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import TextBase from "@shared-components/TextBase";
import ItemEvent from "./item.event";
import { translations } from "@localization";

const UpcomingEvent = () => {
  const listData = [
    {
      image: "",
      time: "25 Mar - 29 Mar",
      title: "Offline: Personal Development: Thriving in the Modern World",
      location: "9, Pham Hung, Mai Dich, Cau Giay, Hanoi",
      author: "Khanh Bui",
      avatar: "",
    },
    {
      image: "",
      time: "25 Mar - 29 Mar",
      title: "Talkshow: Beginner to Professional Manager",
      location: "8, Pham Hung, Mai Dich, Cau Giay, Hanoi",
      author: "Khanh",
      avatar: "",
    },
    {
      image: "",
      time: "25 Mar - 29 Mar",
      title: "Talkshow: Beginner to Professional Manager",
      location: "8, Pham Hung, Mai Dich, Cau Giay, Hanoi",
      author: "Khanh",
      avatar: "",
    },
    {
      image: "",
      time: "25 Mar - 29 Mar",
      title: "Talkshow: Beginner to Professional Manager",
      location: "8, Pham Hung, Mai Dich, Cau Giay, Hanoi",
      author: "Khanh",
      avatar: "",
    },
  ];

  const data = React.useMemo(() => {
    return listData.slice(0, 15);
  }, [listData]);

  const renderItem = ({ item, index }) => {
    return <ItemEvent data={item} key={index} />;
  };

  return (
    <View style={styles.container}>
      <TextBase
        title={translations.event.upComing}
        fontSize={16}
        fontWeight="700"
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        data={data}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        initialNumToRender={2}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
      />
    </View>
  );
};

export default UpcomingEvent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
});
