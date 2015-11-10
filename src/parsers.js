'use strict';

const _ = require('lodash');
const moment = require('moment');
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

  // there may be multiple instructors
  const instructors = courseObj['catalog:instructor'];
  _.each(instructors, function (instructorObj) {
    course.instructors.push(parseCourseInfo(instructorObj, models.Instructor));
  });

  const topics = courseObj['catalog:topic'];
  _.each(topics, function (topicObj) {
    const topicType = _.last(topicObj.$.type.split('/'));

    if (topicType === 'subject') {
      course.subject = parseCourseInfo(topicObj, models.Subject);

    } else if (topicType === 'department') {
      course.department = parseCourseInfo(topicObj, models.Department);

    } else if (topicType === 'requirement') {
      course.requirements.push(parseCourseInfo(topicObj, models.Requirement));

    } else if (topicType === 'level') {
      course.level = parseCourseInfo(topicObj, models.Level);
    }
  });

  return course;
}

function parseCourseInfo(obj, model) {
  if (typeof obj === 'string') {
    return new model({rawId: obj});
  }

  if (obj === null) {
    return obj;
  }

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
  const regex = /(.+)-(.+) on (.+?) (at (.+) (.+) )?\((.+) to (.+)\)/;
  const timeFormat = 'hh:mma';
  const dateFormat = 'MMM DD, YYYY';
  const schedule = new models.Schedule({text: scheduleString});

  _.each(scheduleString.split('\n'), function (meetingString) {
    const meeting = new models.Meeting({text: meetingString});

    const matches = meetingString.match(regex);
    if (matches) {
      meeting.startTime = moment(matches[1], timeFormat);
      meeting.endTime = moment(matches[2], timeFormat);
      meeting.days = matches[3].split(', ');

      if (matches[4]) {
        meeting.location = new models.Location({
          rawId: [matches[5], matches[6]].join('/')
        });
      }

      meeting.startDate = moment(matches[7], dateFormat);
      meeting.endDate = moment(matches[8], dateFormat);
    }

    schedule.meetings.push(meeting);
  });

  return schedule;
}
