const { spawnSync } = require('child_process');
const path = require('path');

console.log('Building Coalition Builder: Party Chair (v0.19.4.1)...');

const psScript = path.join(__dirname, 'build.ps1');
const result = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psScript], {
  stdio: 'inherit'
});

if (result.status !== 0) {
  console.error(`Build failed with exit code ${result.status}`);
  process.exit(result.status || 1);
} else {
  console.log('Build completed successfully.');
}
