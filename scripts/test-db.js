const { Client } = require('pg');

const connectionString = "postgresql://postgres.pcmqmjbmrslrhgzrrgyi:94ZoFMRK8DR12xuq@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";

const client = new Client({
    connectionString: connectionString,
});

client.connect()
    .then(() => {
        console.log('Successfully connected to Supabase Pooler!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error details:', err.message);
        process.exit(1);
    });
