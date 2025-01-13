import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';

export default function Layout() {
    return (
        <main className='w-[100vw] h-[100vh] flex items-center justify-center'>
            <Outlet />
            <AnimatedGridPattern
                numSquares={30}
                maxOpacity={0.1}
                duration={3}
                repeatDelay={1}
                className={cn(
                    '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
                    'inset-x-0 inset-y-[-30%] skew-y-12 z-[-1]'
                )}
            />
            <Toaster />
        </main>
    );
}
