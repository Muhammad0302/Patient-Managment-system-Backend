const crypto = require('crypto');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// const nodemailer = require("nodemailer");
const validator = require('validator');
const Admin = require('../models/Admin');
const User = require('../models/User');
const sendMail = require('../../helpers/nodeMailer');
const Hospital = require('../models/hospital');
exports.login = (req, res, next) => {
    try {
        const validationErrors = [];
        //Added neccessory validations for admin login credentials
        if (!validator.isEmail(req.body.email)) validationErrors.push('Please enter a valid email address.');
        if (validator.isEmpty(req.body.password)) validationErrors.push('Password cannot be blank.');
        if (validationErrors.length) {
            return res.status(400).send({ status: false, message: "Email and Password is required." });
        }
        //Finding admin against email
        Admin.findOne({
            where: {
                email: req.body.email
            }
        }).then(admin => {
            //Checking if admin exists
            if (admin) {
                //Comparing admin password and db's password
                bcrypt
                    .compare(req.body.password, admin.password)
                    .then(async doMatch => {
                        //Checking password got matched
                        if (doMatch) {
                            // req.session.isLoggedIn = true;
                            // req.session.admin = .dataValues;
                            // return req.session.save(err => {
                            // 	console.log(err);
                            // 	res.redirect('/');
                            // });
                            // if (!admin.dataValues.isVerified) {
                            //     //Checking user verified
                            //     return res.status(200).send({ status: false, message: 'Email veification is required, verify your email and try again.' });

                            // }
                            //Creating tokens for  user session
                            const token = await jwt.sign({
                                data: { adminId: admin.dataValues.id, role: "Admin" }
                            }, process.env.JWT_TOKEN_KEY, { expiresIn: '1h' });

                            const refreshToken = await jwt.sign({
                                data: { adminId: admin.dataValues.id, role: "Admin" }
                            }, process.env.JWT_REFRESH_TOKEN_KEY, { expiresIn: '7d' });
                            const { fullName, id, email } = admin.dataValues;
                            //Sending success if login successful
                            return res.status(200).send({ status: true, message: 'Login successfull.', token, refreshToken, admin: { fullName, id, email } });
                        }
                        else {
                            //Sending error if login not successful
                            return res.status(200).send({ status: false, message: 'Email or Password is incorrect.' });

                        }

                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).send({ status: false, message: 'Sorry! Somethig went wrong.', err });

                    });
            } else {
                return res.status(200).send({ status: false, message: 'No admin found with this email' });

            }
        }).catch(err => {
            console.log(err)
            return res.status(500)({ status: false, message: 'Sorry! Somethig went wrong.', err });
        });
    }
    catch (err) {
        return res.status(400).send({ status: false, message: 'Sorry! Somethig went wrong.', err });

    }
};

exports.logout = (req, res, next) => {
    if (res.locals.isAuthenticated) {
        req.session.destroy(err => {
            return res.redirect('/');
        });
    } else {
        return res.redirect('/login');
    }
};

exports.signUp = (req, res, next) => {
    Admin.findOne({
        where: {
            email: req.body.email
        }
    }).then(admin => {
        //Checking if admin already exists
        if (!admin) {
            //Hashing admin's password
            return bcrypt
                .hash(req.body.password, 12)
                .then(async hashedPassword => {
                    //Creating verfication token
                    const token = await jwt.sign({
                        data: { email: req.body.email }
                    }, process.env.JWT_VERIFY_TOKEN, { expiresIn: `${process.env.VERIFY_TOKEN_EXPIRY}` });
                    //Creating new admin
                    const admin = new Admin({
                        fullName: req.body.fullName,
                        email: req.body.email,
                        password: hashedPassword,
                        verificationToken: token
                    });
                    return admin.save();
                })
                .then(async result => {
                    console.log("result ", result)
                    //Sending verfication email
                    let emailResponse = await sendMail(
                        {
                            from: '"Fred Foo 👻" <foo@example.com>', // sender address
                            to: req.body.email, // list of receivers
                            subject: "Verify Email", // Subject line
                            text: "reset email", // plain text body
                            html: `<b>Verify email at <a href=${process.env.VERIFY_URL}/admin/verify?verificationToken=${result.verificationToken}>Click Here to verify Email</a></b>`, // html body
                        }

                    )
                    return res.status(200).send({ status: true, message: "Admin created succcessfully.", testURI: emailResponse.testURI });

                });
        } else {

            return res.status(400).send({ status: false, message: "E-Mail exists already, please pick a different one." });
        }
    })
        .catch(err => {
            console.log(err)
            return res.status(400).send({ status: false, message: "Error creating admin", err });
        });
};

