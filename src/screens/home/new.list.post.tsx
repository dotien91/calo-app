/* eslint-disable camelcase */
/*eslint no-unsafe-optional-chaining: "error"*/

import React, {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import {
  getStatusBarHeight,
  ScreenHeight,
} from "@freakycoder/react-native-helpers";

import ItemPost from "./components/post-item/post.item";
import eventEmitter from "@services/event-emitter";
import { getListPost } from "@services/api/post.api";
import CS from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import EmptyResultView from "@shared-components/empty.data.component";
import { TypedPost } from "shared/models";
import HeaderTab from "./components/header-home/HeaderTab";
import { palette } from "@theme/themes";
import { Viewport } from "@skele/components";

import AboutHome from "./components/about-home/about.home";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import { fakeItem1 } from "./mock/fakeItem1";

interface ListPostProps {
  id?: string;
  isProfile?: boolean;
}

type filterProp = "forYou" | "following" | "trending" | "most_popular";

const HEADER_HEIGHT = getStatusBarHeight() + 56;

const ListPostNew = ({ id }: ListPostProps) => {
  const listRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  // console.log("statusbarHeight: ", getStatusBarHeight());
  const theme = useTheme();
  const { colors } = theme;

  const userData = useStore((state) => state.userData);

  const renderItem = ({ item }: any) => {
    return <ItemPost key={item._id} data={item} isProfile={id?.length > 0} />;
  };
  const [filter, setFilter] = useState<filterProp>("forYou");
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const isScrollToTop = useSharedValue(0);

  const paramsRequest = {
    limit: 10,
    auth_id: userData?._id || "",
    is_following_list: filter === "following" ? "true" : "false",
    order_by: "DESC",
    order_type: filter === "trending" ? "trending" : "time",
  };
  if (id) {
    paramsRequest.user_id = id;
  }
  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
  } = useListData<TypedPost>(
    paramsRequest,
    getListPost,
    [fakeItem1],
    userData?._id,
  );
  const customFooter = () => {
    if (listData.length === 1 && !isLoading) return <>{renderEmpty()}</>;
    return renderFooterComponent;
  };
  useEffect(() => {
    closeSuperModal();
  }, [listData]);

  useEffect(() => {
    setFilter("forYou");
  }, [userData?._id]);

  useEffect(() => {
    const typeEmit = "reload_home_page";
    eventEmitter.on(typeEmit, onRefresh);
    eventEmitter.on("reload_list_post", _requestData);
    return () => {
      eventEmitter.off(typeEmit, onRefresh);
      eventEmitter.off("reload_list_post", _requestData);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const onRefresh = () => {
    if (isScrollToTop.value == 1) {
      _requestData();
    }
    setTimeout(() => {
      listRef.current &&
        listRef.current.scrollToOffset({ animated: true, offset: 0 });
      isScrollToTop.value = 1;
      // scrollToFilter();
    }, 200);
    setTimeout(() => {
      isScrollToTop.value = 0;
    }, 3000);
  };

  const currentPositionFilter = useSharedValue(0);
  const currentY = useSharedValue(0);
  const positionFilter = useSharedValue("relative");
  const showHeader = useSharedValue(1);
  const startPositionY = useRef(0);
  const pauseAnimation = useRef(false);
  const hasScrolled = useRef(false);
  const onLayoutFilter = useCallback(({ nativeEvent }) => {
    currentPositionFilter.value = nativeEvent.layout.y;
  }, []);

  const scrollToFilter = useCallback(() => {
    listRef.current.scrollToIndex(currentPositionFilter.value);
  }, []);

  const styleFilter = useAnimatedStyle(() => {
    return {
      opacity: positionFilter.value === "absolute" ? 1 : 0,
      zIndex: positionFilter.value === "absolute" ? 100 : -1,
      height: 40,
      marginTop: positionFilter.value === "absolute" ? 0 : 8,
    };
  }, []);
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      currentY.value = offsetY;
      if (currentPositionFilter.value) {
        if (offsetY >= currentPositionFilter.value) {
          positionFilter.value = "absolute";
        } else {
          positionFilter.value = "relative";
        }
      }

      if (offsetY < 20) {
        showHeader.value = withTiming(1, { duration: 300 });
        return;
      }

      if (
        offsetY > 200 &&
        offsetY - startPositionY.current > 40 &&
        !pauseAnimation.current
      ) {
        pauseAnimation.current = true;
        showHeader.value = withTiming(0, { duration: 300 });
        return;
      }

      if (offsetY - startPositionY.current < -40 && !pauseAnimation.current) {
        pauseAnimation.current = true;
        showHeader.value = withTiming(1, { duration: 300 });
      }
    },
    [],
  );

  const onScrollBeginDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      pauseAnimation.current = false;
      startPositionY.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const styleHeader = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            showHeader.value,
            [0, 1],
            [-HEADER_HEIGHT, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
      // opacity: positionFilter.value === "absolute" ? 1 : 0,
      opacity: interpolate(
        showHeader.value,
        [0, 0.5, 1],
        [0, 0, 1],
        Extrapolate.CLAMP,
      ),
    };
  }, []);
  const viewFilterRef = useAnimatedRef<any>();

  const renderHeaderTab = useCallback(() => {
    return (
      <>
        <HeaderTab />
      </>
    );
  }, []);
  const StickyHeaderComponent = () => {
    return (
      <>
        <AniPressable
          ref={viewFilterRef}
          style={[styles.filter]}
          onLayout={onLayoutFilter}
        >
          {ContentFilter()}
        </AniPressable>
      </>
    );
  };
  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View
        style={{
          ...CS.center,
          backgroundColor: colors.background,
        }}
      >
        <EmptyResultView
          title={translations.post.emptyPostTitle}
          desc={translations.post.emptyPostDes}
          icon="document-text-outline"
          showLottie={false}
        />
      </View>
    );
  };
  const AniPressable = Animated.createAnimatedComponent(Pressable);

  useEffect(() => {
    if (isFirst) return;
    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    });
    listRef.current?.scrollToOffset({
      animated: true,
      offset: currentPositionFilter.value + 5 - 70,
    });

    setTimeout(() => {
      showHeader.value = withTiming(1, { duration: 1 });
      pauseAnimation.current = true;
      positionFilter.value = "relative";
    }, 300);
  }, [filter, isFirst]);

  const listFilter = [
    {
      id: "forYou",
      name: translations.homework.forYou,
    },
    {
      id: "following",
      name: translations.homework.following,
    },
    {
      id: "trending",
      name: translations.homework.trending,
    },
    // {
    //   id: "most_popular",
    //   name: translations.homework.mostPopular,
    // },
  ];

  function ContentFilter() {
    return (
      <ScrollView
        style={{ height: 30 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        ref={scrollRef}
      >
        <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
          {listFilter.map((item, index) => {
            const selected = filter === item.id;
            return (
              <Pressable
                key={index}
                style={[
                  styles.styleItemFilter,
                  {
                    backgroundColor: selected
                      ? palette.primary
                      : palette.btnInactive2,
                  },
                ]}
                onPress={() => {
                  if (item.id === "following" && !userData?._id) {
                    showWarningLogin();
                    return;
                  }
                  setIsFirst(false);
                  setFilter(selected ? "forYou" : item.id);
                }}
              >
                <Text
                  style={[
                    styles.txtFilter,
                    {
                      color: selected ? colors.white : colors.textOpacity8,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  return (
    <View
      style={{
        ...CS.flex1,
        backgroundColor: colors.background,
      }}
    >
      <Animated.View style={[styles.headerAni, styleHeader]}>
        {<AboutHome />}
        <Animated.View style={[styles.filter, styleFilter]}>
          {ContentFilter()}
        </Animated.View>
      </Animated.View>
      <View style={[CS.flex1, { marginTop: getStatusBarHeight() }]}>
        <Viewport.Tracker>
          <List
            StickyHeaderComponent={StickyHeaderComponent}
            stickyHeaderIndices={[1]}
            listData={listData}
            onScroll={onScroll}
            ListHeaderComponent={renderHeaderTab}
            renderItem={renderItem}
            onEndReached={onEndReach}
            refreshControl={refreshControl}
            ListFooterComponent={customFooter}
            progressViewOffset={HEADER_HEIGHT}
            onScrollBeginDrag={(e) => {
              onScrollBeginDrag?.(e);
              hasScrolled.current = true;
            }}
            onLayoutFilter={onLayoutFilter}
            scrollToFilter={scrollToFilter}
          />
        </Viewport.Tracker>
      </View>
    </View>
  );
};

class List extends Component {
  componentDidMount(): void {
    eventEmitter.on("scroll_home_to_top", this.scrollToTop);
    eventEmitter.on("scroll_home_to_offset", this.srollToOffset);
  }

  componentWillUnmount(): void {
    eventEmitter.off("scroll_home_to_top", this.scrollToTop);
  }

  scrollToTop = () => {
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
  };

  srollToOffset = () => {
    if (this.flatListRef) {
      this.flatListRef.scrollToOffset({
        animated: true,
        offset: ScreenHeight + 150,
      });
    }
  };
  render() {
    const {
      StickyHeaderComponent,
      listData,
      onScroll,
      renderItem,
      onEndReached,
      progressViewOffset,
      onScrollBeginDrag,
      TAB_HEIGHT,
      onLayoutFilter,
      scrollToFilter,
      ListHeaderComponent,
      ListFooterComponent,
      refreshControl,
    } = this.props;

    return (
      <>
        <FlatList
          StickyHeaderComponent={StickyHeaderComponent}
          stickyHeaderIndices={[1]}
          stickyHeaderHiddenOnScroll={true}
          ref={(node) => (this.flatListRef = node)}
          data={listData}
          onScroll={onScroll}
          ListHeaderComponent={ListHeaderComponent}
          renderItem={renderItem}
          onEndReachedThreshold={0.8}
          onEndReached={onEndReached}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          keyExtractor={(item) => item?._id + ""}
          refreshControl={refreshControl()}
          ListFooterComponent={ListFooterComponent()}
          progressViewOffset={progressViewOffset}
          onScrollBeginDrag={onScrollBeginDrag}
          contentContainerStyle={{
            paddingTop: TAB_HEIGHT,
            marginTop: 16,
            paddingBottom: 100,
            paddingTop: 60,
          }}
          onLayoutFilter={onLayoutFilter}
          scrollToFilter={scrollToFilter}
        />
      </>
    );
  }
}

export default ListPostNew;

const styles = StyleSheet.create({
  headerAni: {
    height: HEADER_HEIGHT,
    backgroundColor: palette.background,
    position: "absolute",
    zIndex: 100,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: palette.background,
    marginTop: 10,
    marginBottom: 4,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderColor,
  },
  // absoluteFilter: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   marginTop: 0,
  //   paddingTop: getStatusBarHeight(),
  //   height: 50,
  //   alignItems: "flex-end",
  //   paddingBottom: 8,
  // },
  styleItemFilter: {
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: palette.borderColor,
    marginRight: 8,
    ...CS.center,
    minWidth: (SCREEN_WIDTH - 40) / 3,
  },
  txtFilter: {
    ...CS.hnSemiBold,
    color: palette.textOpacity8,
  },
});
