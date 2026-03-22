import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import Screen from '../components/Screen';
import { fetchAttendanceHistory, fetchStudentById } from '../services/mockTeacherApi';

const badgeStyles = {
  present: { bg: '#E8F7EF', text: '#1F8A4C', border: '#BDEACC' },
  absent: { bg: '#FFECEC', text: '#C0392B', border: '#FFC3BF' },
};

export default function StudentDetailScreen({ route }) {
  const { studentId } = route.params || {};

  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const s = await fetchStudentById(studentId);
        const h = await fetchAttendanceHistory(studentId);
        if (!active) return;
        setStudent(s);
        setHistory(h);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [studentId]);

  const stats = useMemo(() => {
    const present = history.filter((x) => x.present).length;
    const absent = history.length - present;
    return { present, absent, total: history.length };
  }, [history]);

  return (
    <Screen>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : !student ? (
        <Text style={{ color: '#6B7A90' }}>Không tìm thấy học sinh.</Text>
      ) : (
        <>
          <View style={{ padding: 14, backgroundColor: '#F7FBFF', borderRadius: 14, borderWidth: 1, borderColor: '#E3F0FF', marginBottom: 12 }}>
            <Text style={{ fontWeight: '900', fontSize: 18, color: '#13213A' }}>{student.fullName}</Text>
            <Text style={{ marginTop: 6, color: '#6B7A90', fontSize: 13.5 }}>
              {student.gender} | Sinh năm: {student.dob}
            </Text>
            <Text style={{ marginTop: 6, color: '#6B7A90', fontSize: 13.5 }}>
              Phụ huynh: {student.guardianName} | {student.phone}
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={{ fontWeight: '900', color: '#1C4B7A' }}>Có mặt</Text>
                <Text style={{ fontWeight: '900', fontSize: 18, color: '#1F8A4C', marginTop: 4 }}>{stats.present}</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 8 }}>
                <Text style={{ fontWeight: '900', color: '#1C4B7A' }}>Vắng</Text>
                <Text style={{ fontWeight: '900', fontSize: 18, color: '#C0392B', marginTop: 4 }}>{stats.absent}</Text>
              </View>
            </View>
          </View>

          <Text style={{ fontWeight: '900', color: '#13213A', marginBottom: 8 }}>Lịch sử điểm danh (demo)</Text>
          {history.length === 0 ? (
            <Text style={{ color: '#6B7A90' }}>Chưa có lịch sử.</Text>
          ) : (
            history
              .slice()
              .sort((a, b) => (a.date < b.date ? 1 : -1))
              .map((it, idx) => {
                const cfg = it.present ? badgeStyles.present : badgeStyles.absent;
                return (
                  <View
                    key={`${it.date}-${it.session}-${idx}`}
                    style={{
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: cfg.border,
                      backgroundColor: '#fff',
                      padding: 12,
                      marginBottom: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text style={{ fontWeight: '900', color: '#13213A' }}>{it.session}</Text>
                      <Text style={{ marginTop: 4, color: '#6B7A90' }}>{it.date}</Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor: cfg.bg,
                        borderWidth: 1,
                        borderColor: cfg.border,
                      }}
                    >
                      <Text style={{ color: cfg.text, fontWeight: '900' }}>{it.present ? 'Có mặt' : 'Vắng'}</Text>
                    </View>
                  </View>
                );
              })
          )}
        </>
      )}
    </Screen>
  );
}