exports.accountVerify = async (req, res, next) => {
    try {
        const { verificationToken } = req.query;
        console.log("verificationToken ", verificationToken)
        //Decoding email from verfication token
        var decoded = await jwt.verify(verificationToken, process.env.JWT_VERIFY_TOKEN);
        //Searching admin based on decoded email
        Admin.findOne({
            where: {
                email: decoded.data.email
            },
            raw: true
        }).then(async admin => {
            //Checking if admin verfication token equals
            if (admin && admin.verificationToken === verificationToken) {
                //Updating verification status of admin
                let result = await Admin.update({ isVerified: true, verificationToken: null })
                if (result) {

                    res.redirect(process.env.VERIFY_RETURN_URL_SUCCESS)

                } else {
                    res.redirect(process.env.VERIFY_RETURN_URL_FAIL)

                }

            } else {
                res.redirect(process.env.VERIFY_RETURN_URL_FAIL)

                // res.status(200).send({ message:"Invalid token",status:false })

            }
        }).catch(err => {
            console.log(err)
        });

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: "Something went wrong", err });

    }
};

exports.forgotPassword = async (req, res, next) => {
    const validationErrors = [];
    console.log("email", req.body.email)
    try {
        //Validating input values
        if (!validator.isEmail(req?.body?.email)) validationErrors.push('Please enter a valid email address.');

        if (validationErrors.length) {
            return res.status(400).send({ status: false, message: "Please enter a valid email address" });
        }
        //Finding admin before forget password email
        Admin.findOne({
            where: {
                email: req?.body?.email
            }
        }).then(async admin => {
            if (admin) {
                //Creating secure token for forget password
                const token = await jwt.sign({
                    data: { email: req.body.email }
                }, process.env.JWT_RESET_TOKEN, { expiresIn: `${process.env.VERIFY_TOKEN_EXPIRY}` });

                admin.resetToken = token;
                admin.resetTokenExpiry = Date.now() + 3600000;
                //Adding token admin's db document
                const adminSave = await admin.save();
                if (!adminSave) {
                    return res.status(500).send({ status: false, message: "Something went wrong" });

                }
                console.log("before forget password email ")
                //Sending token to user's email
                let emailResponse = await sendMail(
                    {
                        from: '"Fred Foo 👻" <foo@example.com>', // sender address
                        to: req.body.email, // list of receivers
                        subject: "Reset password Email", // Subject line
                        text: "reset email", // plain text body
                        html: `<b>Verify email at <a href=${process.env.VERIFY_URL}/api/reset-password?verificationToken=${token}>Click Here to reset Password</a></b>`, // html body
                    }

                );
                res.status(200).send({ message: "A link has been sent to your registered email. ", status: !!admin, testURI: emailResponse.testURI })

            } else {
                res.status(200).send({ message: "A link has been sent to your registered email. ", status: !!admin })

            }
        }).catch(err => {
            console.log(err)
        });;

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: "Something went wrong", err });

    }

};

