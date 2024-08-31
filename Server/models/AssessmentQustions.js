const mongoose = require('mongoose');
const { Schema } = mongoose
const AssessmentsQuestions = new Schema({
    question: { type: String, required: true },
    options: [{ type: String }], // Array of options
    answer: { type: String },
    questionType: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true }
});

AssessmentsQuestions.virtual('id').get(function() {
    return this._id.toHexString();
});

AssessmentsQuestions.set('toJSON', {
    virtuals: true, 
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

const assessmentQuestions = mongoose.model('AssessmentsQuestion', AssessmentsQuestions);
module.exports = assessmentQuestions;