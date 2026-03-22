// Mock APIs so the UI can run immediately without a backend.
// Replace these functions with real REST API calls later.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const teacherData = {
  id: 't-001',
  name: 'Cô Nguyễn Thị Lan',
  email: 'lan.nguyen@sunshine.edu.vn',
  phone: '0901 234 567',
  roles: ['teacher'],
  classes: [
    { id: 'c-kg1', name: 'Lớp Lá 1', grade: 'MGL' },
    { id: 'c-kg2', name: 'Lớp Lá 2', grade: 'MGL' },
  ],
};

const studentsByClass = {
  'c-kg1': [
    { id: 's-001', fullName: 'Bé An', dob: '2019-08-03', gender: 'M', guardianName: 'Chị Hoa', phone: '0902 111 222' },
    { id: 's-002', fullName: 'Bé Bình', dob: '2019-12-14', gender: 'M', guardianName: 'Anh Minh', phone: '0902 333 444' },
    { id: 's-003', fullName: 'Bé Chi', dob: '2020-02-20', gender: 'F', guardianName: 'Chị Mai', phone: '0902 555 666' },
  ],
  'c-kg2': [
    { id: 's-004', fullName: 'Bé Dũng', dob: '2019-05-22', gender: 'M', guardianName: 'Anh Hùng', phone: '0902 777 888' },
    { id: 's-005', fullName: 'Bé Em', dob: '2020-01-09', gender: 'F', guardianName: 'Chị Linh', phone: '0902 999 000' },
  ],
};

const timetableByClass = {
  'c-kg1': [
    { day: 'Thứ 2', period: '08:00-08:45', subject: 'Phát triển thể chất' },
    { day: 'Thứ 2', period: '09:00-09:45', subject: 'Làm quen chữ cái' },
    { day: 'Thứ 3', period: '08:00-08:45', subject: 'Khám phá khoa học' },
    { day: 'Thứ 4', period: '08:00-08:45', subject: 'Tạo hình' },
    { day: 'Thứ 5', period: '08:00-08:45', subject: 'Âm nhạc' },
    { day: 'Thứ 6', period: '08:00-08:45', subject: 'Vui chơi tự do' },
  ],
  'c-kg2': [
    { day: 'Thứ 2', period: '08:00-08:45', subject: 'Phát triển ngôn ngữ' },
    { day: 'Thứ 3', period: '08:00-08:45', subject: 'Làm quen toán' },
    { day: 'Thứ 4', period: '08:00-08:45', subject: 'Thể dục nhịp điệu' },
    { day: 'Thứ 5', period: '08:00-08:45', subject: 'Tạo hình' },
    { day: 'Thứ 6', period: '08:00-08:45', subject: 'Vui chơi' },
  ],
};

const menuByClassAndDay = {
  'c-kg1': {
    'Thứ 2': [
      { time: '07:30-08:00', item: 'Sữa + Bánh mì' },
      { time: '10:30-11:00', item: 'Cơm + Cá kho' },
      { time: '14:00-14:30', item: 'Cháo + Rau' },
    ],
    'Thứ 3': [{ time: '07:30-08:00', item: 'Trứng + Bánh' }, { time: '10:30-11:00', item: 'Cơm + Gà luộc' }],
    'Thứ 4': [{ time: '07:30-08:00', item: 'Sữa + Ngũ cốc' }, { time: '10:30-11:00', item: 'Cơm + Thịt băm' }],
    'Thứ 5': [{ time: '07:30-08:00', item: 'Bánh + Sữa' }, { time: '10:30-11:00', item: 'Cơm + Tôm sốt' }],
    'Thứ 6': [{ time: '07:30-08:00', item: 'Xôi + Đậu' }, { time: '10:30-11:00', item: 'Cơm + Canh' }],
  },
  'c-kg2': {
    'Thứ 2': [{ time: '07:30-08:00', item: 'Sữa + Bánh mì' }, { time: '10:30-11:00', item: 'Cơm + Thịt kho' }],
    'Thứ 3': [{ time: '07:30-08:00', item: 'Trái cây + Sữa' }, { time: '10:30-11:00', item: 'Cơm + Đùi gà' }],
    'Thứ 4': [{ time: '07:30-08:00', item: 'Ngũ cốc + Sữa' }, { time: '10:30-11:00', item: 'Cơm + Cá chiên' }],
    'Thứ 5': [{ time: '07:30-08:00', item: 'Bánh + Sữa' }, { time: '10:30-11:00', item: 'Cơm + Rau luộc' }],
    'Thứ 6': [{ time: '07:30-08:00', item: 'Xôi + Đậu' }, { time: '10:30-11:00', item: 'Cơm + Canh' }],
  },
};

