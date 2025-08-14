import admin from 'firebase-admin';
import { productionConfig } from '@/config/production';

// Environment variables (kept as comments for reference):
// FIREBASE_PROJECT_ID=teamblitz-45f98
// FIREBASE_PRIVATE_KEY_ID=69e0db3163f0b8a7442bd777b6454c6e6163cb4a
// FIREBASE_PRIVATE_KEY=...
// FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@teamblitz-45f98.iam.gserviceaccount.com
// FIREBASE_CLIENT_ID=112831392827596203243

if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: productionConfig.adminFirebaseProjectId,
    private_key_id: productionConfig.firebasePrivateKeyId,
    private_key: productionConfig.firebasePrivateKey.replace(/\\n/g, '\n'),
    client_email: productionConfig.firebaseClientEmail,
    client_id: productionConfig.firebaseClientId,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${productionConfig.firebaseClientEmail}`
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: productionConfig.adminFirebaseProjectId,
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export default admin;