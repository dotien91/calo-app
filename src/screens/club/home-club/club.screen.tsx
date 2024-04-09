import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import TitleClub from "../components/list.title.club";
import ItemClub from "../components/list.item.club";
import createStyles from "./club.screen.style";
import { useTheme } from "@react-navigation/native";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { EnumClubType } from "models/club.model";
import { palette } from "@theme/themes";

const ClubScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const onPressHeaderRight = () => {};

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

  return (
    <SafeAreaView style={CS.container}>
      <Header
        text={translations.club.club}
        iconNameRight="search"
        onPressRight={onPressHeaderRight}
      />
      <ScrollView>
        <View style={styles.styleItem}>
          <TitleClub
            textLeft={translations.club.title1}
            onPressLeft={() => {
              console.log(11111);
            }}
          />
          <ItemClub />
        </View>
        <View style={styles.styleItem}>
          <TitleClub
            textLeft={translations.club.title2}
            textRight={translations.club.create}
            onPressRight={() => {
              console.log(22222);
            }}
            onPressLeft={() => {
              console.log(11111);
            }}
          />
          <ItemClub />
        </View>
        <View style={styles.styleItem}>
          <TitleClub
            textLeft={translations.club.title3}
            iconNameRight="icSort"
            onPressRight={openSelectTypeSort}
            onPressLeft={() => {
              console.log(11111);
            }}
          />
          <ItemClub />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClubScreen;
