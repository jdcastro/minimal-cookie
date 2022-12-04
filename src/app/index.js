import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import { sign } from 'jsonwebtoken';
import {} from 'dotenv/config';
import { allowHeaderResponse, authorization } from './middleware';

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: 'GET,HEAD,POST,PATCH,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
};
const app = express();
const faviconPath = path.join(__dirname, '../public', 'favicon.ico');
app.use(cors(corsOptions));
app.use(compression());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(cookieParser());
app.use(favicon(faviconPath));
app.use(allowHeaderResponse);

app.get('/', (req, res) => {
  return res.json({ message: 'Hola!!! 👋🏽' });
});

app.get('/login', (req, res) => {
  const token = sign(
    { id: 0, name: 'root', role: 'superadmin' },
    process.env.SECRET,
    {
      expiresIn: process.env.TOCKEN_EXPIRES,
    }
  );
  return res
    .cookie(process.env.ACCESS_TOKEN, token, {
      maxAge: process.env.COOKIE_EXPIRES,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })
    .status(200)
    .json({ message: 'Iniciaste sesión con éxito 🤟 🥳' });
});

app.get('/sheltered', authorization, (req, res) => {
  return res.json({ user: { id: req.id, name:req.name, role: req.role } });
});

app.get('/logout', authorization, (req, res) => {
  return res
    .clearCookie(process.env.ACCESS_TOKEN)
    .status(200)
    .json({ message: 'Cerraste sesión con éxito 🖖🏽' });
});

export const appServerStart = (port) => {
  try {
    app.listen(port, () => {
      console.log(`server Api funcionando: http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
