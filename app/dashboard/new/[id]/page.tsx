import NoteForm from "@/components/NoteForm";

import prisma from "@/lib/db";
import { Note } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

type NoteDetailPageProps = {
  params: {
    id: string;
  };
};

const NoteDetailPage = async ({ params: { id } }: NoteDetailPageProps) => {
  async function getData(userId: string) {
    noStore();
    if (!userId) throw new Error("User Id is undefined");
    if (userId) {
      const data = await prisma.note.findUnique({
        where: {
          id: id,
        },
      });
      if (!data) return null;

      return data;
    }
  }

  const data = await getData(id);
  return (
    <div className="h-screen overflow-y-scroll">
      <NoteForm userId={id} data={data as Note} />
    </div>
  );
};

export default NoteDetailPage;
