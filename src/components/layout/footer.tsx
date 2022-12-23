import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { DOT } from '../../utils/chars';
import ChainData from './chain_data';
import Faucet from './faucet';

export default function Footer() {

    return (
        <footer>
            <Container maxWidth={false} sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "#C5D0DE",
            }}>
                <Box maxWidth="lg" sx={{ mr: 'auto', ml: 'auto', py: 1, display: { 'xs': 'none', 'md': 'flex' } }} flexWrap="wrap" justifyContent="right" >
                    <Faucet />
                    <Typography variant="body2" sx={{ fontSize: '10px', ml: 1 }}>
                        {DOT}
                    </Typography>
                    <ChainData />
                </Box>
            </Container>
        </footer>
    );
}
