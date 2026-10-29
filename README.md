# DOCTOR APPOINTMENT - Ứng Dụng Y Tế & Đặt Lịch Khám (React Native + Supabase)

Dự án mobile app hoàn chỉnh được code từ bản thiết kế Figma SVG (`Untitled.svg`), tích hợp backend & database **Supabase** cho Đăng ký, Đăng nhập, Quản lý tài khoản, Lịch hẹn và Ví tiền.

---

## 🗄️ Cấu hình Backend & Database Supabase

### Bước 1: Tạo dự án Supabase
1. Truy cập [https://supabase.com](https://supabase.com) và đăng ký / đăng nhập tài khoản miễn phí.
2. Nhấn **New Project** (Đặt tên dự án: `DoctorAppointment`, chọn mật khẩu database và khu vực gần nhất như Singapore).

### Bước 2: Khởi tạo Database (SQL Script)
1. Trong dashboard của Supabase, mở menu **SQL Editor** ở cột bên trái.
2. Nhấn **New Query**.
3. Mở file [`supabase_schema.sql`](./supabase_schema.sql) trong thư mục dự án này, copy toàn bộ nội dung và dán vào SQL Editor.
4. Nhấn nút **Run** (Ctrl + Enter).
   - Script sẽ tự động tạo các bảng: `profiles`, `hospitals`, `doctors`, `appointments`, `wallets`, `wallet_transactions`.
   - Thiết lập Trigger tự động tạo profile và ví tiền (số dư 500.000 đ) khi người dùng đăng ký tài khoản mới.
   - Bật Row Level Security (RLS) bảo mật dữ liệu riêng tư từng người dùng.
   - Nạp sẵn dữ liệu mẫu về các bác sĩ và bệnh viện từ thiết kế Figma.

### Bước 3: Kết nối API Key vào App
1. Trong Supabase Dashboard, vào **Project Settings** -> **API**.
2. Sao chép **Project URL** và **anon public key**.
3. Tạo file `.env` tại thư mục gốc `DoctorAppointment/` (dựa trên mẫu [`.env.example`](./.env.example)):
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
*(Hoặc dán trực tiếp vào file [`src/services/supabase.ts`](./src/services/supabase.ts))*

> **Lưu ý:** Khi chưa điền Supabase Key, ứng dụng sẽ tự động chạy ở **Chế độ Demo Local** giúp bạn test giao diện mượt mà mà không lo bị crash!

---

## 🔐 Luồng Xác thực (Authentication Flow)

- **Đăng ký ([`RegisterScreen.tsx`](./src/screens/RegisterScreen.tsx)):**
  - Tự động gọi `supabase.auth.signUp()` với Họ tên, Email, Mật khẩu.
  - Tự động tạo hồ sơ trong bảng `profiles` và cấp ví ban đầu trong bảng `wallets`.
- **Đăng nhập ([`LoginScreen.tsx`](./src/screens/LoginScreen.tsx)):**
  - Đăng nhập bằng `supabase.auth.signInWithPassword()`.
  - Hiển thị spinner khi tải và báo lỗi chi tiết khi sai mật khẩu.
  - Lưu phiên đăng nhập an toàn bằng `@react-native-async-storage/async-storage`.
- **Xác thực OTP ([`OtpScreen.tsx`](./src/screens/OtpScreen.tsx)):**
  - Nhập 6 số mã xác thực email gửi từ Supabase `verifyOtp()`.
  - Hỗ trợ nút gửi lại mã OTP.
- **Quản lý phiên ([`AuthContext.tsx`](./src/context/AuthContext.tsx)):**
  - Lắng nghe trạng thái đăng nhập/đăng xuất thời gian thực `supabase.auth.onAuthStateChange`.
  - Cung cấp thông tin người dùng `user`, `profile` trên toàn ứng dụng.
- **Đăng xuất ([`ProfileScreen.tsx`](./src/screens/ProfileScreen.tsx)):**
  - Gọi `supabase.auth.signOut()` và đưa người dùng về màn hình đăng nhập.

---

## 📱 Khởi chạy ứng dụng

```bash
cd d:\appUIUX\DoctorAppointment
```

- **Chạy trên Web:** `npm run web`
- **Chạy trên điện thoại qua Expo Go:** `npx expo start`
- **Chạy trên máy ảo Android:** `npm run android`


---

## 👑 Phân Quyền Vai Trò (RBAC) & Trung Tâm Quản Trị (Admin Portal)

Dự án hỗ trợ hệ thống phân quyền chuyên sâu:
- **`patient` (Bệnh nhân):** Xem danh sách bác sĩ/bệnh viện, đặt lịch khám, quản lý lịch của mình, nạp ví cá nhân.
- **`admin` (Quản trị viên):** Có toàn quyền xem và điều hành hệ thống:
  - 📊 **Thống kê KPI:** Tổng số người dùng, bác sĩ, lịch hẹn và tổng doanh thu.
  - 📅 **Quản lý lịch khám:** Xem tất cả lịch khám toàn hệ thống, duyệt nhanh (`Duyệt` / `Hoàn tất` / `Hủy`).
  - 👨‍⚕️ **Quản lý bác sĩ:** Thêm bác sĩ mới, cập nhật thông tin hoặc xóa bác sĩ.
  - 🏥 **Quản lý bệnh viện:** Thêm cơ sở y tế và bệnh viện mới.
  - 👥 **Quản lý người dùng & phân quyền:** Cấp quyền Quản trị viên (Admin) hoặc hạ quyền xuống Bệnh nhân.

### Kích hoạt tài khoản Admin trên Supabase Database
1. Mở **Supabase Dashboard** -> menu **SQL Editor**.
2. Chạy nội dung file [`supabase_admin_rbac.sql`](./supabase_admin_rbac.sql).
3. Script sẽ tự động bổ sung cột `role`, hàm bảo mật `public.is_admin()`, thiết lập các chính sách RLS nâng cao và gán quyền Admin cho tài khoản của bạn.
