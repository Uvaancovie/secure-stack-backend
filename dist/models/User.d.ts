import { Schema } from "mongoose";
declare const _default: import("mongoose").Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    idNumber: string;
    accountNumber: string;
    username: string;
    passwordHash: string;
    role: "customer" | "admin";
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    idNumber: string;
    accountNumber: string;
    username: string;
    passwordHash: string;
    role: "customer" | "admin";
}, {}, {
    timestamps: true;
    versionKey: false;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    idNumber: string;
    accountNumber: string;
    username: string;
    passwordHash: string;
    role: "customer" | "admin";
} & {
    _id: import("mongoose").Types.ObjectId;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    idNumber: string;
    accountNumber: string;
    username: string;
    passwordHash: string;
    role: "customer" | "admin";
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    idNumber: string;
    accountNumber: string;
    username: string;
    passwordHash: string;
    role: "customer" | "admin";
}>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
    versionKey: false;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    idNumber: string;
    accountNumber: string;
    username: string;
    passwordHash: string;
    role: "customer" | "admin";
}> & {
    _id: import("mongoose").Types.ObjectId;
}>>;
export default _default;
//# sourceMappingURL=User.d.ts.map