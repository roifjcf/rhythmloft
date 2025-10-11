"use client";
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
        while (_) try {
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
require("./characterchat.scss");
var textInputWithSound_1 = require("../textInputWithSound");
var languageContext_1 = require("@/contexts/languageContext");
var react_markdown_1 = require("react-markdown");
var rehype_raw_1 = require("rehype-raw");
var remark_gfm_1 = require("remark-gfm");
function CharacterChat() {
    var _this = this;
    var _a = react_1.useState(""), input = _a[0], setInput = _a[1];
    var _b = react_1.useState(null), messages = _b[0], setMessages = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var messagesEndRef = react_1.useRef(null);
    var encouragementTimeoutRef = react_1.useRef(null);
    var lang = languageContext_1.useLanguage().lang;
    var language = {
        EN: "English",
        JP: "Japanese",
        ID: "Indonesian",
        ZH_CN: "Chinese (Simplified)",
        ZH_TW: "Chinese (Traditional)"
    }[lang];
    react_1.useEffect(function () {
        var stored = localStorage.getItem("characterChatMessages");
        if (stored)
            setMessages(JSON.parse(stored));
        else
            setMessages([]);
    }, []);
    // save to localStorage on messages change
    react_1.useEffect(function () {
        if (messages === null)
            return; // don't save until loaded
        var last20 = messages.filter(function (m) { return !m.isAuto; }).slice(-20);
        localStorage.setItem("characterChatMessages", JSON.stringify(last20));
    }, [messages]);
    react_1.useEffect(function () {
        var fetchWelcomeMessage = function () { return __awaiter(_this, void 0, void 0, function () {
            var stored, recentMessages, contextString, res, data_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        stored = localStorage.getItem("characterChatMessages");
                        recentMessages = stored ? JSON.parse(stored).slice(-20) : [];
                        if (recentMessages.length > 0) {
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        contextString = recentMessages
                            .map(function (m) { return m.role + ": " + m.content; })
                            .join("\n");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, fetch("/api/ollamaChat", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    message: "\n            As Rin, write a short and cozy greeting to the user in " + language + ".\n            Based on the recent conversation:\n            " + contextString + "\n            Encourage them gently for the rest of the day, keeping a relaxed vibe.\n          "
                                })
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data_1 = _a.sent();
                        setMessages(function (prev) { return __spreadArrays((prev !== null && prev !== void 0 ? prev : []), [{ role: "assistant", content: data_1.content || "(No welcome message)" }]); });
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _a.sent();
                        console.error(err_1);
                        setMessages([{ role: "assistant", content: "(Failed to load welcome message)" }]);
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        fetchWelcomeMessage();
    }, []);
    react_1.useEffect(function () {
        var scheduleEncouragement = function () {
            var recentMessages = (messages !== null && messages !== void 0 ? messages : []).slice(-20);
            var contextString = recentMessages.map(function (m) { return m.role + ": " + m.content; }).join("\n");
            // const delay = 5000;
            function getRandomMinutes(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            var minutes = getRandomMinutes(60, 90);
            var delay = minutes * 60 * 1000;
            var hour = new Date().getHours();
            var timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
            var prompt = "\n      You are Rin, a friendly virtual assistant girlfriend in a cozy chat app.\n      Based on the recent conversation:\n      " + contextString + "\n      Write a short, warm message to the user in " + language + ".\n      - Remind them to take a little pause and breathe.\n      - Encourage them in a kind, personal way.\n      - Make them feel seen and appreciated.\n      - Optionally, tie it to the current time of day (" + timeOfDay + ") in a cozy way.\n      - Keep it casual and sweet, like a friend sending a thoughtful text. Keep it under 50 words.\n\n      Keep it short, natural, and comforting, as if Rin is sitting beside them.\n      ";
            encouragementTimeoutRef.current = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var res, data, content_1, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, 4, 5]);
                            return [4 /*yield*/, fetch("/api/ollamaChat", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ message: prompt })
                                })];
                        case 1:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            data = _a.sent();
                            content_1 = data.content || "(No encouragement message)";
                            setMessages(function (prev) { return __spreadArrays((prev !== null && prev !== void 0 ? prev : []), [{ role: "assistant", content: content_1, isAuto: true }]); });
                            return [3 /*break*/, 5];
                        case 3:
                            err_2 = _a.sent();
                            console.error(err_2);
                            return [3 /*break*/, 5];
                        case 4:
                            scheduleEncouragement(); // Reschedule the next encouragement
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }, delay);
        };
        scheduleEncouragement();
        return function () {
            if (encouragementTimeoutRef.current) {
                clearTimeout(encouragementTimeoutRef.current);
            }
        };
    }, [messages, language]);
    var sendMessage = function () { return __awaiter(_this, void 0, void 0, function () {
        var newMessages, recentMessages, contextString, prompt, res, data, content_2, i_1, animate_1, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!input.trim())
                        return [2 /*return*/];
                    newMessages = __spreadArrays((messages !== null && messages !== void 0 ? messages : []), [{ role: "user", content: input }]);
                    setMessages(__spreadArrays(newMessages, [{ role: "assistant", content: "" }]));
                    setInput("");
                    setLoading(true);
                    recentMessages = newMessages.slice(-20);
                    contextString = recentMessages
                        .map(function (m) { return m.role + ": " + m.content; })
                        .join("\n");
                    prompt = "\n    You are Rin, a cute and cozy AI girlfriend who loves relaxing music vibes.\n    Based on the recent conversation:\n    " + contextString + "\n\n    Write an affectionate reply in " + language + ".\n    Keep it warm, playful, and natural, like a girlfriend texting you. Use Markdown where appropriate.\n    ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/ollamaChat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ message: prompt })
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    content_2 = data.content || "(No response)";
                    i_1 = 0;
                    animate_1 = function () {
                        if (i_1 <= content_2.length) {
                            setMessages(function (prev) {
                                var updated = __spreadArrays((prev !== null && prev !== void 0 ? prev : []));
                                updated[updated.length - 1] = { role: "assistant", content: content_2.slice(0, i_1) };
                                return updated;
                            });
                            i_1++;
                            requestAnimationFrame(animate_1);
                        }
                    };
                    animate_1();
                    return [3 /*break*/, 6];
                case 4:
                    err_3 = _a.sent();
                    console.error(err_3);
                    setMessages(function (prev) {
                        var updated = __spreadArrays((prev !== null && prev !== void 0 ? prev : []));
                        updated[updated.length - 1] = { role: "assistant", content: "(An error occurred)" };
                        return updated;
                    });
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);
    var handleKeyDown = function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
        e.stopPropagation();
    };
    return (React.createElement("div", { className: "container-bg characterchat-container" },
        React.createElement("div", { className: "characterchat-message-container" },
            (messages !== null && messages !== void 0 ? messages : []).map(function (m, i) { return (React.createElement("div", { key: i, className: m.role === "assistant"
                    ? m.isAuto
                        ? "rin-message rin-auto-message"
                        : "rin-message"
                    : "user-message" },
                React.createElement("div", { className: "message-role" }, m.role === "assistant" ? "Rin" : "You"),
                React.createElement(react_markdown_1["default"], { remarkPlugins: [remark_gfm_1["default"]], rehypePlugins: [rehype_raw_1["default"]] }, m.content))); }),
            loading && React.createElement("p", null, "Rin is thinking\u2026"),
            React.createElement("div", { ref: messagesEndRef })),
        React.createElement("div", { className: "characterchat-input-container" },
            React.createElement(textInputWithSound_1["default"], { value: input, onChange: function (e) { return setInput(e.target.value); }, onKeyDown: handleKeyDown, placeholder: "Say something to Rin...", className: "user-input" }),
            React.createElement("button", { onClick: sendMessage, disabled: loading }, "Send"))));
}
exports["default"] = CharacterChat;
