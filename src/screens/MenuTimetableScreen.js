import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import InputField from '../components/InputField';
import { fetchClasses, fetchMenu, fetchTimetable, submitMenuItem } from '../services/mockTeacherApi';

const dayOptions = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];

export default function MenuTimetableScreen() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [tab, setTab] = useState('timetable'); // 'timetable' | 'menu'
  const [timetable, setTimetable] = useState([]);
  const [menuDay, setMenuDay] = useState(dayOptions[0]);
  const [menu, setMenu] = useState([]);

  // Menu form
  const [menuTime, setMenuTime] = useState('16:00-16:30');
  const [menuItem, setMenuItem] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const classList = await fetchClasses();
      if (!active) return;
      setClasses(classList);
      setSelectedClassId(classList?.[0]?.id || null);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!selectedClassId) return;
      const list = await fetchTimetable(selectedClassId);
      if (!active) return;
      setTimetable(list);
    })();
    return () => {
      active = false;
    };
  }, [selectedClassId]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!selectedClassId) return;
      const list = await fetchMenu(selectedClassId, menuDay);
      if (!active) return;
      setMenu(list);
    })();
    return () => {
      active = false;
    };
  }, [selectedClassId, menuDay]);

  const timetableGrouped = useMemo(() => {
    const g = {};
    timetable.forEach((it) => {
      g[it.day] = g[it.day] || [];
      g[it.day].push(it);
    });
    return g;
  }, [timetable]);

  async function onAddMenuItem() {
    if (!menuItem.trim()) {
      Alert.alert('Thiếu món ăn', 'Vui lòng nhập tên món ăn.');
      return;
    }
    try {
      setSubmitting(true);
      await submitMenuItem();
      setMenu((prev) => [{ time: menuTime.trim(), item: menuItem.trim() }, ...prev]);
      setMenuItem('');
      Alert.alert('Đã lưu (demo)', 'Món ăn đã được thêm vào thực đơn.');
    } catch (e) {
      Alert.alert('Lỗi', e?.message || 'Không thể lưu.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: '900', marginBottom: 8 }}>Chọn lớp</Text>
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

      <View style={{ flexDirection: 'row', marginBottom: 14 }}>
        <TouchableOpacity
          onPress={() => setTab('timetable')}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 14,
            backgroundColor: tab === 'timetable' ? '#0B84F3' : '#F1F6FF',
            borderWidth: 1,
            borderColor: tab === 'timetable' ? '#0B84F3' : '#D7E3F3',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="calendar" size={18} color={tab === 'timetable' ? '#fff' : '#1C4B7A'} />
          <Text style={{ marginLeft: 8, fontWeight: '900', color: tab === 'timetable' ? '#fff' : '#1C4B7A' }}>Thời khóa biểu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab('menu')}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 14,
            backgroundColor: tab === 'menu' ? '#0B84F3' : '#F1F6FF',
            borderWidth: 1,
            borderColor: tab === 'menu' ? '#0B84F3' : '#D7E3F3',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            marginLeft: 10,
          }}
        >
          <Ionicons name="restaurant" size={18} color={tab === 'menu' ? '#fff' : '#1C4B7A'} />
          <Text style={{ marginLeft: 8, fontWeight: '900', color: tab === 'menu' ? '#fff' : '#1C4B7A' }}>Thực đơn</Text>
        </TouchableOpacity>
      </View>

      {tab === 'timetable' ? (
        <View>
          <Text style={{ fontWeight: '900', color: '#13213A', marginBottom: 10 }}>Lịch học (demo)</Text>
          {Object.keys(timetableGrouped).length === 0 ? (
            <Text style={{ color: '#6B7A90' }}>Chưa có dữ liệu.</Text>
          ) : (
            dayOptions.map((day) => {
              const items = timetableGrouped[day] || [];
              if (items.length === 0) return null;
              return (
                <View key={day} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: '900', color: '#1C4B7A', marginBottom: 8 }}>{day}</Text>
                  {items.map((it, idx) => (
                    <View
                      key={`${day}-${idx}`}
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: '#E5EEF9',
                        padding: 12,
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ fontWeight: '900', color: '#13213A' }}>{it.subject}</Text>
                      <Text style={{ marginTop: 4, color: '#6B7A90', fontSize: 12.5 }}>{it.period}</Text>
                    </View>
                  ))}
                </View>
              );
            })
          )}
        </View>
      ) : (
        <View>
          <Text style={{ fontWeight: '900', color: '#13213A', marginBottom: 10 }}>Thực đơn theo ngày</Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
            {dayOptions.map((d) => {
              const active = d === menuDay;
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => setMenuDay(d)}
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
                  <Text style={{ color: active ? '#fff' : '#1C4B7A', fontWeight: '900' }}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontWeight: '900', color: '#1C4B7A', marginBottom: 8 }}>Danh sách món ăn</Text>
            {menu.length === 0 ? (
              <Text style={{ color: '#6B7A90' }}>Chưa có món cho ngày này.</Text>
            ) : (
              menu.map((m, idx) => (
                <View
                  key={`${m.time}-${idx}`}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: '#E5EEF9',
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: '900', color: '#13213A' }}>{m.item}</Text>
                  <Text style={{ marginTop: 4, color: '#6B7A90', fontSize: 12.5 }}>{m.time}</Text>
                </View>
              ))
            )}
          </View>

          <View style={{ padding: 12, backgroundColor: '#F7FBFF', borderRadius: 14, borderWidth: 1, borderColor: '#E3F0FF' }}>
            <Text style={{ fontWeight: '900', color: '#13213A', marginBottom: 10 }}>Thêm món ăn (demo)</Text>
            <InputField label="Khung giờ" value={menuTime} onChangeText={setMenuTime} placeholder="Ví dụ: 10:30-11:00" />
            <InputField label="Tên món ăn" value={menuItem} onChangeText={setMenuItem} placeholder="Ví dụ: Cơm + Cá kho" />
            <PrimaryButton title={submitting ? 'Đang lưu...' : 'Lưu thực đơn'} onPress={onAddMenuItem} disabled={submitting} style={{ marginTop: 6 }} />
          </View>
        </View>
      )}
    </Screen>
  );
}

