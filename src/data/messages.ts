export interface Conversation {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  onlineStatus: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: any;
  statusTag?: 'consulting' | 'finished';
}

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'user';
  text?: string;
  attachment?: {
    name: string;
    size: string;
    type: 'pdf' | 'image';
  };
  time: string;
}

export const conversationsData: Conversation[] = [
  {
    id: 'conv-1',
    doctorId: 'doc-1',
    doctorName: 'BS. Nguyễn Quốc Việt',
    specialty: 'Tim mạch',
    onlineStatus: 'Đang trực tuyến',
    lastMessage: 'Mình đã gửi đơn thuốc vào hồ sơ cho bạn.',
    timestamp: '09:42',
    unreadCount: 2,
    avatar: require('../../assets/images/doctor_viet.jpg'),
    statusTag: 'consulting',
  },
  {
    id: 'conv-2',
    doctorId: 'doc-2',
    doctorName: 'BS. Lê Thị Diệu Hằng',
    specialty: 'Sản phụ khoa',
    onlineStatus: 'Offline',
    lastMessage: 'Bạn gửi giúp mình ảnh vùng da nhé.',
    timestamp: 'Hôm qua',
    unreadCount: 1,
    avatar: require('../../assets/images/doctor_hang.jpg'),
    statusTag: 'consulting',
  },
  {
    id: 'conv-3',
    doctorId: 'doc-3',
    doctorName: 'BS. Nguyễn Thị Mỹ',
    specialty: 'Nội tổng quát',
    onlineStatus: 'Offline',
    lastMessage: 'Kết quả xét nghiệm đã ổn định.',
    timestamp: '12/09',
    unreadCount: 0,
    avatar: require('../../assets/images/doctor_my.jpg'),
    statusTag: 'finished',
  },
  {
    id: 'conv-4',
    doctorId: 'doc-4',
    doctorName: 'BS. Nguyễn Công Cảnh',
    specialty: 'Nhi khoa',
    onlineStatus: 'Offline',
    lastMessage: 'Cảm ơn bạn đã tin tưởng dịch vụ.',
    timestamp: '28/08',
    unreadCount: 0,
    avatar: require('../../assets/images/doctor_canh.jpg'),
    statusTag: 'finished',
  },
];

export const sampleChatMessages: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'doctor',
    text: 'Chào bạn, mình đã xem số đo huyết áp bạn gửi sáng nay.',
    time: '09:05',
  },
  {
    id: 'm2',
    sender: 'user',
    text: 'Dạ, sáng nay huyết áp của em là 138/88 mmHg ạ.',
    time: '09:07',
  },
  {
    id: 'm3',
    sender: 'doctor',
    text: 'Mức này hơi cao. Bạn tiếp tục uống thuốc đúng giờ và theo dõi mỗi ngày nhé.',
    time: '09:10',
  },
  {
    id: 'm4',
    sender: 'user',
    attachment: {
      name: 'Nhat-ky-huyet-ap.pdf',
      size: '240 KB',
      type: 'pdf',
    },
    time: '09:12',
  },
  {
    id: 'm5',
    sender: 'doctor',
    text: 'Mình đã gửi đơn thuốc vào hồ sơ cho bạn.',
    time: '09:42',
  },
];
