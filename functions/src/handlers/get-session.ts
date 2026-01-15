import {onRequest} from "firebase-functions/v2/https";
import {db, SESSIONS_COLLECTION} from "../config/firebase";
import {config} from "../index";
import {sendSuccess, sendError, checkMethod} from "../utils/http";
import {HttpMethod, HttpStatus} from "../types/enums";
import {asyncHandler} from "../utils/async-handler";
import {jwtAuth} from "../middleware/auth";
import {formatSession} from "../utils/formatter";

export const getSession = onRequest(config, asyncHandler(async (req, res) => {
  if (!checkMethod(req, res, HttpMethod.GET)) return;

  const auth = jwtAuth(req, res);
  if (!auth) return;

  const sessionId = (req.query.id as string) || auth.sessionId;

  const doc = await db.collection(SESSIONS_COLLECTION).doc(sessionId).get();
  const data = doc?.data();

  if (!doc.exists || !data) {
    return sendError(res, `Session ${sessionId} not found`, HttpStatus.NOT_FOUND);
  }

  const session = formatSession(doc.id, data);

  return sendSuccess(res, {session}, HttpStatus.OK);
}));
