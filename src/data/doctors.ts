export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviewsCount: number;
  patientsCount: string;
  experienceYears: number;
  bio: string;
  avatar: any;
  fee: number;
  isFavorite?: boolean;
}

export const doctorsData: Doctor[] = [
  {
    id: 'doc-1',
    name: 'BS. Nguyễn Quốc Việt',
    specialty: 'Tim mạch',
    hospital: 'Vinmec Đà Nẵng',
    rating: 4.9,
    reviewsCount: 53,
    patientsCount: '3.500+',
    experienceYears: 10,
    bio: 'Bác sĩ chuyên khoa Tim mạch tại Vinmec Đà Nẵng, khám và tư vấn sức khỏe tim mạch cho người lớn.',
    avatar: require('../../assets/images/doctor_viet.jpg'),
    fee: 200000,
    isFavorite: true,
  },
  {
    id: 'doc-2',
    name: 'BS. Lê Thị Diệu Hằng',
    specialty: 'Sản phụ khoa',
    hospital: 'BV Hoàn Mỹ Đà Nẵng',
    rating: 4.9,
    reviewsCount: 53,
    patientsCount: '2.800+',
    experienceYears: 8,
    bio: 'Chuyên gia sản phụ khoa giàu kinh nghiệm trong theo dõi thai kỳ và chăm sóc sức khỏe phụ nữ.',
    avatar: require('../../assets/images/doctor_hang.jpg'),
    fee: 180000,
    isFavorite: true,
  },
  {
    id: 'doc-3',
    name: 'BS. Nguyễn Thị Mỹ',
    specialty: 'Nội tổng quát',
    hospital: 'BV Gia Đình Đà Nẵng',
    rating: 4.9,
    reviewsCount: 53,
    patientsCount: '4.100+',
    experienceYears: 12,
    bio: 'Bác sĩ chuyên khoa Nội tổng quát, chẩn đoán và điều trị các bệnh lý mãn tính và tầm soát sức khỏe.',
    avatar: require('../../assets/images/doctor_my.jpg'),
    fee: 200000,
    isFavorite: true,
  },
  {
    id: 'doc-4',
    name: 'BS. Nguyễn Công Cảnh',
    specialty: 'Nhi khoa',
    hospital: 'BV Phụ sản - Nhi Đà Nẵng',
    rating: 4.9,
    reviewsCount: 53,
    patientsCount: '3.200+',
    experienceYears: 9,
    bio: 'Bác sĩ chuyên khoa Nhi với nhiều năm chăm sóc và tư vấn dinh dưỡng, bệnh lý hô hấp cho trẻ nhỏ.',
    avatar: require('../../assets/images/doctor_canh.jpg'),
    fee: 190000,
    isFavorite: false,
  },
];
