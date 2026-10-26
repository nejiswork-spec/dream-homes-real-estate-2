-- Apply in the intended Supabase SQL editor. Idempotent for this project schema.
create table if not exists public.properties (
 id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), name text not null, location text not null,
 city text not null, type text not null, price numeric not null check(price >= 0),
 beds integer not null check(beds >= 0), baths integer not null check(baths >= 0), area numeric not null check(area >= 0),
 image text not null check(image ~ '^https://'), purpose text not null check(purpose in ('Buy','Rent')),
 description text not null, published boolean not null default false, created_at timestamptz not null default now()
);
alter table public.properties add column if not exists images jsonb not null default '[]'::jsonb;
alter table public.properties add column if not exists amenities jsonb not null default '[]'::jsonb;
alter table public.properties add column if not exists neighbourhood text not null default '';
alter table public.properties add column if not exists documentation text not null default '';
alter table public.properties add column if not exists availability text not null default 'Unconfirmed' check (availability in ('Available','Under offer','Sold','Let','Unconfirmed'));
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
revoke all on private.admin_users from public, anon, authenticated;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from private.admin_users where user_id=(select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
alter table public.properties enable row level security;
revoke all on public.properties from anon, authenticated;
grant select on public.properties to anon;
grant select, insert, update on public.properties to authenticated;
drop policy if exists "Read published properties" on public.properties;
create policy "Read published properties" on public.properties for select to anon,authenticated using (published=true);
drop policy if exists "Admins read properties" on public.properties;
create policy "Admins read properties" on public.properties for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins add properties" on public.properties;
create policy "Admins add properties" on public.properties for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "Admins edit properties" on public.properties;
create policy "Admins edit properties" on public.properties for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create index if not exists properties_public_filters on public.properties(city,type,price) where published=true;
-- Public photos only. Never upload ownership documents or private client files here.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('property-images','property-images',true,6291456,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
drop policy if exists "Admins upload property photos" on storage.objects;
create policy "Admins upload property photos" on storage.objects for insert to authenticated with check(bucket_id='property-images' and (select public.is_admin()));
drop policy if exists "Admins read property photos" on storage.objects;
create policy "Admins read property photos" on storage.objects for select to authenticated using(bucket_id='property-images' and (select public.is_admin()));
create table if not exists public.enquiries (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(name) between 2 and 100),
 email text not null check(length(email) between 3 and 254),
 phone text check(length(phone)<=30),
 intent text not null check(intent in ('Buy','Rent','Sell','Viewing')),
 message text not null check(length(message) between 10 and 3000),
 property_id text references public.properties(id) on delete set null,
 preferred_date date, consent boolean not null check(consent=true),
 status text not null default 'New' check(status in ('New','Contacted','Closed')),
 created_at timestamptz not null default now()
);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;
grant select on public.enquiries to authenticated;
grant update(status) on public.enquiries to authenticated;
drop policy if exists "Admins read enquiries" on public.enquiries;
create policy "Admins read enquiries" on public.enquiries for select to authenticated using((select public.is_admin()));
drop policy if exists "Admins update enquiry status" on public.enquiries;
create policy "Admins update enquiry status" on public.enquiries for update to authenticated using((select public.is_admin())) with check((select public.is_admin()));
create table if not exists private.enquiry_limits(key text primary key, count integer not null, expires_at timestamptz not null);
revoke all on private.enquiry_limits from public, anon, authenticated;
-- Called only by the Edge Function's service-role credential. Rate checks and insert are one transaction.
create or replace function public.receive_enquiry(payload jsonb, client_hash text, email_hash text) returns uuid language plpgsql security definer set search_path='' as $$
declare n integer; result uuid; ip_key text; email_key text; global_key text;
begin
 if client_hash !~ '^[a-f0-9]{64}$' or email_hash !~ '^[a-f0-9]{64}$' then raise exception 'INVALID_REQUEST'; end if;
 perform pg_advisory_xact_lock(473286193);
 delete from private.enquiry_limits where expires_at<now();
 ip_key := 'ip:'||client_hash||':'||floor(extract(epoch from now())/900)::text;
 email_key := 'email:'||email_hash||':'||floor(extract(epoch from now())/3600)::text;
 global_key := 'global:'||floor(extract(epoch from now())/3600)::text;
 insert into private.enquiry_limits values(ip_key,1,now()+interval '1 hour') on conflict(key) do update set count=private.enquiry_limits.count+1 returning count into n;
 if n>5 then raise exception 'RATE_LIMIT'; end if;
 insert into private.enquiry_limits values(email_key,1,now()+interval '2 hours') on conflict(key) do update set count=private.enquiry_limits.count+1 returning count into n;
 if n>5 then raise exception 'RATE_LIMIT'; end if;
 insert into private.enquiry_limits values(global_key,1,now()+interval '2 hours') on conflict(key) do update set count=private.enquiry_limits.count+1 returning count into n;
 if n>1000 then raise exception 'RATE_LIMIT'; end if;
 if nullif(payload->>'property_id','') is not null and not exists(select 1 from public.properties where id=payload->>'property_id' and published=true) then raise exception 'INVALID_PROPERTY'; end if;
 insert into public.enquiries(name,email,phone,intent,message,property_id,preferred_date,consent)
 values(payload->>'name',payload->>'email',nullif(payload->>'phone',''),payload->>'intent',payload->>'message',nullif(payload->>'property_id',''),nullif(payload->>'preferred_date','')::date,(payload->>'consent')::boolean) returning id into result;
 return result;
end;
$$;
revoke all on function public.receive_enquiry(jsonb,text,text) from public,anon,authenticated;
grant execute on function public.receive_enquiry(jsonb,text,text) to service_role;
-- Authorise an existing, verified Auth user manually as project owner:
-- insert into private.admin_users(user_id) values ('REPLACE_WITH_APPROVED_AUTH_USER_UUID');
