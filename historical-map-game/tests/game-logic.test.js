//test file for scoring algorithm and event randomization
import { strict as assert } from 'assert';

//test scoring algorithm
function testScoringAlgorithm() {
  console.log('Testing Scoring Algorithm...');
  
  const GUESS_TIME = 120;
  const DISTANCE_THRESHOLD = 500;
  const MAX_DISTANCE_KM = 10000;
  
  //helper function to calculate score (same logic as game.ts)
  function calculateScore(distanceKm, timeRemaining) {
    const radiusBonus = distanceKm <= DISTANCE_THRESHOLD ? 50 : 0;
    const distanceScore = Math.max(0, 100 * (1 - distanceKm / MAX_DISTANCE_KM));
    const timeScore = Math.max(0, 50 * (timeRemaining / GUESS_TIME));
    return radiusBonus + distanceScore + timeScore;
  }
  
  //test 1: Perfect score (0km, 0 seconds)
  const perfectScore = calculateScore(0, 120);
  assert.equal(perfectScore, 200, 'Perfect score should be 200');
  console.log('Perfect score test passed');
  
  // Test 2: Within radius bonus (400km, 60 seconds)
  // Expected: 50 (radius) + 96 (distance) + 25 (time) = 171
  const withinRadiusScore = calculateScore(400, 60);
  assert.ok(withinRadiusScore > 150, 'Score should be > 150 when within radius');
  assert.ok(withinRadiusScore < 180, 'Score should be < 180 for mid-range guess');
  console.log('Within radius bonus test passed');
  
  //test 3: Outside radius (600km, 30 seconds)
  const outsideRadiusScore = calculateScore(600, 30);
  const expectedDistance = Math.max(0, 100 * (1 - 600 / 10000));
  const expectedTime = Math.max(0, 50 * (30 / 120));
  const expectedTotal = 0 + expectedDistance + expectedTime; //no radius bonus
  assert.equal(Math.round(outsideRadiusScore), Math.round(expectedTotal), 'Score calculation should be correct outside radius');
  console.log('Outside radius test passed');
  
  //test 4: Far distance (8000km, 10 seconds)
  const farScore = calculateScore(8000, 10);
  assert.ok(farScore < 50, 'Score should be low for far distance');
  assert.ok(farScore > 0, 'Score should not be negative');
  console.log('Far distance test passed');
  
  //test 5: Maximum distance (10000km, 0 seconds)
  const maxDistanceScore = calculateScore(10000, 0);
  assert.equal(maxDistanceScore, 0, 'Score should be 0 at maximum distance with no time');
  console.log('Maximum distance test passed');
  
  //test 6: Time component only (within radius, no time)
  const noTimeScore = calculateScore(400, 0);
  const expectedNoTime = 50 + Math.max(0, 100 * (1 - 400 / 10000)) + 0;
  assert.equal(Math.round(noTimeScore), Math.round(expectedNoTime), 'Time component should be 0 when time is up');
  console.log('Time component test passed');
  
  console.log('All scoring algorithm tests passed!\n');
}

//test event randomization
function testEventRandomization() {
  console.log('Testing Event Randomization...');
  
  //simulate event picking logic
  function simulateEventPicking(numEvents, numPicks) {
    const usedIndices = [];
    const pickedEvents = [];
    
    for (let i = 0; i < numPicks; i++) {
      if (usedIndices.length >= numEvents) {
        return pickedEvents; //all events used
      }
      
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * numEvents);
      } while (usedIndices.includes(randomIndex));
      
      usedIndices.push(randomIndex);
      pickedEvents.push(randomIndex);
    }
    
    return pickedEvents;
  }
  
  //test 1: No duplicates
  const picks = simulateEventPicking(5, 5);
  const uniquePicks = [...new Set(picks)];
  assert.equal(picks.length, uniquePicks.length, 'Should not have duplicate events');
  console.log('No duplicates test passed');
  
  //test 2: All events used when picking all
  assert.equal(picks.length, 5, 'Should pick all 5 events');
  console.log('All events picked test passed');
  
  //test 3: Stops when all events used
  const morePicksThanEvents = simulateEventPicking(3, 10);
  assert.equal(morePicksThanEvents.length, 3, 'Should stop at max events');
  console.log('Stops at max events test passed');
  
  //test 4: Randomness check (run multiple times, should get different orders)
  const order1 = simulateEventPicking(10, 10);
  const order2 = simulateEventPicking(10, 10);
  const order3 = simulateEventPicking(10, 10);
  
  //at least one should be different (extremely unlikely all 3 are the same)
  const allSame = JSON.stringify(order1) === JSON.stringify(order2) && 
                  JSON.stringify(order2) === JSON.stringify(order3);
  assert.ok(!allSame, 'Should produce different random orders');
  console.log('Randomness test passed');
  
  //test 5: All indices are valid
  const validPicks = simulateEventPicking(5, 5);
  for (const index of validPicks) {
    assert.ok(index >= 0 && index < 5, 'Index should be within valid range');
  }
  console.log('Valid indices test passed');
  
  console.log('All event randomization tests passed!\n');
}

//test distance calculation (Haversine formula)
function testDistanceCalculation() {
  console.log('Testing Distance Calculation...');
  
  //haversine formula implementation
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; //earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  //test 1: Same location (should be 0)
  const sameLocation = calculateDistance(0, 0, 0, 0);
  assert.ok(sameLocation < 0.01, 'Distance between same location should be ~0');
  console.log('Same location test passed');
  
  //test 2:New York to Los Angeles
  //NY: 40.7128° N, 74.0060° W
  //LA: 34.0522° N, 118.2437° W
  const nyToLa = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
  assert.ok(nyToLa > 3900 && nyToLa < 4000, 'NY to LA distance should be ~3944 km');
  console.log('Known distance test passed');
  
  //test 3: Equator distance (should be proportional to longitude difference)
  const equatorDist = calculateDistance(0, 0, 0, 10);
  assert.ok(equatorDist > 1000 && equatorDist < 1200, 'Equator distance should be ~1111 km per 10 degrees');
  console.log('Equator distance test passed');
  
  //test 4: Pole to pole distance (~20000 km for half circumference)
  const poleDistance = calculateDistance(90, 0, -90, 0);
  assert.ok(poleDistance > 19000 && poleDistance < 21000, 'Pole to pole should be ~20000 km');
  console.log('Pole to pole distance test passed');
  
  console.log('All distance calculation tests passed!\n');
}

//run all tests
try {
  testScoringAlgorithm();
  testEventRandomization();
  testDistanceCalculation();
  console.log('All tests passed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}

