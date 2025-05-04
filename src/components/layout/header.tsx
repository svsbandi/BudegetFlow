import Link from 'next/link';
// Removed DollarSign import as it's no longer used
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50 shadow-sm">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary"
          prefetch={false}
        >
          {/* Replaced DollarSign icon with Rupee symbol */}
          <span className="h-6 w-6 flex items-center justify-center text-xl font-semibold">₹</span>
          <span className="font-bold">BudgetFlow</span>
        </Link>
        {/* Future navigation links can go here */}
        {/* <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
          prefetch={false}
        >
          Dashboard
        </Link> */}
      </nav>
       {/* Placeholder for future user profile/actions */}
       {/* <div className="ml-auto">
         <Button>Add Transaction</Button>
       </div> */}
    </header>
  );
}
