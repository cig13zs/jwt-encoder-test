const assert = require('assert');
const Tool = require('./core');

(async function () {
  const token = await Tool.sign({sub:'123'}, 'test-secret');
  assert.strictEqual(token.split('.').length, 3);
  assert.strictEqual(JSON.parse(Buffer.from(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'),'base64').toString()).sub, '123');
  await assert.rejects(() => Tool.sign({}, 'short'), /8 characters/);
  console.log('ok, tool assertions passed');
})().catch(function (error) {
  console.error(error);
  process.exitCode = 1;
});
