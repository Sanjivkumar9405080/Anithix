import { User } from '../models/User';
import { AuthService } from '../services/authService';

/**
 * Ensures a default system administrator exists in MongoDB with verified status and admin privileges.
 */
export const seedInitialAdmin = async (): Promise<void> => {
  try {
    const defaultEmail = 'admin@anthix.com';
    const defaultPass = 'AdminPass123!';

    let admin = await User.findOne({ email: defaultEmail }).select('+passwordHash').exec();

    if (!admin) {
      const passwordHash = await AuthService.hashPassword(defaultPass);
      admin = await User.create({
        name: 'ANTHIX Administrator',
        email: defaultEmail,
        passwordHash,
        role: 'admin',
        isEmailVerified: true,
        accountStatus: 'active',
      });
      console.log(`[Seed Admin] Default administrator account initialized: ${defaultEmail}`);
    } else {
      let needsSave = false;

      if (admin.role !== 'admin') {
        admin.role = 'admin';
        needsSave = true;
      }

      if (!admin.isEmailVerified) {
        admin.isEmailVerified = true;
        needsSave = true;
      }

      if (admin.accountStatus !== 'active') {
        admin.accountStatus = 'active';
        needsSave = true;
      }

      // Check if current password hash matches default password
      const isMatch = await AuthService.comparePassword(defaultPass, admin.passwordHash);
      if (!isMatch) {
        admin.passwordHash = await AuthService.hashPassword(defaultPass);
        needsSave = true;
      }

      if (needsSave) {
        await admin.save();
        console.log(`[Seed Admin] Administrator credentials verified & active: ${defaultEmail}`);
      }
    }
  } catch (err) {
    console.error('[Seed Admin Error]:', err);
  }
};
