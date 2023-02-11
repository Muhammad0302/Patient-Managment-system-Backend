// const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
// const nodemailer = require("nodemailer");
// const validator = require('validator');
const Question = require("../models/Question");
const Option = require("../models/Option");
const Submission = require("../models/Submission");
const PatientHistory = require("../models/PatientHistory");
const User = require("../models/User");
// const sendMail = require('../../helpers/nodeMailer')

exports.getQuestion = async (req, res, next) => {
  try {
    res.status(200).send({
      status: true,
      data: await Question.findAll({
        include: [
          {
            model: Option,
            // required: true,
          },
        ],
      }),
    });
  } catch (err) {
    return res
      .status(400)
      .send({ status: false, message: "Sorry! Somethig went wrong.", err });
  }
};
exports.saveResponse = async (req, res, next) => {
  try {
    const userId = req?.auth?.data?.userId;
    const { user_response, lang, name, gender, age } = req.body;
    console.log("DATA_FROM_CLIENT", req.body);
    const responseData = [];
    if (user_response) {
      const patientRecords = await new PatientHistory({
        user_id: userId,
        language: lang,
        name,
        gender,
        age,
      }).save();

      Object.keys(user_response).map((questionId) => {
        let question_response = {
          question_id: questionId,
          user_id: userId,
          option_response: user_response[questionId],
          PatientHistory_id: patientRecords.id,
        };
        responseData.push(question_response);
      });

      Submission.bulkCreate(responseData).then((result) => {
        if (result) {
          res
            .status(200)
            .send({ status: true, message: "Response submitted successfully" });
        } else {
          res.status(200).send({
            status: false,
            message: "Could not save you response, try again",
          });
        }
      });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "User Response not found." });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: false, message: "Sorry! Somethig went wrong.", err });
  }
};

exports.getSessions = async (req, res, next) => {
  try {
    const userId = req?.auth?.data?.userId;

    res.status(200).send({
      status: true,
      data: await PatientHistory.findAll({
        where: {
          user_id: userId,
        },
      }),
    });
  } catch (err) {
    return res
      .status(400)
      .send({ status: false, message: "Sorry! Somethig went wrong.", err });
  }
};
exports.getSessionsById = async (req, res, next) => {
  try {
    const userId = req?.auth?.data?.userId;
    const { id } = req?.params;

    console.log(id);

    if (!id) {
      return res
        .status(400)
        .send({ status: false, message: "Sorry! param id is required." });
    }
    res.status(200).send({
      status: true,
      data: await Submission.findAll({
        where: {
          user_id: userId,
          PatientHistory_id: id,
        },
      }),
    });
  } catch (err) {
    return res
      .status(400)
      .send({ status: false, message: "Sorry! Somethig went wrong.", err });
  }
};
