import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = lazy(() => import('../pages/Home/HomePage'));

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;