import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { useAppSession } from "../utils/session";
import { client, subjects } from "../utils/auth-client";

export const auth = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const session = await useAppSession();
    const tokens = session.data;

    console.log("[AUTH] Checking session, has tokens:", !!tokens?.access);

    if (!tokens?.access) {
      return null;
    }

    try {
      const verified = await client.verify(subjects, tokens.access, {
        refresh: tokens.refresh,
      });

      if (verified.err) {
        // console.log("[AUTH] Token verification failed:", verified.err);
        console.log("[AUTH] User verification failed, clearing session...");
        await session.clear();
        return null;
      }

      if (verified.tokens) {
        await session.update({
          access: verified.tokens.access,
          refresh: verified.tokens.refresh,
        });
      }

      // console.log("[AUTH] User authenticated:", verified.subject?.properties?.id);
      console.log("[AUTH] User authenticated:", verified.subject?.properties?.id);
      return verified.subject;
    } catch (err) {
      // console.log("[AUTH] Verify threw error:", err);
      throw err;
    }
  } catch (error) {
    // console.error("[AUTH] Error checking auth:", error);
    return null;
  }
});

export const login = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  const headers = request!.headers;
  const host = headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const { url } = await client.authorize(
    `${origin}/auth/callback`,
    "code"
  );
  return { url };
});

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
  throw redirect({ to: "/" });
});

export const exchange = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    const request = getRequest();
    const headers = request!.headers;
    const host = headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    const exchanged = await client.exchange(data.code, `${origin}/auth/callback`);
    
    if (exchanged.err) {
      console.error("Token exchange failed:", exchanged.err);
      throw new Error(`Token exchange failed: ${JSON.stringify(exchanged.err)}`);
    }

    const session = await useAppSession();
    await session.update({
      access: exchanged.tokens.access,
      refresh: exchanged.tokens.refresh,
    });
    
    const saved = session.data;
    console.log("[EXCHANGE] Session saved, has access token:", !!saved?.access);
    if (!saved?.access) {
      console.error("[EXCHANGE] Session not saved correctly");
      throw new Error("Failed to save session");
    }

    console.log("[EXCHANGE] Redirecting to /");
    throw redirect({ to: "/" });
  });

