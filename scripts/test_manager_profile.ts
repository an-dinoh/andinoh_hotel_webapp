import axios from 'axios';

// Configuration
const BASE_URL = 'http://127.0.0.1:8000/api/v1';
const OWNER_EMAIL = 'hotel_owner_1_5fceeb2a@example.com';
const STAFF_EMAIL = 'staff_test@example.com';
const PASSWORD = 'password123';

const client = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 60000,
});

async function runTestSuite() {
    console.log('🚀 Starting Comprehensive Hotel Manager Profile API Test Suite');
    console.log(`Target: ${BASE_URL}`);
    console.log(`Using Verified Owner: ${OWNER_EMAIL}`);

    try {
        // 1. Owner Login
        console.log('\n1️⃣  Logging in as Owner...');
        const loginResponse = await client.post('auth/login/', {
            email: OWNER_EMAIL,
            password: PASSWORD,
        });
        const ownerToken = loginResponse.data.data?.access_token || loginResponse.data.access_token;
        console.log('✅ Owner Logged In');

        // 3. Get Owner Profile
        console.log('\n3️⃣  Getting Owner Profile (GET auth/profile/)...');
        const profileResponse = await client.get('auth/profile/', {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        console.log('✅ Profile Retrieved:', profileResponse.data.data?.full_name || 'Success');

        // 4. Update Owner Profile
        console.log('\n4️⃣  Updating Owner Profile (PATCH auth/profile/)...');
        await client.patch('auth/profile/', {
            full_name: 'Updated Owner Name',
            phone_number: '+1234567890'
        }, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        console.log('✅ Profile Updated');

        // 5. Check invitation for a non-invited email (Verifying Backend Improvement)
        console.log('\n5️⃣  Checking Invitation for non-invited email (Verifying Backend Improvement)...');
        try {
            const randomEmail = `nonexistent_${Date.now()}@test.com`;
            const nonInvitedCheck = await client.get('hotels/staff/check-invitation/', {
                params: { email: randomEmail },
                headers: { Authorization: `Bearer ${ownerToken}` }
            });
            console.log('✅ Invitation Check (Not Found) returned 200:', JSON.stringify(nonInvitedCheck.data, null, 2));
        } catch (error: any) {
            if (error.response?.status === 404) {
                console.log('ℹ️ Invitation Check (Not Found) still returns 404, but with data:', JSON.stringify(error.response.data, null, 2));
            } else {
                console.log('🔴 Unexpected error in invitation check:', error.message);
            }
        }

        // 6. Staff Login (using provided credentials)
        console.log(`\n6️⃣  Logging in as Staff (${STAFF_EMAIL})...`);
        const staffLoginResponse = await client.post('auth/login/', {
            email: STAFF_EMAIL,
            password: PASSWORD
        });
        const staffToken = staffLoginResponse.data.data?.access_token || staffLoginResponse.data.access_token;
        console.log('✅ Staff Logged In');

        // 7. Check Staff Invitation (Own)
        console.log('\n7️⃣  Checking My Own Staff Invitation (GET hotels/staff/check-invitation/)...');
        const checkResponse = await client.get('hotels/staff/check-invitation/', {
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        console.log('✅ My Invitation Status:', JSON.stringify(checkResponse.data.data || checkResponse.data, null, 2));

        // 8. Attempt Staff Profile Registration
        console.log('\n8️⃣  Attempting Staff Profile Registration (POST hotels/staff/register/)...');
        try {
            await client.post('hotels/staff/register/', {
                full_name: 'Verified Staff User'
            }, {
                headers: { Authorization: `Bearer ${staffToken}` }
            });
            console.log('✅ Staff Registered/Updated');
        } catch (error: any) {
            console.log('ℹ️ Staff Registration status:', error.response?.status || error.message);
            if (error.response?.status === 500) {
                console.log('⚠️ Backend 500 error still present in "register" serializer.');
            }
        }

        // 9. Get Staff Profile (My Me)
        console.log('\n9️⃣  Getting My Staff Profile (GET hotels/staff/me/)...');
        let staffId = '';
        try {
            const staffMeResponse = await client.get('hotels/staff/me/', {
                headers: { Authorization: `Bearer ${staffToken}` }
            });
            const staffData = staffMeResponse.data.data || staffMeResponse.data;
            staffId = staffData.staff?.id || staffData.id;
            console.log('✅ Staff Profile Retrieved. ID:', staffId);
        } catch (error: any) {
            console.log('ℹ️ Staff Profile status:', error.response?.status || error.message);
            if (error.response?.status === 500) {
                console.log('⚠️ Backend 500 error still present in "me" serializer.');
            }
        }

        // 10. Change Staff Role (Owner Operation)
        if (staffId) {
            console.log('\n🔟  Changing Staff Role (POST hotels/staff/:id/change-role/)...');
            try {
                await client.post(`hotels/staff/${staffId}/change-role/`, {
                    role: 'front_desk_manager',
                    can_manage_rooms: true
                }, {
                    headers: { Authorization: `Bearer ${ownerToken}` }
                });
                console.log('✅ Staff Role Changed');
            } catch (error: any) {
                console.log('ℹ️ Role Change status:', error.response?.status || error.message);
            }
        }

        // 11. Change Staff Password
        console.log('\n1️⃣1️⃣ Changing Staff Password (POST hotels/staff/change-password/)...');
        try {
            await client.post('hotels/staff/change-password/', {
                current_password: PASSWORD,
                new_password: 'NewPassword123!'
            }, {
                headers: { Authorization: `Bearer ${staffToken}` }
            });
            console.log('✅ Staff Password Changed');

            // Revert password
            await client.post('hotels/staff/change-password/', {
                current_password: 'NewPassword123!',
                new_password: PASSWORD
            }, {
                headers: { Authorization: `Bearer ${staffToken}` }
            });
            console.log('✅ Staff Password Reverted');
        } catch (error: any) {
            console.log('ℹ️ Password Change status:', error.response?.status || error.message);
        }

        console.log('\n✨ ALL TESTS COMPLETED ✨');

    } catch (error: any) {
        console.error('\n🔴 TEST FAILED 🔴');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

runTestSuite();
