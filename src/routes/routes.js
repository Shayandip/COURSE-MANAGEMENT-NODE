const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const authValidation = require("../validators/auth.validation");
const paginationValidation = require("../validators/paginate.validation");
const courseValidation = require("../validators/course.validation");
const examinationValidation = require("../validators/examination.validation");
const questionValidation = require("../validators/question.validation");
const examAttemptValidation = require("../validators/attemptExam.validation");
const allEnums = require("../helper/enum");
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const courseController = require("../controllers/course.controller");
const examinationController = require("../controllers/examination.controller");
const questionController = require("../controllers/question.controller");
const courseAssignController = require("../controllers/courseAssign.controller");
const examAttemptController = require("../controllers/examAttempt.controller");

// Auth Routes--->
router.post("/login", validate(authValidation.login), authController.login);
router.post(
  "/admin/register",
  validate(authValidation.register),
  authController.register
);

// User Routes--->
router.post(
  "/admin/create-user",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(authValidation.register),
  userController.createUser
);
router.get(
  "/users",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(paginationValidation.basicPagination),
  userController.getUsers
);

//Course Routes--->
router.post(
  "/create-course",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(courseValidation.createCourse),
  courseController.createCourse
);
router.get(
  "/admin/get-course",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(paginationValidation.basicPagination),
  courseController.getCourse
);
router.patch(
  "/update-course/:id",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(courseValidation.updateCourse),
  courseController.updateCourse
);

//Examination Routes--->
router.post(
  "/create-exam",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(examinationValidation.createExamination),
  examinationController.createExamination
);
router.get(
  "/get-exam",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(examinationValidation.examPagination),
  examinationController.getExamByCourseId
);
router.get(
  "/user/get-exam",
  authenticateToken,
  authorize(allEnums.UserRole.USER),
  validate(examinationValidation.examPagination),
  examinationController.userGetExamByCourseId
);
router.patch(
  "/update-exam/:id",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(examinationValidation.updateExamination),
  examinationController.updateExamination
);

//Question Routes-->
router.post(
  "/admin/create-question/:examId",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(questionValidation.createExamination),
  questionController.createQuestions
); /*create bulk questions with options*/
router.get(
  "/get-question",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(questionValidation.questionPagination),
  questionController.getQuestionsByExam
);
router.get(
  "/user/get-question",
  authenticateToken,
  authorize(allEnums.UserRole.USER),
  validate(questionValidation.questionPagination),
  questionController.userGetQuestionsByExam
);
router.patch(
  "/update-question/:id",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(questionValidation.updateQuestion),
  questionController.updateQuestionById
);

//Course-Assign Routes--->
router.post(
  "/assign-course",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(courseValidation.courseAssign),
  courseAssignController.assignCourse
);
router.get(
  "/get-course",
  authenticateToken,
  authorize(allEnums.UserRole.USER),
  validate(paginationValidation.basicPagination),
  courseAssignController.getCourseByUser
);
router.get(
  "/admin/course/:userId",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(paginationValidation.basicPagination),
  courseAssignController.getAssignedByAdmin
);
// router.delete(
//   "/remove/:id",
//   authenticateToken,
//   authorize(allEnums.UserRole.ADMIN),
//   courseAssignController.remove
// );


//Exam-Attempt Routes--->
router.post(
  "/attempt-exam",
  authenticateToken,
  authorize(allEnums.UserRole.USER),
  validate(examAttemptValidation.addAttemptSchema),
  examAttemptController.addAttemptRecord
);
router.get(
  "/admin/get-results",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  validate(examAttemptValidation.attemptPagination),
  examAttemptController.getResultListByAdmin
);
router.get(
  "/user/get-results",
  authenticateToken,
  authorize(allEnums.UserRole.USER),
  validate(paginationValidation.basicPagination),
  examAttemptController.getResultListByUser
);
router.get(
  "/result/:id",
  authenticateToken,
  authorize(allEnums.UserRole.USER, allEnums.UserRole.ADMIN),
  examAttemptController.getResult
); /*Both for admin and user*/
router.delete(
  "/remove-result/:id",
  authenticateToken,
  authorize(allEnums.UserRole.ADMIN),
  examAttemptController.removeResult
);

module.exports = router;
