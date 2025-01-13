import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArticleCreate, useCreateArticle } from '@/hooks/useCreateArticle';
import { StoreState } from '@/store';
import { closeModal, setLoading } from '@/store/slice/modal';
import { addArticle, Article } from '@/store/slice/postTable';

const formSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'El nombre debe contener al menos 1 carácter.' })
        .max(255, { message: 'El nombre puede contener un máximo de 255 carácteres.' }),
    description: z
        .string()
        .min(1, { message: 'La descripción debe contener al menos 1 carácter.' })
        .max(255, { message: 'La descripción puede contener un máximo de 255 carácteres.' })
});

export default function PostCreationForm() {
    const dispatch = useDispatch();
    const mutation = useCreateArticle();
    const { isLoading } = useSelector((state: StoreState) => state.modal);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        dispatch(setLoading(true));
        const newArticle: ArticleCreate = { name: values.name, description: values.description };
        mutation.mutate(newArticle, {
            onSuccess: (data: Article) => {
                dispatch(addArticle(data));
                dispatch(closeModal());
                toast({ title: 'Notificación', description: 'La publicación se ha creado correctamente.', variant: 'success' });
            },
            onError: () => {
                dispatch(closeModal());
                toast({ title: 'Error', variant: 'destructive', description: 'Ha ocurrido un error al intentar crear la publicación.' });
            }
        });
    };

    return (
        <main className='relative'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder='Ingresa un nombre válido' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='Ingresa una descripción válida' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-full'>
                        Publicar
                    </Button>
                </form>
            </Form>
            {isLoading && (
                <div className='absolute top-0 bg-white/70 w-full h-full grid items-center justify-center'>
                    <div className='flex flex-col items-center gap-y-4 text-black '>
                        <LoaderIcon className='animate-spin' size={40} />
                        <p>Publicando...</p>
                    </div>
                </div>
            )}
        </main>
    );
}
