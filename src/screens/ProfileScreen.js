import React, { useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import Screen from '../components/Screen';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const classesText = useMemo(() => {
    const list = user?.classes || [];
    if (list.length === 0) return 'Chưa có';
    return list.map((c) => c.name).join(', ');
  }, [user]);

  function onSave() {
    // Demo only: no backend call.
    Alert.alert('Đã lưu (demo)', 'Thông tin cá nhân đã được cập nhật trên giao diện.');
  }

  return (
    <Screen>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '900', fontSize: 18, color: '#13213A', marginBottom: 8 }}>Thông tin tài khoản</Text>
        <Text style={{ color: '#6B7A90' }}>Vai trò: Giáo viên</Text>
        <Text style={{ color: '#6B7A90', marginTop: 4 }}>Lớp phụ trách: {classesText}</Text>
      </View>

      <InputField label="Họ và tên" value={name} onChangeText={setName} placeholder="Tên giáo viên" />
      <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
      <InputField label="Số điện thoại" value={phone} onChangeText={setPhone} placeholder="SĐT" keyboardType="phone-pad" />

      <PrimaryButton title="Cập nhật thông tin" onPress={onSave} style={{ marginTop: 6 }} />

      <View style={{ marginTop: 14 }}>
        <PrimaryButton
          title="Đăng xuất"
          onPress={() => {
            Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất không?', [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Đăng xuất', style: 'destructive', onPress: logout },
            ]);
          }}
          style={{ backgroundColor: '#D94A4A' }}
        />
      </View>
    </Screen>
  );
}

