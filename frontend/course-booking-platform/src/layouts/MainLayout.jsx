import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/shared/ScrollToTop';

const MainLayout = () => {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Box as="main" flexGrow={1}>
                <Outlet />
            </Box>
            <Footer />
            <ScrollToTop />
        </Box>
    );
};

export default MainLayout;