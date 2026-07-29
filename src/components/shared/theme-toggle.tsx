import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <AnimatedThemeToggler
      className="size-9"
      variant="star"
      fromCenter
      theme={resolvedTheme as "light" | "dark" | undefined}
      onThemeChange={(theme) => setTheme(theme)}
    />
  );
};

export default ThemeToggle;
