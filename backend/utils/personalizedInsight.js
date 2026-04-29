const { cityRegion } = require('./security');

const SIGNAL_COPY = {
  Varna: {
    label: 'Values fit',
    text: 'Your deeper priorities look compatible enough to make the first conversation feel grounded.',
  },
  Vashya: {
    label: 'Natural pull',
    text: 'There is a stronger chance of mutual interest instead of one person carrying the spark.',
  },
  Tara: {
    label: 'Emotional support',
    text: 'This pairing has a steadier emotional rhythm, which can make early trust easier.',
  },
  Yoni: {
    label: 'Chemistry',
    text: 'The attraction style looks more natural than forced or one-sided.',
  },
  GrahaMaitri: {
    label: 'Conversation flow',
    text: 'Your communication styles are more likely to feel easy to read.',
  },
  Gana: {
    label: 'Temperament',
    text: 'Your personalities have enough overlap to make day-to-day interaction smoother.',
  },
  Bhakoot: {
    label: 'Long-term rhythm',
    text: 'This connection has stronger signs of stability beyond first impressions.',
  },
  Nadi: {
    label: 'Shared pace',
    text: 'You are more likely to match each other’s pace around closeness and space.',
  },
};

function titleizeEnum(value) {
  return String(value || '')
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function firstName(user) {
  return String(user?.Username || user?.username || 'this person').trim().split(/\s+/)[0] || 'this person';
}

function intentText(currentUser, otherUser) {
  const mine = titleizeEnum(currentUser?.RelationshipIntent || currentUser?.relationshipIntent);
  const theirs = titleizeEnum(otherUser?.RelationshipIntent || otherUser?.relationshipIntent);
  if (mine && theirs && mine === theirs) {
    return `You are both signaling ${mine.toLowerCase()}, so expectations start in the same lane.`;
  }
  if (theirs) {
    return `${firstName(otherUser)} is looking for ${theirs.toLowerCase()}, which gives you useful context before you invest time.`;
  }
  return 'Their profile gives enough context to decide whether the connection is worth a real conversation.';
}

function locationText(currentUser, otherUser) {
  const mine = cityRegion(currentUser?.BirthLocation || currentUser?.birthLocation);
  const theirs = cityRegion(otherUser?.BirthLocation || otherUser?.birthLocation);
  if (mine && theirs && mine === theirs) {
    return `You are both connected to ${mine}, which can make the match feel less abstract.`;
  }
  if (theirs) {
    return `${firstName(otherUser)} is connected to ${theirs}, so the match comes with a real-world anchor.`;
  }
  return 'There is enough profile context here to start with something more specific than a generic opener.';
}

function profileText(otherUser) {
  const prompt = String(otherUser?.ProfilePrompt || otherUser?.profilePrompt || '').trim();
  const bio = String(otherUser?.Bio || otherUser?.bio || '').trim();
  if (prompt) return `Their prompt gives you an easy way to start with personality, not just photos.`;
  if (bio) return `Their bio gives you something concrete to respond to before the conversation turns generic.`;
  return 'Their profile is simple, so the best opener is to ask about intent and what they want to build.';
}

function scoreHeadline(score, label, name) {
  if (score >= 33) return `${name} looks like a standout match`;
  if (score >= 25) return `${name} has real compatibility potential`;
  if (score >= 18) return `${name} could be worth a thoughtful conversation`;
  return `${name} may need more real-world context`;
}

function scoreSummary(score, label, name) {
  if (score >= 33) {
    return `The compatibility score is strong, but the better signal is that your intent, pace, and emotional fit have several places to meet.`;
  }
  if (score >= 25) {
    return `This is not just a high score. ${name} gives you enough alignment to start with a more intentional conversation.`;
  }
  if (score >= 18) {
    return `There are some useful signals here, but the match should be judged by conversation quality more than the number.`;
  }
  return `The system does not see this as an easy match, so treat it as a profile-first decision rather than a compatibility lock.`;
}

function signalHighlights(reasons = []) {
  return reasons.slice(0, 2).map(reason => {
    const copy = SIGNAL_COPY[reason?.koota] || {};
    return {
      label: copy.label || 'Compatibility signal',
      text: copy.text || 'There is a meaningful compatibility signal here.',
    };
  });
}

function buildPersonalizedInsight(currentUser, otherUser, compat = {}) {
  const name = firstName(otherUser);
  const score = Number(compat.totalScore || 0);
  const highlights = [
    { label: 'Relationship intent', text: intentText(currentUser, otherUser) },
    ...signalHighlights(compat.reasons || []),
    { label: 'Profile context', text: profileText(otherUser) },
  ].slice(0, 4);

  if (highlights.length < 3) {
    highlights.push({ label: 'Real-world anchor', text: locationText(currentUser, otherUser) });
  }

  return {
    headline: scoreHeadline(score, compat.label, name),
    summary: scoreSummary(score, compat.label, name),
    highlights,
    conversationStarter: `Ask ${name} what a good relationship pace looks like for them right now.`,
  };
}

module.exports = {
  buildPersonalizedInsight,
  titleizeEnum,
};
