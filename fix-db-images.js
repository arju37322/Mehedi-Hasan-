import { initializeApp } from "firebase/app";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  await updateDoc(doc(db, "settings", "site_logo"), { value: "" });
  await updateDoc(doc(db, "settings", "about_image"), { value: "" });
  console.log("Cleared broken local upload paths.");
  process.exit(0);
}
run();
