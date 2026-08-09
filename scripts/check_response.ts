import axios from 'axios';

const BASE_URL = 'https://api.andinoh.com/api/v1';
const EMAIL = 'test_hotel_1781527395697@andinoh.com';
const PASSWORD = 'Password123!';

async function main() {
    try {
        const client = axios.create({
            baseURL: BASE_URL,
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Logging in...');
        const loginResponse = await client.post('auth/login/', {
            email: EMAIL,
            password: PASSWORD,
        });

        const token = loginResponse.data.data?.access_token || loginResponse.data.access_token;
        console.log('Token:', token);

        console.log('Fetching hotels/my-hotel/...');
        const response = await client.get('hotels/my-hotel/', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('\n--- RAW RESPONSE DATA ---');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

main();