exports.resetPassword = async (req, res, next) => {
    try {
        const { verificationToken, password } = req.body;
        //Decoding admin's email from verification token
        var decoded = await jwt.verify(verificationToken, process.env.JWT_RESET_TOKEN);
        //Finding admin by admin's email
        Admin.findOne({
            where: {
                email: decoded.data.email
            }
        }).then(async admin => {
            //Checking if resetToken is equal
            if (admin && admin.resetToken === verificationToken) {
                //Encrypting new admin's password
                return bcrypt
                    .hash(password, 12)
                    .then(async hashedPassword => {
                        //Updating admin's doc with updated password
                        let result = await admin.update({ password: hashedPassword, resetToken: null, resetTokenExpiry: null })
                        if (result) {
                            //Sending success if passord gets updated
                            res.status(200).send({ message: "Password updated", status: true })


                        } else {
                            //Sending error if password doesn't updated
                            res.status(200).send({ message: "Err updating password try again", status: false })

                        }

                    })
            } else {
                // res.redirect(process.env.VERIFY_RETURN_URL_FAIL)

                res.status(200).send({ message: "Invalid token", status: false })

            }
        }).catch(err => {
            console.log(err)
        });

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: "Something went wrong", err });

    }
};
exports.getAdmin = async (req, res, next) => {
    try {
        console.log(req.auth)
        //Extracting adminId from token
        const adminId = req?.auth?.data?.adminId;
        //Finding admin by adminId
        Admin.findOne({
            where: {
                id: adminId
            }
        }).then(async admin => {

            // res.redirect(process.env.VERIFY_RETURN_URL_FAIL)
            const { fullName, id, email } = admin;
            //Sending Admin Info If Found
            res.status(200).send({ status: true, admin: { fullName, id, email } })


        }).catch(err => {
            console.log(err)
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: "Something went wrong", err });

    }
};
exports.viewAllUsers = async (req, res, next) => {
    try {
        console.log(req.body)
        console.log(req.auth)
        const role = req?.auth?.data?.role;
        console.log("role ", role)
        if (role !== "Admin") {
            return res.status(400).send({
                success: false,
                message: "Only Admin Can View All Users"
            });
        }
        const users = await User.findAll({
            raw: true,
        })
        console.log("users ", users)
        if (users.length > 0) {
            return res.status(200).send({
                success: true,
                message: "All Users Found",
                users: users
            });
        } else {
            return res.status(404).send({
                success: false,
                message: "Users Not Found"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ success: false, message: "Internal Server Error", err });

    }

};
exports.addUser = (req, res, next) => {
    console.log(req.auth)
    console.log(req.params)
    //Extracting role from admin token
    const role = req?.auth?.data?.role;
    console.log("role ", role)
    if (!role) {
        //Sending error if user requesting isn't admin
        return res.status(401).send({
            status: false,
            message: "Only Admin Can Add User"
        });
    }
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            //Hashing user's password
            return bcrypt
                .hash(req.body.password, 12)
                .then(async hashedPassword => {
                    const token = await jwt.sign({
                        data: { email: req.body.email }
                    }, process.env.JWT_VERIFY_TOKEN, { expiresIn: `${process.env.VERIFY_TOKEN_EXPIRY}` });
                    //Creating new user 
                    const user = new User({
                        fullName: req.body.fullName,
                        email: req.body.email,
                        password: hashedPassword,
                        isVerified: true,
                        verificationToken: token
                    });
                    return user.save();
                })
                .then(async result => {
                    //Sending email if user gets created
                    let emailResponse = await sendMail(
                        {
                            from: '"Fred Foo 👻" <foo@example.com>', // sender address
                            to: req.body.email, // list of receivers
                            subject: "Verify Email", // Subject line
                            text: "reset email", // plain text body
                            html: `<b>Verify email at <a href=${process.env.VERIFY_URL}/api/verify?verificationToken=${result.verificationToken}>Click Here to verify Email</a></b>`, // html body
                        }

                    )
                    return res.status(200).send({ status: true, message: "User created succcessfully.", testURI: emailResponse.testURI });

                });
        } else {

            return res.status(400).send({ status: false, message: "E-Mail exists already, please pick a different one." });
        }
    })
        .catch(err => {
            console.log(err)
            return res.status(400).send({ status: false, message: "Error creating user", err });
        });
};
exports.updateUser = async (req, res, next) => {
    try {
        console.log(req.body)
        console.log(req.auth)
        console.log(req.params)
        //Extracting role from admin token
        const role = req?.auth?.data?.role;
        console.log("role ", role)

        if (!role) {
            //Sending error if user requesting isn't admin
            return res.status(401).send({
                status: false,
                message: "Only Admin Can Update"
            });
        }
        const user = await User.findOne({ where: { id: req.params.userId }, raw: true });
        if (!user) {
            //Sending error if user doesn't get found
            return res.status(404).send({
                status: false,
                message: "User Not Found"
            });
        }
        var encryptedPassword;
        if (req.body.password) {
            //Encrypting user's new password
            await bcrypt
                .hash(req.body.password, 12)
                .then(async hashedPassword => {
                    console.log("hashedPassword ", hashedPassword)
                    encryptedPassword = hashedPassword
                })
        }
        //Updating user
        const updatedUser = await User.update(
            {
                password: encryptedPassword ? encryptedPassword : user.password,
                fullName: req.body.fullName ? req.body.fullName : user.fullName
            },
            {
                where: { id: req.params.userId },
            }
        );
        console.log("updatedUser ", updatedUser)
        if (updatedUser[0] > 0) {
            //Sending success admin gets updated
            return res.status(200).send({
                status: true,
                message: "User Updated",
                updatedOrder: updatedUser
            });
        } else {
            return res.status(404).send({
                status: false,
                message: "User Not Updated"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: "Internal Server Error", err });
    }

};
exports.deleteUser = async (req, res, next) => {
    try {
        console.log(req.auth)
        console.log(req.params)
        //Extracting role from admin token
        const role = req?.auth?.data?.role;
        console.log("role ", role)

        if (!role) {
            //Sending error if user requesting isn't admin
            return res.status(401).send({
                status: false,
                message: "Only Admin Can Delete"
            });
        }
        //Finding user by id
        const user = await User.findOne({
            where: { id: req.params.userId },
        });

        if (user) {
            console.log("user ", user)
            //Deleting user if doesn't exists
            var deleted = await user.destroy({ raw: true }); // deletes the row
            if (deleted) {
                //Sending success if deleted
                return res.status(200).send({
                    status: true,
                    message: "User Deleted",
                    deletedUser: user
                });
            } else {
                return res.status(400).send({
                    status: false,
                    message: "User Not Deleted"
                });
            }
        } else {
            return res.status(404).send({
                status: false,
                message: "User Not Found By This Id"
            });
        }

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: "Internal Server Error", err });

    }


};
exports.getUser = async (req, res, next) => {
    try {
        console.log(req.params.userId)
        //Finding user by id
        User.findOne({
            where: {
                id: req.params.userId
            }
        }).then(async user => {
            // res.redirect(process.env.VERIFY_RETURN_URL_FAIL)
            console.log("user ", user)
            if (!user) {
                return res.status(404).send({
                    status: false,
                    message: "User Not Found By This Id"
                });
            }
            const { fullName, id, email } = user;
            //Sending success if user detail get found
            res.status(200).send({ status: true, user: { fullName, id, email } })


        }).catch(err => {
            console.log(err)
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: "Something went wrong", err });

    }
};
exports.addHospital = async (req, res, next) => {
    try {
        console.log(req.auth)
        console.log(req.params)
        //Extracting role from admin token
        const role = req?.auth?.data?.role;
        console.log("role ", role)
        if (!role) {
            //Sending error if user requesting isn't admin
            return res.status(401).send({
                status: false,
                message: "Only Admin Can Add User"
            });
        }
        const hospital = await new Hospital({
            name: req.body.name,
            Address: req.body.Address,
            cityName: req.body.cityName,
            countryName: req.body.countryName,
            Province: req.body.Province,
            zipCode: req.body.zipCode
        }).save();
        if (hospital) {
            return res.status(200).send({ status: true, hospital: hospital })
        } else {
            return res.status(400).send({ status: false, message: "Something went wrong" })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: "Something went wrong", err });

    }

};

