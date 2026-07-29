import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

interface PasswordInputProps extends Omit<ComponentProps<"input">, "type"> {
  showToggle?: boolean;
}

const PasswordInput = ({ showToggle = true, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput type={showPassword ? "text" : "password"} {...props} />
      {showToggle && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export default PasswordInput;
