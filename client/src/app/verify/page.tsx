import { redirect } from "next/navigation";
import { getUser } from "@civic/auth-web3/nextjs";
import VerifyPage from "@/components/VerifyPage";

export default async function Verify() {
  const user = await getUser();

  if (!user) {
    redirect("/preview");
  }

  return <VerifyPage />;
}
