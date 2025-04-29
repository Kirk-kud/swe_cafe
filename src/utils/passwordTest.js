import bcrypt from 'bcryptjs';

// The password you want to use
const password = 'test123';

// Hash the password
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log('Password:', password);
console.log('Hashed Password:', hashedPassword);

// Verify it works
const isMatch = bcrypt.compareSync(password, hashedPassword);
console.log('Verification:', isMatch ? '✅ Success' : '❌ Failed'); 