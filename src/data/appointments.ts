export interface Appointment {
  id: string;
  code: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  type: 'video' | 'voice' | 'in_person';
  typeLabel: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  statusLabel: string;
  avatar: any;
  fee: number;
  patientName: string;
  patientGender: string;
  patientAge: string;
  notes?: string;
  locationDetail?: string;
}

export const appointmentsData: Appointment[] = [
  {
    id: 'app-1',
    code: 'KH001234',
    doctorName: 'BS. Nguyễn Quốc Việt',
    specialty: 'Tim mạch',
    hospital: 'Vinmec Đà Nẵng',
    date: '24/10/2026',
    time: '09:00 – 09:30',
    type: 'video',
    typeLabel: 'Tư vấn video',
    status: 'confirmed',
    statusLabel: 'Đã xác nhận',
    avatar: require('../../assets/images/doctor_viet.jpg'),
    fee: 200000,
    patientName: 'Nguyễn An',
    patientGender: 'Nữ',
    patientAge: '26 tuổi',
    notes: 'Khám và tư vấn sức khỏe định kỳ',
  },
  {
    id: 'app-2',
    code: 'KH001302',
    doctorName: 'BS. Lê Thị Diệu Hằng',
    specialty: 'Sản phụ khoa',
    hospital: 'Vinmec Đà Nẵng',
    date: '27/10/2026',
    time: '14:30 – 15:00',
    type: 'voice',
    typeLabel: 'Tư vấn thoại',
    status: 'pending',
    statusLabel: 'Đang chờ',
    avatar: require('../../assets/images/doctor_hang.jpg'),
    fee: 150000,
    patientName: 'Nguyễn An',
    patientGender: 'Nữ',
    patientAge: '26 tuổi',
    notes: 'Đang chờ bác sĩ xác nhận lịch.',
  },
  {
    id: 'app-3',
    code: 'KH001455',
    doctorName: 'BS. Nguyễn Thị Mỹ',
    specialty: 'Nội tổng quát',
    hospital: 'Vinmec Đà Nẵng',
    date: '02/11/2026',
    time: '08:30 – 09:00',
    type: 'in_person',
    typeLabel: 'Khám trực tiếp',
    status: 'confirmed',
    statusLabel: 'Đã xác nhận',
    avatar: require('../../assets/images/doctor_my.jpg'),
    fee: 200000,
    patientName: 'Nguyễn An',
    patientGender: 'Nữ',
    patientAge: '26 tuổi',
    locationDetail: 'Tầng 3, Khu B',
  },
  {
    id: 'app-4',
    code: 'KH000980',
    doctorName: 'BS. Nguyễn Công Cảnh',
    specialty: 'Nhi khoa',
    hospital: 'BV Phụ sản - Nhi Đà Nẵng',
    date: '28/08/2026',
    time: '10:00 – 10:30',
    type: 'voice',
    typeLabel: 'Tư vấn thoại',
    status: 'completed',
    statusLabel: 'Đã khám',
    avatar: require('../../assets/images/doctor_canh.jpg'),
    fee: 150000,
    patientName: 'Bé Nguyễn Minh Triết',
    patientGender: 'Nam',
    patientAge: '3 tuổi',
  },
];
