"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.createLayout = void 0;
var catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
var ErrorHandler_1 = require("../util/ErrorHandler");
var cloudinary = require("cloudinary");
var layout_model_1 = require("../models/layout.model");
//create layout
exports.createLayout = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var type, isTypeExist, _a, image, title, subTitle, myCloud, banner, faq, faqItems, categories, categoryItems, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                type = req.body.type;
                return [4 /*yield*/, layout_model_1.default.findOne({ type: type })];
            case 1:
                isTypeExist = _b.sent();
                if (isTypeExist) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Type already exists", 400))];
                }
                if (!(type === "Banner")) return [3 /*break*/, 4];
                _a = req.body, image = _a.image, title = _a.title, subTitle = _a.subTitle;
                return [4 /*yield*/, cloudinary.v2.uploader.upload(image, {
                        folder: "layout",
                    })];
            case 2:
                myCloud = _b.sent();
                banner = {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    },
                    title: title,
                    subTitle: subTitle
                };
                return [4 /*yield*/, layout_model_1.default.create(banner)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                if (!(type === "FAQ")) return [3 /*break*/, 7];
                faq = req.body.faq;
                return [4 /*yield*/, Promise.all(faq.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, {
                                    question: item.question,
                                    answer: item.answer
                                }];
                        });
                    }); }))];
            case 5:
                faqItems = _b.sent();
                return [4 /*yield*/, layout_model_1.default.create({ type: "FAQ", faq: faqItems })];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                if (!(type === "Categories")) return [3 /*break*/, 10];
                categories = req.body.categories;
                return [4 /*yield*/, Promise.all(categories.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, {
                                    title: item.title,
                                }];
                        });
                    }); }))];
            case 8:
                categoryItems = _b.sent();
                return [4 /*yield*/, layout_model_1.default.create({ type: "Categories", categories: categoryItems })];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10:
                res.status(200).json({
                    success: true,
                    message: "Layout created successfully"
                });
                return [3 /*break*/, 12];
            case 11:
                err_1 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(err_1.message, 500))];
            case 12: return [2 /*return*/];
        }
    });
}); });
//edit layout
/*export const editLayout = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {type} = req.body;
        if(type === "Banner"){
            const bannerData:any = await LayoutModel.findOne({type:"Banner"});
            const {image,title,subTitle} = req.body;
            if(bannerData){
                await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
            }
            const myCloud = await cloudinary.v2.uploader.upload(image,{
                folder:"layout",
            })
            const banner ={
                image:{
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url
                },
                title,
                subTitle
            }
            await LayoutModel.findByIdAndUpdate(bannerData.id,{banner});
        }
        if(type === "FAQ"){
            const {faq} = req.body;
            const faqItem = await LayoutModel.findOne({type:"FAQ"});
            const faqItems = await Promise.all(
                faq.map(async (item:any)=>{
                    return{
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(faqItem?.id,{type:"FAQ",faq:faqItems});
        }

        if(type === "Categories"){
            const {categories} = req.body;
            const categoryItems = await Promise.all(
                categories.map(async (item:any)=>{
                    return{
                        title: item.title,
                    }
                })
            )
            await LayoutModel.create({type:"Categories",categories:categoryItems});
        }
        res.status(200).json({
            success:true,
            message:"Layout created successfully"
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }

});*/
//get layout
exports.getLayoutByType = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var type, layout, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                type = req.body.type;
                return [4 /*yield*/, layout_model_1.default.findOne(type)];
            case 1:
                layout = _a.sent();
                res.status(200).json({
                    success: true,
                    layout: layout
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(err_2.message, 500))];
            case 3: return [2 /*return*/];
        }
    });
}); });
