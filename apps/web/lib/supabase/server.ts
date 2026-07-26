import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (
        items: Array<{
          name: string;
          value: string;
          options: Parameters<typeof cookieStore.set>[2];
        }>,
      ) => {
        try {
          items.forEach(({ name, value, options }) => {
            if (options) {
              cookieStore.set(name, value, options);
            } else {
              cookieStore.set(name, value);
            }
          });
        } catch {
          // Server Components cannot always write cookies. Middleware will refresh sessions later.
        }
      },
    },
  });
}
