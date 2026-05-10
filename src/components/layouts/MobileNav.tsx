import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Compass, Wallet, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Trips', href: '/trips', icon: Map },
  { name: 'Discover', href: '/discover/cities', icon: Compass },
  { name: 'Budget', href: '/budget', icon: Wallet },
  { name: 'Profile', href: '/settings/profile', icon: User },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe">
      {/* Floating Create Button */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <Button
          asChild
          size="lg"
          className="h-16 w-16 rounded-full shadow-lg"
        >
          <Link to="/trips/new">
            <Plus className="h-6 w-6" />
          </Link>
        </Button>
      </div>

      {/* Bottom Tabs */}
      <nav className="flex items-center justify-around px-4 h-16">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
