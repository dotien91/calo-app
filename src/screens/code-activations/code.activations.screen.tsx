import React, { useEffect, useMemo, useState } from "react";
import { Text, View, ScrollView, Image } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import * as Animatable from "react-native-animatable";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import createStyles from "./code.activations.style";
import { useTheme } from "@react-navigation/native";
import PressableBtn from "@shared-components/button/PressableBtn";
import { TypedUser } from "shared/models";
import { formatCoin } from "@helpers/string.helper";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { ICourseItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import { formatDate } from "@utils/date.utils";
import { getListAffiliate } from "@services/api/affiliate.api";
import formatMoney from "@shared-components/input-money/format.money";

const CodeActivationsScreen = () => {
  // const [courseCurrentSort, setCourseCurrentSort] = useState({});
  // const [listCourseFilterParams] = useState({});
  // const [courseSearchHistory] = useState("");
  const theme = useTheme();
  const { colors } = theme;
  const setListUserSelected = useStore((state) => state.setListUserSelected);
  const listUserRef = useStore((state) => state.listUserRef);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const [sectionList, setSectionList] = useState<TypedUser[]>([]);
  const [activeSections, setActiveSections] = useState<number[]>([0]);

  useEffect(() => {
    setSectionList(listUserRef);
  }, [listUserRef]);

  const _updateSections = (active: number) => {
    setActiveSections((activeSections) => {
      if (activeSections.indexOf(active) < 0) {
        return [...activeSections, active];
      } else {
        return activeSections.filter((i) => i != active);
      }
    });
  };
  const callAPIDetailUser = (params, index) => {
    getListAffiliate(params).then((res) => {
      if (!res.isError) {
        console.log("ress data ...", res);
        const data = sectionList;
        const i = data.findIndex((i) => i._id == index);
        data[i].children = res.data || [];
        console.log("data...", i, data);
        setSectionList(data);
        _updateSections(index);
      }
    });
  };

  const _renderHeader = (section: TypedUser, index: number) => {
    // console.log(section);

    const isSelected = activeSections.indexOf(index) >= 0;
    const onPressHeader = () => {
      if (!section.children) {
        const params = {
          order_by: "DESC",
          method: "plus",
          limit: "2",
          search: "",
          from_user_ids: section?.user_id?._id.toString(),
        };
        callAPIDetailUser(params, index);
      } else {
        _updateSections(index);
      }
    };

    return (
      <PressableBtn onPress={onPressHeader}>
        <Animatable.View
          duration={300}
          style={isSelected ? styles.viewCustomerActive : styles.viewCustomer}
        >
          <View style={[styles.viewAvatar, { backgroundColor: colors.red }]}>
            <Image
              style={styles.viewAvatar}
              source={{ uri: section?.user_id?.user_avatar_thumbnail }}
            />
          </View>
          <View style={CS.flex1}>
            <Text style={styles.headerText}>
              {section?.user_id?.display_name}
            </Text>
            <Text style={styles.des}>
              {formatDate(section?.user_id?.last_active)}
            </Text>
          </View>
          <Icon
            size={24}
            name={
              activeSections.indexOf(index) >= 0 ? "chevron-up" : "chevron-down"
            }
            type={IconType.Feather}
            color={palette.textOpacity8}
          />
        </Animatable.View>
      </PressableBtn>
    );
  };

  const ItemCourse = ({
    index,
    data,
  }: {
    index: number;
    data: ICourseItem;
  }) => {
    console.log("data...", data);
    return (
      <Animatable.View duration={300} key={index} style={styles.viewCourse}>
        <View style={styles.avatarCourse}>
          <Image
            style={styles.avatarCourse}
            source={{ uri: data.ref_id.avatar.media_thumbnail }}
          />
        </View>
        <View style={CS.flex1}>
          <Text style={{ ...CS.hnMedium, color: colors.text }}>
            {data?.note || "a"}
          </Text>
          <Text style={styles.txtPriceCourse}>
            {data.transaction_value_type === "coin"
              ? formatCoin(data.transaction_value)
              : formatMoney(data?.transaction_value || 0, {
                  suffix: " đ",
                })}
          </Text>
        </View>
      </Animatable.View>
    );
  };

  const _renderContent = (section: any, index: number, isActive: boolean) => {
    const pressSeeAll = () => {
      // console.log(section?.user_id?._id.toString());
      setListUserSelected([section?.user_id?._id]);
      NavigationService.navigate(SCREENS.AFFILIATE);
    };
    return (
      <Animatable.View
        duration={300}
        style={styles.viewSeeAll}
        animation={isActive ? "slideInDown" : "slideInUp"}
      >
        <View key={index}>
          {section.children &&
            section.children.map((item: ICourseItem, index: number) => (
              <ItemCourse key={item._id} index={index} data={item} />
            ))}
          {section.children?.length > 0 ? (
            <PressableBtn onPress={pressSeeAll} style={CS.center}>
              <Text style={styles.txtSeeAll}>{translations.seeAll}</Text>
            </PressableBtn>
          ) : (
            <View style={CS.center}>
              <Text style={CS.hnRegular}>
                {translations.affiliate.noTransaction}
              </Text>
            </View>
          )}
        </View>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <Header text={translations.settingUser.codeActivations} />
      {/* {renderHeader()} */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Accordion
          sections={listUserRef}
          activeSections={activeSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          keyExtractor={(item) => item._id}
        />
      </ScrollView>
    </View>
  );
};

export default CodeActivationsScreen;
