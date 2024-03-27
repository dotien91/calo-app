import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CurrencyInput, { formatNumber } from "react-native-currency-input";
import { useTheme } from "@react-navigation/native";

import CS from "@theme/styles";

const TextInputPrice = ({ priceInput, setPriceInput }) => {
  const theme = useTheme();
  const { colors } = theme;
  const [isShowRecommned, setisShowRecommned] = useState(true);

  const recommendValue = (value) => {
    const formattedValue = formatNumber(value, {
      separator: ".",
      precision: 0,
      delimiter: ".",
    });
    return formattedValue;
  };

  return (
    <View
      style={{
        borderWidth: 1,
        marginHorizontal: 20,
        borderColor: colors.borderColor,
        borderRadius: 8,
        padding: 12,
        marginBottom: 4,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CurrencyInput
          style={{
            ...CS.hnMedium,
            fontSize: 14,
            flex: 1,
          }}
          placeholder="Nhập tiền..."
          delimiter="."
          separator="."
          precision={0}
          value={priceInput}
          onChangeValue={setPriceInput}
        ></CurrencyInput>
        <Text style={{ ...CS.hnMedium, fontSize: 14 }}>VND</Text>
      </View>
      {isShowRecommned ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setPriceInput((priceInput || 100) * 10);
              setisShowRecommned(false);
            }}
            style={{
              borderWidth: 1,
              borderRadius: 16,
              borderColor: colors.grey2,
            }}
          >
            <Text style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
              {priceInput > 0
                ? recommendValue((priceInput || 100) * 10)
                : recommendValue(100 * 10)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPriceInput((priceInput || 100) * 100);
              setisShowRecommned(false);
            }}
            style={{
              borderWidth: 1,
              borderRadius: 16,
              borderColor: colors.grey2,
            }}
          >
            <Text style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
              {priceInput > 0
                ? recommendValue((priceInput || 100) * 100)
                : recommendValue(100 * 100)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPriceInput((priceInput || 100) * 1000);
              setisShowRecommned(false);
            }}
            style={{
              borderWidth: 1,
              borderRadius: 16,
              borderColor: colors.grey2,
            }}
          >
            <Text style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
              {priceInput > 0
                ? recommendValue((priceInput || 100) * 1000)
                : recommendValue(100 * 1000)}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
export default TextInputPrice;
