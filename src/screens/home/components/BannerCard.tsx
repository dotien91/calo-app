import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ForkKnife, Info } from 'phosphor-react-native';
import { translations } from '@localization';

type Props = {
  styles: any;
  COLORS: any;
};

const BannerCard = ({ styles, COLORS }: Props) => {
  return (
    <View style={styles.bannerContainer}>
      <View style={[styles.banner, { backgroundColor: COLORS.bannerBg }]}>
        <View style={styles.bannerContent}>
          <View style={styles.appIconPlaceholder}>
            <ForkKnife size={20} color="white" weight="fill" />
          </View>
          <Text style={[styles.bannerText, { color: COLORS.bannerText }]}>{translations.home?.banner?.title || 'Bộ Đếm Calo AI'}</Text>
        </View>
        <TouchableOpacity style={styles.downloadBtn}>
          <Text style={styles.btnText}>{translations.home?.banner?.download || 'Tải'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <Info size={16} color={COLORS.subText} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.premiumText, { color: COLORS.subText }]}>{translations.home?.banner?.premiumPrefix || 'Tạm biệt quảng cáo.'} <Text style={{ color: COLORS.primary }}>{translations.home?.banner?.premiumCta || 'Nâng cấp Premium'}</Text></Text>
    </View>
  );
};

export default BannerCard;
