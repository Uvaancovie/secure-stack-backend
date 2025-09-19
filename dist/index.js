"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const seedAdmin_1 = require("./utils/seedAdmin");
async function start() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI missing");
        process.exit(1);
    }
    await mongoose_1.default.connect(uri, { serverSelectionTimeoutMS: 10000 });
    await (0, seedAdmin_1.seedAdmin)();
    const port = Number(process.env.PORT || 8080);
    app_1.default.listen(port, () => console.log(`API running on :${port}`));
}
start().catch(err => { console.error("Startup error:", err); process.exit(1); });
//# sourceMappingURL=index.js.map