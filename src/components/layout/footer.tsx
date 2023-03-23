import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { DOT } from '../../utils/chars';
import ChainData from './chain_data';
import Faucet from './faucet';
import buildInfo from "../../version.json";
import { useTranslation } from 'next-i18next';

export default function Footer() {
    const { t } = useTranslation('common');
    const stakingWebsiteUrl = process.env.NEXT_PUBLIC_STAKING_WEBSITE_URL;

    return (
        <footer>
            <Container maxWidth={false} sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "#C5D0DE",
            }}>
                <Container 
                    maxWidth="lg" 
                    sx={{ mr: 'auto', ml: 'auto', py: 1, display: { 'xs': 'none', 'md': 'flex' } }} 
                    color="palette.secondary.dark"
                    >
                    <Box 
                        sx={{ display: { 'xs': 'none', 'md': 'flex' }, ml: '0', mr: 'auto' }} 
                        justifySelf="left"
                        >
                        <Typography variant="body2" sx={{ fontSize: '10px', ml: 1 }}  color="palette.priary.dark">
                            {buildInfo.name} v{buildInfo.version} ({buildInfo.date})
                        </Typography>
                    </Box>
                    <Box 
                        sx={{ display: { 'xs': 'none', 'md': 'flex' }, ml: 'auto', mr: 0 }} 
                        justifySelf="right" >
                        {stakingWebsiteUrl !== undefined && <>
                            <Button variant="text" sx={{ p: 0, ml: 1 }} href={stakingWebsiteUrl} target="_blank" rel="noreferrer">
                                <Typography variant="body2" sx={{ fontSize: '10px' }} >
                                    {t('footer.staking_website_link_title')}
                                </Typography>
                            </Button>
                            <Typography variant="body2" sx={{ fontSize: '10px', ml: 1, mr: 1 }}>
                                {DOT}
                            </Typography>
                        </>}
                        <Faucet />
                        <Typography variant="body2" sx={{ fontSize: '10px', ml: 1 }}>
                            {DOT}
                        </Typography>
                        <ChainData />
                    </Box>
                </Container>
            </Container>
        </footer>
    );
}
