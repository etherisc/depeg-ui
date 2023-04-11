import confetti from 'canvas-confetti';
import { i18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBackendApi } from '../backend/backend_api';
import Bundles from '../components/bundles/bundles';
import { cleanup, showBundle, showCreationConfirmation } from '../redux/slices/bundles';
import { RootState } from '../redux/store';

export default function BundlesPage() {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('common');
    const signer = useSelector((state: RootState) => state.chain.signer);
    const provider = useSelector((state: RootState) => state.chain.provider);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const dispatch = useDispatch();
    const router = useRouter();
    
    useEffect(() => {
        dispatch(cleanup());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps 

    const backend = useMemo(() => getBackendApi(
        enqueueSnackbar,
        t,
        signer,
        provider,
    ), [enqueueSnackbar, signer, provider, t]);

    useEffect(() => {
        async function fetchBundle(id: number, confirmation: boolean) {
            const bundle = await backend.bundleManagement.bundle(id);
            router.push(`/bundles`, undefined, { shallow: true });
            dispatch(showBundle(bundle));
            
            if (confirmation) {
                dispatch(showCreationConfirmation(confirmation));
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
        if (router.isReady && router.query.id !== undefined && isConnected) {
            fetchBundle(parseInt(router.query.id as string), router.query.confirmation !== undefined);
        }
    }, [router.isReady, router.query.id, isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head>
                <title>{t('apptitle')}</title>
            </Head>

            <Bundles backend={backend} />
        </>
    )
}

export async function getStaticProps() {
    if (process.env.NODE_ENV === "development") {
        await i18n?.reloadResources();
    }
    return {
        props: {
            ...(await serverSideTranslations('en', ['common', 'bundles'])),
        },
    }
}