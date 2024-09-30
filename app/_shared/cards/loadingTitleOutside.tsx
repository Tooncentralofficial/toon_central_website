import { Card, Skeleton } from "@nextui-org/react";

const LoadingTitleOutside = () => {
  return (
    <div>
      <Card
        className="flex flex-col justify-between h-[260px] md:h-[320px] bg-[var(--bg-secondary)] space-y-5 p-4"
        radius="lg"
      >
        <div className="absolute top-0 left-0  h-full w-full flex flex-col justify-end p-4 ">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>
      </Card>
      <div className="flex flex-wrap gap-1 items-center justify-between mt-1.5">
        <Skeleton className="w-1/5 rounded-lg">
          <div className="h-3 w-1/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-1/5 rounded-lg">
          <div className="h-3 w-1/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
    </div>
  );
};

export default LoadingTitleOutside;
