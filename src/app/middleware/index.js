import {} from 'dotenv/config';
import { verify } from 'jsonwebtoken';

// Fijate que se setea el Content-Type a application/json, si necesitas otro tipo de respuesta, cambialo
export const allowHeaderResponse = (req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
};

export const authorization = (req, res, next) => {
  const token = req.cookies[process.env.ACCESS_TOKEN];
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = verify(token, process.env.SECRET);
    req.id = data.id;
    req.name = data.name;
    req.role = data.role;
    next();
  } catch {
    return res.sendStatus(403);
  }
};
