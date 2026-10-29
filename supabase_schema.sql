-- ========================================================
-- SCHEMA DATABASE CHO APP DOCTOR APPOINTMENT TRÊN SUPABASE
-- Chạy toàn bộ đoạn mã này trong: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text,
  phone text,
  gender text default 'Nữ',
  age text default '26 tuổi',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bật Row Level Security (RLS) cho profiles
alter table public.profiles enable row level security;

create policy "Người dùng có thể xem hồ sơ của mình"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Người dùng có thể cập nhật hồ sơ của mình"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. TRIGGER TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ USER MỚI QUA AUTH
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Nguyễn An'),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );
  
  -- Tự động tạo ví tiền ban đầu với số dư 500.000 đ
  insert into public.wallets (user_id, balance)
  values (new.id, 500000);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger gắn vào auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. BẢNG BỆNH VIỆN (HOSPITALS)
create table if not exists public.hospitals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialties text not null,
  address text not null,
  distance text not null,
  travel_time text not null,
  rating numeric(2,1) default 4.8,
  image_url text,
  phone text,
  working_hours text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hospitals enable row level security;
create policy "Công khai cho mọi người xem danh sách bệnh viện"
  on public.hospitals for select using (true);

-- 4. BẢNG BÁC SĨ (DOCTORS)
create table if not exists public.doctors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialty text not null,
  hospital_id uuid references public.hospitals(id) on delete set null,
  hospital_name text,
  rating numeric(2,1) default 4.9,
  reviews_count integer default 53,
  patients_count text default '3.500+',
  experience_years integer default 10,
  bio text,
  fee numeric(12,0) default 200000,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.doctors enable row level security;
create policy "Công khai cho mọi người xem danh sách bác sĩ"
  on public.doctors for select using (true);

-- 5. BẢNG LỊCH HẸN KHÁM (APPOINTMENTS)
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  user_id uuid references auth.users(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete cascade,
  doctor_name text not null,
  specialty text not null,
  hospital_name text,
  appointment_date text not null,
  appointment_time text not null,
  consultation_type text not null check (consultation_type in ('video', 'voice', 'in_person')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  fee numeric(12,0) not null,
  patient_name text not null,
  patient_gender text,
  patient_age text,
  patient_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;

create policy "Người dùng xem lịch khám của chính mình"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "Người dùng có thể tạo lịch khám"
  on public.appointments for insert
  with check (auth.uid() = user_id);

create policy "Người dùng có thể hủy lịch khám của mình"
  on public.appointments for update
  using (auth.uid() = user_id);

-- 6. BẢNG VÍ TIỀN (WALLETS) & GIAO DỊCH (WALLET_TRANSACTIONS)
create table if not exists public.wallets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  balance numeric(12,0) default 500000 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.wallets enable row level security;
create policy "Người dùng có thể xem ví của mình"
  on public.wallets for select using (auth.uid() = user_id);

create table if not exists public.wallet_transactions (
  id uuid default gen_random_uuid() primary key,
  wallet_id uuid references public.wallets(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  amount numeric(12,0) not null,
  type text not null check (type in ('top_up', 'payment')),
  current_balance numeric(12,0) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.wallet_transactions enable row level security;
create policy "Người dùng xem giao dịch của mình"
  on public.wallet_transactions for select using (auth.uid() = user_id);

-- ========================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ========================================================
insert into public.hospitals (name, specialties, address, distance, travel_time, rating, phone, working_hours, description)
values 
  ('Vinmec Đà Nẵng', 'Đa khoa • Tim mạch • Xét nghiệm', 'Đường 30 Tháng 4, Đà Nẵng', '3,5 km', '15 phút', 4.8, '0236 3711 111', 'Thứ Hai – Thứ Bảy • 07:00 – 18:00', 'Cơ sở khám chữa bệnh đa khoa quốc tế hàng đầu.'),
  ('BV Hoàn Mỹ Đà Nẵng', 'Đa khoa • Tim mạch • Ngoại khoa', '291 Nguyễn Văn Linh • Đà Nẵng', '7,5 km', '20 phút', 4.8, '0236 3650 676', '24/7', 'Bệnh viện đa khoa tư nhân hàng đầu tại miền Trung.'),
  ('BV Gia Đình Đà Nẵng', 'Đa khoa • Nội khoa • Sản khoa', '73 Nguyễn Hữu Thọ • Đà Nẵng', '9,8 km', '25 phút', 4.8, '1900 2250', '06:30 – 19:30', 'Chăm sóc sức khỏe toàn diện với phương châm Uy tín - Tận tâm.');

insert into public.doctors (name, specialty, hospital_name, rating, reviews_count, patients_count, experience_years, bio, fee)
values
  ('BS. Nguyễn Quốc Việt', 'Tim mạch', 'Vinmec Đà Nẵng', 4.9, 53, '3.500+', 10, 'Bác sĩ chuyên khoa Tim mạch tại Vinmec Đà Nẵng, khám và tư vấn sức khỏe tim mạch cho người lớn.', 200000),
  ('BS. Lê Thị Diệu Hằng', 'Sản phụ khoa', 'BV Hoàn Mỹ Đà Nẵng', 4.9, 53, '2.800+', 8, 'Chuyên gia sản phụ khoa giàu kinh nghiệm trong theo dõi thai kỳ và chăm sóc sức khỏe phụ nữ.', 180000),
  ('BS. Nguyễn Thị Mỹ', 'Nội tổng quát', 'BV Gia Đình Đà Nẵng', 4.9, 53, '4.100+', 12, 'Bác sĩ chuyên khoa Nội tổng quát, chẩn đoán và điều trị các bệnh lý mãn tính.', 200000),
  ('BS. Nguyễn Công Cảnh', 'Nhi khoa', 'BV Phụ sản - Nhi Đà Nẵng', 4.9, 53, '3.200+', 9, 'Bác sĩ chuyên khoa Nhi với nhiều năm chăm sóc và tư vấn dinh dưỡng, bệnh lý nhi khoa.', 190000);
