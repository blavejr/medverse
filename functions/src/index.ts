// basic config for all handlers, can be overridden by the handler if needed
export const config = {
  region: "europe-west1" as const,
  cors: true,
  memory: "256MiB" as const,
  timeoutSeconds: 60,
  maxInstances: 10,
};

export {createSession} from "./handlers/create-session";
export {getSession} from "./handlers/get-session";
export {updateSessionStatus} from "./handlers/update-session-status";
export {listSessions} from "./handlers/list-sessions";
