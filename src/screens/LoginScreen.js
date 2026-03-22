import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import Screen from '../components/Screen';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  const [username, setUsername] = useState('teacher');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    if (!username.trim() || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      await login({ username, password });
    } catch (e) {
      Alert.alert('Đăng nhập thất bại', e?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={{ paddingTop: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#0B84F3', marginBottom: 8 }}>
          KMS Teacher
        </Text>
        <Text style={{ fontSize: 14, color: '#556', marginBottom: 18 }}>
          Đăng nhập để quản lý điểm danh, hoạt động lớp, thời khóa biểu, thực đơn và hồ sơ học sinh.
        </Text>

        <InputField label="Tên đăng nhập" value={username} onChangeText={setUsername} placeholder="teacher" autoCapitalize="none" />
        <InputField label="Mật khẩu" value={password} onChangeText={setPassword} placeholder="123456" secureTextEntry autoCapitalize="none" />

        <PrimaryButton title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'} onPress={onLogin} disabled={loading} style={{ marginTop: 6 }} />

        <Text style={{ marginTop: 14, fontSize: 12.5, color: '#6B7A90' }}>
          Demo: `teacher` / `123456`
        </Text>
      </View>
    </Screen>
  );
}

