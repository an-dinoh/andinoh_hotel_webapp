
import axios from 'axios';

const BACKENDS = [
    'https://andinoh-backend.onrender.com/api/v1',
    'https://hotel-api-gateway.onrender.com/api/v1',
    'https://hotel-api-gateway.onrender.com'
];

const CREDENTIALS = {
    email: 'test_dashboard_prod_01@example.com',
    password: 'Andinoh2026!' // Trying the password from previous scripts
};

async function debugBackend(baseUrl: string) {
    console.log(`\n--- PROBING: ${baseUrl} ---`);
    const client = axios.create({
        baseURL: baseUrl,
        timeout: 10000,
        validateStatus: () => true
    });

    try {
        console.log(`Authenticating ${CREDENTIALS.email}...`);
        const loginRes = await client.post('/auth/login/', CREDENTIALS).catch(e => e.response);

        if (!loginRes || loginRes.status !== 200) {
            // Try alternate path
            const loginResAlt = await client.post('/auth/api/auth/login', CREDENTIALS).catch(e => e.response);
            if (!loginResAlt || loginResAlt.status !== 200) {
                console.log(`❌ Auth Failed (Status: ${loginRes?.status || 'network error'})`);
                return;
            }
            console.log(`✅ Auth Success (Alternate Path)`);
            client.defaults.headers.common['Authorization'] = `Bearer ${loginResAlt.data.data?.access_token || loginResAlt.data.access_token}`;
        } else {
            console.log(`✅ Auth Success`);
            client.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.access_token || loginRes.data.data?.access_token}`;
        }

        console.log('Fetching Rooms...');
        const roomsRes = await client.get('/hotels/rooms/');
        console.log(`Rooms Status: ${roomsRes.status}`);
        if (roomsRes.status === 200) {
            const rooms = roomsRes.data.data?.results || roomsRes.data.results || [];
            console.log(`Count: ${rooms.length}`);
            if (rooms.length > 0) {
                console.log('Sample Room (First):', JSON.stringify(rooms[0], null, 2));
            }
        } else {
            console.log('Rooms Data:', JSON.stringify(roomsRes.data, null, 2));
        }

        console.log('Fetching Dashboard Stats...');
        const statsRes = await client.get('/hotels/dashboard-stats/');
        if (statsRes.status === 200) {
            console.log('Dashboard Stats:', JSON.stringify(statsRes.data.data || statsRes.data, null, 2));
        }

    } catch (error: any) {
        console.log(`❌ Error Probing ${baseUrl}: ${error.message}`);
    }
}

async function run() {
    for (const url of BACKENDS) {
        await debugBackend(url);
    }
}

run();
