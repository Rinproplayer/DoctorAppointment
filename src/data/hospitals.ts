export interface Hospital {
  id: string;
  name: string;
  specialties: string;
  address: string;
  distance: string;
  travelTime: string;
  rating: number;
  image: any;
  isFavorite?: boolean;
  phone: string;
  workingHours: string;
  description: string;
}

export const hospitalsData: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Vinmec Đà Nẵng',
    specialties: 'Đa khoa • Tim mạch • Xét nghiệm',
    address: 'Đường 30 Tháng 4, Đà Nẵng',
    distance: '3,5 km',
    travelTime: '15 phút',
    rating: 4.8,
    image: require('../../assets/images/vinmec.jpg'),
    isFavorite: true,
    phone: '0236 3711 111',
    workingHours: 'Thứ Hai – Thứ Bảy • 07:00 – 18:00',
    description: 'Cơ sở khám chữa bệnh đa khoa, cung cấp dịch vụ khám chuyên khoa và xét nghiệm theo tiêu chuẩn quốc tế.',
  },
  {
    id: 'hosp-2',
    name: 'BV Hoàn Mỹ Đà Nẵng',
    specialties: 'Đa khoa • Tim mạch • Ngoại khoa',
    address: '291 Nguyễn Văn Linh • Đà Nẵng',
    distance: '7,5 km',
    travelTime: '20 phút',
    rating: 4.8,
    image: require('../../assets/images/hoanmy.jpg'),
    isFavorite: true,
    phone: '0236 3650 676',
    workingHours: 'Thứ Hai – Chủ Nhật • 24/7',
    description: 'Bệnh viện đa khoa tư nhân hàng đầu tại miền Trung với trang thiết bị hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.',
  },
  {
    id: 'hosp-3',
    name: 'BV Gia Đình Đà Nẵng',
    specialties: 'Đa khoa • Nội khoa • Sản khoa',
    address: '73 Nguyễn Hữu Thọ • Đà Nẵng',
    distance: '9,8 km',
    travelTime: '25 phút',
    rating: 4.8,
    image: require('../../assets/images/giadinh.jpg'),
    isFavorite: false,
    phone: '1900 2250',
    workingHours: 'Thứ Hai – Chủ Nhật • 06:30 – 19:30',
    description: 'Chăm sóc sức khỏe toàn diện với phương châm Uy tín - Tận tâm - Thấu hiểu.',
  },
];
