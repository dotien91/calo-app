import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import useStore from "@services/zustand/store";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { getUserById, sendGiftLivestream } from "@services/api/user.api";
import { IGiftDonate } from "@services/zustand/user/UserSlice";

interface GiftingLiveStreamProps {
  live_id: string;
  partner_id: string;
}

const GiftingLiveStream = ({ partner_id, live_id }: GiftingLiveStreamProps) => {
  const [selectedGift, setSelectedGift] = React.useState<IGiftDonate>();
  const userInfo = useStore((state) => state.userInfo);
  const setUserInfo = useStore((state) => state.setUserInfo);
  const listGift = useStore((state) => state.listGift);
  const handleSend = (gift_code: string) => {
    if (selectedGift.price_coin > (userInfo?.current_coin ?? 0)) {
      showToast({
        message: translations.liveStream.messageErrorCoin,
        type: "error",
      });
    } else {
      const data = {
        gift_code: gift_code,
        partner_id: partner_id,
        livestream_id: live_id,
      };
      sendGiftLivestream(data).then((res) => {
        if (res.isError) {
          showToast({
            type: "error",
            message: "error",
          });
        } else {
          // lấy lại thông tin user
          getUserById(userInfo?._id).then((res) => {
            setUserInfo(res.data);
          });
        }
      });
    }
  };
  const renderHeader = () => {
    return (
      <View style={styles.viewHeader}>
        <View style={{ ...CS.row, gap: 16 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={styles.text}>{translations.liveStream.gift}:</Text>
            {!!selectedGift?.image ? (
              <Image
                source={{ uri: selectedGift?.image }}
                style={{
                  height: 25,
                  width: 25,
                }}
              />
            ) : (
              <Text
                style={[
                  styles.text,
                  { fontSize: 14, alignSelf: "flex-end", fontStyle: "italic" },
                ]}
              >
                {translations.liveStream.notSelected}
              </Text>
            )}
          </View>
          <View style={{ ...CS.row, gap: 2 }}>
            <Text style={styles.text}>
              {translations.liveStream.priceGift}:{" "}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 2,
                marginVertical: 2,
              }}
            >
              <IconSvg name="icCoin" size={20} color={palette.yellow} />
              <Text style={{ ...styles.text, fontSize: 12 }}>
                {selectedGift?.value}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ ...CS.row, gap: 2 }}>
          <Text style={styles.text}>{translations.liveStream.totalCoin}: </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 2,
              marginVertical: 2,
            }}
          >
            <IconSvg name="icCoin" size={20} color={palette.yellow} />
            <Text style={{ ...styles.text, fontSize: 12 }}>
              {userInfo?.current_coin || 0}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const renderItemListGift = (item: IGiftDonate, index: number) => {
    const activeItem = selectedGift?.key === item?.key;
    return (
      <TouchableOpacity
        onPress={() => setSelectedGift(item)}
        key={index}
        style={styles.viewItemListGift}
      >
        <View
          style={[
            styles.viewImage,
            activeItem && {
              // borderWidth: 2,
              borderColor: palette.primary,
            },
          ]}
        >
          <Image
            resizeMode="contain"
            source={{ uri: item?.image }}
            style={styles.imageStyle}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 2,
              marginVertical: 2,
            }}
          >
            <IconSvg name="icCoin" size={20} color={palette.yellow} />
            <Text style={{ ...styles.text, fontSize: 12 }}>{item.value}</Text>
          </View>
          {activeItem && (
            <TouchableOpacity
              onPress={() => handleSend(item.key)}
              style={styles.btnSend}
            >
              <Text style={styles.text}>Gửi</Text>
            </TouchableOpacity>
          )}
        </View>
        {!activeItem && (
          <Text style={[styles.textGift, { textAlign: "center" }]}>
            {item.des}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  const renderListGift = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.viewListGift}
      >
        {listGift.map((item, index) => (
          <View key={index}>{renderItemListGift(item, index)}</View>
        ))}
      </ScrollView>
    );
  };
  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderListGift()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    gap: 16,
    // paddingHorizontal: 16,
  },
  viewHeader: {
    // ...CS.row,
    gap: 16,
    paddingLeft: 8,
  },
  text: {
    ...CS.hnRegular,
    color: palette.white8,
  },
  textGift: {
    ...CS.hnRegular,
    color: palette.white8,
    fontSize: 14,
  },
  viewListGift: {
    // ...CS.row,
    flexDirection: "row",
    width: Device.width,
    paddingBottom: 80,
    flexWrap: "wrap",
  },
  viewItemListGift: {
    ...CS.center,
    gap: 4,
    marginHorizontal: 8,
    marginVertical: 8,
    flexWrap: "wrap",
    width: Device.width / 4,
  },
  imageStyle: {
    width: "95%",
    height: Device.width / 5,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  btnSend: {
    ...CS.center,
    width: "100%",
    backgroundColor: palette.primary,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    paddingVertical: 4,
  },
  viewImage: {
    ...CS.center,
    width: Device.width / 4,
    borderWidth: 2,
    borderColor: "#242323",
    padding: 4,
  },
});
export default GiftingLiveStream;
