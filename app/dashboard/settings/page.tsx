import prisma from "@/lib/db";
import SettingsForm from "@/components/SettingsForm";
import { auth } from "@clerk/nextjs";
import { unstable_noStore as noStore } from "next/cache";
import { User } from "@prisma/client";

async function getData(userId: string) {
  noStore();
  if (userId) {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        colorScheme: true,
      },
    });
    return data;
  }
}

const SettingsPage = async () => {
  const { userId } = auth();
  const data = await getData(userId as string);

  return (
    <div className="grid items-start gap-8 px-2">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <h1 className="text-3xl md:text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Your Profile Settings</p>
        </div>
      </div>
      <SettingsForm
        //   @ts-ignore
        data={data as User}
        userId={userId ?? ""}
      />
    </div>
  );
};

export default SettingsPage;
