import * as React from "react";
import { View, StyleSheet, SafeAreaView, FlatList } from "react-native";
import * as Progress from "react-native-progress";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";

import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import IconSvg from "assets/svg";
import TextBase from "@shared-components/TextBase";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { Device } from "@utils/device.utils";
import { IDetailPractice } from "models/course.model";
import {
  getAllSubmitTest,
  getListTest,
} from "@services/api/ielts.practice.api";
import LoadingList from "@shared-components/loading.list.component";
import useStore from "@services/zustand/store";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";

const IeltsPraticeList = () => {
  const route = useRoute();
  const type = route.params?.["type"];
  const userData = useStore((state) => state.userData);
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [progress, setProgress] = React.useState([]);

  // const { data, isLoading, setData } = useApi<IDetailPractice[]>({
  //   params: { type },
  //   requestData: getListTest,
  // });

  React.useEffect(() => {
    initData(data);
  }, []);

  const initData = () => {
    getListTest({ type }).then((res) => {
      console.log("list test", res.data);
      if (!res.isError) {
        _getAllSubmitTest(res.data);
        getProgress(res.data);
      }
    });
  };

  const getProgress = (listTest: IDetailPractice[]) => {
    const listTestChild = listTest.filter((item) => !!item.parent_id);
    const progressPercent =
      listTestChild.filter((item) => !!item?.is_done)?.length /
      listTestChild.length;
    setProgress(progressPercent || 0);
  };

  const _getAllSubmitTest = (listTest: IDetailPractice[]) => {
    getAllSubmitTest({
      user_id: userData?._id,
    }).then((res) => {
      setIsLoading(false);
      console.log("getAllSubmitTest", res.data);
      if (!res.isError) {
        const resData = res.data;
        const newData = listTest.map((item) => {
          const findItem = resData.find(
            (_item) => _item.test_id._id == item._id,
          );
          return {
            ...item,
            ...findItem,
          };
        });
        setData(newData);
      }
    });
  };
  console.log("list with point", data);

  const listTestParent = React.useMemo(() => {
    const a = data
      ?.filter((item) => !item?.parent_id)
      .map((_item) => {
        const child = data?.filter((child) => child?.parent_id == _item._id);
        return {
          ..._item,
          child,
          // child: child.length ? child : [_item]
        };
      });
    return a;
  }, [data]);

  const HeaderWriting = () => {
    return (
      <View style={styles.header}>
        <IconSvg name="icWritingHeader" width={180} height={119} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <TextBase fontSize={24} fontWeight="600">
            {(progress || 0) * 100}%
          </TextBase>
          <View style={styles.btnPractice}>
            <TextBase color="primary" fontSize={14} fontWeight="500">
              {translations.ieltsPractice.praticeTest}
            </TextBase>
          </View>
        </View>
      </View>
    );
  };

  const widthImage = Device.width - 32;

  const renderItem = ({ item }) => {
    return <ItemPracticeTest item={item} />;
  };

  console.log("listTestParent", listTestParent);

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        text={
          translations.ieltsPractice?.[type] ||
          translations.ieltsPractice.praticeTest
        }
      />
      <HeaderWriting />
      <Progress.Bar
        style={styles.viewBar}
        progress={progress || 0}
        borderWidth={0}
        unfilledColor={palette.grey3}
        color={progress == 1 ? palette.green : palette.primary}
        width={widthImage}
        borderRadius={8}
        height={8}
      ></Progress.Bar>
      {isLoading && <LoadingList numberItem={2} />}

      <FlatList
        data={listTestParent}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={8}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
};

const ItemPracticeTest = React.memo(({ item }) => {
  console.log(22222222, item);
  const openPraticeTest = (item) => {
    NavigationService.navigate(SCREENS.IELTS_PRACTICE, {
      practiceDetail: item,
    });
  };
  const renderTestChild = (item, index) => {
    return (
      <PressableBtn
        disable={item.is_done}
        onPress={() => openPraticeTest(item)}
        key={item?.id}
        style={styles.viewTask}
      >
        <IconSvg
          name="iconWriting"
          size={32}
          color={index % 2 ? palette.primary : palette.yellow}
        />
        <TextBase color="text" style={CS.flex1}>
          {item.title}
        </TextBase>
        <View style={CS.flexEnd}>
          <TextBase style={{ marginRight: 2 }}>
            {item?.band_detail?.[item.type + "_point"]}
          </TextBase>
          {/* <TextBase >
        {item?.status}
      </TextBase> */}
          {item.is_done && (
            <IconSvg name="icCheck" size={20} color={palette.green} />
          )}
        </View>
      </PressableBtn>
    );
  };

  return (
    <View style={styles.viewItem}>
      <View style={styles.headerItem}>
        <View style={CS.flexStart}>
          {item.is_done && (
            <IconSvg name="icCheck" size={16} color={palette.green} />
          )}
          <TextBase color={"text"} fontWeight="600">
            {item.title}
          </TextBase>
        </View>
      </View>

      <View style={styles.formTask}>
        {item.child.map((item, index) => renderTestChild(item, index))}
      </View>
    </View>
  );
});

export default IeltsPraticeList;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  btnPractice: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.secondColor,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    minWidth: 100,
  },
  viewBar: {
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  viewItem: {
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 3.05,
    shadowOpacity: 0.05,
    elevation: 4,
    backgroundColor: palette.white,
  },
  headerItem: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  formTask: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: palette.borderColor,
  },
  viewTask: {
    paddingVertical: 4,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
  },
});
