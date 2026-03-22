import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import InputField from '../components/InputField';
import { fetchClasses, fetchStudentsByClass } from '../services/mockTeacherApi';

export default function StudentsScreen({ navigation }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const list = await fetchClasses();
      if (!active) return;
      setClasses(list);
      setSelectedClassId(list?.[0]?.id || null);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!selectedClassId) return;
      setLoading(true);
      try {
        const list = await fetchStudentsByClass(selectedClassId);
        if (!active) return;
        setStudents(list);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedClassId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.fullName.toLowerCase().includes(q));
  }, [students, search]);

  return (
    <Screen>
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: '900', marginBottom: 8 }}>Lớp của bạn</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {classes.map((c) => {
            const active = c.id === selectedClassId;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedClassId(c.id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: active ? '#0B84F3' : '#F1F6FF',
                  marginRight: 10,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: active ? '#0B84F3' : '#D7E3F3',
                }}
              >
                <Text style={{ color: active ? '#fff' : '#1C4B7A', fontWeight: '900' }}>{c.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <InputField label="Tìm kiếm học sinh" value={search} onChangeText={setSearch} placeholder="Nhập tên bé..." />

      <View style={{ marginTop: 6 }}>
        <Text style={{ fontWeight: '900', color: '#13213A', marginBottom: 8 }}>
          Danh sách ({filtered.length})
        </Text>

        {loading ? (
          <ActivityIndicator />
        ) : filtered.length === 0 ? (
          <Text style={{ color: '#6B7A90' }}>Không có kết quả.</Text>
        ) : (
          filtered.map((s) => (
            <TouchableOpacity
              key={s.id}
              onPress={() => navigation.navigate('StudentDetail', { studentId: s.id })}
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#E5EEF9',
                padding: 12,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: '#F1F6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#D7E3F3' }}>
                <Ionicons name="person" size={20} color="#0B84F3" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '900', color: '#13213A' }}>{s.fullName}</Text>
                <Text style={{ marginTop: 4, color: '#6B7A90', fontSize: 12.5 }}>
                  {s.gender} | {s.dob}
                </Text>
                <Text style={{ marginTop: 4, color: '#6B7A90', fontSize: 12.5 }}>
                  Phụ huynh: {s.guardianName}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7A90" />
            </TouchableOpacity>
          ))
        )}
      </View>
    </Screen>
  );
}

