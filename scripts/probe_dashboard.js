const axios = require('axios');

const API_URL = 'https://andinoh-backend.onrender.com/api/v1';

const loginData = {
    email: 'owner3@andinoh.com',
    password: 'Andinoh2026!'
};

const hotelData = {
    name: "Andinoh Skyline Hotel",
    address: "123 Skyline Ave",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    phone_number: "+2348012345678",
    email: "contact@skyline.com",
    description: "A luxury skyline experience."
};

async function probe() {
    try {
        console.log('Logging in...');
        const loginResponse = await axios.post(`${API_URL}/auth/login/`, loginData);
        const token = loginResponse.data.access_token;
        console.log('Login successful. Token obtained.');

        const client = axios.create({
            baseURL: API_URL,
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: () => true
        });

        console.log('\n--- Checking Hotel Status ---');
        let myHotel = await client.get('hotels/my-hotel/');
        console.log(`[${myHotel.status}] hotels/my-hotel/`);

        if (myHotel.status === 404) {
            console.log('   -> Hotel not found. Attempting to create one...');
            const createResponse = await client.post('hotels/my-hotel/', hotelData);
            console.log(`[${createResponse.status}] Create Hotel Response`);
            if (createResponse.status === 201 || createResponse.status === 200) {
                console.log('   -> Hotel Created Successfully!');
                myHotel = await client.get('hotels/my-hotel/'); // Refresh
            } else {
                console.log('   -> Creation FAILED:', createResponse.data);
                return; // Stop if we can't create a hotel
            }
        } else if (myHotel.status === 200) {
            console.log('   -> Hotel exists:', myHotel.data.name);
        }

        if (myHotel.status === 200) {
            console.log('\n--- Retrying Dashboard Endpoints ---');
            // Now that we have a hotel, these might work!
            const endpointsToProbe = [
                'hotels/dashboard-stats/',
                'hotels/analytics/booking-trends/',
                // Also try without plural if above fail, but let's stick to the current ones first
                'hotels/stats/',
                'hotels/dashboard/'
            ];

            for (const endpoint of endpointsToProbe) {
                const res = await client.get(endpoint);
                console.log(`[${res.status}] ${endpoint}`);
                if (res.status === 200) console.log('   -> SUCCESS!');
            }
        }

    } catch (error) {
        console.error('Script Error:', error.message);
        if (error.response) console.error('Data:', error.response.data);
    }
}

probe();
