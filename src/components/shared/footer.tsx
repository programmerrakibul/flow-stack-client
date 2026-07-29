import Container from "@/components/shared/container";
import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-4">
      <Container className="flex items-center justify-between flex-col sm:flex-row">
        <Logo />
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Flow Stack. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
