import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

const firebaseConfig = {
  projectId: "gen-lang-client-0903475277",
  appId: "1:389483035958:web:1764fb5d0d98eea72bc797",
  apiKey: "AIzaSyDsmKup0Y3YmLQp6Yz2YCIqSiz9ODPspyw",
  authDomain: "gen-lang-client-0903475277.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-5db37e65-acf1-4257-8131-b31b840cd004"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
