import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import TitleClub from "./list.title.club";
import ItemClub from "./list.item.club";
import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import createStyles from "./club.style";
import LoadingList from "@shared-components/loading.list.component";

const FeatureClubScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isLoading] = useState(true);
  const listRenderItem = [
    {
      img: "",
      title:
        "IKIGAI COACH: The Project Management: Beginner to PROject Manager",
      time: "2 months",
    },
    {
      img: "",
      title: "Management Skills Training for New & Experienced Managers",
      time: "3 days",
    },
    {
      img: "",
      title: "MBA in a Box: Business Lessons from a CEO",
      time: "1 months",
    },
    {
      img: "https://files.exam24h.com/upload/2024/04/09_1712638873985/661390fed29bd7cb5f9bc88c-1712638873983-animal-before.webp",
      title: "Mental Health and Wellbeing Practitioner",
      time: "2 days",
    },
  ];

  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  const renderItemSelected = ({ item, index }) => {
    return <ItemClub data={item} key={index} />;
  };

  return (
    <View style={styles.styleItem}>
      <TitleClub textLeft={translations.club.title1} />
      {listRenderItem.length == 0 && isLoading ? (
        renderLoading()
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={listRenderItem}
          renderItem={renderItemSelected}
          scrollEventThrottle={16}
          // contentContainerStyle={{
          //   paddingLeft: 16,
          //   paddingBottom: 16,
          // }}
          initialNumToRender={2}
          onEndReachedThreshold={0}
          showsVerticalScrollIndicator={false}
          // keyExtractor={(item) => item?._id + ""}
          // onEndReached={onEndReach}
          removeClippedSubviews={true}
          // refreshControl={refreshControl()}
          // ListFooterComponent={renderFooterComponent()}
        />
      )}
    </View>
  );
};

export default FeatureClubScreen;
