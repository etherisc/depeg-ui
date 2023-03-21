import { forwardRef } from 'react';
import NextLink from 'next/link';
import { useDispatch } from 'react-redux';
import { resetNavigation } from '../redux/slices/bundles';

export const LinkBehaviour = forwardRef(function LinkBehaviour(props: any, ref: any) {
    const dispatch = useDispatch();
    dispatch(resetNavigation());
    return <NextLink ref={ref} {...props} />;
});
