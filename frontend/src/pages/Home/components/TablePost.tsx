import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import ActionRowButton from './ActionRowButton';
import PostCreationForm from './PostCreationForm';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StoreState } from '@/store';
import { openModal } from '@/store/slice/modal';
import { Article } from '@/store/slice/postTable';

function TablePost() {
    const refInputSearchName = useRef<HTMLInputElement | null>(null);

    const dispatch = useDispatch();
    const { isOpen } = useSelector((state: StoreState) => state.modal);
    const { data } = useSelector((state: StoreState) => state.table);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 5 //default page size
    });

    const columns: ColumnDef<Article>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Nombre',
                cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>,
                minSize: 400,
                maxSize: 250
            },
            {
                accessorKey: 'description',
                header: 'Descripción',
                cell: ({ row }) => <div className='lowercase text-ellipsis text-balance'>{row.getValue('description')}</div>,
                minSize: 400,
                maxSize: 600
            },

            {
                id: 'actions',
                enableHiding: false,
                header: 'Acción',
                cell: ({ row }) => {
                    return <ActionRowButton row={row} />;
                },
                minSize: 30,
                maxSize: 30
            }
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: index => setPagination(index),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination
        }
    });

    const handleResetFilters = () => {
        table.setColumnFilters([]);
        if (!!refInputSearchName && !!refInputSearchName?.current) {
            refInputSearchName.current.value = '';
        }
        toast('Se han limpiado los filtros.');
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className='flex justify-between bg-white rounded-xl gap-4 items-center py-4'>
                    <Input
                        placeholder='Ingresa un nombre'
                        className='col-span-3'
                        ref={refInputSearchName}
                        onChange={event => table.getColumn('name')?.setFilterValue(event.target.value.toLowerCase())}
                    />
                    <section className='flex xs:flex-wrap gap-2'>
                        <Button variant='ghost' onClick={() => handleResetFilters()}>
                            Limpiar filtro
                        </Button>

                        <Button variant={'default'} onClick={() => dispatch(openModal())}>
                            Crear publicación
                        </Button>
                    </section>
                </div>
                <div className='rounded-md border bg-white'>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                                        No se han encontrado publicaciones.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className='flex items-center justify-between space-x-2 py-4'>
                    <div className='flex gap-4 flex-wrap text-xs items-center w-full'>
                        <p>Total: {table.getFilteredRowModel().rows.length} fila(s).</p>
                    </div>
                    <div className='space-x-2 flex'>
                        <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Anterior
                        </Button>
                        <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Siguiente
                        </Button>
                    </div>
                </div>

                {isOpen && <Modal body={<PostCreationForm />} title={<p>Formulario de creación</p>} />}
            </motion.div>
        </AnimatePresence>
    );
}

export default TablePost;
