import { View, Text, FlatList, Dimensions } from "react-native";

import Header from "@shared-components/header/Header";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import CS from "@theme/styles";
import { useState } from "react";

const LeaderBoard = () => {
  // const theme = useTheme();
  // const { colors } = theme;
  // const styles = useMemo(() => createStyles(theme), [theme]);

  const [setIsFooterSticky, setsetIsFooterSticky] = useState(false);
  const hightScreen = Dimensions.get("window").height;

  const DATA = [
    { id: "1", title: "Item 1" },
    { id: "2", title: "Item 2" },
    { id: "3", title: "Item 3" },
    { id: "4", title: "Item 4" },
    { id: "5", title: "Item 5" },
    { id: "6", title: "Item 6" },
    { id: "7", title: "Item 7" },
    { id: "8", title: "Item 8" },
    { id: "9", title: "Item 9" },
    { id: "10", title: "Item 10" },
    { id: "11", title: "Item 11" },
    { id: "12", title: "Item 12" },
    { id: "13", title: "Item 13" },
    { id: "14", title: "Item 14" },
    { id: "15", title: "Item 15" },
    { id: "16", title: "Item 16" },
    { id: "17", title: "Item 17" },
    { id: "18", title: "Item 18" },
    { id: "19", title: "Item 1" },
    { id: "20", title: "Item 2" },
    { id: "21", title: "Item 3" },
    { id: "22", title: "Item 4" },
    { id: "23", title: "Item 5" },
    { id: "24", title: "Item 6" },
    { id: "25", title: "Item 7" },
    { id: "26", title: "Item 8" },
    { id: "27", title: "Item 9" },
    { id: "28", title: "Item 10" },
    { id: "29", title: "Item 11" },
    { id: "30", title: "Item 12" },
    { id: "31", title: "Item 13" },
    { id: "32", title: "Item 14" },
    { id: "33", title: "Item 15" },
    { id: "34", title: "Item 16" },
    { id: "35", title: "Item 17" },
    { id: "36", title: "Item 18" },
    // Add more items as needed
  ];

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        style={{ height: 100, backgroundColor: index === 16 ? "red" : "white" }}
      >
        <Text>{item.title}</Text>
      </View>
    );
  };

  const renderStickyItem = () => {
    return (
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
        }}
      >
        <Text>This item is pinned</Text>
      </View>
    );
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const contenoffSetItem = 100 * 15;
    // const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height / 36 * 16 - 20;
    if (
      layoutMeasurement.height > contentOffset.y ||
      layoutMeasurement.height + hightScreen < contentOffset.y
    ) {
      setsetIsFooterSticky(true);
    } else {
      setsetIsFooterSticky(false);
    }
    // setsetIsFooterSticky(isCloseToBottom);
    console.log(contentOffset, layoutMeasurement);
  };

  return (
    <View>
      <FlatList
        data={DATA}
        // style={{backgroundColor:'red'}}
        renderItem={renderItem}
        // ListHeaderComponent={renderStickyItem}
        onScroll={handleScroll}
        // stickyHeaderIndices={DATA.length > 0 ? [16] : [0]} // Index of the item to be pinned
        keyExtractor={(item) => item.id}
      />
      {setIsFooterSticky ? (
        <View
          style={{
            backgroundColor: "blue",
            height: 100,
            position: "absolute",
            bottom: 20,
            width: "100%",
          }}
        ></View>
      ) : null}
    </View>
  );
};
export default LeaderBoard;
