// Production Configuration - Direct Values for Netlify
// Environment variables kept as comments for reference

export const productionConfig = {
  // Firebase Client Configuration (Public)
  // NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDlGIXeOtusP7iP7m6qgKmBH1xo8ulVJFI
  firebaseApiKey: "AIzaSyDlGIXeOtusP7iP7m6qgKmBH1xo8ulVJFI",
  
  // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teamblitz-45f98.firebaseapp.com
  firebaseAuthDomain: "teamblitz-45f98.firebaseapp.com",
  
  // NEXT_PUBLIC_FIREBASE_PROJECT_ID=teamblitz-45f98
  firebaseProjectId: "teamblitz-45f98",
  
  // NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=teamblitz-45f98.firebasestorage.app
  firebaseStorageBucket: "teamblitz-45f98.firebasestorage.app",
  
  // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=6089062028
  firebaseMessagingSenderId: "6089062028",
  
  // NEXT_PUBLIC_FIREBASE_APP_ID=1:6089062028:web:e37f0984ab0de972d0eda9
  firebaseAppId: "1:6089062028:web:e37f0984ab0de972d0eda9",
  
  // NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-0WJGVFZQNP
  firebaseMeasurementId: "G-0WJGVFZQNP",

  // Firebase Admin SDK Configuration (Server-side)
  // FIREBASE_PROJECT_ID=teamblitz-45f98
  adminFirebaseProjectId: "teamblitz-45f98",
  
  // FIREBASE_PRIVATE_KEY_ID=69e0db3163f0b8a7442bd777b6454c6e6163cb4a
  firebasePrivateKeyId: "69e0db3163f0b8a7442bd777b6454c6e6163cb4a",
  
  // FIREBASE_PRIVATE_KEY=...
  firebasePrivateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFCHOffbfeJGpK\nBTwK2PX9jMv4krHqD2gAtfjtlaZuE9u+9H2jJaEe3cQwYsgbFIg/dvxyW9ijmbMc\n87O+/VxKNgEvtrgaCGrEY+RDZdlYi3MdT2p7sZM6sBPMjkRlWCweLez7gYnxaakN\nQqwkM3xj4pVkI0I10IR2cJkUTW24VjY+DI3AfdsnPb6BC9HJjS+/wzeEeJz6HKOC\nVQmPdGIDW9AtO6EL6zFwQQPgWh6kze5mKF9q9+/OFuu9TNstpD/cAEkw7AMXbH3W\ngeIXkPCaOSNKNRoXtmI9r05TzET+UuT1Cvt1Mch3YNv0g08ROcbZutmGHp9UVC2U\n9N+wboADAgMBAAECggEAMiBZUg0o1vIKvHQid1wFERFd3wprCvIKcovZHZCB++U/\ndZA72mK7X9/phqnK4ODTXNoHlYx6S/zRTZ9ObluEvDiLCrmAktbrWrVTIDZsGhO4\nII/QtlFR9I9RKixTiDjrWG40qTOmhW1tHbuFkdwrXDoL6aLyuEApQvyYZUrhjBCo\nbDIhXylfBgB3eAJEwzddM+/ln1+0YaKpZKcHbjyNwYe8mq0UuJn58BoIhLbln6gg\nkoXyx6ss7LJVwKdJcNJBToG4W1q/UbqxzT/cgm5M/7sUKSPNmCUw1BSYzY1mr+wk\ncXTZ9ic2gIjMklq0RLCWocMuHUxCqFlnGG2h1AsViQKBgQDrOyfY4jiYheAnac5q\nSSk7Q6PAWbpik81pzGHEF+l2qB8JaWLe0xdeJti7yG0o/5NXRaG4HP4RkTgAlToR\nyyneTt1pTA3TObLHz1l+4jtcs+F0k6GgeiIsnIyriZUZ6/gOn0lgijoif7jbhQ2Y\nZIl9dSxopKY5/0deaca184PmPwKBgQDWbes1PWycM2gpeFf4c+fTVKFmMkrUeTW0\n1LqZDQvhDW4nQnZFXeWkq5kBl0wihGPfydAiSDAumnsryEsij1zqGXz9gtR5CWhn\nD/X7xzeVnnP/SdqRpUZRdl4O7U/ekoDZOkxqbeevbfCr3L8cvjW9evIXY6r5Hz+E\naW4nvzSdPQKBgQCqjG1LllkqXIY0jUYXUYwPZ+8l2uiD6F2aQ5Dut9eRLDu0ezAw\nFiRvIwMowxxCCWsub1HdR0f+PKe55HgBxqdIgy2M1pN/fendbLyafjRD9jeUaiVZ\nULPOXIKxLENqU+e50ktFL3MO6EODBWjiAKKez4GvLRFII4n/LfngmfobyQKBgQCP\ndKhITRjNg6LrI6UPBlQRUWxNV9YyQglJOoy/+jd5UCfiwhcoH0KUoWzS4KrB6Pp8\nbKL/XHZHp3hB+VUzAOCziWvSmuWVOFMNqGL0F/q68XA/WeSNTho2Q893gxLNIAxt\nyA/5oB/BgPbjs+Jz01lWs9slBLwMwPgYmQRmOQh1LQKBgGqXGkXq79arRfuR24al\nT1Dx2tVwa94/bmz/Ni5bnhKsHMJCltF6UTG0EFJnQJN7w8H/zylhQFmS91wrIqG6\nP4A7b+tFdxYxhF13ajCBzxG8qricYs5nsVN65Zexo56SdDNhmr8JlySNYXJWcMbr\nxZhRFt0CkvSBVLFbRj83vDf9\n-----END PRIVATE KEY-----\n",
  
  // FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@teamblitz-45f98.iam.gserviceaccount.com
  firebaseClientEmail: "firebase-adminsdk-fbsvc@teamblitz-45f98.iam.gserviceaccount.com",
  
  // FIREBASE_CLIENT_ID=112831392827596203243
  firebaseClientId: "112831392827596203243",

  // Application Security Configuration
  // JWT_SECRET=TeamBlitz2025ProductionSecureJWTSecretKey64CharactersLongForMaximumSecurity
  jwtSecret: "TeamBlitz2025ProductionSecureJWTSecretKey64CharactersLongForMaximumSecurity",
  
  // JWT_EXPIRES_IN=7d
  jwtExpiresIn: "7d",
  
  // ADMIN_SECRET=TeamBlitzAdminSecret2025ProductionReady
  adminSecret: "TeamBlitzAdminSecret2025ProductionReady",

  // Application Configuration
  // NEXT_PUBLIC_BASE_URL=https://teamblitz.netlify.app
  baseUrl: "https://teamblitz.netlify.app",

  // Email Service Configuration (Optional - disabled for now)
  // GMAIL_USER=
  // GMAIL_APP_PASSWORD=
  gmailUser: "",
  gmailAppPassword: "",

  // Environment
  nodeEnv: "production",
  isDevelopment: false,
  isProduction: true
};