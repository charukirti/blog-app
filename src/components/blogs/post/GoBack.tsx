import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function GoBack() {
    const navigate = useNavigate()
  return (
    <Button
      variant={"outline"}
      type="button"
      className="flex cursor-pointer items-center gap-1 text-gray-600 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-400"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={16} />
      Go back
    </Button>
  );
}
