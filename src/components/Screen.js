import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen({ children, scroll = true, style }) {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      {scroll ? <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView> : <View style={styles.content}>{children}</View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
});

