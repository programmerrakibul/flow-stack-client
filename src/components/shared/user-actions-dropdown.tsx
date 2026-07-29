import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TUser } from "@/types/user";
import {
  Ban,
  CheckCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

interface UserActionsDropdownProps {
  user: TUser;
  onDelete: (userId: string) => void;
  onToggleActive: (userId: string) => void;
  isToggling?: boolean;
}

const UserActionsDropdown = ({
  user,
  onDelete,
  onToggleActive,
  isToggling,
}: UserActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => onToggleActive(user.id)}
          disabled={isToggling}
        >
          {user.isActive ? (
            <>
              <Ban className="size-4 mr-2" />
              Inactivate
            </>
          ) : (
            <>
              <CheckCircle className="size-4 mr-2" />
              Activate
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(user.id)}
          className="text-destructive"
        >
          <Trash2 className="size-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsDropdown;
