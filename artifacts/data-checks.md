# Data-Layer Checks

## Expected Writes and Schema

I have no database access, so these names are inferred from visible behavior and API fields. The `ask-unauthenticated` request sent the question with an empty `sessionId`; its response returned an assistant message and a non-empty session ID. This shows that the backend associates the exchange with a session, but not whether either message is persisted. If persisted, I would expect a session or conversation entity with ordered message records.

Signup uses Firebase authentication, where email verification is represented by an identity claim. `get-profile` exposes an internal profile, account state, preferred chain, and interests. `user-balance` exposes 100 ASK as **pending**, zero available, zero total earned, chain balances, and a wallet. The preferred chain matched across responses. The UI's 5,000 target was absent, so it may be frontend or configuration data.

Expected application tables and columns:

- `internal_profiles(id, firebase_uid, account_state, preferred_chain, created_at)`
- `user_wallets(id, user_id, address, network_id, chain_id, scope, owner_type, created_at, updated_at)`
- `ask_balances(user_id, pending, available, total_earned, updated_at)`
- `user_chain_balances(user_id, chain_id, permission_ask)`
- `agent_sessions(id, user_id, created_at)`
- `agent_messages(id, session_id, role, content, status, created_at, completed_at)`

The chain-balance table is one normalized option; the API's keyed object could instead be stored as JSON. IDs should be primary keys, relationships should use indexed foreign keys, balances should be non-negative numeric values, and timestamps should be timezone-aware. The observed null wallet timestamps deserve investigation.

## SQL Checks

```sql
-- 1. Confirm a session contains the submitted question and assistant response.
select
  s.id as session_id,
  s.user_id,
  m.id as message_id,
  m.role,
  m.status,
  length(trim(m.content)) as content_length,
  m.created_at,
  m.completed_at
from agent_sessions s
join agent_messages m on m.session_id = s.id
where s.id = :session_id
order by m.created_at, m.id;
```

```sql
-- 2. Confirm signup created an active profile linked to Firebase.
select
  id,
  account_state,
  preferred_chain,
  created_at
from internal_profiles
where firebase_uid = :firebase_uid
  and account_state = 'ACTIVE'
  and created_at is not null;
```

```sql
-- 3. Return orphaned or internally invalid records; expect zero rows.
select 'orphan_message' as issue, m.id::text as record_id
from agent_messages m
left join agent_sessions s on s.id = m.session_id
where s.id is null

union all

select 'invalid_message', m.id::text
from agent_messages m
where trim(coalesce(m.content, '')) = ''
   or m.created_at > now() + interval '5 minutes'
   or (m.status = 'completed' and m.completed_at is null)
   or (m.completed_at is not null and m.completed_at < m.created_at)

union all

select 'invalid_balance', b.user_id::text
from ask_balances b
left join internal_profiles p on p.id = b.user_id
where p.id is null
   or b.pending < 0
   or b.available < 0
   or b.total_earned < 0

union all

select 'orphan_wallet', w.id::text
from user_wallets w
left join internal_profiles p on p.id = w.user_id
where p.id is null

union all

select 'missing_wallet_timestamps', w.id::text
from user_wallets w
where w.created_at is null
   or w.updated_at is null;
```

## Downstream Integrity Check

For each analytics load, compare the message-event row count with `count(distinct message_id)`. Quarantine duplicates and alert when the counts differ; duplicated streaming events would otherwise inflate message volume and engagement metrics.
