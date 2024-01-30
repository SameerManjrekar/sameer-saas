"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateUser(
  userId: string,
  name: string,
  colorScheme: string
) {
  if (!userId) return;
  try {
    const data = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        colorScheme,
      },
      select: {
        name: true,
        colorScheme: true,
      },
    });

    revalidatePath("/", "layout");
    return data;
  } catch (error) {
    console.log("Error in Updating User Data");
  }
}
