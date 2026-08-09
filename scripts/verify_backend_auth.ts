import axios from 'axios';

// Configuration
const BASE_URL = 'https://api.andinoh.com/api/v1';
const TEST_EMAIL = `test_auto_${Date.now()}@andinoh.com`;
const TEST_PASSWORD = 'Password123!';
const TEST_HOTEL_NAME = `Test Hotel ${Date.now()}`;
const TEST_LICENSE = `LIC-${Date.now()}`;

const client = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 60000, // 60s timeout for Render wake-up
});

async function runVerification() {
    console.log('🚀 Starting Backend Authentication Verification');
    console.log(`Target: ${BASE_URL}`);
    console.log(`Test User: ${TEST_EMAIL}`);

    try {
        // 1. Test Registration
        console.log('\n1️⃣  Testing Registration...');
        const registerPayload = {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            hotel_name: TEST_HOTEL_NAME,
            hotel_license_number: TEST_LICENSE,
        };

        // Note: Using the exact relative path we fixed in the frontend
        const regResponse = await client.post('auth/register/', registerPayload);

        if (regResponse.status === 201 || regResponse.status === 200) {
            console.log('✅ Registration SUCCESS');
            console.log('Response:', JSON.stringify(regResponse.data, null, 2));
        } else {
            console.error('❌ Registration FAILED with status:', regResponse.status);
        }

        // 2. Test Login
        console.log('\n2️⃣  Testing Login...');
        const loginPayload = {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        };

        const loginResponse = await client.post('auth/login/', loginPayload);

        if (loginResponse.status === 200) {
            console.log('✅ Login SUCCESS');
            const token = loginResponse.data.data?.access_token || loginResponse.data.access_token;
            console.log(`Token received: ${token ? 'YES' : 'NO'}`);

            // 3. Test Authorized Endpoint (Me)
            if (token) {
                console.log('\n3️⃣  Testing Authorized Endpoint (/auth/me/)...');
                const meResponse = await client.get('auth/me/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (meResponse.status === 200) {
                    console.log('✅ Authorized Request SUCCESS');
                    console.log('User Role:', meResponse.data.data?.role || meResponse.data.role);
                }
            }
        } else {
            console.error('❌ Login FAILED with status:', loginResponse.status);
        }

    } catch (error: any) {
        console.error('\n🔴 CRITICAL ERROR 🔴');
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received. Is the server online?');
            console.error('Error Code:', error.code);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error Message:', error.message);
        }
    }
}

runVerification();
