"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.OpenModels = void 0;
exports.client = client;
var modal_1 = require("./providers/modal");
var streaming_1 = require("./streaming");
var registry_1 = require("./registry");
var service_urls_1 = require("./config/service-urls");
var OpenModels = /** @class */ (function () {
    function OpenModels(config) {
        if (config === void 0) { config = {}; }
        // Validate that API key is provided
        if (!config.apiKey) {
            throw new streaming_1.OpenModelsError('API key is required. Please provide an API key in the client configuration.');
        }
        // Validate API key format
        if (!config.apiKey.startsWith('om_') || config.apiKey.length < 10) {
            throw new streaming_1.OpenModelsError('Invalid API key format. API keys must start with "om_" and be at least 10 characters long.');
        }
        // Initialize providers with service-specific URLs
        this.textProvider = new modal_1.ModalProvider({
            apiKey: config.apiKey,
            baseUrl: (0, service_urls_1.getServiceUrl)('text'),
        });
        this.embedProvider = new modal_1.ModalProvider({
            apiKey: config.apiKey,
            baseUrl: (0, service_urls_1.getServiceUrl)('embed'),
        });
        this.imageProvider = new modal_1.ModalProvider({
            apiKey: config.apiKey,
            baseUrl: (0, service_urls_1.getServiceUrl)('image'),
        });
        this.audioProvider = new modal_1.ModalProvider({
            apiKey: config.apiKey,
            baseUrl: (0, service_urls_1.getServiceUrl)('audio'),
        });
        this.visionProvider = new modal_1.ModalProvider({
            apiKey: config.apiKey,
            baseUrl: (0, service_urls_1.getServiceUrl)('vision'),
        });
    }
    OpenModels.prototype.chat = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.textProvider.chat(request)];
                    case 1:
                        response = _a.sent();
                        if (request.stream) {
                            return [2 /*return*/, (0, streaming_1.parseSSEStream)(response)];
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_1 = _a.sent();
                        if (error_1 instanceof Error) {
                            throw new streaming_1.OpenModelsError(error_1.message);
                        }
                        throw new streaming_1.OpenModelsError('Unknown error occurred');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OpenModels.prototype.embed = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.embedProvider.embed(request)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_2 = _a.sent();
                        if (error_2 instanceof Error) {
                            throw new streaming_1.OpenModelsError(error_2.message);
                        }
                        throw new streaming_1.OpenModelsError('Unknown error occurred');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OpenModels.prototype.image = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.imageProvider.image(request)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_3 = _a.sent();
                        if (error_3 instanceof Error) {
                            throw new streaming_1.OpenModelsError(error_3.message);
                        }
                        throw new streaming_1.OpenModelsError('Unknown error occurred');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OpenModels.prototype.run = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, model, chatReq, response, model, imgReq, response, model, embReq, response, model, aReq, response, model, aReq, response, model, vReq, response, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 21, , 22]);
                        _a = request.task;
                        switch (_a) {
                            case 'text-generation': return [3 /*break*/, 1];
                            case 'image-generation': return [3 /*break*/, 4];
                            case 'embedding': return [3 /*break*/, 7];
                            case 'audio-transcribe': return [3 /*break*/, 10];
                            case 'audio-summarize': return [3 /*break*/, 13];
                            case 'image-classification': return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 19];
                    case 1:
                        model = request.model || (0, registry_1.getDefaultModel)('text-generation');
                        chatReq = __assign(__assign({}, request), { model: model });
                        return [4 /*yield*/, this.textProvider.chat(chatReq)];
                    case 2:
                        response = _b.sent();
                        if (chatReq.stream)
                            return [2 /*return*/, (0, streaming_1.parseSSEStream)(response)];
                        return [4 /*yield*/, response.json()];
                    case 3: return [2 /*return*/, (_b.sent())];
                    case 4:
                        model = request.model || (0, registry_1.getDefaultModel)('image-generation');
                        imgReq = __assign(__assign({}, request), { model: model });
                        return [4 /*yield*/, this.imageProvider.image(imgReq)];
                    case 5:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 6: return [2 /*return*/, (_b.sent())];
                    case 7:
                        model = request.model || (0, registry_1.getDefaultModel)('embedding');
                        embReq = __assign(__assign({}, request), { model: model });
                        return [4 /*yield*/, this.embedProvider.embed(embReq)];
                    case 8:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 9: return [2 /*return*/, (_b.sent())];
                    case 10:
                        model = request.model || (0, registry_1.getDefaultModel)('audio-transcribe');
                        aReq = __assign(__assign({}, request), { model: model });
                        return [4 /*yield*/, this.audioProvider.audioTranscribe(aReq)];
                    case 11:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 12: return [2 /*return*/, (_b.sent())];
                    case 13:
                        model = request.model || (0, registry_1.getDefaultModel)('audio-summarize');
                        aReq = __assign(__assign({}, request), { model: model });
                        return [4 /*yield*/, this.audioProvider.audioSummarize(aReq)];
                    case 14:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 15: return [2 /*return*/, (_b.sent())];
                    case 16:
                        model = request.model || (0, registry_1.getDefaultModel)('image-classification');
                        vReq = __assign(__assign({}, request), { model: model });
                        return [4 /*yield*/, this.visionProvider.visionClassify(vReq)];
                    case 17:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 18: return [2 /*return*/, (_b.sent())];
                    case 19: throw new streaming_1.OpenModelsError('Unsupported task');
                    case 20: return [3 /*break*/, 22];
                    case 21:
                        error_4 = _b.sent();
                        if (error_4 instanceof Error)
                            throw new streaming_1.OpenModelsError(error_4.message);
                        throw new streaming_1.OpenModelsError('Unknown error occurred');
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    return OpenModels;
}());
exports.OpenModels = OpenModels;
function client(config) {
    return new OpenModels(config);
}
