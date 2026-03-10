import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { translations } from '@localization';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFF',
    marginBottom: 12,
  },
  hintLabel: { fontSize: 13, color: '#8E8E93', marginBottom: 6 },
  btnReanalyze: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2ECC71',
  },
  btnClose: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  textReanalyze: { color: '#000', fontSize: 16, fontWeight: '600' },
  textClose: { color: '#8E8E93', fontSize: 15 },
});

type EditResultModalProps = {
  visible: boolean;
  onClose: () => void;
  /** Gọi với user_edit_hint (mô tả gợi ý) để AI phân tích lại */
  onReanalyze: (userEditHint: string) => Promise<void>;
  reanalyzeLoading?: boolean;
  colors?: { text?: string; card?: string; border?: string; accent?: string };
};

const EditResultModal = ({
  visible,
  onClose,
  onReanalyze,
  reanalyzeLoading = false,
  colors = {},
}: EditResultModalProps) => {
  const [editHint, setEditHint] = useState('');
  const c = {
    text: colors.text ?? '#FFF',
    card: colors.card ?? '#1C1C1E',
    border: colors.border ?? '#2C2C2E',
    accent: colors.accent ?? '#2ECC71',
  };

  useEffect(() => {
    if (visible) setEditHint('');
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => { if (!reanalyzeLoading) onClose(); }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => { if (!reanalyzeLoading) onClose(); }}
        />
        <View style={[styles.box, { backgroundColor: c.card }]}>
          <Text style={[styles.title, { color: c.text }]}>
            {(translations as any).scanner.editResult}
          </Text>
          <Text style={[styles.hintLabel, { color: c.text }]}>
            {(translations as any).scanner.editHintLabel ?? 'Mô tả lại để AI phân tích lại (tùy chọn)'}
          </Text>
          <TextInput
            style={[styles.input, { color: c.text, borderColor: c.border, marginBottom: 4 }]}
            value={editHint}
            onChangeText={setEditHint}
            placeholder={(translations as any).scanner.editHintPlaceholder ?? 'VD: bớt cơm, thêm rau, đổi tên món...'}
            placeholderTextColor="#8E8E93"
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[styles.btnReanalyze, { backgroundColor: c.accent }]}
            onPress={() => onReanalyze(editHint.trim())}
            disabled={reanalyzeLoading}
          >
            {reanalyzeLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.textReanalyze}>
                {(translations as any).scanner.reanalyze ?? 'Phân tích lại bằng AI'}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => { if (!reanalyzeLoading) onClose(); }}
            disabled={reanalyzeLoading}
          >
            <Text style={[styles.textClose, reanalyzeLoading && { opacity: 0.5 }]}>
              {(translations as any).scanner.cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditResultModal;
