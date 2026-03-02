
import axios from 'axios';

const BASE_URL = 'https://hotel-api-gateway.onrender.com';
const TEST_EMAIL = `debug_rooms_${Date.now()}@andinoh.com`;
const TEST_PASSWORD = 'Password123!';

async function captureRoomData() {
    const client = axios.create({
        baseURL: BASE_URL,
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true
    });

    console.log(`Target: ${BASE_URL}`);
    console.log(`User: ${TEST_EMAIL}`);

    try {
        // 1. Register
        console.log('Registering (POST auth/api/auth/register)...');
        const regRes = await client.post('auth/api/auth/register', {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            hotel_name: "Debug Hotel",
            hotel_license_number: "DEBUG-001"
        });

        if (regRes.status !== 201 && regRes.status !== 200) {
            console.log('Registration failed:', regRes.data);
            return;
        }

        const token = regRes.data.access_token || regRes.data.data?.access_token;
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 2. Fetch Rooms
        console.log('Fetching Rooms (GET hotels/api/v1/hotels/rooms/)...');
        const roomsRes = await client.get('hotels/api/v1/hotels/rooms/');
        console.log(`Status: ${roomsRes.status}`);
        console.log('--- API RETURN VALUE (Full Body) ---');
        console.log(JSON.stringify(roomsRes.data, null, 2));
        console.log('--- END OF RETURN VALUE ---');

        const rooms = roomsRes.data.data?.results || roomsRes.data.results || [];
        console.log(`Interpretation: Found ${rooms.length} objects in results.`);

    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

captureRoomData();
