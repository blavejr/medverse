import {onRequest} from "firebase-functions/v2/https";
import {db, SESSIONS_COLLECTION} from "../config/firebase";
import {listSessionsSchema} from "../schemas/session.schema";
import {config} from "../index";
import {validate} from "../utils/validation";
import {sendSuccess, checkMethod} from "../utils/http";
import {HttpMethod, HttpStatus} from "../types/enums";
import {asyncHandler} from "../utils/async-handler";
import {jwtAuth} from "../middleware/auth";
import {formatSession} from "../utils/formatter";

export const listSessions = onRequest(config, asyncHandler(async (req, res) => {
  if (!checkMethod(req, res, HttpMethod.GET)) return;

  const auth = jwtAuth(req, res);
  if (!auth) return;

  const {status, region, limit, page} = validate(listSessionsSchema, {
    status: req.query.status,
    region: req.query.region,
    limit: req.query.limit,
    page: req.query.page,
  });

  let query: FirebaseFirestore.Query = db
    .collection(SESSIONS_COLLECTION)
    .orderBy("createdAt", "desc");

  if (status) query = query.where("status", "==", status);
  if (region) query = query.where("region", "==", region);

  const offset = (page - 1) * limit;
  query = query.offset(offset).limit(limit + 1);

  const snapshot = await query.get();
  const hasNext = snapshot.docs.length > limit;
  const sessions = snapshot.docs
    .slice(0, limit)
    .map((doc) => formatSession(doc.id, doc.data()));

  return sendSuccess(res, {
    sessions,
    page,
    count: sessions.length,
    pagination: {
      limit,
      hasNext,
      next: hasNext ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
      page: page <= 1 ? 1 : page,
    },
  }, HttpStatus.OK);
}));
