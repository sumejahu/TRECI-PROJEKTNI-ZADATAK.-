import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxzQnSMWGzyIcv3pPCWXvm_tb1vlTu2y0",
  authDomain: "nela-si.firebaseapp.com",
  projectId: "nela-si",
  storageBucket: "nela-si.firebasestorage.app",
  messagingSenderId: "366363984218",
  appId: "1:366363984218:web:10c7ea4d6e618cc07b7363"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

console.log("✅ app.js učitan, Firebase init OK");

// ENTER = dodaj task
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

// Dodavanje taska
addTaskBtn.addEventListener("click", async () => {
  const text = taskInput.value.trim();
  if (!text) return;

  try {
    await addDoc(collection(db, "tasks"), {
      text,
      completed: false
    });
    taskInput.value = "";
  } catch (e) {
    console.error("❌ addDoc error:", e);
    alert(e.message);
  }
});

// Real-time prikaz taskova
onSnapshot(collection(db, "tasks"), (snapshot) => {
  taskList.innerHTML = "";

  snapshot.forEach((snap) => {
    const task = snap.data();

    const li = document.createElement("li");
    li.textContent = task.text;

    if (task.completed) {
      li.classList.add("completed");
    }

    // Toggle completed
    li.addEventListener("click", async () => {
      await updateDoc(doc(db, "tasks", snap.id), {
        completed: !task.completed
      });
    });

    // Delete dugme
    const del = document.createElement("button");
    del.textContent = "X";

    del.addEventListener("click", async (e) => {
      e.stopPropagation();
      await deleteDoc(doc(db, "tasks", snap.id));
    });

    li.appendChild(del);
    taskList.appendChild(li);
  });
});
