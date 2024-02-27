import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import * as Animatable from "react-native-animatable";
import * as NavigationService from "react-navigation-helpers";

import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import IconBtn from "@shared-components/button/IconBtn";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import createStyles from "./code.activations.style";
import { useTheme } from "@react-navigation/native";
import PressableBtn from "@shared-components/button/PressableBtn";
import { TypedUser } from "shared/models";
import { formatPrice } from "@helpers/string.helper";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { ICourseItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";

const CodeActivationsScreen = () => {
  const [courseCurrentSort, setCourseCurrentSort] = useState({});
  // const [listCourseFilterParams] = useState({});
  // const [courseSearchHistory] = useState("");
  const theme = useTheme();
  const { colors } = theme;
  const setListUserSelected = useStore((state) => state.setListUserSelected);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const [sectionList, setSectionList] = useState<TypedUser[]>([]);
  const [activeSections, setActiveSections] = useState<number[]>([0]);
  const [selected, setSelected] = useState(0);
  //fake data
  const listData = [
    {
      _id: "0",
      display_name: "Dangth",
      linkImage:
        "https://files.exam24h.com/upload/2024/02/06_1707208375367/6590ef713f9a0468c8290eb9-1707208375367-4daab0e0-13ae-42e3-8c27-16f02c7e36f4.jpg",
      price: 1200000,
      children: [
        { _id: "1", title: "khoa hoc 1", price: 1200000, percentage: 10 },
        { _id: "2", title: "khoa hoc 2", price: 2400000, percentage: 10 },
        { _id: "3", title: "khoa hoc 3", price: 3600000, percentage: 10 },
        { _id: "4", title: "khoa hoc 4", price: 4800000, percentage: 10 },
      ],
    },
    {
      _id: "1",
      display_name: "Anvv",
      linkImage:
        "https://files.exam24h.com/upload/2024/02/06_1707208375367/6590ef713f9a0468c8290eb9-1707208375367-4daab0e0-13ae-42e3-8c27-16f02c7e36f4.jpg",
      price: 1300000,
      children: [
        { _id: "1", title: "khoa hoc 1", price: 1300000, percentage: 10 },
        { _id: "2", title: "khoa hoc 2", price: 2600000, percentage: 10 },
        { _id: "3", title: "khoa hoc 3", price: 3900000, percentage: 10 },
        { _id: "4", title: "khoa hoc 4", price: 2500000, percentage: 10 },
      ],
    },
  ];

  useEffect(() => {
    setSectionList(listData);
  }, []);

  const isLoading = false;
  const totalCount = 4;

  const renderHeader = () => {
    if (isLoading || !listData.length) return null;
    return (
      <View style={styles.wrapSort}>
        <Text style={styles.txtCountResult}>
          {totalCount} {translations.results}
        </Text>

        <TouchableOpacity onPress={openSortModal} style={CS.flexEnd}>
          <Text style={CS.hnSemiBold}>{translations.sort_by_relevance}</Text>
          <IconBtn name="align-right" />
        </TouchableOpacity>
      </View>
    );
  };

  const sortByTime = () => {
    setSelected(1);
    closeSuperModal();
  };
  const sortByPrice = () => {
    setSelected(2);
    closeSuperModal();
  };

  const openSortModal = useCallback(() => {
    showSuperModal({
      contentModalType: EnumModalContentType.SelectSort,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        defaultItem: courseCurrentSort,
        title: translations.codeActivations.sortBy,
        callback: setCourseCurrentSort,
        listAction: [
          {
            label: translations.codeActivations.timeLatest,
            selected: selected == 1,
            callbackAction: sortByTime,
          },
          {
            label: translations.codeActivations.priceHighest,
            selected: selected == 2,
            callbackAction: sortByPrice,
          },
        ],
      },
    });
  }, [courseCurrentSort, selected]);
  const _updateSections = (active: number) => {
    setActiveSections((activeSections) => {
      if (activeSections.indexOf(active) < 0) {
        return [...activeSections, active];
      } else {
        return activeSections.filter((i) => i != active);
      }
    });
  };

  const _renderHeader = (section: TypedUser, index: number) => {
    console.log(section);

    return (
      <PressableBtn onPress={() => _updateSections(index)}>
        <Animatable.View duration={300} style={styles.viewCustomer}>
          <View style={[styles.viewAvatar, { backgroundColor: colors.red }]}>
            <Image
              style={styles.viewAvatar}
              source={{ uri: section.linkImage }}
            />
          </View>
          <View style={CS.flex1}>
            <Text style={styles.headerText}>{section?.display_name}</Text>
            <Text style={styles.des}>{formatPrice(section?.price || 0)}</Text>
          </View>
          <Icon
            size={24}
            name={
              activeSections.indexOf(index) >= 0 ? "chevron-up" : "chevron-down"
            }
            type={IconType.Feather}
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
    return (
      <Animatable.View duration={300} key={index} style={styles.viewCourse}>
        <View style={styles.avatarCourse}>
          <Image
            style={styles.avatarCourse}
            source={{ uri: listData[0].linkImage }}
          />
        </View>
        <View style={CS.flex1}>
          <Text style={{ ...CS.hnMedium, color: colors.text }}>
            {data?.title || "a"}
          </Text>
          <Text style={styles.txtPriceCourse}>
            {formatPrice(data?.price || 0)}
          </Text>
        </View>
        <View style={styles.viewPrecentage}>
          <Text style={styles.txtPercentage}>{`${data.percentage}%`}</Text>
        </View>
      </Animatable.View>
    );
  };

  const _renderContent = (section: any, index: number, isActive: boolean) => {
    const pressSeeAll = () => {
      setListUserSelected(["6590ef713f9a0468c8290eb9"]);
      NavigationService.navigate(SCREENS.AFFILIATE);
    };
    return (
      <Animatable.View
        duration={300}
        style={styles.viewSeeAll}
        animation={isActive ? "slideInDown" : "slideInUp"}
      >
        <View key={index}>
          {section.children
            .slice(0, 2)
            .map((item: ICourseItem, index: number) => (
              <ItemCourse key={item._id} index={index} data={item} />
            ))}
          <PressableBtn onPress={pressSeeAll} style={CS.center}>
            <Text style={styles.txtSeeAll}>{translations.seeAll}</Text>
          </PressableBtn>
        </View>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <Header text="Code activations" />
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Accordion
          sections={sectionList}
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
