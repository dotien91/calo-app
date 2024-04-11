import React, { useMemo } from "react";
import { ImageBackground, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import IconSvg from "assets/svg";
import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import createStyles from "./elite.club.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import { useTheme } from "@react-navigation/native";
import { EnumColors } from "models";
import { translations } from "@localization";
import { palette } from "@theme/themes";

const ItemEliteScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View style={styles.viewIcon}>
        <IconSvg name={nameIcon} size={20} color={palette.textOpacity6} />
        <TextBase fontSize={16} fontWeight="400">
          {text}
        </TextBase>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/bgeliteclub.png")}
        style={styles.viewImg}
      />
      <View style={styles.viewContent}>
        <View style={styles.viewTitle}>
          <TextBase
            fontSize={20}
            fontWeight="700"
            title="IKIGAI COACH: The Project Management: Beginner to Project Manager"
            numberOfLines={3}
          />
          <TextBase
            fontSize={14}
            fontWeight="400"
            title={`212 ${translations.club.member}`}
          />
          <TextBase
            fontSize={20}
            fontWeight="700"
            title="3.450.000 VND"
            color={EnumColors.primary}
          />
        </View>
        <Button
          onPress={() => {
            console.log(1111111);
          }}
          text={translations.club.purchaseJoin}
          backgroundColor={palette.primary}
        />
        <View style={styles.viewTitle}>
          <TextBase
            fontSize={16}
            fontWeight="700"
            title={translations.club.about}
          />
          <TextViewCollapsed
            // text={track?.content || ""}
            text="Vietnam Project Manager Community, a meeting place for people who are oriented or are working as Project Managers of companies, especially in the IT Software field."
            styleText={styles.des}
          />
          <View style={styles.viewHis}>
            <IconSvg name="icTime" size={20} color={palette.textOpacity6} />
            <View>
              <TextBase
                fontSize={16}
                fontWeight="500"
                title={translations.club.history}
              />
              <TextBase
                fontSize={14}
                fontWeight="400"
                title={`${translations.club.des1} November 16, 2022${translations.club.des2} December 16, 2023.`}
              />
            </View>
          </View>
          <View style={styles.viewTitle}>
            <View style={styles.viewHeadTitle}>
              <TextBase
                fontSize={16}
                fontWeight="700"
                title={translations.club.title}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <PressableBtn onPress={() => {}}>
                  <TextBase
                    fontSize={16}
                    fontWeight="500"
                    color={EnumColors.textOpacity6}
                  >
                    {translations.seeAll}
                  </TextBase>
                </PressableBtn>
                <Icon
                  name="chevron-forward-outline"
                  type={IconType.Ionicons}
                  color={palette.textOpacity6}
                  size={16}
                />
              </View>
            </View>
            <View style={styles.viewAvatar}>
              <View style={styles.styleAvatar}></View>
              <View style={styles.styleAvatar}></View>
              <View style={styles.styleAvatar}></View>
              <View style={styles.styleAvatar}></View>
            </View>
            <TextBase
              fontSize={16}
              fontWeight="400"
              title={`Khanh ${translations.club.des3} 5 ${translations.club.des4}`}
            />
          </View>
          <View style={styles.viewTitle}>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.group}
            />
            <View style={styles.viewGroup}>
              <IconText
                nameIcon="icComment"
                text={`17 ${translations.club.newPosts}`}
              />
              <IconText
                nameIcon="icPersonal"
                text={`217 ${translations.club.member}`}
              />
              <View style={{ marginLeft: 32 }}>
                <TextBase
                  fontSize={12}
                  fontWeight="400"
                  title={`+20 ${translations.club.inCome}`}
                />
              </View>
              <IconText
                nameIcon="icPeople"
                text={`${translations.club.created} 1 month ${translations.club.ago}`}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemEliteScreen;
