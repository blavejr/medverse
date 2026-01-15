import {onRequest} from "firebase-functions/v2/https";
import {FieldValue} from "firebase-admin/firestore";
import {db, SESSIONS_COLLECTION} from "../config/firebase";
import {updateSessionStatusSchema} from "../schemas/session.schema";
import {config} from "../index";
import {validate} from "../utils/validation";
import {sendSuccess, checkMethod} from "../utils/http";
import {HttpMethod, HttpStatus} from "../types/enums";
import {asyncHandler} from "../utils/async-handler";
import {jwtAuth} from "../middleware/auth";
import {formatSession} from "../utils/formatter";

export const updateSessionStatus = onRequest(config, asyncHandler(async (req, res) => {
  if (!checkMethod(req, res, HttpMethod.PATCH)) return;

  const auth = jwtAuth(req, res);
  if (!auth) return;

  const sessionId = (req.query.id as string) || auth.sessionId;
  const {status} = validate(updateSessionStatusSchema, req.body);

  await db.runTransaction(async (transaction) => {
    const sessionRef = db.collection(SESSIONS_COLLECTION).doc(sessionId);
    const doc = await transaction.get(sessionRef);
    
    if (!doc.exists) {
      throw new Error(`Session ${sessionId} not found`);
    }

    transaction.update(sessionRef, {
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  const doc = await db.collection(SESSIONS_COLLECTION).doc(sessionId).get();
  const data = doc.data()!;
  const session = formatSession(doc.id, {...data, status});

  return sendSuccess(res, {session}, HttpStatus.OK);
}));
