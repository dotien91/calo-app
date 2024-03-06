import * as React from "react";
import { View, StyleSheet, Image } from "react-native";

import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import formatMoney from "@shared-components/input-money/format.money";
import { formatCoin } from "@helpers/string.helper";
interface ItemAffiliateProps {
  item: any;
}

const ItemAffiliate = ({ item }: ItemAffiliateProps) => {
  const coin = item.current_coin - item.last_coin || 0;
  const token = item.current_token - item.last_token || 0;
  const typeToken = item.transaction_value_type === "token";
  const isCashOut = item.transaction_bank;
  const commission = typeToken
    ? formatMoney(token, { suffix: " đ", showPositiveSign: true })
    : formatCoin(coin) || "";
  const fullname = isCashOut
    ? translations.withDraw.header
    : item.from_user?.display_name
    ? `${translations.affiliate.customer}: ${item.from_user?.display_name}`
    : "system";
  const refType = item.ref_type;
  const price =
    (typeToken && formatMoney(item?.ref_id?.price, { suffix: " đ" })) || "";
  const title = item?.ref_id?.title || item.note;
  const linkImage = item?.ref_id?.media_id?.media_thumbnail;

  return (
    <View style={styles.container}>
      <View style={styles.styleImage}>
        {linkImage && (
          <Image source={{ uri: linkImage }} style={styles.styleImage} />
        )}
      </View>
      <View style={CS.flex1}>
        <TextBase
          numberOfLines={2}
          fontSize={16}
          fontWeight="600"
          color={EnumColors.text}
        >
          {title}
        </TextBase>
        {refType?.toLocaleLowerCase() === "course" && (
          <TextBase
            fontSize={12}
            fontWeight="400"
            color={EnumColors.textOpacity6}
          >
            {price}
          </TextBase>
        )}
        <TextBase
          fontSize={16}
          fontWeight="400"
          color={EnumColors.textOpacity8}
        >
          {`${fullname}`}
        </TextBase>
      </View>
      <View style={styles.viewPercentage}>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color={item?.method === "plus" ? "green2" : "primary"}
        >{`${commission}`}</TextBase>
        <TextBase>
          {item.method === "minus"
            ? item.status === "processing"
              ? translations.settings.pending
              : translations.settings.billing
            : ""}
        </TextBase>
      </View>
    </View>
  );
};

export default ItemAffiliate;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: palette.borderColor2,
    marginTop: 16,
  },
  styleImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "blue",
  },
  viewPercentage: {
    ...CS.center,
    paddingHorizontal: 8,
  },
});
