import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const storage = getStorage(app);

async function run() {
  try {
    const storageRef = ref(storage, "test.txt");
    await uploadString(storageRef, "Hello World");
    console.log("Uploaded successfully!");
    const url = await getDownloadURL(storageRef);
    console.log("URL:", url);
    process.exit(0);
  } catch (err) {
    console.error("Storage error:", err);
    process.exit(1);
  }
}
run();
