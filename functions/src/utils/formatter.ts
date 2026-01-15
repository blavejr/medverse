import {DocumentData} from "firebase-admin/firestore";
import {SessionStatus} from "../types/session";

export interface SessionResponse {
  id: string;
  region: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

const toISO = (timestamp: any): string => {
  if (typeof timestamp === "string") {
    return timestamp;
  }
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return new Date().toISOString();
};

export const formatSession = (id: string, data: DocumentData): SessionResponse => {
  return {
    id,
    region: data.region,
    status: data.status,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
};
