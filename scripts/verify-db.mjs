import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(process.argv[2] ?? ".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, "")];
    }),
);

const headers = {
  apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
};

for (const table of ["artworks", "orders", "contact_messages"]) {
  const response = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, { headers });
  const body = await response.text();
  console.log(`${table}: ${response.status} ${response.ok ? "ready" : body.slice(0, 160)}`);
}
