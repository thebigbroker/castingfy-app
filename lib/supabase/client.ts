import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/constants";

export function createClient() {
  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          const value = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${name}=`))
            ?.split("=")[1];
          return value;
        },
        set(name: string, value: string, options) {
          document.cookie = `${name}=${value}; path=/; ${
            options?.maxAge ? `max-age=${options.maxAge};` : ""
          } ${options?.sameSite ? `samesite=${options.sameSite};` : "samesite=lax;"}`;
        },
        remove(name: string, options) {
          document.cookie = `${name}=; path=/; max-age=0; ${
            options?.sameSite ? `samesite=${options.sameSite};` : "samesite=lax;"
          }`;
        },
      },
    }
  );
}
