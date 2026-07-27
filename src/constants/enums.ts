import {
  CheckCircle,
  Circle,
  Clock,
  Flag,
  AlertTriangle,
  ArrowDown,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";
import { Status, Priority } from "@/types/task";
import { Role } from "@/types/user";
import type { ComponentProps } from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface StatusConfig {
  label: string;
  color: string;
  badgeVariant: BadgeVariant;
  icon: LucideIcon;
}

interface PriorityConfig {
  label: string;
  color: string;
  badgeVariant: BadgeVariant;
  icon: LucideIcon;
}

interface RoleConfig {
  label: string;
  color: string;
  badgeVariant: BadgeVariant;
  icon: LucideIcon;
}

export const STATUS_CONFIG: Record<Status, StatusConfig> = {
  [Status.TODO]: {
    label: "Todo",
    color: "text-blue-500",
    badgeVariant: "secondary",
    icon: Circle,
  },
  [Status.IN_PROGRESS]: {
    label: "In Progress",
    color: "text-amber-500",
    badgeVariant: "outline",
    icon: Clock,
  },
  [Status.COMPLETED]: {
    label: "Completed",
    color: "text-emerald-500",
    badgeVariant: "default",
    icon: CheckCircle,
  },
};

export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  [Priority.LOW]: {
    label: "Low",
    color: "text-blue-500",
    badgeVariant: "secondary",
    icon: ArrowDown,
  },
  [Priority.MEDIUM]: {
    label: "Medium",
    color: "text-amber-500",
    badgeVariant: "outline",
    icon: Flag,
  },
  [Priority.HIGH]: {
    label: "High",
    color: "text-red-500",
    badgeVariant: "destructive",
    icon: AlertTriangle,
  },
};

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  [Role.USER]: {
    label: "User",
    color: "text-gray-500",
    badgeVariant: "secondary",
    icon: User,
  },
  [Role.ADMIN]: {
    label: "Admin",
    color: "text-purple-500",
    badgeVariant: "default",
    icon: Shield,
  },
};

export type { ComponentProps, LucideIcon };
