// Gives a user the moderator role, so they can review reports.
// Usage: npm run make-moderator -w server -- <username>
// There is no screen for this on purpose (class.md: role is set by a setup script).
import { UserRepository } from '../src/repositories/UserRepository.js';

const username = process.argv[2];
if (!username) {
  console.error('Usage: npm run make-moderator -w server -- <username>');
  process.exit(1);
}
const changed = UserRepository.setRole(username, 'moderator');
console.log(changed ? `${username} is now a moderator.` : `No user called ${username}.`);
process.exit(changed ? 0 : 1);
