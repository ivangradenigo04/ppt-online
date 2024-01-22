import { Router } from "@vaadin/router";
import { rtdb, db } from "./rtdb";

type GameOptions = "piedra" | "papel" | "tijera" | "";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const state = {
  data: {
    userId: "",
    opponentId: "",
    gameroomId: "",
    rtdbGameroomId: "",
    myGame: {
      fullName: "",
      online: false,
      ready: false,
      move: "",
    },
    opponentGame: {
      fullName: "",
      online: false,
      ready: false,
      move: "",
    },
    result: "",
    history: {
      myWins: 0,
      opponentWins: 0,
    },
  },
  listeners: [],

  init() {
    const localData = localStorage.getItem("saved-state");
    if (localData) {
      this.setState(JSON.parse(localData));
    }
  },

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (const callback of this.listeners) {
      callback(this.data);
    }
    localStorage.setItem("saved-state", JSON.stringify(newState));
    console.log("El estado cambió", this.data);
  },

  subscribe(callback: (state: any) => any) {
    this.listeners.push(callback);
  },

  unsubscribe() {
    this.listeners = [];
  },

  setName(fullName: string) {
    const cs = this.getState();
    cs.myGame.fullName = fullName;
    this.setState(cs);
  },

  logIn(cb) {
    const cs = this.getState();
    fetch(API_BASE_URL + "/login", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName: cs.myGame.fullName,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.userId = data.userId;
        this.setState(cs);
        cb();
      });
  },

  askNewRoom(cb) {
    const cs = this.getState();
    const { userId } = cs;
    if (userId) {
      fetch(API_BASE_URL + "/gamerooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.gameroomId = data.gameroomId;
          this.setState(cs);
          cb();
        });
    } else {
      console.error("There is not userId");
    }
  },

  setGameroomId(id: string) {
    const cs = this.getState();
    cs.gameroomId = id;
    this.setState(cs);
  },

  accessToRoom(cb) {
    const cs = this.getState();
    const { userId } = cs;
    const { gameroomId } = cs;

    fetch(API_BASE_URL + "/gamerooms/" + gameroomId + "?userId=" + userId, {
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 404) {
          Router.go("/not-exist");
        }
        if (res.status == 401) {
          Router.go("/full-room");
        }
        if (res.ok) {
          cb();
        }
        return res.json();
      })
      .then((data) => {
        cs.rtdbGameroomId = data.rtdbGameroomId;
        this.setState(cs);
        this.listenOpponentData();
      });
  },

  listenOpponentData() {
    const cs = this.getState();
    const { userId } = cs;
    const { rtdbGameroomId } = cs;

    const gameroomRef = db.ref(
      rtdb,
      "/gamerooms/" + rtdbGameroomId + "/currentGame"
    );
    db.onValue(gameroomRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        if (childKey != userId) {
          cs.opponentId = childKey;
          cs.opponentGame = childSnapshot.val();
          this.setState(cs);
          db.off(gameroomRef);
          this.listenOpponentGame();
        }
      });
    });
  },

  listenHistory(cb) {
    const cs = this.getState();
    const { userId } = cs;
    const { rtdbGameroomId } = cs;

    const historyRef = db.ref(
      rtdb,
      "/gamerooms/" + rtdbGameroomId + "/history"
    );
    db.get(historyRef).then((snapshot) => {
      if (snapshot.exists) {
        let opponentWinsFound = false;
        let myWinsFound = false;

        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;

          if (childKey !== userId) {
            cs.history.opponentWins = childSnapshot.val();
            opponentWinsFound = true;
          } else if (childKey === userId) {
            cs.history.myWins = childSnapshot.val();
            myWinsFound = true;
          }
        });

        if (!opponentWinsFound) {
          cs.history.opponentWins = 0;
        }

        if (!myWinsFound) {
          cs.history.myWins = 0;
        }

        this.setState(cs);
        cb();
      } else {
        cs.history.opponentWins = 0;
        cs.history.myWins = 0;
        this.setState(cs);
        cb();
      }
    });
  },

  setOnlineStatus() {
    const cs = this.getState();
    cs.myGame.online = true;
    this.setState(cs);
  },

  setReadyStatus() {
    const cs = this.getState();
    cs.myGame.ready = true;
    this.setState(cs);
  },

  setMoves(jugador: GameOptions) {
    const cs = this.getState();
    cs.myGame.move = jugador;
    this.setState(cs);
  },

  setOfflineStatus() {
    const cs = this.getState();
    cs.myGame.online = false;
    this.setState(cs);
  },

  resetReadyStatus() {
    const cs = this.getState();
    cs.myGame.ready = false;
    this.setState(cs);
  },

  resetMoves() {
    const cs = this.getState();
    cs.myGame.move = "";
    this.setState(cs);
  },

  resetHistory() {
    const cs = this.getState();
    cs.history.myWins = 0;
    cs.history.opponentWins = 0;
    this.setState(cs);
  },

  pushMyGame(cb?) {
    const cs = this.getState();
    const { myGame } = cs;
    const { userId } = cs;
    const { gameroomId } = cs;
    fetch(
      API_BASE_URL +
        "/gamerooms/" +
        gameroomId +
        "/users" +
        "?userId=" +
        userId,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(myGame),
      }
    ).then(() => {
      if (cb) {
        cb();
      }
    });
  },

  listenOpponentGame() {
    const cs = this.getState();
    const { opponentId } = cs;
    const { rtdbGameroomId } = cs;

    const opponentRef = db.ref(
      rtdb,
      "/gamerooms/" + rtdbGameroomId + "/currentGame/" + opponentId
    );
    db.onValue(opponentRef, (snapshot) => {
      cs.opponentGame = snapshot.val();
      this.setState(cs);
    });
  },

  whoWins(player: GameOptions, opponent: GameOptions): string {
    if (player === opponent) {
      return "tie";
    } else if (
      (player === "piedra" && opponent === "tijera") ||
      (player === "papel" && opponent === "piedra") ||
      (player === "tijera" && opponent === "papel")
    ) {
      return "win";
    } else if (player == "" || opponent == "") {
      return "tie";
    } else {
      return "lose";
    }
  },

  setResult() {
    const cs = this.getState();
    const { myGame } = cs;
    const { opponentGame } = cs;
    const result = this.whoWins(myGame.move, opponentGame.move);

    cs.result = result;
    cs.history = {
      myWins: result === "win" ? cs.history.myWins + 1 : cs.history.myWins,
      opponentWins:
        result === "lose"
          ? cs.history.opponentWins + 1
          : cs.history.opponentWins,
    };

    if (result == "win") {
      this.pushHistory(cs.history);
    } else {
    }

    this.setState(cs);
  },

  pushHistory(history) {
    const cs = this.getState();
    const { userId } = cs;
    const { gameroomId } = cs;
    fetch(
      API_BASE_URL +
        "/gamerooms/" +
        gameroomId +
        "/history" +
        "?userId=" +
        userId,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(history),
      }
    );
  },
};

export { state, GameOptions };
