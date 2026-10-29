-- ========================================================
-- PHÂN QUYỀN VAI TRÒ (RBAC) & TÀI KHOẢN ADMIN TRÊN SUPABASE
-- Chạy đoạn mã này trong: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Thêm cột vai trò (role) vào bảng profiles
alter table public.profiles 
  add column if not exists role text not null default 'patient' check (role in ('patient', 'doctor', 'admin'));

-- 2. Cập nhật Trigger tự động gán role khi đăng ký mới
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Nguyễn An'),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = coalesce(excluded.role, profiles.role);
  
  -- Tự động tạo ví tiền ban đầu với số dư 500.000 đ nếu chưa có
  insert into public.wallets (user_id, balance)
  values (new.id, 500000)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- 3. Hàm kiểm tra quyền Admin an toàn (Security Definer)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 4. BỔ SUNG & CẬP NHẬT RLS POLICIES CHO PHÂN QUYỀN

-- Bảng profiles: Admin được xem và cập nhật tất cả hồ sơ; Người dùng chỉ xem/sửa hồ sơ mình
drop policy if exists "Người dùng có thể xem hồ sơ của mình" on public.profiles;
create policy "Người dùng có thể xem hồ sơ của mình"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Người dùng có thể cập nhật hồ sơ của mình" on public.profiles;
create policy "Người dùng có thể cập nhật hồ sơ của mình"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- Bảng appointments: Admin được xem, duyệt, đổi trạng thái và hủy mọi lịch khám
drop policy if exists "Người dùng xem lịch khám của chính mình" on public.appointments;
create policy "Người dùng xem lịch khám của chính mình"
  on public.appointments for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Người dùng có thể hủy lịch khám của mình" on public.appointments;
create policy "Người dùng có thể hủy lịch khám của mình"
  on public.appointments for update
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admin có thể xóa lịch khám" on public.appointments;
create policy "Admin có thể xóa lịch khám"
  on public.appointments for delete
  using (public.is_admin());

-- Bảng doctors: Admin có quyền Thêm, Sửa, Xóa bác sĩ
drop policy if exists "Admin có thể thêm bác sĩ" on public.doctors;
create policy "Admin có thể thêm bác sĩ"
  on public.doctors for insert
  with check (public.is_admin());

drop policy if exists "Admin có thể sửa bác sĩ" on public.doctors;
create policy "Admin có thể sửa bác sĩ"
  on public.doctors for update
  using (public.is_admin());

drop policy if exists "Admin có thể xóa bác sĩ" on public.doctors;
create policy "Admin có thể xóa bác sĩ"
  on public.doctors for delete
  using (public.is_admin());

-- Bảng hospitals: Admin có quyền Thêm, Sửa, Xóa bệnh viện
drop policy if exists "Admin có thể thêm bệnh viện" on public.hospitals;
create policy "Admin có thể thêm bệnh viện"
  on public.hospitals for insert
  with check (public.is_admin());

drop policy if exists "Admin có thể sửa bệnh viện" on public.hospitals;
create policy "Admin có thể sửa bệnh viện"
  on public.hospitals for update
  using (public.is_admin());

drop policy if exists "Admin có thể xóa bệnh viện" on public.hospitals;
create policy "Admin có thể xóa bệnh viện"
  on public.hospitals for delete
  using (public.is_admin());

-- 5. LỆNH GÁN TÀI KHOẢN LÀM ADMIN (QUẢN TRỊ VIÊN)
-- Gán quyền admin cho tài khoản email đã tạo hoặc các tài khoản quản trị:
update public.profiles
set role = 'admin'
where email in (
  'admin@doctorapp.com',
  'nguyennt2.23itb@vku.udn.vn',
  'patient.test.app.2026@gmail.com'
);
