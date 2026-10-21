import assert from 'node:assert/strict'

// Test 1: Mathematical Z-Score and Weighted Engagement
function computeWeightedEngagement(metrics) {
  return (metrics.shares * 4) + (metrics.saves * 3) + (metrics.comments * 2) + (metrics.likes * 1)
}

function calculateZScore(currentScore, historicalScores) {
  if (historicalScores.length < 2) return currentScore > 1000 ? 2.5 : 0.5
  const mean = historicalScores.reduce((sum, val) => sum + val, 0) / historicalScores.length
  const variance = historicalScores.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (historicalScores.length - 1)
  const stdDev = Math.sqrt(variance)
  if (stdDev === 0) return currentScore > mean ? 3.0 : 0.0
  const z = (currentScore - mean) / stdDev
  return Number(z.toFixed(2))
}

function evaluateViralSignal(currentMetrics, historicalBatch) {
  const currentWeighted = computeWeightedEngagement(currentMetrics)
  const historicalWeighted = historicalBatch.map(computeWeightedEngagement)
  const zScore = calculateZScore(currentWeighted, historicalWeighted)
  return {
    zScore,
    status: zScore >= 2.5 ? 'viral_spike' : zScore >= 1.0 ? 'elevated' : 'normal',
    shouldCascade: zScore >= 2.5,
  }
}

// Test 2: Amplification Cascade & Safety Guards
function triggerAmplificationCascade(viralItem) {
  if (viralItem.isDerivative) {
    return { triggered: false, reason: 'depth_limit_reached' }
  }
  if (viralItem.viralStatus === 'amplified') {
    return { triggered: false, reason: 'already_amplified' }
  }

  const basePlatforms = ['youtube', 'instagram', 'twitter']
  const targetPlatforms = basePlatforms.filter((p) => p !== viralItem.platform)
  const derivatives = targetPlatforms.map((p) => ({
    id: `derivative-${viralItem.id}-${p}`,
    platform: p,
    isDerivative: true,
    parentContentId: viralItem.id,
    viralStatus: 'normal',
  }))

  return {
    triggered: true,
    derivativesCreated: derivatives,
  }
}

console.log('--- RUNNING SOUNDWAVE AI v1.5 VERIFICATION SUITE ---')

// 1. Verify Normal Traffic Does Not Trigger Cascade
const historicalSamples = [
  { shares: 100, saves: 300, comments: 80, likes: 1000 },
  { shares: 90, saves: 280, comments: 60, likes: 950 },
  { shares: 110, saves: 310, comments: 90, likes: 1050 },
]
const normalPost = { shares: 105, saves: 295, comments: 75, likes: 1020 }
const normalEval = evaluateViralSignal(normalPost, historicalSamples)
console.log(`✓ Normal Post Z-Score: ${normalEval.zScore} (Expected: normal, cascade: false)`)
assert.equal(normalEval.shouldCascade, false)
assert.equal(normalEval.status, 'normal')

// 2. Verify Viral Outlier Triggers Cascade
const viralSpikePost = { shares: 1450, saves: 3200, comments: 850, likes: 6500 }
const viralEval = evaluateViralSignal(viralSpikePost, historicalSamples)
console.log(`✓ Viral Spike Post Z-Score: ${viralEval.zScore} (Expected: >= 2.5, cascade: true)`)
assert.equal(viralEval.shouldCascade, true)
assert.equal(viralEval.status, 'viral_spike')
assert.ok(viralEval.zScore >= 2.5)

// 3. Verify Cascade Spawns Derivatives on Secondary Platforms
const sourceTiktok = {
  id: 'tiktok-post-1',
  platform: 'tiktok',
  isDerivative: false,
  viralStatus: 'viral_spike',
}
const cascadeResult = triggerAmplificationCascade(sourceTiktok)
console.log(`✓ Cascade execution: ${cascadeResult.triggered ? 'TRIGGERED' : 'FAILED'}, derivatives count: ${cascadeResult.derivativesCreated.length}`)
assert.equal(cascadeResult.triggered, true)
assert.equal(cascadeResult.derivativesCreated.length, 3) // youtube, instagram, and twitter
assert.ok(cascadeResult.derivativesCreated.every((d) => d.isDerivative === true))
assert.ok(cascadeResult.derivativesCreated.every((d) => d.parentContentId === 'tiktok-post-1'))

// 4. Verify Depth Safeguard (Derivative cannot trigger another cascade)
const derivativeItem = cascadeResult.derivativesCreated[0]
const blockedCascade = triggerAmplificationCascade(derivativeItem)
console.log(`✓ Depth Safeguard Test: ${blockedCascade.triggered ? 'FAILED (Broke guard)' : 'PASSED (Blocked recursive cascade)'}`)
assert.equal(blockedCascade.triggered, false)
assert.equal(blockedCascade.reason, 'depth_limit_reached')

// 5. Verify Idempotency Safeguard
sourceTiktok.viralStatus = 'amplified'
const idempotencyCheck = triggerAmplificationCascade(sourceTiktok)
console.log(`✓ Idempotency Safeguard Test: ${idempotencyCheck.triggered ? 'FAILED' : 'PASSED (Blocked duplicate run)'}`)
assert.equal(idempotencyCheck.triggered, false)
assert.equal(idempotencyCheck.reason, 'already_amplified')

console.log('\n>>> ALL 5 ENGINE SAFETY & LOGIC TESTS PASSED ACCORDING TO SPEC! <<<')
