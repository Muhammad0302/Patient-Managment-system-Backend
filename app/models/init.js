const Option = require('./Option');
const Question = require('./Question');
const Organization = require('./Organization');
const User = require('./User');
const Submission = require('./Submission');
const PatientHistory = require('./PatientHistory');


Question.hasMany(Option, { foreignKey: 'question_id' });
Option.belongsTo(Question, { foreignKey: 'question_id' });

Question.hasMany(Submission, { foreignKey: 'question_id' });
Submission.belongsTo(Question, { foreignKey: 'question_id' });


User.hasMany(PatientHistory, { foreignKey: 'user_id' });
PatientHistory.belongsTo(User, { foreignKey: 'user_id' });

PatientHistory.hasMany(Submission, { foreignKey: 'PatientHistory_id' });
Submission.belongsTo(PatientHistory, { foreignKey: 'PatientHistory_id' });

