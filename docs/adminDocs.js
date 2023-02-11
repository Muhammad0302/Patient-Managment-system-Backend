    //Admin APIs Started
/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - email
 *         - fullName
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email of User
 *         fullName:
 *           type: string
 *           description: Full Name of User
 *         password:
 *           type: string
 *           description: Password of User
 *         
 * 
 *       example:
 *         email: harisbakhabarpk@gmail.com
 *         fullName: Haris Abbasi
 *         password: Hahaha88*
 *     Login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: email of User
 *         password:
 *           type: string
 *           description: password of User
 * 
 *       example:
 *         email: harisbakhabarpk@gmail.com
 *         password: Hahaha88
 *     verificationToken:
 *       type: string
 *       properties:
 *         otp:
 *           type: string
 *           description: verificationToken of User
 * 
 *       example:
 *         verificationToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoidXNhbWEuc2FtYUBnbWFpbC5jb20ifSwiaWF0IjoxNjU5MzU4ODg0LCJleHAiOjE2NTkzNTg5NDR9.ty0UhuFL10DHRgW1_oijGQOGwkl8Ej5YWjJC5yA6Axs
 *     Forgetpassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: email of User
 * 
 *       example:
 *         email: harisbakhabarpk@gmail.com
 *     Changeorderstatus:
 *       type: object
 *       properties:
 *         newStatus:
 *           type: string
 *           description: New Status of order
 * 
 *       example:
 *         newStatus: Order Dispatched
 *     Searchorder:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Status of order
 * 
 *       example:
 *         status: Order Confirmed
 *     Resetpassword:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *           description: password of User
 *         confirmPassword:
 *           type: string
 *           description: confirmPassword of User
 *         verificationToken:
 *           type: string
 *           description: verificationToken of User
 * 
 *       example:
 *         password: Hahaha88
 *         confirmPassword: Hahaha88
 *         verificationToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiaGFyaXNiYWtoYWJhcnBrQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NTk1OTc0NTgsImV4cCI6MTY1OTU5NzUxOH0.NnKplcKYvZKcIemRmzocML7zNdyXPuXQR4jWRTxrydc
 * 
 */
/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: The Admins managing API
 */
/**
 * @swagger
 * /admin/sign-up:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: The admin was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * /admin/verify?verificationToken=:
 *  post:
 *    summary: To Verify Token
 *    tags: [Admins]
 *    requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Login'
 *    description: use to verify user
 *    parameters:
 *       - in: path
 *         name: verificationToken
 *         required: true
 *         description: verificationToken of the user to retrieve.
 *         schema:
 *           type: string
 *    responses:
 *       '200':
 *         description: A successful request
 */
/**
* @swagger
* /admin/login:
*   post:
*     summary: To Login Admin
*     tags: [Admins]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Login'
*     responses:
*       200:
*         description: The user was logged in successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Login'
*       500:
*         description: Some server error
*/
/**
* @swagger
* /admin/forgot-password:
*   post:
*     summary: To Get Forget Password Url
*     tags: [Admins]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Forgetpassword'
*     responses:
*       200:
*         description: The user was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Forgetpassword'
*       500:
*         description: Some server error
*/
/**
 * @swagger
 * /admin/reset-password:
 *   post:
 *     summary: To Reset Password
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resetpassword'
 *     responses:
 *       200:
 *         description: Admin's New Password Has Been Set
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * /admin/admin:
 *  get:
 *    summary: To Get Admin
 *    tags: [Admins]
 *    description: use to get admin
 *    responses:
 *       '200':
 *         description: A successful request
 */
/**
 * @swagger
 * /admin/adduser:
 *   post:
 *     summary: Add a user
 *     tags: [Admins]
 *     description: use to add order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * /admin/updateuser/3:
 *   patch:
 *     summary: Update A User
 *     tags: [Admins]
 *     description: use to update user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * /admin/deleteuser/3:
 *  delete:
 *    summary: To Delete User
 *    tags: [Admins]
 *    description: use to delete user
 *    responses:
 *       '200':
 *         description: A successful request
 */
/**
 * @swagger
 * /admin/getUser/3:
 *  get:
 *    summary: To Get User
 *    tags: [Admins]
 *    description: use to get user
 *    responses:
 *       '200':
 *         description: A successful request
 */
/**
 * @swagger
 * /admin/deactivateUser/3:
 *  get:
 *    summary: To Deactivate User
 *    tags: [Admins]
 *    description: use to deactivate user
 *    responses:
 *       '200':
 *         description: A successful request
 */
