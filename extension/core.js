;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RepoTool = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
function bytes(value){return new TextEncoder().encode(value);}function b64urlBytes(data){var binary='';new Uint8Array(data).forEach(function(v){binary+=String.fromCharCode(v);});var out=typeof Buffer!=='undefined'?Buffer.from(data).toString('base64'):btoa(binary);return out.replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');}function b64urlText(value){return b64urlBytes(bytes(value));}
async function subtle(){if(typeof crypto!=='undefined'&&crypto.subtle)return crypto.subtle;if(typeof require!=='undefined')return require('crypto').webcrypto.subtle;throw new Error('Web Crypto is unavailable');}
async function sign(payload,secret){if(!secret||secret.length<8)throw new Error('Use a test secret with at least 8 characters');var header=b64urlText(JSON.stringify({alg:'HS256',typ:'JWT'})),body=b64urlText(JSON.stringify(payload)),data=header+'.'+body,api=await subtle(),key=await api.importKey('raw',bytes(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']),sig=b64urlBytes(await api.sign('HMAC',key,bytes(data)));return data+'.'+sig;}
async function process(input){var parts=String(input||'').split(/\r?\n---secret---\r?\n/);if(parts.length!==2)throw new Error('Separate JSON and the test secret with ---secret---');var payload=JSON.parse(parts[0]);if(!payload||Array.isArray(payload)||typeof payload!=='object')throw new Error('Claims must be a JSON object');var token=await sign(payload,parts[1].trim());return{output:token,summary:'HS256 test token created. Signature has not been server-verified.'};}
  return { process: process, sign: sign, b64urlText: b64urlText };
});
