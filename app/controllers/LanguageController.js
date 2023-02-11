// const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
// const nodemailer = require("nodemailer");
// const validator = require('validator');
const Language = require('../models/Language');
// const sendMail = require('../../helpers/nodeMailer')


exports.getLanguage =async (req, res, next) => {
	try {
	 res.status(200).send({status:true,data:await Language.findAll()})
	}
	catch (err) {
		return res.status(400).send({ status: false, message: 'Sorry! Somethig went wrong.', err });

	}
};