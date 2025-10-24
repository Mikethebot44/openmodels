"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenModelsError = void 0;
exports.parseSSEStream = parseSSEStream;
var OpenModelsError = /** @class */ (function (_super) {
    __extends(OpenModelsError, _super);
    function OpenModelsError(message, status, code) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        _this.code = code;
        _this.name = 'OpenModelsError';
        return _this;
    }
    return OpenModelsError;
}(Error));
exports.OpenModelsError = OpenModelsError;
function parseSSEStream(response) {
    return __asyncGenerator(this, arguments, function parseSSEStream_1() {
        var text, lines, _i, lines_1, line, trimmed, data, parsed, e_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!response.body) {
                        throw new OpenModelsError('Response body is null');
                    }
                    // Handle authentication errors before parsing stream
                    if (response.status === 401) {
                        throw new OpenModelsError('Invalid API key. Please check your credentials.', 401);
                    }
                    if (response.status === 403) {
                        throw new OpenModelsError('Insufficient credits. Please top up your account.', 403);
                    }
                    return [4 /*yield*/, __await(response.text())];
                case 1:
                    text = _d.sent();
                    lines = text.split('\n');
                    _i = 0, lines_1 = lines;
                    _d.label = 2;
                case 2:
                    if (!(_i < lines_1.length)) return [3 /*break*/, 12];
                    line = lines_1[_i];
                    trimmed = line.trim();
                    if (trimmed === '')
                        return [3 /*break*/, 11];
                    if (!(trimmed === '[DONE]')) return [3 /*break*/, 4];
                    return [4 /*yield*/, __await(void 0)];
                case 3: return [2 /*return*/, _d.sent()];
                case 4:
                    if (!trimmed.startsWith('data: ')) return [3 /*break*/, 11];
                    data = trimmed.slice(6);
                    if (!(data === '[DONE]')) return [3 /*break*/, 6];
                    return [4 /*yield*/, __await(void 0)];
                case 5: return [2 /*return*/, _d.sent()];
                case 6:
                    _d.trys.push([6, 10, , 11]);
                    parsed = JSON.parse(data);
                    if (!((_c = (_b = (_a = parsed.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.delta) === null || _c === void 0 ? void 0 : _c.content)) return [3 /*break*/, 9];
                    return [4 /*yield*/, __await(parsed.choices[0].delta.content)];
                case 7: return [4 /*yield*/, _d.sent()];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_1 = _d.sent();
                    // Skip malformed JSON
                    return [3 /*break*/, 11];
                case 11:
                    _i++;
                    return [3 /*break*/, 2];
                case 12: return [2 /*return*/];
            }
        });
    });
}
