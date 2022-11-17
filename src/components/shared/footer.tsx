import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import ChainData from './onchain/chain_data';


export default function Footer() {

    return (
        <footer>
            <Container maxWidth="xl" sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "#f9f9f9",
            }}>
                <Box sx={{ py: 1 }} display="flex" flexWrap="wrap" justifyContent="right" >
                    <ChainData />
                </Box>
            </Container>
        </footer>
    );
}
