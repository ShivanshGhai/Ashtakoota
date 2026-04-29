const assert = require('assert');
const fs = require('fs');
const path = require('path');

const authRoute = fs.readFileSync(path.join(__dirname, '..', 'routes', 'auth.js'), 'utf8');
const usersRoute = fs.readFileSync(path.join(__dirname, '..', 'routes', 'users.js'), 'utf8');
const envExample = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');

assert(authRoute.includes("process.env.UPLOAD_DIR || './uploads'"), 'registration uploads should default to ./uploads');
assert(usersRoute.includes("process.env.UPLOAD_DIR || './uploads'"), 'profile uploads should default to ./uploads');
assert(authRoute.includes('`/uploads/${finalName}`'), 'registration photo URLs should stay under /uploads');
assert(usersRoute.includes('`/uploads/${finalName}`'), 'profile photo URLs should stay under /uploads');
assert(envExample.includes('UPLOAD_DIR=./uploads'), 'env example should preserve relative upload directory');
assert(envExample.includes('/app/uploads'), 'env example should document the Railway volume mount');

console.log('uploadPaths.test.js passed');
