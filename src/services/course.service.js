const createError = require("http-errors");
const Course = require("../models/course.model");

async function createCourse(data) {
  const { name, description, createdBy } = data;
  const checkName = await Course.findOne({ name: name, createdBy: createdBy });
  if (checkName) {
    throw createError(400, "This course already exists");
  }
  const newCourseObj = new Course({ name, description, createdBy });
  const newCourse = await newCourseObj.save();
  return newCourse;
}

async function getCourse(createdBy, { offset = 0, limit = 10, keyword = "" }) {
  const query = {
    createdBy: createdBy,
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  };

  const [course, total] = await Promise.all([
    Course.find(query)
      .where({ createdBy: createdBy })
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 }),
    Course.countDocuments(query),
  ]);

  if (total === 0) {
    throw createError(404, "You didn't created any course")
  }

  return { course, total };
}

async function updateCourse(_id, data) {
  const { name, description, createdBy } = data;
  const course = await Course.findById(_id);
  if (!course) {
    throw createError(404, "Course not found");
  }
  if (course.createdBy.toString() !== createdBy) {
    throw createError(403, "You are not authorized to update this course");
  }
  const duplicate = await Course.findOne({
    _id: { $ne: _id },
    name: name,
    createdBy: createdBy,
  });
  if (duplicate) {
    throw createError(400, "Another course with this name already exists");
  }
  course.name = name || course.name;
  course.description = description || course.description;
  course.updatedAt = new Date();

  const updatedCourse = await course.save();
  return updatedCourse;
}

module.exports = { createCourse, updateCourse, getCourse };
