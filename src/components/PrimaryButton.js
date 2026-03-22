import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function PrimaryButton({ title, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, disabled && styles.btnDisabled, style]}
    >
      <Text style={[styles.btnText, disabled && styles.btnTextDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#0B84F3',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: '#87BFF6' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnTextDisabled: { color: '#EAF5FF' },
});

