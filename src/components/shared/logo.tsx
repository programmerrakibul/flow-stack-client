import darkLogo from "@/assets/logo_dark.png";
import lightLogo from "@/assets/logo_light.png";
import { useTheme } from "next-themes";
import { Link } from "react-router";

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const logo = resolvedTheme === "dark" ? darkLogo : lightLogo;

  console.log(resolvedTheme);

  console.log(logo);

  return (
    <Link to="/" className="flex items-center justify-center w-37.5">
      <img src={logo} alt="logo" className="w-full h-full object-fill" />
    </Link>
  );
};

export default Logo;
