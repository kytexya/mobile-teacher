import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import InputField from '../components/InputField';
import { fetchClasses, fetchAnnouncementsForTeacher, submitAnnouncement, submitClassActivity, submitDailyNote } from '../services/mockTeacherApi';
import { useAuth } from '../context/AuthContext';

const modeOptions = [
  { key: 'note', label: 'Ghi chú hôm nay', icon: 'book' },
  { key: 'activity', label: 'Hoạt động lớp', icon: 'flower' },
  { key: 'announcement', label: 'Thông báo', icon: 'notifications' },
];

function formatNow() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  const hh = `${d.getHours()}`.padStart(2, '0');
  const min = `${d.getMinutes()}`.padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export default function ActivitiesScreen() {
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [mode, setMode] = useState('note');

  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [loadingFeed, setLoadingFeed] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Hoạt động học');
  const [attachmentHint, setAttachmentHint] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const classList = await fetchClasses();
      if (!active) return;
      setClasses(classList);
      setSelectedClassId(classList?.[0]?.id || user?.classes?.[0]?.id || null);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!selectedClassId) return;
      setLoadingFeed(true);
      try {
        const list = await fetchAnnouncementsForTeacher(selectedClassId);
        if (!active) return;

        // Split mock items into 3 feed types.
        const nextNotes = [];
        const nextActivities = [];
        const nextAnnouncements = [];
        list.forEach((item) => {
          if (item.type === 'note') nextNotes.push(item);
          else if (item.type === 'announcement') nextAnnouncements.push(item);
          else nextActivities.push(item);
        });

        setNotes(nextNotes);
        setAnnouncements(nextAnnouncements);
        setActivities(nextActivities);
      } finally {
        if (active) setLoadingFeed(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedClassId]);

  const feed = useMemo(() => {
    if (mode === 'note') return notes;
    if (mode === 'activity') return activities;
    return announcements;
  }, [mode, notes, activities, announcements]);

  async function onSubmit() {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tiêu đề và nội dung.');
      return;
    }
    if (!selectedClassId) {
      Alert.alert('Chưa chọn lớp', 'Vui lòng chọn lớp trước khi đăng.');
      return;
    }

    try {
      setSubmitting(true);
      const now = formatNow();
      if (mode === 'note') {
        await submitDailyNote();
        setNotes((prev) => [
          { id: `n-${Date.now()}`, createdAt: now, classId: selectedClassId, type: 'note', title: title.trim(), content: content.trim() },
          ...prev,
        ]);
      } else if (mode === 'activity') {
        await submitClassActivity();
        setActivities((prev) => [
          {
            id: `act-${Date.now()}`,
            createdAt: now,
            classId: selectedClassId,
            type: 'activity',
            title: title.trim(),
            content: content.trim(),
            category,
            attachmentHint,
          },
          ...prev,
        ]);
      } else {
        await submitAnnouncement();
        setAnnouncements((prev) => [
          { id: `a-${Date.now()}`, createdAt: now, classId: selectedClassId, type: 'announcement', title: title.trim(), content: content.trim() },
          ...prev,
        ]);
      }

      // Reset form
      setTitle('');
      setContent('');
      setCategory('Hoạt động học');
      setAttachmentHint('');
      Alert.alert('Đã đăng', 'Nội dung đã được lưu (demo).');
    } catch (e) {
      Alert.alert('Lỗi', e?.message || 'Không thể lưu.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: '800', marginBottom: 8 }}>Chọn lớp</Text>
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
                <Text style={{ color: active ? '#fff' : '#1C4B7A', fontWeight: '800' }}>{c.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 14 }}>
        {modeOptions.map((m) => {
          const active = m.key === mode;
          return (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMode(m.key)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 14,
                backgroundColor: active ? '#0B84F3' : '#F1F6FF',
                borderWidth: 1,
                borderColor: active ? '#0B84F3' : '#D7E3F3',
                marginRight: m.key === 'note' ? 8 : m.key === 'activity' ? 8 : 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={m.icon} size={18} color={active ? '#fff' : '#1C4B7A'} />
              <Text style={{ marginLeft: 8, fontWeight: '900', color: active ? '#fff' : '#1C4B7A', fontSize: 12.5 }}>{m.label}</Text>
            </TouchableOpacity>
          );
        })}
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
        <Text style={{ fontWeight: '900', color: '#13213A', marginBottom: 8 }}>
          Đăng nội dung ({mode === 'note' ? 'Ghi chú' : mode === 'activity' ? 'Hoạt động' : 'Thông báo'})
        </Text>

        <InputField label="Tiêu đề" value={title} onChangeText={setTitle} placeholder="Ví dụ: Bản tin hôm nay" />
        <InputField
          label="Nội dung"
          value={content}
          onChangeText={setContent}
          placeholder="Nhập chi tiết..."
          multiline
          numberOfLines={4}
        />

        {mode === 'activity' && (
          <>
            <InputField label="Chủ đề hoạt động" value={category} onChangeText={setCategory} placeholder="Hoạt động học" />
            <InputField label="Hình ảnh/đính kèm (demo)" value={attachmentHint} onChangeText={setAttachmentHint} placeholder="Ví dụ: 3 ảnh chụp hoạt động" />
          </>
        )}

        <PrimaryButton title={submitting ? 'Đang đăng...' : 'Đăng nội dung'} onPress={onSubmit} disabled={submitting} style={{ marginTop: 6 }} />
      </View>

      <View style={{ marginBottom: 6 }}>
        <Text style={{ fontWeight: '900', color: '#13213A', marginBottom: 8 }}>
          {loadingFeed ? 'Đang tải...' : `Danh sách (${feed.length})`}
        </Text>

        {feed.length === 0 ? (
          <Text style={{ color: '#6B7A90' }}>Chưa có dữ liệu cho tab này.</Text>
        ) : (
          feed.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#E5EEF9',
                borderRadius: 14,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: '900', color: '#13213A' }}>{item.title}</Text>
              <Text style={{ marginTop: 4, color: '#6B7A90', fontSize: 12.5 }}>{item.createdAt}</Text>
              <Text style={{ marginTop: 10, color: '#334' }}>{item.content}</Text>
              {mode === 'activity' && item.category && (
                <Text style={{ marginTop: 8, color: '#6B7A90', fontSize: 12.5 }}>
                  Chủ đề: {item.category}
                </Text>
              )}
              {mode === 'activity' && item.attachmentHint && (
                <Text style={{ marginTop: 4, color: '#6B7A90', fontSize: 12.5 }}>
                  Đính kèm: {item.attachmentHint}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}