const attendanceHistoryByStudent = {
  's-001': [
    { date: '2026-03-10', session: 'Sáng', present: true },
    { date: '2026-03-11', session: 'Sáng', present: true },
    { date: '2026-03-12', session: 'Sáng', present: false },
    { date: '2026-03-13', session: 'Sáng', present: true },
  ],
  's-002': [
    { date: '2026-03-10', session: 'Sáng', present: true },
    { date: '2026-03-11', session: 'Sáng', present: false },
    { date: '2026-03-12', session: 'Sáng', present: true },
    { date: '2026-03-13', session: 'Sáng', present: true },
  ],
  's-003': [
    { date: '2026-03-10', session: 'Sáng', present: true },
    { date: '2026-03-11', session: 'Sáng', present: true },
    { date: '2026-03-12', session: 'Sáng', present: true },
    { date: '2026-03-13', session: 'Sáng', present: true },
  ],
  's-004': [
    { date: '2026-03-10', session: 'Sáng', present: true },
    { date: '2026-03-11', session: 'Sáng', present: true },
    { date: '2026-03-12', session: 'Sáng', present: true },
    { date: '2026-03-13', session: 'Sáng', present: false },
  ],
  's-005': [
    { date: '2026-03-10', session: 'Sáng', present: false },
    { date: '2026-03-11', session: 'Sáng', present: true },
    { date: '2026-03-12', session: 'Sáng', present: true },
    { date: '2026-03-13', session: 'Sáng', present: true },
  ],
};

const announcements = [
  {
    id: 'a-001',
    createdAt: '2026-03-14 08:30',
    classId: 'c-kg1',
    type: 'announcement',
    title: 'Thông báo: Ngày hội đọc sách',
    content: 'Sáng thứ Sáu, lớp chuẩn bị sách truyện để tham gia hoạt động đọc sách cùng phụ huynh.',
  },
  {
    id: 'a-002',
    createdAt: '2026-03-15 09:10',
    classId: 'c-kg2',
    type: 'note',
    title: 'Bản tin hôm nay',
    content: 'Các bạn đã hoàn thành bài tập tô màu và học cách rửa tay đúng quy trình.',
  },
];

export async function login({ username, password }) {
  await sleep(500);
  // Demo auth rule:
  // - username: teacher
  // - password: 123456
  if (username.trim().toLowerCase() !== 'teacher' || password !== '123456') {
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng. (Demo: teacher / 123456)');
  }
  return {
    token: 'mock-jwt-token-for-teacher',
    teacher: teacherData,
  };
}

export async function fetchTeacherMe() {
  await sleep(200);
  return teacherData;
}

export async function fetchClasses() {
  await sleep(200);
  return teacherData.classes;
}

export async function fetchStudentsByClass(classId) {
  await sleep(250);
  return studentsByClass[classId] || [];
}

export async function fetchTimetable(classId) {
  await sleep(250);
  return timetableByClass[classId] || [];
}

export async function fetchMenu(classId, day) {
  await sleep(250);
  const classMenus = menuByClassAndDay[classId] || {};
  return classMenus[day] || [];
}

export async function fetchStudentById(studentId) {
  await sleep(180);
  for (const classId of Object.keys(studentsByClass)) {
    const found = (studentsByClass[classId] || []).find((s) => s.id === studentId);
    if (found) return found;
  }
  return null;
}

export async function fetchAttendanceHistory(studentId) {
  await sleep(200);
  return attendanceHistoryByStudent[studentId] || [];
}

export async function fetchAnnouncementsForTeacher(classId) {
  await sleep(220);
  return announcements
    .filter((a) => !classId || a.classId === classId)
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function submitAttendance() {
  await sleep(450);
  return { ok: true };
}

export async function submitDailyNote() {
  await sleep(350);
  return { ok: true };
}

export async function submitAnnouncement() {
  await sleep(350);
  return { ok: true };
}

export async function submitClassActivity() {
  await sleep(350);
  return { ok: true };
}

export async function submitMenuItem() {
  await sleep(350);
  return { ok: true };
}

