import { forwardRef } from 'react';
import NextLink from 'next/link';

export const LinkBehaviour = forwardRef(function LinkBehaviour(props: any, ref: any) {
    return <NextLink ref={ref} {...props} />;
});
