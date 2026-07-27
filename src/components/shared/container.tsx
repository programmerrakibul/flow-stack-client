import { cn } from "@/utils/utils";

const Container = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("container w-full overflow-hidden mx-auto px-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
