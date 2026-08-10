import * as ftp from 'basic-ftp';

async function deploy() {
  const client = new ftp.Client(30000);
  client.ftp.verbose = true;

  const server = process.env.FTP_SERVER || 'ftpupload.net';
  const user = process.env.FTP_USERNAME;
  const password = process.env.FTP_PASSWORD;

  if (!user || !password) {
    console.error('❌ Missing FTP_USERNAME or FTP_PASSWORD environment variables.');
    process.exit(1);
  }

  try {
    console.log(`🔌 Connecting to ${server} as ${user}...`);
    await client.access({
      host: server,
      user: user,
      password: password,
      secure: false,
    });
    console.log('✅ Connected successfully!');

    console.log('🚀 Uploading frontend build (./frontend/dist) to /htdocs...');
    await client.uploadFromDir('./frontend/dist', '/htdocs');

    console.log('🚀 Uploading backend API (./backend) to /htdocs/backend...');
    await client.uploadFromDir('./backend', '/htdocs/backend');

    console.log('🎉 Deployment to InfinityFree completed successfully!');
  } catch (err) {
    console.error('❌ FTP Deployment failed:', err);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
