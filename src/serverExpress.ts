import express from 'express';
import path from 'path';
import cors from 'cors';
import { urlencoded, json } from 'body-parser';
import multer from 'multer'

// By default authMiddleware
import auth from './utils/strategies/jwt.strategy';
import { signIn ,storage,uploadImageToProduct} from './graphql/resolvers/auth/auth.resolver';

export const app = express();

// Middlewares
app.use(cors());
// Servir archivos estaticos
app.use( express.static(path.join(__dirname, '../public/uploads/')));
app.use(urlencoded({ extended: false }));
app.use(auth);


// Auth Routes
app.post('/api/signIn', json(), signIn);
// Upload image to product

const upload = multer({ storage });
app.post('/api/upload/:idProduct', upload.single('data'),uploadImageToProduct );

export default app;
