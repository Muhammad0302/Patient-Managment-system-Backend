const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");

// load dependencies
const env = require("dotenv");
var cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
var { expressjwt: jwt } = require("express-jwt");
const app = express();
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
//Loading Routes
const webRoutes = require("./routes/web");
const adminRoutes = require("./routes/admin");
const sequelize = require("./config/database");
const errorController = require("./app/controllers/ErrorController");
app.use(cors());

env.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EMTranPro Backend APIs with Swagger",
      version: "0.1.0",
      description:
        "This is a EMTranPro application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Codistan",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./docs/adminDocs.js"],
};

// const InsertQuestionData = async (row) => {
//   console.log("Insert");
//   return await sequelize.query(
//     `INSERT INTO options (question_id, type, bengali, arabic, chinese, english, french, german, greek, gujrati, hindi, italian, japanese, korean, persian, polish, portuguese, punjabi, russian, spanish, tagalog_filipino, vietnamese)
//   VALUES ("${row[0]}", "${row[1]}", "${row[2]}", "${row[3]}", "${row[4]}", "${row[5]}", "${row[6]}", "${row[7]}", "${row[8]}", "${row[9]}", "${row[10]}", "${row[11]}", "${row[12]}", "${row[13]}", "${row[14]}", "${row[15]}", "${row[16]}", "${row[17]}", "${row[18]}", "${row[19]}", "${row[20]}", "${row[21]}")`,
//     { raw: true }
//   );
// };

// var csvData = [];
// fs.createReadStream("D:/Codistan-Projects/emtran-pro/EMTran_Pro_Options.csv")
//   .pipe(parse({ delimiter: "," }))
//   .on("data", function (csvrow) {
//     if (csvData?.length > 0) {
//       // console.log(csvrow);
//       InsertQuestionData(csvrow)
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//     //do something with csvrow
//     csvData.push(csvrow);
//   })
//   .on("end", function () {
//     //do something with csvData
//     // console.log(csvData);
//     // csvData.map((row) =>
//     //   InsertQuestionData(row)
//     //     .then((res) => {
//     //       console.log(res);
//     //     })
//     //     .catch((err) => {
//     //       console.log(err);
//     //     })
//     // );
//   });

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(
  jwt({
    secret: process.env.JWT_TOKEN_KEY,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/sign-up",
      "/api/login",
      "/api/reset-password",
      "/api/forget-password",
      "/api/verify",
      "/api/test",
      "/admin/sign-up",
      "/admin/login",
      "/admin/reset-password",
      "/admin/forgot-password",
      "/admin/verify",
      "/api/test",
    ],
  })
);
app.use("/api", webRoutes);
app.use("/admin", adminRoutes);
const init = require("./app/models/init");
sequelize
  // .sync({ alter: true })
  .sync()
  .then(() => {
    app.listen(process.env.PORT);
    //pending set timezone

    console.log("App listening on port " + process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
