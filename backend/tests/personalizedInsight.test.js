const assert = require('assert');
const { buildPersonalizedInsight } = require('../utils/personalizedInsight');

const currentUser = {
  Username: 'Avery',
  RelationshipIntent: 'long-term',
  BirthLocation: 'Vancouver, BC, Canada',
};

const otherUser = {
  Username: 'Jordan',
  RelationshipIntent: 'long-term',
  BirthLocation: 'Vancouver, BC, Canada',
  ProfilePrompt: 'A quiet dinner beats a loud room.',
};

const insight = buildPersonalizedInsight(currentUser, otherUser, {
  totalScore: 28,
  label: 'Good',
  reasons: [
    { koota: 'GrahaMaitri', score: 5, max: 5 },
    { koota: 'Bhakoot', score: 7, max: 7 },
  ],
});

assert.strictEqual(typeof insight.headline, 'string');
assert.strictEqual(typeof insight.summary, 'string');
assert.strictEqual(typeof insight.conversationStarter, 'string');
assert.ok(Array.isArray(insight.highlights), 'highlights should be an array');
assert.ok(insight.highlights.length >= 3, 'insight should include several human-readable highlights');
assert.ok(insight.highlights.some(item => item.label === 'Relationship intent'), 'intent should be represented');
assert.ok(insight.highlights.some(item => item.label === 'Conversation flow'), 'top compatibility signals should be translated');

const flatCopy = [
  insight.headline,
  insight.summary,
  insight.conversationStarter,
  ...insight.highlights.flatMap(item => [item.label, item.text]),
].join(' ');

assert(!/\bkoota\b/i.test(flatCopy), 'normal recommendation copy should not expose koota jargon');
assert(!/\bguna\b/i.test(flatCopy), 'normal recommendation copy should not expose guna jargon');

const sparseInsight = buildPersonalizedInsight({}, {}, { totalScore: 0, label: 'Poor', reasons: [] });
assert.ok(sparseInsight.headline, 'sparse profiles should still get fallback copy');
assert.ok(sparseInsight.highlights.length >= 2, 'sparse profiles should still get usable highlights');

console.log('personalizedInsight.test.js passed');
