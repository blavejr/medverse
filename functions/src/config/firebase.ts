import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  const projectId =
    process.env.GCLOUD_PROJECT ??
    process.env.GOOGLE_CLOUD_PROJECT ??
    process.env.FIREBASE_PROJECT_ID;

  admin.initializeApp(projectId ? {projectId} : undefined);
}

export const db = admin.firestore();
export const SESSIONS_COLLECTION = "sessions";

if (process.env.FIRESTORE_EMULATOR_HOST) {
  db.settings({
    host: process.env.FIRESTORE_EMULATOR_HOST,
    ssl: false,
  });
}
