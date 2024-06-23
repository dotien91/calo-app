import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useRoute } from "@react-navigation/native";

import Header from "@shared-components/header/Header";
import useStore from "@services/zustand/store";

// import { useUserHook } from "@helpers/hooks/useUserHook";
import CS from "@theme/styles";
import FastImage from "react-native-fast-image";
import { Device } from "@utils/device.ui.utils";
import TextBase from "@shared-components/TextBase";
import { getHoursAndDate } from "@utils/date.utils";
import IconBtn from "@shared-components/button/IconBtn";
import formatMoney from "@shared-components/input-money/format.money";
import UserItem from "@screens/course-tab/components/user.item";
import Button from "@shared-components/button/Button";
import { isAndroid } from "@helpers/device.info.helper";
import {
  showLoading,
  showToast,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import { useUserHook } from "@helpers/hooks/useUserHook";
import { translations } from "@localization";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import { palette } from "@theme/themes";

const LiveStreamPreviewScreem = () => {
  const userData = useStore((state) => state.userData);
  const { isLoggedIn } = useUserHook();
  const route = useRoute();
  const data = route.params?.["data"];
  const isMyLivestream = () => {
    return userData?._id == data?.user_id?._id;
  };

  const onBuy = () => {
    if (!isLoggedIn()) {
      showWarningLogin();
      return;
    }
    // if (isAndroid()) {
    //   alert("handle in app purchase");
    //   return;
    // }
    if (!data?.price_id) {
      showToast({
        type: "warning",
      });
      return;
    }
    showLoading();
    const _data = {
      payment_method: !isAndroid() ? "apple" : "google",
      plan_objects: [
        {
          amount_of_package: "1",
          plan_id: data.plan_id,
          type: "Livestream",
          payload: {},
        },
      ],
    };
    eventEmitter.emit("emit_buy_product", {
      productId: data?.price_id,
      data: _data,
      typePurchase: "product",
      typeProduct: "livestream",
      local_id: data._id,
    });
    return;
  };

  const renderPublisher = () => {
    return (
      <View style={styles.authorBox}>
        <UserItem {...data.user_id} />
        <TextViewCollapsed
          styleText={styles.txtDes}
          text={data?.user_id?.bio || translations.noReferrals}
        />
      </View>
    );
  };

  const goLive = () => {
    navigate(SCREENS.LIVE_STREAM, {
      titleLive: data?.title || "",
      go_live_id: data?._id,
    });
  };

  const renderBuyBtn = () => {
    if (isMyLivestream())
      return <Button type="primary" onPress={goLive} text="Go live" />;
    return (
      <Button
        type="primary"
        onPress={onBuy}
        text={translations.updateLivestream.orderLive}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <FastImage
          source={{ uri: data?.cover_url || data?.user_id?.user_avatar }}
          resizeMode="cover"
          style={{
            width: Device.width - 32,
            height: ((Device.width - 32) / 19) * 10,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />
        <TextBase fontWeight="500">{data?.title}</TextBase>
        <View style={CS.flexStart}>
          <IconBtn name="clock" customStyle={{ marginRight: 8 }} />
          <TextBase textAlign="center" fontWeight="600">
            {getHoursAndDate(data?.start_time).hour}{" "}
            {getHoursAndDate(data?.start_time).date}
          </TextBase>
        </View>
        <View style={CS.flexStart}>
          <IconBtn name="dollar-sign" customStyle={{ marginRight: 8 }} />
          <TextBase textAlign="center" fontWeight="600">
            {formatMoney(data?.price)} đ
          </TextBase>
        </View>
        {renderPublisher()}
        <View style={{ height: 16 }} />
      </View>
    );
  };
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        text={
          data?.is_author
            ? "Livestream"
            : translations.updateLivestream.orderLive
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {renderContent()}
      </ScrollView>
      <View style={styles.fixedBtn}>{renderBuyBtn()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  authorBox: {
    ...CS.borderStyle,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  txtDes: {
    ...CS.hnRegular,
    color: palette.textOpacity6,
    lineHeight: 24,
  },
  fixedBtn: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
    backgroundColor: palette.white,
    zIndex: 1,
  },
});

export default LiveStreamPreviewScreem;
