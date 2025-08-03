const { execSync } = require('child_process');

try {
  console.log('Testing TypeScript compilation...');
  execSync('npx tsc --noEmit --jsx react --skipLibCheck', {
    stdio: 'inherit',
    timeout: 30000,
    cwd: process.cwd()
  });
  console.log('TypeScript compilation successful');
} catch (error) {
  console.error('TypeScript compilation failed:', error.message);
  process.exit(1);
}
