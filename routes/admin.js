const express = require('express');
const router = express.Router();
const AdminController = require('../app/controllers/adminController');
console.log("admin")
router.get('/ping', (req,res)=>{
    res.status(200).send("Server is accessable !!")
});
router.post('/login', AdminController.login);
router.post('/logout', AdminController.logout);
router.get('/verify', AdminController.accountVerify);
router.post('/sign-up', AdminController.signUp);
router.post('/forgot-password', AdminController.forgotPassword);
router.post('/reset-password', AdminController.resetPassword);
//Route for getting who is the admin
router.get('/admin', AdminController.getAdmin);
//Route for viewing all users
router.get('/viewAllUsers', AdminController.viewAllUsers);
//Route for adding new docter
router.post('/adduser', AdminController.addUser);
//Route for updating docter
router.patch('/updateuser/:userId', AdminController.updateUser);
//Route for deleting docter
router.delete('/deleteuser/:userId', AdminController.deleteUser);
//Route for getting any docter
router.get('/getUser/:userId', AdminController.getUser);
//Route for viewing all hospitals
router.get('/viewAllHospitals', AdminController.viewAllHospitals);
//Route for adding new hospital
router.post('/addhospital', AdminController.addHospital);
router.delete('/delete_hospital', AdminController.deleteHospital);
module.exports = router;