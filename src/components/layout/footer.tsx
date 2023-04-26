import { Button, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import IconButton from '@mui/material/IconButton';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';

import React from 'react';
import { DOT } from '../../utils/chars';
import ChainData from './chain_data';
import Faucet from './faucet';
import buildInfo from "../../version.json";
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

export default function Footer() {
    const { t } = useTranslation('common');
    const stakingWebsiteUrl = process.env.NEXT_PUBLIC_STAKING_WEBSITE_URL;
    const theme = useTheme();
    const fontSize = '0.7rem';

    return (
        <footer style={{ marginTop: 'auto', marginBottom: 0 }}>
            <Container maxWidth={false} sx={{
                marginTop: '32px', 
                paddingTop: 0.6,
                paddingBottom: 0.6,
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: theme.palette.grey[200],
            }}>
                <Container 
                    maxWidth={false}
                    sx={{ mr: 'auto', ml: 'auto', py: 1, display: { 'xs': 'none', 'md': 'flex' } }} 
                    color="palette.secondary.dark"
                    >
                    <Box 
                        sx={{ display: { 'xs': 'none', 'md': 'flex' }, ml: '0', mr: 'auto', verticalAlign: 'middle' }} 
                        justifySelf="left" 
                    >
                        <Link href="https://www.etherisc.com" target="_blank" rel="noopener noreferrer">
                            <Avatar alt="Etherisc logo" src="/etherisc_logo_bird_blue.svg"  sx={{ width: 28, height: 28 }} />
                        </Link>

                        <IconButton aria-label="Twitter.com" sx={{ width: 24, height: 24, marginLeft: 1 }} onClick={() => window.open('https://twitter.com/Etherisc/')}><TwitterIcon fontSize="small" /></IconButton>
                        <IconButton aria-label="t.me" sx={{ width: 24, height: 24 }} onClick={() => window.open('https://t.me/etherisc_community')}><TelegramIcon fontSize="small" /></IconButton>
                        <IconButton aria-label="GitHub.com" sx={{ width: 24, height: 24, marginRight: 1 }} onClick={() => window.open('https://github.com/etherisc/')}><GitHubIcon fontSize="small" /></IconButton>

                        <Typography variant="body2" sx={{ fontSize: fontSize, ml: 1, marginTop: 0.5 }} color={theme.palette.text.primary}>
                            {buildInfo.name} v{buildInfo.version} ({buildInfo.date})
                        </Typography>
                    </Box>
                    <Box 
                        sx={{ display: { 'xs': 'none', 'md': 'flex' }, ml: 'auto', mr: 0 }} 
                        justifySelf="right" >
                        {stakingWebsiteUrl !== undefined && <>
                            <Button variant="text" sx={{ p: 0, ml: 1 }} href={stakingWebsiteUrl} target="_blank" rel="noreferrer">
                                <Typography variant="body2" sx={{ fontSize: fontSize }} >
                                    {t('footer.staking_website_link_title')}
                                </Typography>
                            </Button>
                            <Typography variant="body2" sx={{ fontSize: fontSize, ml: 1, mr: 1 }}>
                                {DOT}
                            </Typography>
                        </>}
                        <Faucet fontSize={fontSize} />
                        <Typography variant="body2" sx={{ fontSize: fontSize, ml: 1 }}>
                            {DOT}
                        </Typography>
                        <ChainData fontSize={fontSize} />
                    </Box>
                </Container>
            </Container>
        </footer>
    );
}
