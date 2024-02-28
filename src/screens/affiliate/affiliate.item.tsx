import * as React from "react";
import { View, StyleSheet, Image } from "react-native";

import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import CS from "@theme/styles";
import { translations } from "@localization";
interface ItemAffiliateProps {
  linkImage?: string;
  title: string;
  price: string;
  commission: string;
  fullname: string;
}

const ItemAffiliate = ({
  linkImage,
  title,
  price,
  commission,
  fullname,
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
        <TextBase
          fontSize={12}
          fontWeight="400"
          color={EnumColors.textOpacity6}
        >
          {price}
        </TextBase>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color={EnumColors.textOpacity8}
        >
          {`${translations.affiliate.customer}: ${fullname}`}
        </TextBase>
      </View>
      <View style={{ ...CS.center, paddingHorizontal: 8 }}>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color="green2"
        >{`+${commission}`}</TextBase>
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
  },
  styleImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "blue",
  },
});
