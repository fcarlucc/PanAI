import { redirect } from "next/navigation";
import { getUser } from "@civic/auth-web3/nextjs";
import NotarizePage from "@/components/NotarizePage";

export default async function Notarize() {
  const user = await getUser();

  if (!user) {
    redirect("/preview");
  }

  return <NotarizePage />;
}
