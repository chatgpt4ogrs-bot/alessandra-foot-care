const https = require('https');

const SUPABASE_URL = 'qeawolverpxosxoezuwq.supabase.co';
const ANON_KEY = 'sb_publishable_yxbliIpRCH-lNVLQ16yo5w_1KYhVd9M';

function testEndpoint(label, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: SUPABASE_URL,
      path: path,
      headers: {
        'apikey': ANON_KEY,
        'Authorization': 'Bearer ' + ANON_KEY,
      }
    };
    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        console.log(`[${label}] Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          console.log(`[${label}] Resposta:`, JSON.stringify(json).substring(0, 200));
        } catch {
          console.log(`[${label}] Resposta:`, data.substring(0, 200));
        }
        resolve(res.statusCode);
      });
    });
    req.on('error', (e) => {
      console.log(`[${label}] ERRO DE REDE:`, e.message);
      resolve(null);
    });
    req.setTimeout(8000, () => {
      console.log(`[${label}] TIMEOUT - sem resposta em 8s`);
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

async function main() {
  console.log('=== TESTE DE CONEXÃO COM SUPABASE ===\n');
  console.log('URL:', SUPABASE_URL);
  console.log('Chave:', ANON_KEY.substring(0, 30) + '...\n');

  await testEndpoint('REST API', '/rest/v1/');
  await testEndpoint('AUTH HEALTH', '/auth/v1/health');
  await testEndpoint('STORAGE', '/storage/v1/health');

  console.log('\n=== TESTE CONCLUÍDO ===');
}

main();
