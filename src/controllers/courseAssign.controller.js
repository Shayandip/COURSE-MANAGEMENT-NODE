const courseAssignService = require("../services/courseAssign.service");

async function assignCourse(req, res, next) {
  try {
    const { courseId, memberId } = req.body;
    const result = await courseAssignService.assignCourse({
      courseId,
      memberId,
      assignedBy: req.user.id,
    });
    return res.status(201).json({
      isSuccess: true,
      statusCode: 201,
      message: "Course assigned successfully to user",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getCourseByUser(req, res, next) {
  try {
    const { limit, offset, keyword } = req.query;
    const result = await courseAssignService.getCourseByUser(req.user.id, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      keyword,
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Courses fetched successfully",
      courses: result.data,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

async function getAssignedByAdmin(req, res, next) {
  try {
    const memberId = req.params.userId;
    if (!memberId) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "memberId required!",
      });
    }
    console.log(memberId);
    
    const { limit, offset, keyword } = req.query;
    const result = await courseAssignService.getAssignedByAdmin(memberId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      keyword,
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Courses fetched successfully",
      courses: result.data,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

// async function remove(req, res, next) {
//   try {
//     const _id = req.params.id;
//     if (!_id) {
//       return res.status(400).json({
//         isSuccess: false,
//         statusCode: 400,
//         message: "_id required!",
//       });
//     }
//     const response = await courseAssignService.remove(_id);
//     res.status(200).json({
//       isSuccess: true,
//       statusCode: 200,
//       message: "Result deleted successfully",
//       data: { id: response },
//     });
//   } catch (error) {
//     next(error);
//   }
// }

module.exports = { assignCourse, getCourseByUser, getAssignedByAdmin };
