import React, { useMemo } from "react";
import {
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import createStyles from "./affiliate.screen.style";
import { translations } from "@localization";
import CS from "@theme/styles";
import ItemAffiliate from "./affiliate.item";
import ItemSortBy from "./components/item.sortby";
import { getListAffiliate } from "@services/api/affiliate.api";
import { useListData } from "@helpers/hooks/useListData";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { formatPrice } from "@helpers/string.helper";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";

const AffiliatePage = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  //Lấy thông tin affiliate
  const { listData, isLoading, onEndReach, refreshControl } = useListData<any>(
    { limit: "20", search: "" },
    getListAffiliate,
    [],
  );

  console.log("listData...", listData);

  const ItemMonth = ({ text, price }: { text: string; price: string }) => {
    return (
      <View style={styles.styleViewTotal}>
        <View>
          <Text style={styles.txtMonth}>{text}</Text>
          <Text numberOfLines={2} style={styles.txtCommissionMonth}>
            {price}
          </Text>
        </View>
        <Icon
          name="trending-up-outline"
          size={24}
          type={IconType.Ionicons}
          color={colors.green2}
        />
      </View>
    );
  };

  const renderViewTotalAffiliate = () => {
    return (
      <View style={styles.styleViewTotalAff}>
        <View style={styles.styleTotalToday}>
          <ImageBackground
            source={require("../../assets/images/bgIHCAffiliate.png")}
            resizeMode="cover"
            imageStyle={{ borderRadius: 8 }}
            style={styles.styleImageBg2}
          >
            <Text style={styles.txtToday}>{translations.affiliate.today}</Text>
            <Text style={styles.txtCommissionToday}>2.500 IHC</Text>
          </ImageBackground>
        </View>
        <View style={styles.styleViewLine}>
          <ItemMonth
            text={translations.affiliate.thisMonth}
            price={"4.500 IHC"}
          />
          <ItemMonth
            text={translations.affiliate.lastMonth}
            price={"5.500 IHC"}
          />
        </View>
      </View>
    );
  };

  const renderHeader = ({ price }) => {
    const _onPressLeft = () => {
      NavigationService.goBack();
    };
    return (
      <ImageBackground
        source={require("../../assets/images/bgAffiliate.png")}
        style={styles.backgroundHeader}
      >
        <View style={styles.viewHeaderFake}>
          <Icon
            onPress={_onPressLeft}
            name={"chevron-left"}
            type={IconType.Feather}
            size={25}
            color={colors.white}
          />
          <Text numberOfLines={1} style={styles.txtHeader}>
            {translations.affiliate.yourIncome}
          </Text>
          <View style={{ width: 25 }} />
        </View>
        <Text
          style={{
            ...CS.hnSemiBold,
            fontSize: 24,
            color: colors.white,
            textAlign: "center",
          }}
        >
          {price}
        </Text>
        <Text
          style={{
            ...CS.hnSemiBold,
            fontSize: 16,
            color: colors.white,
            textAlign: "center",
            textDecorationLine: "underline",
          }}
        >
          {translations.affiliate.withdraw}
        </Text>
      </ImageBackground>
    );
  };

  const renderListFilter = () => {
    const sortByProduct = () => {};
    const sortByUser = () => {};
    const sortByDate = () => {
      showSuperModal({
        contentModalType: EnumModalContentType.FilterAffiliate,
        styleModalType: EnumStyleModalType.Bottom,
      });
    };
    return (
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 16,
          flexDirection: "row",
          gap: 8,
        }}
      >
        <ItemSortBy text={translations.affiliate.date} onPress={sortByDate} />
        <ItemSortBy
          text={translations.affiliate.product}
          onPress={sortByProduct}
        />
        <ItemSortBy text={translations.affiliate.user} onPress={sortByUser} />
      </View>
    );
  };

  const renderListDetail = () => {
    const renderItem = ({ item, index }) => {
      console.log("item...", item);
      return (
        <ItemAffiliate
          key={index}
          commission={item.commission_value}
          fullname="Dangth"
          price={formatPrice(item.current_token - item.last_token)}
          title={item.note}
        />
      );
    };

    const renderFooterComponent = () => {
      if (!isLoading) return <View />;
      return <LoadingList numberItem={1} />;
    };
    const renderEmpty = () => {
      return (
        <EmptyResultView
          desc={translations.affiliate.emptyTransaction}
          icon="document-text-outline"
          showLottie={false}
        />
      );
    };

    return (
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        {isLoading && <LoadingList numberItem={3} />}
        <FlatList
          nestedScrollEnabled
          data={[...listData, ...listData]}
          renderItem={renderItem}
          scrollEventThrottle={16}
          onEndReachedThreshold={0}
          onEndReached={onEndReach}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          keyExtractor={(item) => item?.chat_room_id?._id + ""}
          refreshControl={refreshControl()}
          ListFooterComponent={renderFooterComponent()}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    );
  };

  return (
    <View style={CS.flex1}>
      <ScrollView style={{ ...CS.flex1 }} showsVerticalScrollIndicator={false}>
        {renderHeader({ price: 100 })}
        {renderViewTotalAffiliate()}
        {renderListFilter()}
        {renderListDetail()}
        <View style={{ height: getBottomSpace() }}></View>
      </ScrollView>
    </View>
  );
};

export default AffiliatePage;
