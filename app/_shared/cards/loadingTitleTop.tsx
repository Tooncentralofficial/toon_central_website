import { Card, Skeleton } from "@nextui-org/react";

const LoadingTitleTop = () => {
  return (
    <Card
      className="h-[200px]  flex flex-col justify-between md:h-[260px] bg-[var(--bg-secondary)] space-y-5 p-4"
      radius="lg"
    >
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
      <div className="space-y-3">
        <Skeleton className="w-1/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
    </Card>
  );
};

export default LoadingTitleTop;
