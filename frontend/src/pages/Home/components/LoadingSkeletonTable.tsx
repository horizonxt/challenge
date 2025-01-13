import { memo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

function LoadingSkeletonTable() {
    const rows = 6;
    const cols = 3;

    return (
        <>
            <div className='flex items-center py-4 justify-between rounded-xl'>
                <Skeleton className='max-w-sm h-8 bg-black/10 w-2/3' />
                <section className='flex gap-2 flex-wrap'>
                    <Skeleton className='max-w-sm h-8 bg-black/10 w-36' />
                    <Skeleton className='max-w-sm h-8 bg-black/10 w-36' />
                </section>
            </div>
            <div className='grid grid-cols-3 gap-y-2 gap-x-1'>
                {Array.from({ length: rows * cols }).map((_, index) => (
                    <Skeleton key={index} className='h-10 w-full bg-black/20' />
                ))}
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
                <Skeleton className='max-w-sm h-8 bg-black/10 w-24' /> <Skeleton className='max-w-sm h-8 bg-black/10 w-24' />
            </div>
        </>
    );
}

export default memo(LoadingSkeletonTable);
