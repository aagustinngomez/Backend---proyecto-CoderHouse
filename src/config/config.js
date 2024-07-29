import dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || 'desarrollo'}.local`;
console.log(`Cargando archivo de entorno: ${envFile}`);
const result = dotenv.config({ path: envFile });

if (result.error) {
  console.error('Error cargando archivo de entorno', result.error);
}

const {
  API_VERSION,
  PORT,
  DB_CNN,
  DB_NAME,
  CURSO,
  NODE_ENV,
  SIGNING_SECRET,
  GITHUB_SECRET,
  GITHUB_APP_ID,
  GITHUB_CLIENT_ID,
  GITHUB_CALLBACK_URL,
  API_URL,
  LOG_LEVEL_CONSOLE,
  LOG_LEVEL_FILE,
  EMAIL_ADDRESS,
  EMAIL_SECRET,
  STRIPE_KEY,
} = process.env;

console.log({ API_VERSION, PORT, DB_CNN, DB_NAME, CURSO, NODE_ENV, SIGNING_SECRET, GITHUB_SECRET, GITHUB_APP_ID, GITHUB_CLIENT_ID, GITHUB_CALLBACK_URL, API_URL, LOG_LEVEL_CONSOLE, LOG_LEVEL_FILE, EMAIL_ADDRESS, EMAIL_SECRET, STRIPE_KEY });

export default {
  API_VERSION,
  PORT,
  DB_CNN,
  DB_NAME,
  CURSO,
  NODE_ENV,
  SIGNING_SECRET,
  GITHUB_SECRET,
  GITHUB_APP_ID,
  GITHUB_CLIENT_ID,
  GITHUB_CALLBACK_URL,
  API_URL,
  LOG_LEVEL_CONSOLE,
  LOG_LEVEL_FILE,
  EMAIL_ADDRESS,
  EMAIL_SECRET,
  STRIPE_KEY,
};