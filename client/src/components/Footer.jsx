import { Music } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-6 mt-auto">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Music className="h-4 w-4 text-primary" />
        <span>Electrum &copy; {new Date().getFullYear()}</span>
      </div>
      <p className="text-xs text-muted-foreground">Guitar chord & song companion</p>
    </div>
  </footer>
);

export default Footer;
