import Container from "@/components/shared/container";
import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <p className="text-xs text-muted-foreground whitespace-break-spaces">
          &copy; {new Date().getFullYear()} Flow Stack. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
