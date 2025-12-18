import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Firebase Config ---
const app = initializeApp({
  apiKey: "AIzaSyAAYzCsDHJvYIN_kblYv7vgCJHB8CkrJl8",
  authDomain: "fmd--chat.firebaseapp.com",
  projectId: "fmd--chat"
});

const db = getFirestore();

// --- Fake Login ---
const USERS = { A: "passA", B: "passB" };
let currentUser = null;

// --- Element Referenzen ---
const userInput = document.getElementById("user");
const pwInput = document.getElementById("pw");
const errDiv = document.getElementById("err");
const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const msgInput = document.getElementById("msg");
const logPre = document.getElementById("log");

// --- Login Funktion ---
window.login = () => {
  const u = userInput.value;
  const p = pwInput.value;
  if(USERS[u] === p){
    currentUser = u;
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
  } else {
    errDiv.textContent = "Wrong login";
  }
};

// --- Nachricht senden ---
window.send = () => {
  if(msgInput.value.trim() === "") return;
  addDoc(collection(db,"messages"),{
    user: currentUser,
    text: msgInput.value,
    time: Date.now()
  });
  msgInput.value = "";
};

// --- Nachrichten anzeigen ---
onSnapshot(
  query(collection(db,"messages"), orderBy("time")),
  s => {
    logPre.innerHTML = "";
    s.docs.forEach(d => {
      const m = d.data();
      const div = document.createElement("div");
      div.className = m.user === currentUser ? "me" : "them";
      const ts = new Date(m.time).toUTCString().slice(17,22); // HH:MM GMT
      div.textContent = `[${ts} GMT] ${m.text}`;
      logPre.appendChild(div);
    });
  }
);