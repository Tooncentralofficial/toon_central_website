import { Button } from "@nextui-org/react";
import { ArrowLeftLong } from "../icons/icons";
import { useRouter } from "next/navigation";

const BackButton = () => {
    const router=useRouter()
    return (  
        <Button
        onClick={() => router.back()}
        isIconOnly
        className="bg-secondary p-2 rounded-[50%]"
      >
        <ArrowLeftLong />
      </Button>
    );
}
 
export default BackButton;