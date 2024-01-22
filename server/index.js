"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var db_1 = require("./db");
var nanoId = require("nano-id");
var path = require("path");
var port = process.env.PORT || 3000;
var app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
var usersColl = db_1.fs.collection("users");
var gameroomsColl = db_1.fs.collection("gamerooms");
app.get("/env", function (req, res) {
    res.json(process.env.NODE_ENV);
});
app.post("/login", function (req, res) {
    var fullName = req.body.fullName;
    usersColl
        .where("fullName", "==", fullName)
        .get()
        .then(function (result) {
        if (result.empty) {
            usersColl
                .add({
                fullName: fullName,
            })
                .then(function (newUserRef) {
                res.json({
                    userId: newUserRef.id,
                    new: true,
                });
            });
        }
        else {
            res.json({
                userId: result.docs[0].id,
                message: "User has already been created",
            });
        }
    });
});
app.post("/gamerooms", function (req, res) {
    var userId = req.body.userId;
    usersColl
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            var gameroomRef_1 = db_1.rtdb.ref("gamerooms/" + nanoId(20));
            gameroomRef_1
                .set({
                owner: userId,
            })
                .then(function () {
                var rtdbId = gameroomRef_1.key;
                var randomId = nanoId(6);
                var gameroomId = randomId.toString();
                gameroomsColl
                    .doc(gameroomId)
                    .set({
                    rtdbGameroomId: rtdbId,
                })
                    .then(function () {
                    res.json({
                        gameroomId: gameroomId,
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "User does not exist",
            });
        }
    });
});
app.get("/gamerooms/:gameroomId", function (req, res) {
    var userId = req.query.userId;
    var gameroomId = req.params.gameroomId;
    gameroomsColl
        .doc(gameroomId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            var data_1 = doc.data();
            var rtdbGameroomId = data_1.rtdbGameroomId;
            var gameroomRef = db_1.rtdb.ref("gamerooms/" + rtdbGameroomId + "/currentGame");
            gameroomRef.once("value").then(function (snapshot) {
                var numChildren = snapshot.numChildren();
                // Verificar si la propiedad online es true y verifica quien esta offline
                var countOnlineTrue = 0;
                var playerOfflineId;
                snapshot.forEach(function (childSnapshot) {
                    var childData = childSnapshot.val();
                    if (childData && childData.online === true) {
                        countOnlineTrue++;
                    }
                    if (childData && childData.online === false) {
                        playerOfflineId = childSnapshot.key;
                    }
                });
                if (numChildren < 2) {
                    //Si hay un solo jugador en la sala entro
                    res.json(data_1);
                }
                else if (numChildren == 2 && countOnlineTrue == 2) {
                    //Si hay dos jugadores online en la sala no entra nadie
                    res.status(401).json({
                        message: "Gameroom is full",
                    });
                }
                else if (numChildren == 2 && userId == playerOfflineId) {
                    //Si hay dos jugadores en la sala y el de mi mismo ID esta offline entro
                    res.json(data_1);
                }
                else {
                    res.status(401).json({
                        message: "You cannot enter in this room",
                    });
                }
            });
        }
        else {
            res.status(404).json({
                message: "Gameroom ID does not exist",
            });
        }
    });
});
app.post("/gamerooms/:gameroomId/users", function (req, res) {
    var userId = req.query.userId;
    var gameroomId = req.params.gameroomId;
    usersColl
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            gameroomsColl
                .doc(gameroomId.toString())
                .get()
                .then(function (doc) {
                if (doc.exists) {
                    var data = doc.data();
                    var rtdbGameroomId = data.rtdbGameroomId;
                    var gameroomRef = db_1.rtdb.ref("gamerooms/" + rtdbGameroomId + "/currentGame/" + userId);
                    gameroomRef.set(req.body).then(function () {
                        res.json(req.body);
                    });
                }
            });
        }
        else {
            res.status(401).json({
                message: "User does not exist",
            });
        }
    });
});
app.post("/gamerooms/:gameroomId/history", function (req, res) {
    var userId = req.query.userId;
    var gameroomId = req.params.gameroomId;
    usersColl
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            gameroomsColl
                .doc(gameroomId.toString())
                .get()
                .then(function (doc) {
                if (doc.exists) {
                    var data = doc.data();
                    var rtdbGameroomId = data.rtdbGameroomId;
                    var historyRef = db_1.rtdb.ref("gamerooms/" + rtdbGameroomId + "/history/" + userId);
                    historyRef.set(req.body.myWins).then(function () {
                        res.json({ myWins: req.body.myWins, message: "Push wins ok" });
                    });
                }
            });
        }
        else {
            res.status(401).json({
                message: "User does not exist",
            });
        }
    });
});
app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
