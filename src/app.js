import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import movieRoutes from './routes/movieRoutes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger);

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/movies', movieRoutes);

app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`CineVault avviato su http://localhost:${PORT}`);
});

