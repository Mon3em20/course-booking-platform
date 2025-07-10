const express = require('express');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  createCourseReview
} = require('../controllers/courseController');
const { protect, instructor } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, instructor, createCourse);

router.route('/instructor')
  .get(protect, instructor, getInstructorCourses);

router.route('/:id')
  .get(getCourseById)
  .put(protect, instructor, updateCourse)
  .delete(protect, instructor, deleteCourse);

router.route('/:id/reviews')
  .post(protect, createCourseReview);

module.exports = router;