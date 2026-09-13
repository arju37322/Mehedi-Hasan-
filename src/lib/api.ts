import { apiFetch } from './api';
import { db, auth } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export async function apiFetch(url: string, options: RequestInit = {}) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body as string) : undefined;
  
  // Helper for formatting responses to match what fetch().json() does
  const jsonResponse = (data: any) => ({ ok: true, json: async () => data });
  const errorResponse = (msg: string, status = 500) => ({ ok: false, status, json: async () => ({ error: msg }) });

  try {
    // Auth
    if (url === '/api/auth/login' && method === 'POST') {
      const { username, password } = body;
      await signInWithEmailAndPassword(auth, username, password);
      return jsonResponse({ success: true });
    }
    if (url === '/api/auth/logout' && method === 'POST') {
      await signOut(auth);
      return jsonResponse({ success: true });
    }
    if (url === '/api/auth/me' && method === 'GET') {
      const user = await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(u => {
          unsubscribe();
          resolve(u);
        });
      });
      return jsonResponse({ authenticated: !!user, user: user ? { id: (user as any).uid, username: (user as any).email } : null });
    }

    // Settings
    if (url === '/api/settings' || url === '/api/admin/settings') {
      if (method === 'GET') {
        const snap = await getDocs(collection(db, 'settings'));
        const obj: any = {};
        snap.forEach(d => obj[d.id] = d.data().value);
        return jsonResponse(obj);
      }
      if (method === 'POST') {
        for (const [key, value] of Object.entries(body)) {
          await setDoc(doc(db, 'settings', key), { value });
        }
        return jsonResponse({ success: true });
      }
    }

    // Dashboard
    if (url === '/api/admin/dashboard' && method === 'GET') {
      const [portSnap, leadSnap, servSnap, testSnap] = await Promise.all([
        getDocs(collection(db, 'portfolio')),
        getDocs(collection(db, 'leads')),
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'testimonials'))
      ]);
      const recentLeads = leadSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => b.created_at - a.created_at).slice(0, 5);
      return jsonResponse({
        stats: {
          totalProjects: portSnap.size,
          totalLeads: leadSnap.size,
          totalServices: servSnap.size,
          totalTestimonials: testSnap.size
        },
        recentLeads
      });
    }

    // CRUD entities
    const routeMatch = url.match(/^\/api\/(admin\/)?(services|portfolio|testimonials|faqs|leads)(?:\/(.+))?$/);
    if (routeMatch) {
      const collName = routeMatch[2];
      const docId = routeMatch[3];
      
      if (method === 'GET') {
        let q = query(collection(db, collName));
        const snap = await getDocs(q);
        let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return jsonResponse(items);
      }
      
      if (method === 'POST' && !docId) {
        const newRef = await addDoc(collection(db, collName), { ...body, created_at: Date.now() });
        return jsonResponse({ id: newRef.id, ...body });
      }
      
      if (method === 'PUT' && docId) {
        await updateDoc(doc(db, collName, docId), body);
        return jsonResponse({ id: docId, ...body });
      }
      
      if (method === 'DELETE' && docId) {
        await deleteDoc(doc(db, collName, docId));
        return jsonResponse({ success: true });
      }
    }

    console.warn('Unhandled apiFetch:', method, url);
    return jsonResponse({});
  } catch (err: any) {
    console.error('apiFetch Error:', err);
    return errorResponse(err.message);
  }
}
