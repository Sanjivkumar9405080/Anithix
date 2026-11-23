import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/User';
import { AuthService } from '../services/authService';

/**
 * Server-side script to provision or promote an initial administrator.
 *
 * Usage:
 *   npx tsx src/scripts/createAdmin.ts --email admin@anthix.com --password AdminSecurePassword123! --name "ANTHIX Lead"
 * Or via environment variables:
 *   ADMIN_EMAIL=admin@anthix.com ADMIN_PASSWORD=... npx tsx src/scripts/createAdmin.ts
 */

function parseArgs(): { email?: string; password?: string; name?: string } {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      result.email = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      result.password = args[i + 1];
      i++;
    } else if (args[i] === '--name' && args[i + 1]) {
      result.name = args[i + 1];
      i++;
    }
  }

  return {
    email: result.email || process.env.ADMIN_EMAIL,
    password: result.password || process.env.ADMIN_PASSWORD,
    name: result.name || process.env.ADMIN_NAME || 'ANTHIX Administrator',
  };
}

async function run() {
  const { email, password, name } = parseArgs();

  if (!email || !password) {
    console.error('\n❌ [Error] Missing required admin credentials.');
    console.log('\nUsage:');
    console.log('  npm run admin:create -- --email <admin-email> --password <strong-password> [--name <name>]\n');
    console.log('Example:');
    console.log('  npm run admin:create -- --email admin@anthix.com --password AdminSecurePass123! --name "Site Admin"\n');
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    console.error('❌ [Error] Invalid email address format.');
    process.exit(1);
  }

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    console.error('❌ [Error] Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
    process.exit(1);
  }

  console.log('\n[Setup] Connecting to MongoDB...');
  await connectDB();

  try {
    const passwordHash = await AuthService.hashPassword(password);

    let user = await User.findOne({ email: normalizedEmail }).exec();

    if (user) {
      user.role = 'admin';
      user.name = name || user.name;
      user.passwordHash = passwordHash;
      user.isEmailVerified = true;
      user.accountStatus = 'active';
      await user.save();
      console.log(`\n✅ [Success] Existing user "${normalizedEmail}" promoted to Administrator (role: 'admin').`);
    } else {
      user = await User.create({
        name: name || 'ANTHIX Administrator',
        email: normalizedEmail,
        passwordHash,
        role: 'admin',
        isEmailVerified: true,
        accountStatus: 'active',
      });
      console.log(`\n✅ [Success] New Administrator account created for "${normalizedEmail}" (role: 'admin').`);
    }

    console.log(`🔒 Admin can now log in at /admin/login\n`);
  } catch (err) {
    console.error('❌ [Error provisioning admin]:', err);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

run();
