import * as express from "express";
import * as cors from "cors";
import { fs, rtdb } from "./db";
import * as nanoId from "nano-id";
import path = require("path");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const usersColl = fs.collection("users");
const gameroomsColl = fs.collection("gamerooms");

app.get("/env", (req, res) => {
  res.json(process.env.NODE_ENV);
});

app.post("/login", (req, res) => {
  const { fullName } = req.body;

  usersColl
    .where("fullName", "==", fullName)
    .get()
    .then((result) => {
      if (result.empty) {
        usersColl
          .add({
            fullName,
          })
          .then((newUserRef) => {
            res.json({
              userId: newUserRef.id,
              new: true,
            });
          });
      } else {
        res.json({
          userId: result.docs[0].id,
          message: "User has already been created",
        });
      }
    });
});

app.post("/gamerooms", (req, res) => {
  const { userId } = req.body;

  usersColl
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const gameroomRef = rtdb.ref("gamerooms/" + nanoId(20));
        gameroomRef
          .set({
            owner: userId,
          })
          .then(() => {
            const rtdbId = gameroomRef.key;
            const randomId = nanoId(6);
            const gameroomId = randomId.toString();
            gameroomsColl
              .doc(gameroomId)
              .set({
                rtdbGameroomId: rtdbId,
              })
              .then(() => {
                res.json({
                  gameroomId,
                });
              });
          });
      } else {
        res.status(401).json({
          message: "User does not exist",
        });
      }
    });
});

app.get("/gamerooms/:gameroomId", (req, res) => {
  const { userId } = req.query as any;
  const { gameroomId } = req.params;

  gameroomsColl
    .doc(gameroomId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const { rtdbGameroomId } = data;
        const gameroomRef = rtdb.ref(
          "gamerooms/" + rtdbGameroomId + "/currentGame"
        );

        gameroomRef.once("value").then((snapshot) => {
          const numChildren = snapshot.numChildren();
          // Verificar si la propiedad online es true y verifica quien esta offline
          let countOnlineTrue = 0;
          let playerOfflineId;
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if (childData && childData.online === true) {
              countOnlineTrue++;
            }
            if (childData && childData.online === false) {
              playerOfflineId = childSnapshot.key;
            }
          });

          if (numChildren < 2) {
            //Si hay un solo jugador en la sala entro
            res.json(data);
          } else if (numChildren == 2 && countOnlineTrue == 2) {
            //Si hay dos jugadores online en la sala no entra nadie
            res.status(401).json({
              message: "Gameroom is full",
            });
          } else if (numChildren == 2 && userId == playerOfflineId) {
            //Si hay dos jugadores en la sala y el de mi mismo ID esta offline entro
            res.json(data);
          } else {
            res.status(401).json({
              message: "You cannot enter in this room",
            });
          }
        });
      } else {
        res.status(404).json({
          message: "Gameroom ID does not exist",
        });
      }
    });
});

app.post("/gamerooms/:gameroomId/users", (req, res) => {
  const { userId } = req.query as any;
  const { gameroomId } = req.params;

  usersColl
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        gameroomsColl
          .doc(gameroomId.toString())
          .get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data();
              const { rtdbGameroomId } = data;

              const gameroomRef = rtdb.ref(
                "gamerooms/" + rtdbGameroomId + "/currentGame/" + userId
              );
              gameroomRef.set(req.body).then(() => {
                res.json(req.body);
              });
            }
          });
      } else {
        res.status(401).json({
          message: "User does not exist",
        });
      }
    });
});

app.post("/gamerooms/:gameroomId/history", (req, res) => {
  const { userId } = req.query as any;
  const { gameroomId } = req.params;

  usersColl
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        gameroomsColl
          .doc(gameroomId.toString())
          .get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data();
              const { rtdbGameroomId } = data;
              const historyRef = rtdb.ref(
                "gamerooms/" + rtdbGameroomId + "/history/" + userId
              );
              historyRef.set(req.body.myWins).then(() => {
                res.json({ myWins: req.body.myWins, message: "Push wins ok" });
              });
            }
          });
      } else {
        res.status(401).json({
          message: "User does not exist",
        });
      }
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
