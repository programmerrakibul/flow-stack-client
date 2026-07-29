import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_CONFIG } from "@/constants/enums";
import type { TTask } from "@/types/task";
import { Status } from "@/types/task";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface TaskActionsDropdownProps {
  task: TTask;
  onEdit: (task: TTask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Status) => void;
}

const TaskActionsDropdown = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onEdit(task)}>
          <Pencil className="size-4 mr-2" />
          Edit
        </DropdownMenuItem>
        {Object.values(Status).map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => onStatusChange(task.id, s)}
            disabled={task.status === s || task.status === Status.COMPLETED}
          >
            Mark as {STATUS_CONFIG[s].label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => onDelete(task.id)}
          className="text-destructive"
        >
          <Trash2 className="size-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActionsDropdown;
