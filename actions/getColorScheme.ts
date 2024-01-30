"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getColorScheme(userId: string) {
  if (!userId) return;
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        colorScheme: true,
      },
    });

    revalidatePath("/", "layout");
    return data;
  } catch (error) {
    console.log("Error in Getting User Data");
  }
}
