import Container from "@/components/shared/container";
import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-heading text-sm font-bold whitespace-nowrap">
            <Zap className="h-4 w-4 text-primary" />
            Flow Stack
          </div>
          <p className="text-xs text-muted-foreground whitespace-break-spaces">
            &copy; {new Date().getFullYear()} Flow Stack. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
