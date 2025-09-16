"use server";

import { db } from "@/db/drizzle";
import { User, users } from "@/db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { withErrorHandler } from "@/utils/withErrorHandler";

export async function getUsers() {
  return withErrorHandler(
    async () => await db.select().from(users),
    "Error fetching users"
  );
}

export async function createUser(
  user: Omit<User, "id" | "createdAt" | "updatedAt">
) {
  return withErrorHandler(
    async () => (await db.insert(users).values(user), { success: true }),

    "Error creating user"
  );
}

export async function updateUser(
  id: string,
  user: Omit<User, "id" | "createdAt" | "updatedAt">
) {
  return withErrorHandler(
    async () => (
      await db.update(users).set(user).where(eq(users.id, id)),
      { success: true }
    ),
    "Error updating user"
  );
}

export async function deleteUser(id: string) {
  return withErrorHandler(
    async () => (
      await db.delete(users).where(eq(users.id, id)), { success: true }
    ),
    "Error deleting user"
  );
}
