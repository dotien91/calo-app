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

interface TypedData {
  id: number;
  name: string;
  price_coin: number;
  image_url: string;
}
const data = [
  {
    id: 1,
    name: "Quỳnh",
    price_coin: 10,
    image_url:
      "https://images.vexels.com/media/users/3/140022/isolated/preview/ae688f131dfb50ecff10efc8a86def6a-crocodile-cartoon.png?w=360",
  },
  {
    id: 2,
    name: "Huệ",
    price_coin: 9,
    image_url:
      "https://static.vecteezy.com/system/resources/previews/011/288/627/non_2x/crocodile-coloring-cartoon-design-on-transparent-background-png.png",
  },
  {
    id: 3,
    name: "Hoa",
    price_coin: 8,
    image_url:
      "https://png.pngtree.com/png-vector/20220915/ourmid/pngtree-alligator-crocodile-cartoon-clipart-png-image_6176697.png",
  },
  {
    id: 4,
    name: "Súng",
    price_coin: 7,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 5,
    name: "Hoa",
    price_coin: 8,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 6,
    name: "Súng",
    price_coin: 7,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 7,
    name: "Hoa",
    price_coin: 8,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 8,
    name: "Súng",
    price_coin: 7,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 9,
    name: "Súng",
    price_coin: 7,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 10,
    name: "Súng",
    price_coin: 7,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 11,
    name: "Súng",
    price_coin: 7,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 12,
    name: "Súng",
    price_coin: 7,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 13,
    name: "Súng",
    price_coin: 7,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
  {
    id: 14,
    name: "Súng",
    price_coin: 7,
    image_url:
      "https://image.similarpng.com/very-thumbnail/2020/09/Green-crocodile-standing-on-transparent-background-PNG.png",
  },
];
const GiftingLiveStream = () => {
  const [selectedGift, setSelectedGift] = React.useState<TypedData>();
  const handleSend = () => {};
  const renderHeader = () => {
    return (
      <View style={styles.viewHeader}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text style={styles.text}>Quà tặng:</Text>
          {!!selectedGift?.image_url ? (
            <Image
              source={{ uri: selectedGift?.image_url }}
              style={{
                height: 25,
                width: 25,
              }}
            />
          ) : (
            <Text
              style={[
                styles.text,
                { fontSize: 12, alignSelf: "flex-end", fontStyle: "italic" },
              ]}
            >
              Chưa chọn
            </Text>
          )}
        </View>
        <View style={{ ...CS.row, gap: 2 }}>
          <Text style={styles.text}>Mệnh giá: </Text>
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
              {selectedGift?.price_coin}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const renderItemListGift = (item: TypedData, index: number) => {
    const activeItem = selectedGift?.id === item?.id;
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
              borderWidth: 2,
              borderColor: palette.primary,
              padding: 4,
            },
          ]}
        >
          <Image
            resizeMode="contain"
            source={{ uri: item?.image_url }}
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
            <Text style={{ ...styles.text, fontSize: 12 }}>
              {item.price_coin}
            </Text>
          </View>
          {activeItem && (
            <TouchableOpacity onPress={handleSend} style={styles.btnSend}>
              <Text style={styles.text}>Gửi</Text>
            </TouchableOpacity>
          )}
        </View>
        {!activeItem && (
          <Text style={[styles.textGift, { textAlign: "center" }]}>
            {item.name}
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
        {data.map((item, index) => (
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
    ...CS.row,
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
    paddingBottom: 50,
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
  },
});
export default GiftingLiveStream;
