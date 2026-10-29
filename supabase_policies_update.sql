-- ========================================================
-- BỔ SUNG POLICIES & BẢNG WALLET_TRANSACTIONS CHO SUPABASE
-- Chạy đoạn mã này trong: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Bổ sung quyền cập nhật và nạp tiền cho ví (wallets)
drop policy if exists "Người dùng có thể cập nhật ví của mình" on public.wallets;
create policy "Người dùng có thể cập nhật ví của mình"
  on public.wallets for update
  using (auth.uid() = user_id);

drop policy if exists "Người dùng có thể tạo ví" on public.wallets;
create policy "Người dùng có thể tạo ví"
  on public.wallets for insert
  with check (auth.uid() = user_id);

-- 2. Bổ sung quyền tạo hồ sơ người dùng nếu cần
drop policy if exists "Người dùng có thể tạo hồ sơ" on public.profiles;
create policy "Người dùng có thể tạo hồ sơ"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 3. Tạo bảng lịch sử giao dịch ví (wallet_transactions)
create table if not exists public.wallet_transactions (
  id uuid default gen_random_uuid() primary key,
  wallet_id uuid references public.wallets(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  amount numeric(12,0) not null,
  type text not null check (type in ('top_up', 'payment')),
  current_balance numeric(12,0) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.wallet_transactions enable row level security;

drop policy if exists "Người dùng xem giao dịch của mình" on public.wallet_transactions;
create policy "Người dùng xem giao dịch của mình"
  on public.wallet_transactions for select using (auth.uid() = user_id);

drop policy if exists "Người dùng tạo giao dịch của mình" on public.wallet_transactions;
create policy "Người dùng tạo giao dịch của mình"
  on public.wallet_transactions for insert with check (auth.uid() = user_id);
