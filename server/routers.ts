import { z } from "zod";

import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM, listLLMModels } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { selectManagedModelFromCatalog } from "./assistant-policy";
import { consumeChatRequest } from "./assistant-rate-limit";

const chatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(10),
  language: z.enum(["en-IN", "hi-IN"]),
});

async function selectManagedModel() {
  const { data } = await listLLMModels();
  return selectManagedModelFromCatalog(data);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  assistant: router({
    chat: publicProcedure.input(chatInput).mutation(async ({ input, ctx }) => {
      try {
        const forwarded = ctx.req.headers["x-forwarded-for"];
        const clientKey = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]?.trim() || "anonymous";
        if (!consumeChatRequest(clientKey)) {
          throw new Error("Too many assistant requests. Please wait a minute and try again.");
        }
        const model = await selectManagedModel();
        const response = await invokeLLM({
          model,
          maxTokens: 700,
          messages: [
            {
              role: "system",
              content: `You are My AI Assistant, a careful mobile assistant. Reply in ${input.language === "hi-IN" ? "clear Hindi (use English technical terms only when helpful)" : "clear English"}. Be concise, accurate, and transparent about uncertainty. You can help draft, explain, plan, and reason, but you cannot access websites, external accounts, personal files, GitHub, email, calendars, payments, or device controls in this conversation. Never claim that an action was performed when it was not. If an external action is requested, explain that it needs an explicitly configured integration and user approval. Do not request passwords, tokens, or secret keys.`,
            },
            ...input.messages,
          ],
        });
        const rawContent = response.choices[0]?.message?.content;
        const content = typeof rawContent === "string" ? rawContent.trim() : "";
        if (!content) throw new Error("The managed provider returned no content.");
        return { content, provider: "managed" as const, model };
      } catch {
        throw new Error("The managed assistant is unavailable right now. Please try again later.");
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
