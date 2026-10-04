begin;
create extension if not exists pgtap with schema extensions;
select plan(4);

-- duas alunas
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@teste.com'),
  ('00000000-0000-0000-0000-00000000000b', 'b@teste.com');

select is((select count(*) from public.perfis)::int, 2, 'trigger cria um perfil por usuário');

-- age como a aluna A
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a"}';

select is((select count(*) from public.perfis)::int, 1, 'aluna A só enxerga o próprio perfil');
select is(public.eh_admin(), false, 'aluna A não é admin');
select throws_ok(
  $$ update public.perfis set papel = 'admin' where id = '00000000-0000-0000-0000-00000000000a' $$,
  '42501',
  null,
  'aluna não consegue se promover a admin'
);

select * from finish();
rollback;
