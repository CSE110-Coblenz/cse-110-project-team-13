// Simple CI test that checks critical functionality
function runCITests() {
    const fs = require('fs');
    let passed = 0;
    let failed = 0;
    
    console.log('🧪 Running CI Tests...\n');
    
    // Test 1: Check if essential files exist
    const requiredFiles = [
        'index.html',
        'styles.css', 
        'scripts/main.ts',
        'package.json',
        'assets/events.json'
    ];
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file} exists`);
            passed++;
        } else {
            console.log(`❌ ${file} missing`);
            failed++;
        }
    });
    
    // Test 2: Check if TypeScript compiles
    try {
        require('child_process').execSync('npx tsc --noEmit', { stdio: 'pipe' });
        console.log('✅ TypeScript compiles without errors');
        passed++;
    } catch (error) {
        console.log('❌ TypeScript compilation failed');
        failed++;
    }
    
    // Test 3: Check HTML structure
    const html = fs.readFileSync('index.html', 'utf8');
    if (html.includes('start-screen') && html.includes('game-screen')) {
        console.log('✅ HTML structure looks good');
        passed++;
    } else {
        console.log('❌ HTML missing required elements');
        failed++;
    }
    
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
}

runCITests();