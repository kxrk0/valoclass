// Test file to validate all crosshair presets and functionality
import { 
  PRO_PRESETS, 
  encodeValorantCrosshair, 
  decodeValorantCrosshair, 
  isValidValorantCode,
  validateCrosshairAccuracy,
  DEFAULT_VALORANT_CROSSHAIR
} from './valorantCrosshair'

// Test all pro presets
export function testAllPresets() {
  console.log('🧪 Testing all professional crosshair presets...')
  
  let allPassed = true
  
  for (const preset of PRO_PRESETS) {
    console.log(`\n📋 Testing ${preset.name} by ${preset.player}`)
    console.log(`Code: ${preset.valorantCode}`)
    
    // Validate the preset's code format
    const isValidFormat = isValidValorantCode(preset.valorantCode)
    console.log(`✅ Format validation: ${isValidFormat ? 'PASS' : 'FAIL'}`)
    
    if (!isValidFormat) {
      allPassed = false
      continue
    }
    
    // Test encode/decode accuracy
    const encoded = encodeValorantCrosshair(preset.settings)
    const isAccurate = validateCrosshairAccuracy(preset.settings)
    
    console.log(`✅ Encode accuracy: ${isAccurate ? 'PASS' : 'FAIL'}`)
    console.log(`📝 Generated code: ${encoded}`)
    
    if (!isAccurate) {
      allPassed = false
    }
    
    // Test decoding
    const decoded = decodeValorantCrosshair(preset.valorantCode)
    const redCode = encodeValorantCrosshair(decoded)
    
    console.log(`✅ Decode test: ${redCode === preset.valorantCode ? 'PASS' : 'FAIL'}`)
    
    if (redCode !== preset.valorantCode) {
      console.log(`❌ Mismatch: Expected ${preset.valorantCode}, Got ${redCode}`)
      allPassed = false
    }
  }
  
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
  return allPassed
}

// Test specific crosshair scenarios
export function testSpecificScenarios() {
  console.log('\n🧪 Testing specific crosshair scenarios...')
  
  // Test 1: Center dot only
  const dotOnly = {
    ...DEFAULT_VALORANT_CROSSHAIR,
    centerDot: true,
    centerDotThickness: 3,
    innerLines: false,
    colorType: 0 // White
  }
  
  console.log('\n📋 Testing center dot only crosshair')
  const dotAccuracy = validateCrosshairAccuracy(dotOnly)
  console.log(`✅ Dot only accuracy: ${dotAccuracy ? 'PASS' : 'FAIL'}`)
  
  if (dotAccuracy) {
    const encoded = encodeValorantCrosshair(dotOnly)
    console.log(`📝 Dot code: ${encoded}`)
  }
  
  // Test 2: Lines only
  const linesOnly = {
    ...DEFAULT_VALORANT_CROSSHAIR,
    centerDot: false,
    innerLines: true,
    innerLineLength: 6,
    innerLineThickness: 2,
    colorType: 1 // Green
  }
  
  console.log('\n📋 Testing lines only crosshair')
  const linesAccuracy = validateCrosshairAccuracy(linesOnly)
  console.log(`✅ Lines only accuracy: ${linesAccuracy ? 'PASS' : 'FAIL'}`)
  
  // Test 3: Dynamic crosshair
  const dynamic = {
    ...DEFAULT_VALORANT_CROSSHAIR,
    movementError: true,
    firingError: true,
    movementErrorMultiplier: 2,
    firingErrorMultiplier: 1,
    outerLines: true,
    colorType: 4 // Cyan
  }
  
  console.log('\n📋 Testing dynamic crosshair')
  const dynamicAccuracy = validateCrosshairAccuracy(dynamic)
  console.log(`✅ Dynamic accuracy: ${dynamicAccuracy ? 'PASS' : 'FAIL'}`)
  
  return dotAccuracy && linesAccuracy && dynamicAccuracy
}

// Run all tests
export function runAllTests() {
  console.log('🚀 Starting comprehensive crosshair accuracy tests...')
  
  const presetTests = testAllPresets()
  const scenarioTests = testSpecificScenarios()
  
  const allPassed = presetTests && scenarioTests
  
  console.log(`\n🏁 Final Result: ${allPassed ? '🎉 ALL SYSTEMS PERFECT' : '⚠️ ISSUES DETECTED'}`)
  
  if (allPassed) {
    console.log('✨ Crosshair system is 100% accurate and ready for production!')
  }
  
  return allPassed
}

// Auto-run tests in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Delay to avoid running during import
  setTimeout(() => {
    console.log('\n' + '='.repeat(60))
    console.log('🎯 VALOCLASS CROSSHAIR SYSTEM VALIDATION - REAL FORMAT')
    console.log('='.repeat(60))
    
    // Test real Valorant code format
    console.log('🧪 Testing REAL Valorant format with 34 parts:')
    console.log('0;P;c;1;o;1;d;0;z;1;f;0;0t;1;0l;4;0o;2;0a;1;0f;1;1t;3;1l;2;1o;6;1a;1;1m;1;1f;1')
    
    runAllTests()
    console.log('='.repeat(60) + '\n')
  }, 1000)
}
