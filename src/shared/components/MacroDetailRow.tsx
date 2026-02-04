import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import TextBase from '@shared-components/TextBase';

export interface MacroDetailRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  labelColor?: string;
  valueColor?: string;
  style?: object;
}

/**
 * Một dòng macro: icon + label + value (dùng trong plan result, settings...)
 */
const MacroDetailRow: React.FC<MacroDetailRowProps> = ({
  icon,
  label,
  value,
  labelColor = '#D1D5DB',
  valueColor = '#FFFFFF',
  style,
}) => (
  <View style={[styles.row, style]}>
    {icon}
    <TextBase fontSize={14} style={[styles.label, { color: labelColor }]}>
      {label}
    </TextBase>
    <TextBase fontSize={14} fontWeight="700" style={{ color: valueColor }}>
      {value}
    </TextBase>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    flex: 1,
    marginLeft: 8,
  },
});

export default MacroDetailRow;
