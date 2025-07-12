import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';

// Student Pages
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import MyCoursesPage from './pages/student/MyCoursesPage';
import CourseContentPage from './pages/student/CourseContentPage';
import MyBookingsPage from './pages/student/MyBookingsPage';
import CertificatesPage from './pages/student/CertificatesPage';
import StudentProfilePage from './pages/student/ProfilePage';
import StudentSettingsPage from './pages/student/SettingsPage';
import CertificateDetailPage from './pages/student/CertificateDetailPage';

// Instructor Pages
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import CourseManagementPage from './pages/instructor/CourseManagementPage';
import CourseFormPage from './pages/instructor/CourseFormPage';
import SessionManagementPage from './pages/instructor/SessionManagementPage';
import StudentManagementPage from './pages/instructor/StudentManagementPage';
import InstructorBookingsPage from './pages/instructor/BookingsPage';
import InstructorProfilePage from './pages/instructor/ProfilePage';
import InstructorSettingsPage from './pages/instructor/SettingsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AdminCourseManagementPage from './pages/admin/CourseManagementPage';
import AdminBookingsPage from './pages/admin/BookingsPage';
import ReportsPage from './pages/admin/ReportsPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';

// Auth Components
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';
import NotFoundPage from './pages/NotFoundPage';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <AuthProvider>
                    <Router>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<HomePage />} />
                                <Route path="courses" element={<CoursesPage />} />
                                <Route path="courses/:courseId" element={<CourseDetailsPage />} />
                                <Route path="about" element={<AboutPage />} />
                                <Route path="contact" element={<ContactPage />} />
                                <Route path="faq" element={<FaqPage />} />
                                <Route path="login" element={<LoginPage />} />
                                <Route path="register" element={<RegisterPage />} />
                                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="reset-password/:token" element={<ResetPasswordPage />} />
                                <Route path="verify-certificate" element={<VerifyCertificatePage />} />
                            </Route>

                            {/* Student Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <RequireAuth>
                                        <RequireRole roles={['student', 'instructor', 'admin']}>
                                            <DashboardLayout />
                                        </RequireRole>
                                    </RequireAuth>
                                }
                            >
                                <Route index element={<Navigate to="/dashboard/overview" replace />} />
                                <Route path="overview" element={<StudentDashboardPage />} />
                                <Route path="my-courses" element={<MyCoursesPage />} />
                                <Route path="my-courses/:courseId" element={<CourseContentPage />} />
                                <Route path="my-bookings" element={<MyBookingsPage />} />
                                <Route path="certificates" element={<CertificatesPage />} />
                                <Route path="profile" element={<StudentProfilePage />} />
                                <Route path="settings" element={<StudentSettingsPage />} />
                                <Route path="certificates/:certificateId" element={<CertificateDetailPage />} />
                            </Route>

                            {/* Instructor Routes */}
                            <Route
                                path="/instructor"
                                element={
                                    <RequireAuth>
                                        <RequireRole roles={['instructor', 'admin']}>
                                            <DashboardLayout isInstructor={true} />
                                        </RequireRole>
                                    </RequireAuth>
                                }
                            >
                                <Route index element={<Navigate to="/instructor/dashboard" replace />} />
                                <Route path="dashboard" element={<InstructorDashboardPage />} />
                                <Route path="courses" element={<CourseManagementPage />} />
                                <Route path="courses/new" element={<CourseFormPage />} />
                                <Route path="courses/edit/:courseId" element={<CourseFormPage />} />
                                <Route path="courses/:courseId/sessions" element={<SessionManagementPage />} />
                                <Route path="courses/:courseId/students" element={<StudentManagementPage />} />
                                <Route path="bookings" element={<InstructorBookingsPage />} />
                                <Route path="profile" element={<InstructorProfilePage />} />
                                <Route path="settings" element={<InstructorSettingsPage />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route
                                path="/admin"
                                element={
                                    <RequireAuth>
                                        <RequireRole roles={['admin']}>
                                            <AdminLayout />
                                        </RequireRole>
                                    </RequireAuth>
                                }
                            >
                                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                                <Route path="dashboard" element={<AdminDashboardPage />} />
                                <Route path="users" element={<UserManagementPage />} />
                                <Route path="courses" element={<AdminCourseManagementPage />} />
                                <Route path="bookings" element={<AdminBookingsPage />} />
                                <Route path="reports" element={<ReportsPage />} />
                                <Route path="settings" element={<SystemSettingsPage />} />
                            </Route>

                            {/* Not Found */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Router>
                </AuthProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </ChakraProvider>
        </QueryClientProvider>
    );
};

export default App;