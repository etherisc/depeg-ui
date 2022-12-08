import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import ChainData from './chain_data';
import Faucet from './faucet';

export default function Footer() {

    return (
        <footer>
            <Container maxWidth="xl" sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "#C5D0DE",
            }}>
                <Box sx={{ py: 1 }} display="flex" flexWrap="wrap" justifyContent="right" >
                    <Faucet />
                    <ChainData />
                </Box>
            </Container>
        </footer>
    );
}
