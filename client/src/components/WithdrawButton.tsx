import { Button } from "@/components/ui/button";

export default function WithdrawButton() {
  return (
    <div className="flex justify-center my-8">
      <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-lg hover:scale-105 transition">
        Ritira Rewards
      </Button>
    </div>
  );
}
