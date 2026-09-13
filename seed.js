import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore/lite';
import fs from 'fs';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const localDb = JSON.parse(fs.readFileSync('./database.json', 'utf8'));

async function seed() {
  console.log('Seeding...');
  for (const [key, val] of Object.entries(localDb.settings)) {
    const k = val.key;
    const v = val.value;
    if (k && v !== undefined) {
      await setDoc(doc(db, 'settings', k), { value: v });
    }
  }
  console.log('Seeded settings');

  for (const s of localDb.services) {
    await setDoc(doc(db, 'services', String(s.id)), s);
  }
  console.log('Seeded services');

  for (const s of localDb.faqs) {
    await setDoc(doc(db, 'faqs', String(s.id)), s);
  }
  console.log('Seeded faqs');

  for (const s of localDb.portfolio) {
    await setDoc(doc(db, 'portfolio', String(s.id)), s);
  }
  console.log('Seeded portfolio');
  
  await setDoc(doc(db, 'admins', 'arju37322@gmail.com'), { email: 'arju37322@gmail.com', created_at: new Date().toISOString() });
  console.log('Seeded admin user');

  console.log('Done');
  process.exit(0);
}

seed().catch(console.error);
