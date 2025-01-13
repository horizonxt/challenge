import { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Toaster } from '@/components/ui/toaster';
import { useArticles } from '@/hooks/useArticles';
import { StoreState } from '@/store';
import { setArticles, setLoadingTable } from '@/store/slice/postTable';

/* eslint-disable @typescript-eslint/naming-convention */
const LoadingSkeletonTable = lazy(() => import('./components/LoadingSkeletonTable'));
const TablePost = lazy(() => import('./components/TablePost'));
/* eslint-enable @typescript-eslint/naming-convention */

export default function Home() {
    const dispatch = useDispatch();
    const { data: articles, error, isLoading, isError, refetch: callArticlesApi, isSuccess } = useArticles();

    const { isLoadingTable } = useSelector((state: StoreState) => state.table);

    useEffect(() => {
        callArticlesApi();

        if (isSuccess) {
            dispatch(setArticles(articles));
        }

        setTimeout(() => {
            dispatch(setLoadingTable(false));
        }, 1000);
    }, [articles, isSuccess, callArticlesApi, dispatch, error, isLoading, isError]);

    return (
        <main className='w-[80%] max-w-4xl !overflow-hidden'>
            <section className='flex justify-center mb-3'>
                <img src='logo.svg' alt='Logo TCIT Cloud Solutions' className='min-h-[90px] h-[90px]' />
            </section>
            <Suspense fallback={<LoadingSkeletonTable />}>
                {!isLoadingTable && <TablePost />}
                {isLoadingTable && <LoadingSkeletonTable />}
            </Suspense>
            <Toaster />
        </main>
    );
}
