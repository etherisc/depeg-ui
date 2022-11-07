import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/material/styles';
import Link from 'next/link';
import React from 'react';
import ChainData from './chain_data';


export default function Footer() {

    return (
        <footer>
            <Container maxWidth="xl" sx={{
                position: "fixed",
                bottom: 0,
                bgcolor: "#f9f9f9",
            }}>
                <Box sx={{ py: 1 }} display="flex" flexWrap="wrap" justifyContent="right" >
                    <ChainData />
                </Box>
            </Container>
        </footer>
    );
}
