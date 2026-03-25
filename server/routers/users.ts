import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_app";
import { accessControl, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const usersRouter = router({
  getAdminUsers: protectedProcedure
    .input(z.void())
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Apenas administradores podem acessar esta funcionalidade." });
      }
      const db = await ctx.db;
      const allUsers = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.fullName,
          role: users.role,
          isApproved: accessControl.isApproved,
        })
        .from(users)
        .leftJoin(accessControl, eq(users.email, accessControl.email));

      return { users: allUsers };
    }),

  updateUserApproval: protectedProcedure
    .input(z.object({
      userId: z.number(),
      isApproved: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Apenas administradores podem aprovar usuários." });
      }
      const db = await ctx.db;
      const userToUpdate = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);

      if (userToUpdate.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });
      }

      await db.update(accessControl)
        .set({ isApproved: input.isApproved, updatedAt: new Date() })
        .where(eq(accessControl.email, userToUpdate[0].email));

      return { success: true };
    }),

  updateUserRole: protectedProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(["user", "professional", "admin"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Apenas administradores podem alterar funções de usuários." });
      }
      const db = await ctx.db;
      const userToUpdate = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);

      if (userToUpdate.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });
      }

      await db.update(users)
        .set({ role: input.role, updatedAt: new Date() })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),
});
