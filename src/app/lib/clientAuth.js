export async function fetchCurrentUser() {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return { authenticated: false };
  return res.json();
}


