-- Visitor content highlight acknowledgements (anonymous, keyed by portfolio_vid cookie).
-- Apply via Supabase SQL Editor or `supabase db push`.

create table if not exists public.visitor_content_seen (
  visitor_id uuid not null,
  slug text not null,
  content_version_ts bigint not null,
  seen_at timestamptz not null default now(),
  primary key (visitor_id, slug)
);

create index if not exists visitor_content_seen_visitor_id_idx
  on public.visitor_content_seen (visitor_id);

alter table public.visitor_content_seen enable row level security;

create policy "anon_select_own_acks"
  on public.visitor_content_seen
  for select
  to anon
  using (true);

create policy "anon_insert_own_acks"
  on public.visitor_content_seen
  for insert
  to anon
  with check (true);

create policy "anon_update_own_acks"
  on public.visitor_content_seen
  for update
  to anon
  using (true)
  with check (true);

create or replace function public.ack_content_seen(
  p_visitor_id uuid,
  p_slug text,
  p_content_version_ts bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.visitor_content_seen (visitor_id, slug, content_version_ts)
  values (p_visitor_id, p_slug, p_content_version_ts)
  on conflict (visitor_id, slug)
  do update set
    content_version_ts = greatest(
      public.visitor_content_seen.content_version_ts,
      excluded.content_version_ts
    ),
    seen_at = now()
  where excluded.content_version_ts >= public.visitor_content_seen.content_version_ts;
end;
$$;

create or replace function public.get_content_acks(p_visitor_id uuid)
returns table(slug text, content_version_ts bigint)
language sql
security definer
stable
set search_path = public
as $$
  select v.slug, v.content_version_ts
  from public.visitor_content_seen v
  where v.visitor_id = p_visitor_id;
$$;

grant execute on function public.ack_content_seen(uuid, text, bigint) to anon;
grant execute on function public.get_content_acks(uuid) to anon;
