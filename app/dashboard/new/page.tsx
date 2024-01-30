import NoteForm from "@/components/NoteForm";
import { auth } from "@clerk/nextjs";

const NewNotePage = async () => {
  const { userId } = auth();

  return (
    <div className="">
      <NoteForm userId={userId as string} />
    </div>
  );
};

export default NewNotePage;
