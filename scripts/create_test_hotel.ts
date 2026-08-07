import axios from 'axios';

const BASE_URL = 'https://andinoh-backend.onrender.com/api/v1';
const TIMESTAMP = Date.now();
const EMAIL = `test_hotel_${TIMESTAMP}@andinoh.com`;
const PASSWORD = 'Password123!';
const HOTEL_NAME = `Grand Test Hotel ${TIMESTAMP}`;
const LICENSE = `LIC-${TIMESTAMP}`;

const client = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 60000, // 60s timeout for Render wake-up
});

async function main() {
    console.log('🚀 Creating a New Test Hotel...');
    console.log(`Backend API: ${BASE_URL}`);
    console.log(`Email: ${EMAIL}`);
    console.log(`Password: ${PASSWORD}`);
    console.log(`Hotel Name: ${HOTEL_NAME}`);
    console.log(`License: ${LICENSE}`);

    try {
        // 1. Register User
        console.log('\n1️⃣  Registering User...');
        const registerPayload = {
            email: EMAIL,
            password: PASSWORD,
            role: 'hotel',
            hotel_name: HOTEL_NAME,
            hotel_license_number: LICENSE,
        };

        const regResponse = await client.post('auth/register/', registerPayload);
        console.log('✅ Registration request completed.');
        
        // 2. Login User
        console.log('\n2️⃣  Logging in...');
        const loginPayload = {
            email: EMAIL,
            password: PASSWORD,
        };

        const loginResponse = await client.post('auth/login/', loginPayload);
        const token = loginResponse.data.data?.access_token || loginResponse.data.access_token;
        if (!token) {
            throw new Error('Could not retrieve access token from login response');
        }
        console.log('✅ Login successful. JWT Token obtained.');

        // 3. Check / Create Hotel Profile
        console.log('\n3️⃣  Checking Hotel Profile status...');
        let hotelData = null;
        try {
            const getHotelResponse = await client.get('hotels/my-hotel/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            hotelData = getHotelResponse.data.data || getHotelResponse.data;
            console.log('ℹ️ Hotel profile already exists:', hotelData.id);
        } catch (getHotelError: any) {
            if (getHotelError.response?.status === 404) {
                console.log('ℹ️ Hotel profile does not exist yet. Creating profile...');
                
                const createHotelPayload = {
                    name: HOTEL_NAME,
                    description: 'A beautiful test hotel created automatically for testing.',
                    hotel_type: 'boutique',
                    star_rating: 4,
                    address: '123 Main Street',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'United States',
                    postal_code: '94105',
                    phone: '+15555551234',
                    email: EMAIL,
                    check_in_time: '15:00:00',
                    check_out_time: '11:00:00',
                    total_rooms: 10
                };

                const createResponse = await client.post('hotels/my-hotel/', createHotelPayload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                hotelData = createResponse.data.data || createResponse.data;
                console.log('✅ Hotel profile created successfully!');
            } else {
                throw getHotelError;
            }
        }

        console.log('\n==================================================');
        console.log('🎉 TEST HOTEL SUCCESSFULLY CREATED 🎉');
        console.log('==================================================');
        console.log(`📧 Login Email:    ${EMAIL}`);
        console.log(`🔑 Login Password: ${PASSWORD}`);
        console.log(`🏨 Hotel Name:     ${HOTEL_NAME}`);
        console.log(`🆔 Hotel ID:       ${hotelData?.id || 'N/A'}`);
        console.log(`📄 License Number: ${LICENSE}`);
        console.log(`📍 Location:       ${hotelData?.address}, ${hotelData?.city}, ${hotelData?.country}`);
        console.log('==================================================');
        console.log('You can now log in at http://localhost:3001/login using these credentials.');

    } catch (error: any) {
        console.error('\n🔴 CRITICAL ERROR CREATING HOTEL 🔴');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

main();
