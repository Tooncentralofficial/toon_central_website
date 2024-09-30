import { NoRecord } from "@/app/_shared/icons/icons";

const NotFound = ({title,desc}:{title?:string,desc?:string}) => {
    return (   <div className="max-w-[300px] mt-10 w-full">
        <NoRecord/>
        <div className="text-[#475467] text-center mt-10">
         {title||" No books found."}
          <p className="mt-2">
            {
              desc||" Subscribe to your favorite series.For every series subscribed to your list, we’ll notify youwhenever new episodes are updated."
            }
          </p>
        </div>
      </div> );
}
 
export default NotFound;