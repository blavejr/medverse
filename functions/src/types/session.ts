export interface Session {
    id: string;
    region: string;
    status: SessionStatus;
    createdAt: Date;
    updatedAt: Date;
  }

export enum SessionStatus {
    PENDING = "pending",
    ACTIVE = "active",
    COMPLETED = "completed",
    FAILED = "failed",
  }

export interface CreateSessionRequest {
    region: string;
  }

export interface UpdateSessionRequest {
    status: SessionStatus;
  }
