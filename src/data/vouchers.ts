export interface Voucher {
  id: string;
  code: string;
  title: string;
  condition: string;
  discount: string;
}

export const vouchersData: Voucher[] = [
  {
    id: 'v1',
    code: 'FIRSTCARE',
    title: 'FIRSTCARE',
    condition: 'Nạp thêm 100.000 đ để nhận ưu đãi',
    discount: 'Giảm 50%',
  },
  {
    id: 'v2',
    code: 'WELCOME24',
    title: 'WELCOME24',
    condition: 'Dành cho lần đặt lịch đầu tiên',
    discount: 'Hoàn đến 50.000 đ',
  },
  {
    id: 'v3',
    code: 'NEWPATIENT',
    title: 'NEWPATIENT',
    condition: 'Ưu đãi dành cho bệnh nhân mới',
    discount: 'Giảm 25%',
  },
  {
    id: 'v4',
    code: 'HEALTHFIRST',
    title: 'HEALTHFIRST',
    condition: 'Áp dụng cho dịch vụ chăm sóc sức khỏe',
    discount: 'Giảm 20%',
  },
];

export interface LabTest {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  category: 'general' | 'specialized';
  categoryLabel: string;
}

export const labTestsData: LabTest[] = [
  {
    id: 't1',
    title: 'Gói xét nghiệm tổng quát',
    subtitle: '3 nhóm chỉ số • Lấy mẫu máu',
    price: 650000,
    category: 'general',
    categoryLabel: 'Tổng quát',
  },
  {
    id: 't2',
    title: 'Xét nghiệm đường huyết',
    subtitle: 'Chỉ số đường huyết • Lấy mẫu máu',
    price: 120000,
    category: 'general',
    categoryLabel: 'Tổng quát',
  },
  {
    id: 't3',
    title: 'Gói chức năng gan',
    subtitle: 'Các chỉ số chức năng gan',
    price: 300000,
    category: 'specialized',
    categoryLabel: 'Chuyên sâu',
  },
];
