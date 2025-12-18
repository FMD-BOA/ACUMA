import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase CONFIG
const app = initializeApp({
  apiKey: "AIzaSyAAYzCsDHJvYIN_kblYv7vgCJHB8CkrJl8",
  authDomain: "fmd--chat.firebaseapp.com",
  projectId: "fmd--chat"
});

const db = getFirestore(app);

// Fake-Login (manuell festgelegt)
const USERS = {
  A: "passA",
  B: "passB"
};

let currentUser = null;

// DOM
const loginDiv  = document.getElementById("login");
const chatDiv   = document.getElementById("chat");
const userInput = document.getElementById("user");
const pwInput   = document.getElementById("pw");
const errDiv    = document.getElementById("err");
const msgInput  = document.getElementById("msg");
const logDiv    = document.getElementById("log");

// Login
window.login = () => {
  const u = userInput.value;
  const p = pwInput.value;

  if (USERS[u] === p) {
    currentUser = u;
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
  } else {
    errDiv.textContent = "Wrong login";
  }
};

// Nachricht senden
window.send = () => {
  if (!msgInput.value.trim()) return;

  addDoc(collection(db, "messages"), {
    user: currentUser,
    text: msgInput.value,
    time: Date.now()
  });

  msgInput.value = "";
};

// Nachrichten empfangen (Realtime)
onSnapshot(
  query(collection(db, "messages"), orderBy("time")),
  snap => {
    logDiv.innerHTML = "";

    snap.docs.forEach(d => {
      const m = d.data();
      const div = document.createElement("div");

      div.className = m.user === currentUser ? "me" : "them";
      const ts = new Date(m.time).toUTCString();
      div.textContent = `[GMT ${ts}] ${m.text}`;

      logDiv.appendChild(div);
    });

    logDiv.scrollTop = logDiv.scrollHeight;
  }
);