exports.viewAllHospitals = async (req, res, next) => {
    try {
        console.log(req.body)
        console.log(req.auth)
        const role = req?.auth?.data?.role;
        console.log("role ", role)
        if (role !== "Admin") {
            return res.status(400).send({
                success: false,
                message: "Only Admin Can View All Users"
            });
        }
        const hospitals = await Hospital.findAll({
            raw: true,
        })
        console.log("hospitals ", hospitals)
        if (hospitals.length > 0) {
            return res.status(200).send({
                success: true,
                message: "All Hospitals Found",
                hospitals: hospitals
            });
        } else {
            return res.status(404).send({
                success: false,
                message: "hospitals Not Found"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ success: false, message: "Internal Server Error", err });

    }

};

exports.deleteHospital = async (req, res, next) => {
    try {
        console.log(req.body)
        console.log(req.auth)
        const role = req?.auth?.data?.role;
        const {id}=req.body;
        console.log("role ", role)
        if (role !== "Admin") {
            return res.status(400).send({
                success: false,
                message: "Only Admin Can View All Users"
            });
        }
        const hospitals = await Hospital.destroy({where:{id:id}})
        console.log("hospitals ", hospitals)
        if (hospitals) {
            return res.status(200).send({
                success: true,
                message: "Deleted"
            });
        } else {
            return res.status(404).send({
                success: false,
                message: "hospitals Not Found"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ success: false, message: "Internal Server Error", err });

    }

};