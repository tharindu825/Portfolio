const fs = require('fs');
try {
    require('ts-node').register();
    require('./src/index.ts');
} catch (e) {
    fs.writeFileSync('error_log.txt', e.stack || e.message);
}
