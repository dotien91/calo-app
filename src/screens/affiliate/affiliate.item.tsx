import * as React from "react";
import { View, StyleSheet, Image } from "react-native";

import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
interface ItemAffiliateProps {
  linkImage?: string;
  title: string;
  price: string | number;
  commission: string;
  fullname: string;
  refType?: string;
  item: any;
}

const ItemAffiliate = ({
  item,
  linkImage,
  title,
  price,
  commission,
  fullname,
  refType,
}: ItemAffiliateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.styleImage}>
        {linkImage && (
          <Image source={{ uri: linkImage }} style={styles.styleImage} />
        )}
      </View>
      <View style={{ flex: 1 }}>
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
      <View style={{ ...CS.center, paddingHorizontal: 8 }}>
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
});
