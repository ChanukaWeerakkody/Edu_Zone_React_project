"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_2 = require("mongoose");
var reviewSchema = new mongoose_2.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
});
var linkSchema = new mongoose_2.Schema({
    title: String,
    url: String
});
var commentSchema = new mongoose_2.Schema({
    user: Object,
    comment: String,
    commentReplies: [Object],
});
var courseDataSchema = new mongoose_2.Schema({
    videoUrl: String,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestions: String,
    questions: [commentSchema],
});
var courseSchema = new mongoose_2.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
        required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });
var CourseModel = mongoose_1.default.model("Course", courseSchema);
exports.default = CourseModel;
