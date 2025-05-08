const createError = require("http-errors");
const CourseAssign = require("../models/courseAssignment.model");
const Course = require("../models/course.model");

async function assignCourse(data) {
  const { courseId, memberId, assignedBy } = data;
  const checkDupli = await CourseAssign.findOne({
    course: courseId,
    member: memberId,
    assignedBy: assignedBy,
  });
  if (checkDupli) {
    throw createError(409, "This course already assigned to this user!");
  }
  const result = await CourseAssign.create({
    course: courseId,
    member: memberId,
    assignedBy: assignedBy,
  });
  return result;
}

async function getCourseByUser(memberId, { limit, offset, keyword }) {
  const assigned = await CourseAssign.find({ member: memberId }).select(
    "course"
  );

  const courseIds = assigned.map((elm) => elm.course);
  const query = {
    _id: { $in: courseIds },
  };
  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }
  const courses = await Course.find(query)
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Course.countDocuments(query);

  if (total === 0) {
    throw createError(404, "No course assigned to you");
  }

  return {
    data: courses,
    total,
  };
}

async function getAssignedByAdmin(memberId, { limit, offset, keyword }) {
  const assigned = await CourseAssign.find({ member: memberId }).populate(
    "course"
  );  
  const courseIds = assigned.map((elm) => elm.course);
  const query = {
    _id: { $in: courseIds },
  };
  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }
  const courses = await Course.find(query)
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Course.countDocuments(query);

  if (total === 0) {
    throw createError(404, "No course assigned to this user");
  }

  return {
    data: courses,
    total,
  };
}

// async function remove(_id) {
//   const result = await CourseAssign.findByIdAndDelete(_id);
//   if (!result) {
//     throw createError(404, "Not found with this id");
//   }
//   return _id;
// }

module.exports = { assignCourse, getCourseByUser, getAssignedByAdmin };
