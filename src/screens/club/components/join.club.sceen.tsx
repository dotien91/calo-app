import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import ItemClub from "./list.item.club";
import TitleClub from "./list.title.club";
import createStyles from "./club.style";
import { useTheme } from "@react-navigation/native";
import { translations } from "@localization";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { palette } from "@theme/themes";
import { EnumClubType } from "models/club.model";
import LoadingList from "@shared-components/loading.list.component";
import CS from "@theme/styles";

const JoinClubSceen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isLoading] = useState(true);
  const listRenderItem = [
    {
      img: "https://files.exam24h.com/upload/2024/04/09_1712638873985/661390fed29bd7cb5f9bc88c-1712638873983-animal-before.webp",
      title:
        "IKIGAI COACH: The Project Management: Beginner to PROject Manager",
      time: "2 months",
    },
    {
      img: "https://files.exam24h.com/upload/2024/04/09_1712638873985/661390fed29bd7cb5f9bc88c-1712638873983-animal-before.webp",
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

  const openSelectTypeSort = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.FilterSortClub,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        title: translations.club.sortBy,
        options: [
          {
            name: translations.club.mostVisited,
            id: EnumClubType.mostVisited,
            iconSvg: "icAffiliate",
            color: palette.textOpacity6,
          },
          {
            name: translations.club.clubs,
            id: EnumClubType.clubs,
            iconSvg: "icCourse",
            color: palette.textOpacity6,
          },
          {
            name: translations.club.join,
            id: EnumClubType.join,
            iconSvg: "icTime",
            color: palette.textOpacity6,
          },
        ],
      },
    });
  };

  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  const renderItemSelected = ({ item, index }) => {
    return <ItemClub data={item} key={index} />;
  };

  return (
    <View style={styles.styleItem}>
      <TitleClub
        textLeft={translations.club.title3}
        iconNameRight="icSort"
        onPressRight={openSelectTypeSort}
      />
      {listRenderItem.length == 0 && isLoading ? (
        renderLoading()
      ) : (
        <FlatList
          style={CS.flex1}
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

export default JoinClubSceen;
