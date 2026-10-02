const localtunnel = require('localtunnel');

(async () => {
  try {
    const requestedName = process.argv[2] || 'silhouette-atelier-mode';
    const subdomain = requestedName;
    console.log(`Starting localtunnel for port 3001 with requested subdomain: ${subdomain}...`);
    
    const tunnel = await localtunnel({
      port: 3001,
      subdomain: subdomain
    });

    console.log(`\n=================================================`);
    console.log(`ONLINE_URL: ${tunnel.url}`);
    console.log(`=================================================\n`);

    tunnel.on('close', () => {
      console.log('Tunnel was closed.');
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });

    // Keep process alive
    process.stdin.resume();
  } catch (err) {
    console.error('Failed to create tunnel:', err);
  }
})();
