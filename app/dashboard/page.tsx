import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Edit, File } from "lucide-react";
import { Card } from "@/components/ui/card";

import ReactMarkdown from "react-markdown";
import { formatDate } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { DeleteNoteButton } from "@/components/SubmitButton";
import { unstable_noStore as noStore } from "next/cache";

async function getData(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Note: true,
      Subscription: {
        select: {
          status: true,
        },
      },
    },
  });
  return data;
}

const DashboardPage = async () => {
  const { userId } = auth();
  const data = await getData(userId as string);

  async function deleteNote(formData: FormData) {
    "use server";
    const noteId = formData.get("noteId") as string;
    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });
    revalidatePath("/dashboard");
  }

  const checkActiveSubscription = () => {
    return data?.Subscription?.status === "active" ? (
      <Button asChild>
        <Link href="/dashboard/new">Create New Note</Link>
      </Button>
    ) : (
      <Button asChild>
        <Link href="/dashboard/billing">Create Subscription</Link>
      </Button>
    );
  };
  return (
    <div className="grid items-start gap-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl sm:text4xl font-medium">Your Notes</h1>
          <p className="text-lg text-muted-foreground">
            Here you can see and create new notes
          </p>
        </div>
        {checkActiveSubscription()}
      </div>

      {data?.Note.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <File className="size-10 text-primary" />
          </div>
          <h1 className="mt-6 text-xl font-semibold">
            {"You don't have any notes created"}
          </h1>
          <p className="mb-8 mt-2 text-center text-center leading-6 text-muted-foreground max-w-sm mx-auto">
            Please create some so that you can see them here
          </p>
          {checkActiveSubscription()}
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          {data?.Note.map((note) => (
            <Card
              key={note.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <h3 className="font-semibold text-primary text-lg">
                  {note.title}
                </h3>
                <ReactMarkdown className="prose dark:text-white dark:prose-headings:text-white dark:prose-strong:text-white">
                  {note.description}
                </ReactMarkdown>
                <p>{formatDate(note.createdAt)}</p>
              </div>

              <div className="flex gap-x-4">
                <Link href={`/dashboard/new/${note.id}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="size-4" />
                  </Button>
                </Link>
                <form action={deleteNote}>
                  <input type="hidden" name="noteId" value={note.id} />
                  <DeleteNoteButton />
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
