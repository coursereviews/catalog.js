'use strict';

const _ = require('lodash');
const models = require('./models');

exports.parseCatalog = function (catalogObj) {
  const catalog = new models.Catalog;

  catalog.href = catalogObj.rss.channel[0].link[0];

  const termObj = catalogObj.rss.channel[0]['catalog:chosen_term'][0];
  catalog.term = parseCourseInfo(termObj, models.Term);

  _.each(catalogObj.rss.channel[0].item, function (course) {
    catalog.courses.push(parseCourse(course));
  });

  return catalog;
};

function parseCourse(courseObj) {
  const course = new models.Course;

  course.code = courseObj.title[0];
  course.href = courseObj.link[0];
  course.description = courseObj.description[0];
  course.title = courseObj['catalog:title'][0];
  course.type = parseCourseInfo(courseObj['catalog:genustype'][0], models.Type);
  course.location = parseCourseInfo(courseObj['catalog:location'][0], models.Location);
  course.term = parseCourseInfo(courseObj['catalog:term'][0], models.Term);
  course.schedule = parseSchedule(courseObj['catalog:schedule'][0]);
  course.crn = parseCRN(courseObj['catalog:property'][0]);

  return course;
}

function parseCourseInfo(obj, model) {
  if (typeof obj === 'string')
    return new model({rawId: obj});

  if (obj === null)
    return obj;

  const courseInfo = new model;

  courseInfo.rawId = obj['$'].id;
  courseInfo.href = obj['$'].href;
  courseInfo.text = obj['_'];

  return courseInfo;
}

function parseCRN(crnObj) {
  return new models.CRN({rawId: crnObj['catalog:value'][0]});
}

function parseSchedule(scheduleString) {
  const schedule = new models.Schedule({text: scheduleString});

  return schedule;
}
