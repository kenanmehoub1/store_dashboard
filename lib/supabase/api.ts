// lib/supabase/api.ts
// Helper to call Supabase REST API from server

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getHeaders() {
  return {
    apikey: ANON_KEY!,
    Authorization: `Bearer ${ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export async function supabaseGet(table: string, query = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ""}`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    const errBody = await res.text();
    console.error("Supabase GET error:", res.status, errBody);
    throw new Error(`GET ${table} failed: ${res.status} - ${errBody}`);
  }
  return res.json();
}

export async function supabasePost(table: string, body: object) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    console.error("Supabase POST error:", res.status, errBody);
    throw new Error(`POST ${table} failed: ${res.status} - ${errBody}`);
  }
  return res.json();
}

export async function supabasePatch(
  table: string,
  query: string,
  body: object
) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${table} failed: ${res.status}`);
  return res.json();
}

export async function supabaseDelete(table: string, query: string) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`DELETE ${table} failed: ${res.status}`);
  return res.json();
}
