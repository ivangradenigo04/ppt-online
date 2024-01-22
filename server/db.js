"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.fs = void 0;
var admin = require("firebase-admin");
var databaseURL = process.env.DATABASE_URL ||
    "https://ppt-online-17bca-default-rtdb.firebaseio.com";
if (process.env.NODE_ENV === "development") {
    var serviceAccount = require("../credentials/key.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: databaseURL,
    });
}
else if (process.env.NODE_ENV === "production") {
    admin.initializeApp({
        credential: admin.credential.cert({
            type: process.env.FIREBASE_TYPE,
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
            universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
        }),
        databaseURL: databaseURL,
    });
}
var fs = admin.firestore();
exports.fs = fs;
var rtdb = admin.database();
exports.rtdb = rtdb;
