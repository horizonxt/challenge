import { X } from 'lucide-react';
import { Button } from './button';
import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/slice/modal';
import { StoreState } from '@/store';

interface ModalProps {
    title: JSX.Element;
    body: JSX.Element;
    footer?: JSX.Element;
}

function Modal({ title, body, footer }: ModalProps) {
    const dispatch = useDispatch();

    const { isLoading } = useSelector((state: StoreState) => state.modal);

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <main className='bg-white absolute top-1/4 left-1/2 transform -translate-x-1/2 h-auto md:min-w-[35vw] w-[80vw] max-w-[600px] z-[500] rounded-xl border '>
                    <section className='w-full flex items-center pl-4 pt-3'>
                        <div className='min-w-[85%] max-w-[80%]'>{title}</div>
                        <div className='grid justify-end  w-full'>
                            {!isLoading && (
                                <Button variant={null} onClick={() => dispatch(closeModal())}>
                                    <X />
                                </Button>
                            )}
                        </div>
                    </section>
                    <section className='p-4'>
                        {body}
                        {footer}
                    </section>
                </main>
                <div className='bg-black/40 fixed top-0 left-0 h-screen w-screen z-[100]'></div>
            </motion.div>
        </AnimatePresence>
    );
}

export default memo(Modal);
