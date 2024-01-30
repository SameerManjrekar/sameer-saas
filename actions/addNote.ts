"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addNote(
  userId: string,
  title: string,
  description: string
) {
  try {
    if (!userId) throw new Error("UserId is undefined");
    const data = await prisma.note.create({
      data: {
        title,
        description,
        userId,
      },
    });

    revalidatePath("/dashboard");
    return data;
  } catch (error) {
    console.log("Error in saving Notes Data");
  }
}

export async function updateNote(
  title: string,
  description: string,
  noteId: string,
  userId: string
) {
  try {
    const data = await prisma.note.update({
      where: {
        id: noteId,
        userId: userId,
      },
      data: {
        title,
        description,
      },
    });

    revalidatePath("/dashboard");
    return data;
  } catch (error) {
    console.log("Error in editing Notes Data");
  }
}
