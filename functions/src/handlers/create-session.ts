import {onRequest} from "firebase-functions/v2/https";
import {FieldValue} from "firebase-admin/firestore";
import {db, SESSIONS_COLLECTION} from "../config/firebase";
import {createSessionSchema} from "../schemas/session.schema";
import {config} from "../index";
import {validate} from "../utils/validation";
import {sendSuccess, checkMethod} from "../utils/http";
import {HttpMethod, HttpStatus} from "../types/enums";
import {SessionStatus} from "../types/session";
import {asyncHandler} from "../utils/async-handler";
import {generateToken} from "../utils/jwt";
import {generateId} from "../utils/uuid";
import {formatSession} from "../utils/formatter";

export const createSession = onRequest(config, asyncHandler(async (req, res) => {
  if (!checkMethod(req, res, HttpMethod.POST)) return;

  const {region} = validate(createSessionSchema, req.body);

  const sessionId = generateId();
  const now = new Date().toISOString();

  await db.collection(SESSIONS_COLLECTION).doc(sessionId).set({
    region,
    status: SessionStatus.PENDING,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const token = generateToken({sessionId});
  const session = formatSession(sessionId, {
    region,
    status: SessionStatus.PENDING,
    createdAt: now,
    updatedAt: now,
  });

  return sendSuccess(res, {session, token}, HttpStatus.CREATED);
}));
