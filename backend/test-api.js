const http = require('http');

// Compiled app and db connection
const app = require('./dist/app').default;
const { connectDB, disconnectDB } = require('./dist/config/db');
const { OTPVerification } = require('./dist/models/OTPVerification');
const { User } = require('./dist/models/User');
const { Contact } = require('./dist/models/Contact');
const { Project } = require('./dist/models/Project');
const { EmailActivity } = require('./dist/models/EmailActivity');
const { Demo } = require('./dist/models/Demo');
const { Notification } = require('./dist/models/Notification');
const bcrypt = require('bcryptjs');

const server = http.createServer(app);
const PORT = 5058;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runAllTests() {
  console.log('[Test Runner] Connecting to database...');
  await connectDB();

  server.listen(PORT, '127.0.0.1', async () => {
    console.log(`\n======================================================`);
    console.log(`🧪 Running Complete ANTHIX Backend Integration & E2E Test Suite`);
    console.log(`======================================================\n`);

    let passed = 0;
    let failed = 0;

    const assert = (condition, testName) => {
      if (condition) {
        console.log(`  ✓ PASS: ${testName}`);
        passed++;
      } else {
        console.error(`  ✗ FAIL: ${testName}`);
        failed++;
      }
    };

    const testEmail = `integration.test.${Date.now()}@anthix-sample.dev`;
    const testPassword = 'Password123!';
    let sessionCookie = '';
    let sessionToken = '';

    try {
      // 1. Health Check
      console.log('--- 1. Public Health Check ---');
      const healthRes = await fetch(`${BASE_URL}/api/health`);
      const healthData = await healthRes.json();
      assert(healthRes.status === 200, 'GET /api/health returns HTTP 200');
      assert(healthData.service === 'ANTHIX Backend API', 'Service name is "ANTHIX Backend API"');
      assert(healthData.database.connected === true, 'Database is connected to cluster');

      // 1b. CORS Check for localhost:3000
      console.log('\n--- 1b. CORS Check from http://localhost:3000 ---');
      const corsRes = await fetch(`${BASE_URL}/api/health`, {
        headers: { Origin: 'http://localhost:3000' },
      });
      assert(corsRes.status === 200, 'Origin http://localhost:3000 returns HTTP 200');
      assert(
        corsRes.headers.get('access-control-allow-origin') === 'http://localhost:3000',
        'CORS header Access-Control-Allow-Origin: http://localhost:3000 returned'
      );

      // 2. Protected Route Rejections
      console.log('\n--- 2. Unauthenticated Protected Route Access ---');
      const unauthContactRes = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'Digital Solutions',
          message: 'Trying to contact without login',
        }),
      });
      const unauthContactData = await unauthContactRes.json();
      assert(unauthContactRes.status === 401, 'POST /api/contact without session returns HTTP 401');
      assert(unauthContactData.success === false, 'POST /api/contact returns success: false');
      assert(
        unauthContactData.message && unauthContactData.message.includes('Authentication required'),
        'Returns friendly auth required message'
      );

      const unauthMeRes = await fetch(`${BASE_URL}/api/auth/me`);
      assert(unauthMeRes.status === 401, 'GET /api/auth/me without session returns HTTP 401');

      // 3. Registration Validation Failure
      console.log('\n--- 3. Registration Validation & Constraints ---');
      const invalidRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'A',
          email: 'not-an-email',
          password: '123',
          confirmPassword: '456',
        }),
      });
      const invalidRegData = await invalidRegRes.json();
      assert(invalidRegRes.status === 400, 'Invalid registration payload returns HTTP 400');
      assert(Array.isArray(invalidRegData.errors), 'Field errors array returned for invalid inputs');

      // 4. Registration Flow
      console.log('\n--- 4. User Registration Flow ---');
      const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Sarah Connor',
          email: testEmail,
          password: testPassword,
          confirmPassword: testPassword,
        }),
      });
      const regData = await regRes.json();
      assert(regRes.status === 201, 'POST /api/auth/register returns HTTP 201');
      assert(regData.success === true, 'Registration creates profile and initiates optional OTP creation');
      assert(regData.data && regData.data.user && regData.data.user.email === testEmail, 'User profile created immediately');

      // 4b. Confirm Unverified Account CAN Log In (OTP Verification is Optional)
      console.log('\n--- 4b. Optional Verification: Unverified Account Can Log In & Access Profile ---');
      const unverifiedLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });
      const unverifiedLoginData = await unverifiedLoginRes.json();
      assert(unverifiedLoginRes.status === 200, 'Unverified account login succeeds with HTTP 200');
      assert(unverifiedLoginData.success === true, 'Login returns success: true for user without mandatory OTP');
      assert(Boolean(unverifiedLoginData.data.token), 'Session token returned for unverified user');
      assert(unverifiedLoginData.data.user.isEmailVerified === false, 'User profile is currently unverified');

      // Retrieve the generated OTP from DB to simulate user email receipt
      const otpRecord = await OTPVerification.findOne({
        email: testEmail,
        purpose: 'registration',
        verified: false,
      }).sort({ createdAt: -1 });

      assert(Boolean(otpRecord), 'Pending OTP record found in MongoDB');

      // 5. Verify Registration OTP
      console.log('\n--- 5. Verify Registration OTP ---');
      // Intentionally test bad OTP first
      const badOtpRes = await fetch(`${BASE_URL}/api/auth/verify-registration-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          otp: '999999',
        }),
      });
      assert(badOtpRes.status === 400, 'Incorrect OTP code rejected with HTTP 400');

      // Find the actual OTP: since it's hashed in DB, for testing we can set a known hash
      const knownOtp = '123456';
      otpRecord.otpHash = await bcrypt.hash(knownOtp, 10);
      await otpRecord.save();

      const verifyRegRes = await fetch(`${BASE_URL}/api/auth/verify-registration-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          otp: knownOtp,
        }),
      });
      const verifyRegData = await verifyRegRes.json();
      assert(verifyRegRes.status === 200, 'Valid OTP verifies and returns HTTP 200 OK');
      assert(verifyRegData.success === true, 'Email address marked as verified');
      assert(verifyRegData.data.user.isEmailVerified === true, 'Profile isEmailVerified updated to true');

      // 6. Test Email and Password Login (NO OTP Required)
      console.log('\n--- 6. Email and Password Login (No OTP Required) ---');

      // 6a. Bad Password
      const badPasswordRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'WrongPassword123!',
        }),
      });
      assert(badPasswordRes.status === 401, 'Incorrect password rejected with HTTP 401');
      const badPasswordData = await badPasswordRes.json();
      assert(badPasswordData.message === 'Invalid email or password.', 'Generic error message returned');

      // 6b. Non-existent Email
      const nonExistentRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@nowhere.dev',
          password: testPassword,
        }),
      });
      assert(nonExistentRes.status === 401, 'Non-existent email rejected with HTTP 401');

      // 6c. Successful Email and Password Login
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });
      const loginData = await loginRes.json();
      assert(loginRes.status === 200, 'POST /api/auth/login with valid email and password returns HTTP 200');
      assert(loginData.success === true, 'Login succeeds without requiring any OTP');
      assert(Boolean(loginData.data.token), 'Session token returned');
      assert(loginData.data.user.email === testEmail, 'User profile returned');

      sessionToken = loginData.data.token;
      const rawLoginCookie = loginRes.headers.get('set-cookie');
      if (rawLoginCookie) {
        sessionCookie = rawLoginCookie.split(';')[0];
        assert(sessionCookie.includes('anthix_session='), 'HttpOnly session cookie issued on login');
      }

      // 6d. Check Authenticated Session via GET /api/auth/me
      console.log('\n--- 6d. Session Verification (GET /api/auth/me) ---');
      const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      const meData = await meRes.json();
      assert(meRes.status === 200, 'GET /api/auth/me returns HTTP 200 for authenticated user');
      assert(meData.data.user.email === testEmail, 'User profile matches registered email');

      // 7. Submit Contact Inquiry
      console.log('\n--- 7. Submit Contact Inquiry (POST /api/contact) ---');
      const contactRes = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          service: 'AI & Automation',
          organization: 'Cyberdyne Systems',
          phone: '+1 555-0199',
          subject: 'Automation System Inquiry',
          message: 'We require technical guidance on AI workflow integration.',
        }),
      });
      const contactData = await contactRes.json();
      assert(contactRes.status === 201, 'POST /api/contact saves inquiry and returns HTTP 201');
      assert(contactData.success === true, 'Contact submission confirmed by backend');

      // 8. Fetch User's Own Inquiries (GET /api/contact/me)
      console.log('\n--- 8. Retrieve User Inquiries (GET /api/contact/me) ---');
      const myContactsRes = await fetch(`${BASE_URL}/api/contact/me`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      const myContactsData = await myContactsRes.json();
      assert(myContactsRes.status === 200, 'GET /api/contact/me returns HTTP 200');
      assert(Array.isArray(myContactsData.data.contacts), 'Inquiries array returned');
      assert(myContactsData.data.contacts.length >= 1, 'Inquiry successfully saved and listed');

      // 9. Passwordless Login Request OTP Flow
      console.log('\n--- 9. Passwordless Email Login Request ---');
      const loginReqRes = await fetch(`${BASE_URL}/api/auth/login/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
        }),
      });
      const loginReqData = await loginReqRes.json();
      assert(loginReqRes.status === 200, 'Login OTP requested successfully');
      assert(loginReqData.success === true, 'Login OTP dispatched');

      // 10. Logout Flow
      console.log('\n--- 10. User Logout (POST /api/auth/logout) ---');
      const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Cookie: sessionCookie,
        },
      });
      assert(logoutRes.status === 200, 'POST /api/auth/logout returns HTTP 200');

      // 11. Admin Access Control & Dashboard Testing
      console.log('\n--- 11. Admin Authorization & Security Guards ---');
      
      // 11a. Unauthenticated access to /api/admin/dashboard returns 401
      const unauthAdminRes = await fetch(`${BASE_URL}/api/admin/dashboard`);
      const unauthAdminData = await unauthAdminRes.json();
      assert(unauthAdminRes.status === 401, 'Unauthenticated GET /api/admin/dashboard returns HTTP 401');
      assert(unauthAdminData.success === false, 'Returns success: false');

      // 11b. Standard user (role: "user") access to /api/admin/dashboard returns 403 Forbidden
      const standardUserAdminRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      const standardUserAdminData = await standardUserAdminRes.json();
      assert(standardUserAdminRes.status === 403, 'Regular user GET /api/admin/dashboard returns HTTP 403 Forbidden');
      assert(
        standardUserAdminData.message && standardUserAdminData.message.includes('Administrator privileges required'),
        'Strict 403 message confirms non-admin denial'
      );

      // 11c. Invalid Admin Login Credentials
      console.log('\n--- 11c. Admin Authentication ---');
      const badAdminLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@anthix.com',
          password: 'IncorrectPassword!',
        }),
      });
      assert(badAdminLoginRes.status === 401, 'POST /api/admin/login with incorrect credentials returns HTTP 401');

      // Ensure admin user exists in DB with hashed password
      const adminEmail = 'admin@anthix.com';
      const adminPass = 'AdminPass123!';
      let adminRecord = await User.findOne({ email: adminEmail });
      if (!adminRecord) {
        const passwordHash = await bcrypt.hash(adminPass, 12);
        adminRecord = await User.create({
          name: 'ANTHIX Administrator',
          email: adminEmail,
          passwordHash,
          role: 'admin',
          isEmailVerified: true,
          accountStatus: 'active',
        });
      } else {
        const passwordHash = await bcrypt.hash(adminPass, 12);
        adminRecord.passwordHash = passwordHash;
        adminRecord.role = 'admin';
        adminRecord.isEmailVerified = true;
        await adminRecord.save();
      }

      // 11d. Valid Admin Login
      const adminLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPass,
        }),
      });
      const adminLoginData = await adminLoginRes.json();
      assert(adminLoginRes.status === 200, 'POST /api/admin/login returns HTTP 200');
      assert(adminLoginData.success === true, 'Admin login success confirmed');
      assert(adminLoginData.data.user.role === 'admin', 'Returned user role is strictly "admin"');

      const adminRawCookie = adminLoginRes.headers.get('set-cookie') || '';
      const adminSessionCookie = adminRawCookie.split(';')[0];
      const adminToken = adminLoginData.data.token;

      // 11d2. Admin Contact Form Submission & Identity Verification using Bearer Token
      console.log('\n--- 11d2. Admin Contact Form Submission & Bearer Auth ---');
      const adminContactRes = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          service: 'AI & Automation',
          organization: 'ANTHIX Headquarters',
          phone: '+1 800-555-0199',
          subject: 'Admin Internal Inquiry',
          message: 'Testing admin inquiry submission via Bearer token without cookies.',
        }),
      });
      const adminContactData = await adminContactRes.json();
      assert(adminContactRes.status === 201, 'Admin POST /api/contact with Bearer token succeeds with HTTP 201');
      assert(adminContactData.success === true, 'Admin contact submission confirmed');

      // Admin retrieves their inquiries (GET /api/contact/me) with Bearer token
      const adminMyContactsRes = await fetch(`${BASE_URL}/api/contact/me`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const adminMyContactsData = await adminMyContactsRes.json();
      assert(adminMyContactsRes.status === 200, 'Admin GET /api/contact/me with Bearer token returns HTTP 200');
      assert(Array.isArray(adminMyContactsData.data.contacts), 'Admin contacts array returned');

      // Invalid token returns 401
      const invalidTokenContactRes = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer invalid.or.tampered.token',
        },
        body: JSON.stringify({
          service: 'Digital Solutions',
          message: 'This inquiry should fail due to invalid token.',
        }),
      });
      assert(invalidTokenContactRes.status === 401, 'Invalid Bearer token to /api/contact returns HTTP 401');

      // GET /api/auth/me with admin Bearer token returns admin profile
      const adminAuthMeRes = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const adminAuthMeData = await adminAuthMeRes.json();
      assert(adminAuthMeRes.status === 200, 'Admin GET /api/auth/me with Bearer token returns HTTP 200');
      assert(adminAuthMeData.data.user.role === 'admin', 'Admin profile verified with role "admin"');

      // 11e. Admin Dashboard Overview
      console.log('\n--- 11e. Admin Dashboard Metrics (GET /api/admin/dashboard) ---');
      const adminDashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const adminDashData = await adminDashRes.json();
      assert(adminDashRes.status === 200, 'GET /api/admin/dashboard returns HTTP 200');
      assert(typeof adminDashData.data.stats.totalMessages === 'number', 'totalMessages metric present');
      assert(typeof adminDashData.data.stats.totalUsers === 'number', 'totalUsers metric present');
      assert(Array.isArray(adminDashData.data.serviceDistribution), 'serviceDistribution array present');
      assert(Array.isArray(adminDashData.data.recentMessages), 'recentMessages array present');

      // 11f. Admin Contact Inquiries List (GET /api/admin/messages)
      console.log('\n--- 11f. Admin Inquiries List & Filters ---');
      const adminMessagesRes = await fetch(`${BASE_URL}/api/admin/messages?limit=10&page=1`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const adminMessagesData = await adminMessagesRes.json();
      assert(adminMessagesRes.status === 200, 'GET /api/admin/messages returns HTTP 200');
      assert(Array.isArray(adminMessagesData.data.messages), 'Messages array returned');
      assert(adminMessagesData.data.pagination.page === 1, 'Pagination data present');

      // Pick an inquiry to test status update, internal notes, and detail fetch
      let targetMessageId = '';
      if (adminMessagesData.data.messages.length > 0) {
        targetMessageId = adminMessagesData.data.messages[0]._id;
      } else {
        // Create an inquiry for testing
        const sampleContact = await Contact.create({
          userId: adminRecord._id,
          name: 'Jane Doe',
          email: 'jane@acme.corp',
          organization: 'Acme Corp',
          service: 'Digital Solutions',
          subject: 'Enterprise Consultation',
          message: 'Need a customized quote for enterprise implementation.',
          status: 'new',
        });
        targetMessageId = sampleContact._id.toString();
      }

      // 11g. Get Single Inquiry By ID
      console.log('\n--- 11g. Admin Single Inquiry Detail (GET /api/admin/messages/:id) ---');
      const singleMsgRes = await fetch(`${BASE_URL}/api/admin/messages/${targetMessageId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const singleMsgData = await singleMsgRes.json();
      assert(singleMsgRes.status === 200, 'GET /api/admin/messages/:id returns HTTP 200');
      assert(singleMsgData.data.message._id.toString() === targetMessageId, 'Fetched exact inquiry details');

      // 11h. Update Message Status (PATCH /api/admin/messages/:id/status)
      console.log('\n--- 11h. Update Status & Internal Notes ---');
      const updateStatusRes = await fetch(`${BASE_URL}/api/admin/messages/${targetMessageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
        body: JSON.stringify({ status: 'in_progress' }),
      });
      const updateStatusData = await updateStatusRes.json();
      assert(updateStatusRes.status === 200, 'PATCH status returns HTTP 200');
      assert(updateStatusData.data.message.status === 'in_progress', 'Message status successfully updated to "in_progress"');

      // 11i. Update Internal Admin Notes (PATCH /api/admin/messages/:id/notes)
      const updateNotesRes = await fetch(`${BASE_URL}/api/admin/messages/${targetMessageId}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
        body: JSON.stringify({ notes: 'Followed up via telephone. Proposal in draft.' }),
      });
      const updateNotesData = await updateNotesRes.json();
      assert(updateNotesRes.status === 200, 'PATCH notes returns HTTP 200');
      assert(
        updateNotesData.data.message.adminNotes === 'Followed up via telephone. Proposal in draft.',
        'Internal admin notes saved securely'
      );

      // 11j. Verify Data Isolation (Client endpoint NEVER leaks adminNotes)
      console.log('\n--- 11j. Privacy Check: Client Endpoint Never Leaks Admin Notes ---');
      const clientContactsRes = await fetch(`${BASE_URL}/api/contact/me`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      const clientContactsData = await clientContactsRes.json();
      if (clientContactsData.data && clientContactsData.data.contacts.length > 0) {
        const clientMsg = clientContactsData.data.contacts[0];
        assert(clientMsg.adminNotes === undefined, 'Client GET /api/contact/me does NOT contain adminNotes field');
        assert(clientMsg.archived === undefined, 'Client GET /api/contact/me does NOT contain archived flag');
      }

      // 11k. Admin Users List (GET /api/admin/users)
      console.log('\n--- 11k. Admin Users Directory (GET /api/admin/users) ---');
      const adminUsersRes = await fetch(`${BASE_URL}/api/admin/users?limit=10&page=1`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const adminUsersData = await adminUsersRes.json();
      assert(adminUsersRes.status === 200, 'GET /api/admin/users returns HTTP 200');
      assert(Array.isArray(adminUsersData.data.users), 'Users array returned');
      assert(typeof adminUsersData.data.users[0].inquiriesCount === 'number', 'User inquiries count aggregated');

      // 11l. Admin User By ID
      const targetUserId = adminUsersData.data.users[0].id;
      const adminSingleUserRes = await fetch(`${BASE_URL}/api/admin/users/${targetUserId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const adminSingleUserData = await adminSingleUserRes.json();
      assert(adminSingleUserRes.status === 200, 'GET /api/admin/users/:id returns HTTP 200');
      assert(adminSingleUserData.data.user.id === targetUserId, 'Fetched user profile safely without passwordHash');
      assert(adminSingleUserData.data.user.passwordHash === undefined, 'passwordHash omitted from admin user detail');
      assert(Array.isArray(adminSingleUserData.data.inquiries), 'User inquiries array returned');

      // 11m. CSV Export (GET /api/admin/export/messages)
      console.log('\n--- 11m. CSV Export with Formula Injection Protection ---');
      const csvRes = await fetch(`${BASE_URL}/api/admin/export/messages`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const csvText = await csvRes.text();
      assert(csvRes.status === 200, 'GET /api/admin/export/messages returns HTTP 200');
      assert(csvRes.headers.get('content-type').includes('text/csv'), 'Content-Type is text/csv');
      assert(csvText.includes('ID,Status,Created At,Client Name,Client Email'), 'CSV header row present');

      // 11n. Soft Delete / Archive Message (DELETE /api/admin/messages/:id)
      console.log('\n--- 11n. Archive Message (DELETE /api/admin/messages/:id) ---');
      const deleteMsgRes = await fetch(`${BASE_URL}/api/admin/messages/${targetMessageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const deleteMsgData = await deleteMsgRes.json();
      assert(deleteMsgRes.status === 200, 'DELETE /api/admin/messages/:id returns HTTP 200');
      assert(deleteMsgData.success === true, 'Message marked as archived');

      // 12. Public Projects Endpoint (GET /api/projects)
      console.log('\n--- 12. Public Projects Endpoint (GET /api/projects) ---');
      const publicProjRes = await fetch(`${BASE_URL}/api/projects`);
      const publicProjData = await publicProjRes.json();
      assert(publicProjRes.status === 200, 'GET /api/projects returns HTTP 200');
      assert(publicProjData.success === true, 'Public projects success: true');
      assert(Array.isArray(publicProjData.data.projects), 'Projects array returned');
      assert(publicProjData.data.projects.length >= 6, 'Contains at least 6 auto-seeded projects');

      // 13. Admin Projects CRUD (GET, POST, PATCH, DELETE)
      console.log('\n--- 13. Admin Projects Management (CRUD) ---');
      const adminProjRes = await fetch(`${BASE_URL}/api/admin/projects`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const adminProjData = await adminProjRes.json();
      assert(adminProjRes.status === 200, 'GET /api/admin/projects returns HTTP 200');
      assert(adminProjData.data.projects.length >= 6, 'Admin projects listing returned');

      // 13b. Admin Create New Project
      console.log('\n--- 13b. Create New Project (POST /api/admin/projects) ---');
      const createProjRes = await fetch(`${BASE_URL}/api/admin/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
        body: JSON.stringify({
          title: 'Automated Test Cloud Architecture',
          shortDescription: 'Enterprise cloud migration and zero-trust orchestration test platform.',
          description: 'Full description of the automated cloud architecture test platform.',
          category: 'Cloud Infrastructure',
          technologies: ['Kubernetes', 'Terraform', 'Go'],
          thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
          status: 'draft',
          featured: true,
          mockupType: 'crm',
          surfaceTheme: 'violet-lavender',
        }),
      });
      const createProjData = await createProjRes.json();
      assert(createProjRes.status === 201, 'POST /api/admin/projects returns HTTP 201');
      assert(createProjData.data.project.title === 'Automated Test Cloud Architecture', 'Project title saved');
      const testProjectId = createProjData.data.project._id;

      // 13c. Toggle Publish Status
      console.log('\n--- 13c. Toggle Publish Status (PATCH /api/admin/projects/:id/publish) ---');
      const publishProjRes = await fetch(`${BASE_URL}/api/admin/projects/${testProjectId}/publish`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const publishProjData = await publishProjRes.json();
      assert(publishProjRes.status === 200, 'Toggle publish returns HTTP 200');
      assert(publishProjData.data.project.status === 'published', 'Project status toggled to published');

      // 13d. Delete Test Project
      console.log('\n--- 13d. Delete Project (DELETE /api/admin/projects/:id) ---');
      const deleteProjRes = await fetch(`${BASE_URL}/api/admin/projects/${testProjectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      assert(deleteProjRes.status === 200, 'DELETE /api/admin/projects/:id returns HTTP 200');

      // 14. Direct Client Emailing (POST /api/admin/email/send & GET /api/admin/email/activities)
      console.log('\n--- 14. Direct Client Email Dispatch ---');
      const sendEmailRes = await fetch(`${BASE_URL}/api/admin/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
        body: JSON.stringify({
          to: testEmail,
          recipientName: 'Integration Tester',
          subject: 'Regarding your inquiry with ANTHIX',
          body: 'Thank you for reaching out. We have reviewed your architectural requirements.',
          requestId: targetMessageId,
        }),
      });
      const sendEmailData = await sendEmailRes.json();
      assert(sendEmailRes.status === 200, 'POST /api/admin/email/send returns HTTP 200');
      assert(sendEmailData.success === true, 'Email dispatch logged successfully');
      assert(sendEmailData.data.activity.recipient === testEmail, 'Email recipient verified');

      // 14b. Check Email Activities Log
      console.log('\n--- 14b. Email Activities Log (GET /api/admin/email/activities) ---');
      const emailActivitiesRes = await fetch(`${BASE_URL}/api/admin/email/activities`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const emailActivitiesData = await emailActivitiesRes.json();
      assert(emailActivitiesRes.status === 200, 'GET /api/admin/email/activities returns HTTP 200');
      assert(Array.isArray(emailActivitiesData.data.activities), 'Email activities list returned');
      assert(emailActivitiesData.data.activities.some((a) => a.recipient === testEmail), 'Dispatched email logged');

      // 15. Admin System Settings (GET /api/admin/settings)
      console.log('\n--- 15. Admin System Settings & Health (GET /api/admin/settings) ---');
      const settingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const settingsData = await settingsRes.json();
      assert(settingsRes.status === 200, 'GET /api/admin/settings returns HTTP 200');
      assert(settingsData.data.system.environment !== undefined, 'Settings contains system environment');
      assert(settingsData.data.database.connected === true, 'Settings confirms database connected');
      assert(settingsData.data.emailProvider.isConfigured !== undefined, 'Settings contains emailProvider state');

      // 16. Security & Authorization Enforcement (Non-admin token must get HTTP 403)
      console.log('\n--- 16. Security & Role Isolation (Non-admin blocked from /api/admin/*) ---');
      const unauthorizedRes = await fetch(`${BASE_URL}/api/admin/settings`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      assert(unauthorizedRes.status === 403, 'Regular user token receives HTTP 403 Forbidden on /api/admin/settings');

      // 17. User Profile Management (GET & PATCH /api/users/me & /api/users/profile)
      console.log('\n--- 17. User Profile Management ---');
      const getProfileRes = await fetch(`${BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      const getProfileData = await getProfileRes.json();
      assert(getProfileRes.status === 200, 'GET /api/users/me returns HTTP 200');
      assert(getProfileData.data.user.email === testEmail, 'User profile returns correct email');
      assert(typeof getProfileData.data.user.profileCompletion === 'number', 'Profile completion score calculated');

      const updateProfileRes = await fetch(`${BASE_URL}/api/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          phone: '+1 555-0199',
          company: 'Acme Health Systems',
          jobTitle: 'Director of Technology',
          organizationType: 'Healthcare Provider',
          location: 'San Francisco, CA',
          website: 'https://acmehealth.example.com',
          bio: 'Specializing in healthcare automation, hospital management, and digital workflows.',
          interests: ['Healthcare EHR', 'AI Automation', 'Data Security'],
        }),
      });
      const updateProfileData = await updateProfileRes.json();
      assert(updateProfileRes.status === 200, 'PATCH /api/users/profile returns HTTP 200');
      assert(updateProfileData.data.user.company === 'Acme Health Systems', 'Updated company is saved');
      assert(updateProfileData.data.user.profileCompletion > 50, 'Profile completion score updated');

      // 18. User Avatar Upload with Magic Byte Security & Cleanup
      console.log('\n--- 18. User Avatar Upload & Security Validation ---');
      // 18a. Invalid payload (plain text masquerading as PNG)
      const fakeImageRes = await fetch(`${BASE_URL}/api/users/me/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          image: 'data:image/png;base64,SGVsbG8gV29ybGQ=', // "Hello World"
        }),
      });
      assert(fakeImageRes.status === 400, 'Uploading non-image binary signature rejected with HTTP 400');

      // 18b. Valid PNG image
      const validPngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const uploadAvatarRes = await fetch(`${BASE_URL}/api/users/me/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          image: validPngBase64,
        }),
      });
      const uploadAvatarData = await uploadAvatarRes.json();
      assert(uploadAvatarRes.status === 200, 'Uploading valid PNG avatar returns HTTP 200');
      assert(uploadAvatarData.data.avatarUrl.startsWith('/uploads/avatars/'), 'Avatar URL stored on disk & returned');

      // 18c. Remove avatar
      const removeAvatarRes = await fetch(`${BASE_URL}/api/users/me/avatar`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      assert(removeAvatarRes.status === 200, 'DELETE /api/users/me/avatar returns HTTP 200');

      // 19. User Inquiries & Privacy (Admin notes must be strictly omitted)
      console.log('\n--- 19. User Inquiries & Privacy Protection ---');
      const userRequestsRes = await fetch(`${BASE_URL}/api/users/me/requests`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      const userRequestsData = await userRequestsRes.json();
      assert(userRequestsRes.status === 200, 'GET /api/users/me/requests returns HTTP 200');
      assert(Array.isArray(userRequestsData.data.requests), 'User requests list returned');
      const targetUserRequest = userRequestsData.data.requests.find((r) => r._id === targetMessageId);
      if (targetUserRequest) {
        assert(targetUserRequest.adminNotes === undefined, 'Internal adminNotes strictly excluded from user view');
        assert(targetUserRequest.status !== undefined, 'User request status visible to user');
      }

      // 20. Admin Demo Sharing & User Demo Access
      console.log('\n--- 20. Admin Demo Sharing & User Portal Access ---');
      // 20a. Admin searches users for recipient picker
      const searchUsersRes = await fetch(`${BASE_URL}/api/admin/users/search?q=integration.test`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      const searchUsersData = await searchUsersRes.json();
      assert(searchUsersRes.status === 200, 'GET /api/admin/users/search returns HTTP 200');
      const foundUser = searchUsersData.data.users.find((u) => u.email === testEmail);
      assert(foundUser !== undefined, 'Found recipient user via admin search autocomplete');

      // 20b. Admin creates and shares demo with recipient
      const createDemoRes = await fetch(`${BASE_URL}/api/admin/demos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
        body: JSON.stringify({
          title: 'Custom Hospital EHR Demo',
          description: 'A customized interactive prototype for hospital workflow automation.',
          category: 'Hospital Management System',
          demoUrl: 'https://demo.anthix.com/hospital-ehr-sample',
          recipientUserId: foundUser._id,
          status: 'published',
          adminMessage: 'Hello Sarah! Here is the interactive prototype we prepared based on your requirements.',
          privateAdminNotes: 'Confidential: client requested enterprise HIPAA compliant hosting.',
        }),
      });
      const createDemoData = await createDemoRes.json();
      assert(createDemoRes.status === 201, 'POST /api/admin/demos returns HTTP 201 Created');
      const createdDemoId = createDemoData.data.demo._id;
      assert(createDemoData.data.demo.privateAdminNotes !== undefined, 'Admin sees privateAdminNotes in admin response');

      // 20c. User views their shared demos (GET /api/users/me/demos)
      const userDemosRes = await fetch(`${BASE_URL}/api/users/me/demos`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      const userDemosData = await userDemosRes.json();
      assert(userDemosRes.status === 200, 'GET /api/users/me/demos returns HTTP 200');
      const userSharedDemo = userDemosData.data.demos.find((d) => d._id === createdDemoId);
      assert(userSharedDemo !== undefined, 'User receives their custom shared demo');
      assert(userSharedDemo.privateAdminNotes === undefined, 'Private admin notes omitted from client payload');
      assert(userSharedDemo.title === 'Custom Hospital EHR Demo', 'Demo title matches created record');

      // 20d. User receives notification for the shared demo
      console.log('\n--- 20d. User In-App Notifications ---');
      const userNotificationsRes = await fetch(`${BASE_URL}/api/users/me/notifications`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie: sessionCookie,
        },
      });
      const userNotificationsData = await userNotificationsRes.json();
      assert(userNotificationsRes.status === 200, 'GET /api/users/me/notifications returns HTTP 200');
      assert(userNotificationsData.data.unreadCount > 0, 'Unread notification count incremented');
      const demoNotification = userNotificationsData.data.notifications.find((n) => n.relatedDemoId === createdDemoId);
      assert(demoNotification !== undefined, 'Notification generated for shared demo');

      if (demoNotification) {
        const markReadRes = await fetch(`${BASE_URL}/api/users/me/notifications/${demoNotification._id}/read`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            Cookie: sessionCookie,
          },
        });
        assert(markReadRes.status === 200, 'Mark notification as read returns HTTP 200');
      }

      // 20e. Admin deletes demo
      const deleteDemoRes = await fetch(`${BASE_URL}/api/admin/demos/${createdDemoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Cookie: adminSessionCookie,
        },
      });
      assert(deleteDemoRes.status === 200, 'DELETE /api/admin/demos/:id returns HTTP 200');

      // Clean up test records
      await User.deleteOne({ email: testEmail });
      await OTPVerification.deleteMany({ email: testEmail });
      await Contact.deleteMany({ email: testEmail });
      await Project.deleteOne({ title: 'Automated Test Cloud Architecture' });
      await EmailActivity.deleteMany({ recipient: testEmail });
      await Demo.deleteMany({ recipientUserId: foundUser?._id });
      await Notification.deleteMany({ recipientUserId: foundUser?._id });

      console.log(`\n======================================================`);
      console.log(`🎉 Complete Test Results: ${passed} passed, ${failed} failed`);
      console.log(`======================================================\n`);
    } catch (err) {
      console.error('[Test Execution Error]:', err);
      failed++;
    } finally {
      server.close(async () => {
        await disconnectDB();
        console.log('[Test Runner] Test HTTP server closed.');
        process.exit(failed > 0 ? 1 : 0);
      });
    }
  });
}

runAllTests();
