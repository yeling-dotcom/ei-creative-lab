create extension if not exists pgcrypto;

create table if not exists artworks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  description text,
  image_url text not null,
  category text not null default 'illustration',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  product_type text not null check (product_type in ('chibi_portrait', 'sticker_pack')),
  brief text not null,
  reference_url text,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 100),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'deposit_paid', 'paid', 'refunded')),
  order_status text not null default 'new' check (order_status in ('new', 'reviewing', 'in_progress', 'proof_ready', 'completed', 'cancelled')),
  quoted_amount numeric(10,2),
  owner_notes text
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sender_name text not null,
  sender_email text not null,
  message text not null,
  is_read boolean not null default false
);

alter table artworks enable row level security;
alter table orders enable row level security;
alter table contact_messages enable row level security;

create policy "artworks_public_read" on artworks for select using (is_published = true);
create policy "artworks_demo_manage" on artworks for all using (true) with check (true);
create policy "orders_public_create" on orders for insert with check (true);
create policy "orders_demo_manage" on orders for all using (true) with check (true);
create policy "contact_public_create" on contact_messages for insert with check (true);
create policy "contact_demo_manage" on contact_messages for all using (true) with check (true);

insert into artworks (title, slug, description, image_url, category, is_featured, sort_order)
values
  ('Moonlight Baker', 'moonlight-baker', 'A tiny baker serving warm pastries beneath a sleepy crescent moon.', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200', 'chibi', true, 1),
  ('Garden Friends', 'garden-friends', 'A cheerful sticker family inspired by tropical leaves and curious pets.', 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1200', 'stickers', true, 2),
  ('Cloud Collector', 'cloud-collector', 'Soft pastel character study for a personal portrait commission.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200', 'portrait', false, 3)
on conflict (slug) do nothing;
