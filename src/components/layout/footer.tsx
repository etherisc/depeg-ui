import { Button, Link, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { DOT } from '../../utils/chars';
import ChainData from './chain_data';
import Faucet from './faucet';
import buildInfo from "../../version.json";
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faGithub, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';

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
                        sx={{ 
                            display: { 'xs': 'none', 'md': 'flex' }, 
                            ml: '0', 
                            mr: 'auto', 
                            verticalAlign: 'middle', 
                        }} 
                        justifySelf="left" 
                        >
                        <Box component="span" sx={{ mr: 0.5, mt: -0.5, mb: -1 }} >
                            <Link href="https://etherisc.com" target="_blank" rel="noreferrer">
                                <Image src="/etherisc_logo_bird_blue.svg" alt="Etherisc logo" width={24} height={24} />
                            </Link>
                        </Box>
                        <Link href="https://twitter.com/Etherisc/" target="_blank" rel="noreferrer">
                            <Typography sx={{lineHeight: '16px', color: theme.palette.text.primary}} >
                                <FontAwesomeIcon icon={faTwitter} className="fa" />
                            </Typography>
                        </Link>
                        <Link href="https://t.me/etherisc_community" target="_blank" rel="noreferrer">
                            <Typography sx={{lineHeight: '16px', color: theme.palette.text.primary}} >
                                <FontAwesomeIcon icon={faTelegram} className="fa" />
                            </Typography>
                        </Link>
                        <Link href="https://discord.gg/cVsgakVG4R" target="_blank" rel="noreferrer">
                            <Typography sx={{lineHeight: '16px', color: theme.palette.text.primary}} >
                                <FontAwesomeIcon icon={faDiscord} className="fa" />
                            </Typography>
                        </Link>
                        <Link href="https://github.com/etherisc/" target="_blank" rel="noreferrer">
                            <Typography sx={{lineHeight: '16px', color: theme.palette.text.primary}} >
                                <FontAwesomeIcon icon={faGithub} className="fa" />
                            </Typography>
                        </Link>
                        <Typography variant="body2" sx={{ fontSize: fontSize, ml: 1, verticalAlign: 'middle' }} color={theme.palette.text.primary}>
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
