import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

const EmptyState = ({
  title,
  description,
  icon: Icon,
  action,
}: EmptyStateProps) => {
  return (
    <Empty className="border border-dashed">
      <EmptyMedia variant={"icon"}>{Icon && <Icon />}</EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyContent>
          <EmptyDescription>{description}</EmptyDescription>
          {action}
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;
