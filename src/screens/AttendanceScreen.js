import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { fetchClasses, fetchStudentsByClass, submitAttendance } from '../services/mockTeacherApi';
import { useAuth } from '../context/AuthContext';

const sessionOptions = ['Sáng', 'Chiều'];
const pillColors = {
  present: { bg: '#E8F7EF', text: '#1F8A4C', border: '#BDEACC' },
  absent: { bg: '#FFECEC', text: '#C0392B', border: '#FFC3BF' },
};

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function AttendanceScreen() {
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [session, setSession] = useState('Sáng');
  const [date, setDate] = useState(formatDate(new Date()));

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const classList = await fetchClasses();
        if (!active) return;
        setClasses(classList);
        const initialClassId = classList?.[0]?.id || user?.classes?.[0]?.id || null;
        setSelectedClassId(initialClassId);
      } catch {
        // Ignore for demo
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!selectedClassId) return;
      const list = await fetchStudentsByClass(selectedClassId);
      if (!active) return;
      setStudents(list);
      // Default: all present (teacher can tap to switch).
      const next = {};
      list.forEach((s) => {
        next[s.id] = true;
      });
      setRecords(next);
    })();
    return () => {
      active = false;
    };
  }, [selectedClassId]);

  const summary = useMemo(() => {
    const values = Object.values(records);
    const present = values.filter(Boolean).length;
    const absent = values.length - present;
    return { present, absent, total: values.length };
  }, [records]);

  function toggleStudent(studentId) {
    setRecords((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  }

  async function onSubmit() {
    if (!selectedClassId) {
      Alert.alert('Chưa chọn lớp', 'Vui lòng chọn lớp để thực hiện điểm danh.');
      return;
    }
    if (!date) {
      Alert.alert('Thiếu ngày', 'Vui lòng nhập ngày điểm danh.');
      return;
    }

    try {
      setLoading(true);
      await submitAttendance();
      Alert.alert('Thành công', `Đã lưu điểm danh: ${summary.present} có mặt, ${summary.absent} vắng.`);
    } catch (e) {
      Alert.alert('Lỗi', e?.message || 'Không thể lưu điểm danh.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Chọn lớp</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {classes.map((c) => {
            const isActive = c.id === selectedClassId;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedClassId(c.id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: isActive ? '#0B84F3' : '#F1F6FF',
                  marginRight: 10,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: isActive ? '#0B84F3' : '#D7E3F3',
                }}
              >
                <Text style={{ color: isActive ? '#fff' : '#1C4B7A', fontWeight: '700' }}>{c.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Phiên học</Text>
          <View style={{ flexDirection: 'row' }}>
            {sessionOptions.map((opt) => {
              const active = opt === session;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSession(opt)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: active ? '#0B84F3' : '#F1F6FF',
                    borderWidth: 1,
                    borderColor: active ? '#0B84F3' : '#D7E3F3',
                    alignItems: 'center',
                    marginRight: opt === 'Sáng' ? 8 : 0,
                  }}
                >
                  <Text style={{ color: active ? '#fff' : '#1C4B7A', fontWeight: '800' }}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ width: 160 }}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Ngày</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#D7E3F3',
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontWeight: '700', color: '#334' }}>{date}</Text>
            <Text style={{ fontSize: 12, color: '#6B7A90', marginTop: 2 }}>Hiện tại (demo)</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          padding: 12,
          backgroundColor: '#F7FBFF',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#E3F0FF',
          marginBottom: 12,
        }}
      >
        <Text style={{ fontWeight: '800', marginBottom: 6 }}>Tóm tắt</Text>
        <Text style={{ color: '#1C4B7A', fontWeight: '700' }}>
          Tổng: {summary.total} | Có mặt: {summary.present} | Vắng: {summary.absent}
        </Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontWeight: '800', marginBottom: 8 }}>Danh sách học sinh</Text>
        {students.length === 0 ? (
          <Text style={{ color: '#6B7A90' }}>Chưa có dữ liệu cho lớp này.</Text>
        ) : (
          <View>
            {students.map((s) => {
              const present = !!records[s.id];
              const cfg = present ? pillColors.present : pillColors.absent;
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => toggleStudent(s.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: cfg.border,
                    backgroundColor: '#fff',
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={{ fontWeight: '800', color: '#13213A' }}>{s.fullName}</Text>
                    <Text style={{ fontSize: 12.5, color: '#6B7A90', marginTop: 2 }}>
                      {s.gender} | {s.dob}
                    </Text>
                  </View>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: cfg.bg, borderWidth: 1, borderColor: cfg.border }}>
                    <Text style={{ color: cfg.text, fontWeight: '800' }}>{present ? 'Có mặt' : 'Vắng'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Ionicons name={present ? 'checkmark' : 'close'} size={14} color={cfg.text} />
                      <Text style={{ marginLeft: 6, fontSize: 12, color: cfg.text }}>{present ? 'Tap để đổi' : 'Tap để đổi'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <PrimaryButton title={loading ? 'Đang lưu...' : 'Lưu điểm danh'} onPress={onSubmit} disabled={loading || students.length === 0} />
    </Screen>
  );
}

