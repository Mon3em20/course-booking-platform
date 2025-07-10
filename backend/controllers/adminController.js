const User = require('../models/user');
const Course = require('../models/course');
const Booking = require('../models/booking');
const Session = require('../models/session');
const Review = require('../models/review');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        // Build filter object
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const count = await User.countDocuments(filter);

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            users,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            // Get user enrollments
            const enrollments = await Booking.find({ student: user._id })
                .populate('course', 'title')
                .sort({ bookingDate: -1 });

            // If instructor, get courses
            let instructorCourses = [];
            if (user.role === 'instructor') {
                instructorCourses = await Course.find({ instructor: user._id });
            }

            res.json({
                user,
                enrollments,
                instructorCourses
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // If deleting an instructor, handle their courses
            if (user.role === 'instructor') {
                // Option 1: Delete all courses by this instructor
                // await Course.deleteMany({ instructor: user._id });

                // Option 2: Mark courses as inactive
                await Course.updateMany(
                    { instructor: user._id },
                    { isActive: false }
                );
            }

            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        // User stats
        const totalUsers = await User.countDocuments({});
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalInstructors = await User.countDocuments({ role: 'instructor' });

        // Course stats
        const totalCourses = await Course.countDocuments({});
        const activeCourses = await Course.countDocuments({ isActive: true });

        // Booking stats
        const totalBookings = await Booking.countDocuments({});
        const completedBookings = await Booking.countDocuments({ status: 'confirmed', paymentStatus: 'completed' });

        // Revenue stats
        const revenue = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

        // Monthly revenue (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Booking.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    bookingDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$bookingDate' },
                        month: { $month: '$bookingDate' }
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Recent bookings
        const recentBookings = await Booking.find({})
            .populate('course', 'title')
            .populate('student', 'name email')
            .sort({ bookingDate: -1 })
            .limit(10);

        // Popular courses
        const popularCourses = await Course.aggregate([
            { $project: { title: 1, enrolledCount: { $size: '$enrolledStudents' } } },
            { $sort: { enrolledCount: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            userStats: {
                totalUsers,
                totalStudents,
                totalInstructors
            },
            courseStats: {
                totalCourses,
                activeCourses
            },
            bookingStats: {
                totalBookings,
                completedBookings
            },
            revenueStats: {
                totalRevenue,
                monthlyRevenue
            },
            recentBookings,
            popularCourses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all courses for admin
// @route   GET /api/admin/courses
// @access  Private/Admin
const getAllCourses = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        // Build filter object
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: 'i' };
        }

        const count = await Course.countDocuments(filter);

        const courses = await Course.find(filter)
            .populate('instructor', 'name email')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            courses,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        // Build filter object
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.paymentStatus) {
            filter.paymentStatus = req.query.paymentStatus;
        }
        if (req.query.paymentMethod) {
            filter.paymentMethod = req.query.paymentMethod;
        }

        const count = await Booking.countDocuments(filter);

        const bookings = await Booking.find(filter)
            .populate('course', 'title')
            .populate('student', 'name email')
            .sort({ bookingDate: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            bookings,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get revenue reports
// @route   GET /api/admin/reports/revenue
// @access  Private/Admin
const getRevenueReports = async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                bookingDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        let revenueData;

        switch (period) {
            case 'daily':
                revenueData = await Booking.aggregate([
                    {
                        $match: {
                            paymentStatus: 'completed',
                            ...dateFilter
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$bookingDate' },
                                month: { $month: '$bookingDate' },
                                day: { $dayOfMonth: '$bookingDate' }
                            },
                            total: { $sum: '$amount' },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
                ]);
                break;

            case 'monthly':
            default:
                revenueData = await Booking.aggregate([
                    {
                        $match: {
                            paymentStatus: 'completed',
                            ...dateFilter
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$bookingDate' },
                                month: { $month: '$bookingDate' }
                            },
                            total: { $sum: '$amount' },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { '_id.year': 1, '_id.month': 1 } }
                ]);
                break;
        }

        res.json(revenueData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllCourses,
    getAllBookings,
    getRevenueReports
};