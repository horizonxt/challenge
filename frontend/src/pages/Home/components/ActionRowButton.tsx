import { Row } from '@tanstack/react-table';
import { Loader2, Trash } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
import { toast as toastCustom } from '@/hooks/use-toast';
import { useDeleteArticle } from '@/hooks/useDeleteArticle';
import { Article, removeArticle } from '@/store/slice/postTable';

type ActionRowButtonProps = {
    row: Row<Article>;
};
export default function ActionRowButton({ row }: ActionRowButtonProps) {
    const dispatch = useDispatch();
    const mutation = useDeleteArticle();
    const [loading, setLoadingButton] = useState(false);

    const handleDeleteArticle = async () => {
        setLoadingButton(true);
        try {
            await mutation.mutateAsync(row.original.id);
            dispatch(removeArticle(row.original.id));
            toastCustom({ title: 'Notificación', description: 'La publicación se ha eliminado correctamente.', variant: 'success' });
        } catch {
            toastCustom({
                title: 'Error',
                variant: 'destructive',
                description: 'Ha ocurrido un error al intentar eliminar la publicación.'
            });
        } finally {
            setLoadingButton(false);
        }
    };

    if (loading) {
        return (
            <Button className='text-xs' size={'sm'} variant={'outline'}>
                <Loader2 className='animate-spin' /> Eliminando...
            </Button>
        );
    }
    return (
        <Button className='text-xs min-w-[120px]' size={'sm'} variant={'outline'} onClick={handleDeleteArticle}>
            <Trash /> Eliminar
        </Button>
    );
}
