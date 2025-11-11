import cloudbase from '@cloudbase/node-sdk';

const app = cloudbase.init({
  secretId: process.env.TENCENT_SECRET_ID,
  secretKey: process.env.TENCENT_SECRET_KEY,
  env: process.env.CLOUDBASE_ENV_ID,
});

const db = app.database();
const _ = db.command;

export { db, _ };