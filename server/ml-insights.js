// Simple ML-inspired insights without requiring Python
// Based on the patterns from the ML dataset

export function predictProductivity(studyHours, sleepHours, distractionHours, focusScore) {
  // Calculate productivity score based on weighted factors
  let score = 0;
  
  // Study hours contribution (0-30 points)
  if (studyHours >= 4 && studyHours <= 7) {
    score += 30;
  } else if (studyHours >= 3 && studyHours < 4) {
    score += 20;
  } else if (studyHours > 7) {
    score += 15; // Too much can lead to burnout
  } else {
    score += 10;
  }
  
  // Sleep hours contribution (0-30 points)
  if (sleepHours >= 7 && sleepHours <= 9) {
    score += 30;
  } else if (sleepHours >= 6 && sleepHours < 7) {
    score += 20;
  } else if (sleepHours >= 5) {
    score += 10;
  } else {
    score += 5;
  }
  
  // Distractions penalty (0-20 points)
  if (distractionHours < 2) {
    score += 20;
  } else if (distractionHours < 4) {
    score += 10;
  } else if (distractionHours < 6) {
    score += 5;
  }
  
  // Focus score contribution (0-20 points)
  score += Math.min(20, focusScore / 5);
  
  // Normalize to 0-100
  const productivityScore = Math.min(100, score);
  
  let level, message;
  if (productivityScore >= 70) {
    level = 'High';
    message = 'Excellent productivity! Keep up the great work.';
  } else if (productivityScore >= 40) {
    level = 'Medium';
    message = 'Good productivity. Some room for improvement.';
  } else {
    level = 'Low';
    message = 'Low productivity detected. Consider adjusting your habits.';
  }
  
  return {
    score: Math.round(productivityScore),
    level,
    message,
    confidence: {
      Low: productivityScore < 40 ? 80 : 20,
      Medium: productivityScore >= 40 && productivityScore < 70 ? 80 : 20,
      High: productivityScore >= 70 ? 80 : 20
    }
  };
}

export function getRecommendations(studyHours, sleepHours, socialMediaHours, gamingHours, screenTimeHours, focusScore) {
  const recommendations = [];
  const totalDistractions = socialMediaHours + gamingHours + screenTimeHours;
  
  // Sleep recommendations
  if (sleepHours < 6) {
    recommendations.push({
      type: 'critical',
      category: 'Sleep',
      icon: '😴',
      message: `You're only getting ${sleepHours.toFixed(1)} hours of sleep. Aim for 7-9 hours for optimal performance.`,
      action: 'Increase sleep by at least 1-2 hours',
      impact: 'high'
    });
  } else if (sleepHours < 7) {
    recommendations.push({
      type: 'warning',
      category: 'Sleep',
      icon: '😴',
      message: `Your sleep (${sleepHours.toFixed(1)}h) is below optimal. Try to get 7-9 hours.`,
      action: 'Add 30-60 minutes to your sleep schedule',
      impact: 'medium'
    });
  } else if (sleepHours >= 7 && sleepHours <= 9) {
    recommendations.push({
      type: 'success',
      category: 'Sleep',
      icon: '✅',
      message: `Great sleep schedule (${sleepHours.toFixed(1)}h)! Keep it up.`,
      action: 'Maintain this healthy sleep pattern',
      impact: 'positive'
    });
  }
  
  // Study hours recommendations
  if (studyHours < 3) {
    recommendations.push({
      type: 'warning',
      category: 'Study Time',
      icon: '📚',
      message: `Only ${studyHours.toFixed(1)} hours of study time. Consider increasing to 4-6 hours daily.`,
      action: 'Schedule 2-3 focused study sessions per day',
      impact: 'high'
    });
  } else if (studyHours > 8) {
    recommendations.push({
      type: 'warning',
      category: 'Study Time',
      icon: '⚠️',
      message: `${studyHours.toFixed(1)} hours is a lot! Risk of burnout. Take regular breaks.`,
      action: 'Use Pomodoro technique: 25min study, 5min break',
      impact: 'medium'
    });
  } else if (studyHours >= 4 && studyHours <= 7) {
    recommendations.push({
      type: 'success',
      category: 'Study Time',
      icon: '✅',
      message: `Excellent study hours (${studyHours.toFixed(1)}h). Well balanced!`,
      action: 'Continue this effective study routine',
      impact: 'positive'
    });
  }
  
  // Distraction recommendations
  if (totalDistractions > 5) {
    recommendations.push({
      type: 'critical',
      category: 'Distractions',
      icon: '📱',
      message: `${totalDistractions.toFixed(1)} hours on distractions daily. This significantly impacts productivity.`,
      action: 'Reduce social media and gaming by 50%. Use app blockers during study time.',
      impact: 'high'
    });
  } else if (totalDistractions > 3) {
    recommendations.push({
      type: 'warning',
      category: 'Distractions',
      icon: '📱',
      message: `${totalDistractions.toFixed(1)} hours on distractions. Try to reduce to under 2 hours.`,
      action: 'Set daily limits on social media apps',
      impact: 'medium'
    });
  } else if (totalDistractions < 2) {
    recommendations.push({
      type: 'success',
      category: 'Distractions',
      icon: '✅',
      message: `Low distractions (${totalDistractions.toFixed(1)}h). Excellent self-control!`,
      action: 'Keep maintaining this discipline',
      impact: 'positive'
    });
  }
  
  // Focus recommendations
  if (focusScore < 30) {
    recommendations.push({
      type: 'critical',
      category: 'Focus',
      icon: '🎯',
      message: `Low focus score (${focusScore.toFixed(1)}). Difficulty concentrating affects learning.`,
      action: 'Try meditation, remove distractions, study in quiet environment',
      impact: 'high'
    });
  } else if (focusScore < 50) {
    recommendations.push({
      type: 'info',
      category: 'Focus',
      icon: '🎯',
      message: `Moderate focus (${focusScore.toFixed(1)}). Room for improvement.`,
      action: 'Use focus techniques like Pomodoro, minimize multitasking',
      impact: 'medium'
    });
  } else if (focusScore >= 70) {
    recommendations.push({
      type: 'success',
      category: 'Focus',
      icon: '✅',
      message: `Excellent focus (${focusScore.toFixed(1)})! You're in the zone.`,
      action: 'Maintain this concentration level',
      impact: 'positive'
    });
  }
  
  return recommendations;
}

export function calculateBurnoutRisk(studyHours, sleepHours, distractionHours, upcomingDeadlines) {
  let riskScore = 0;
  const factors = [];
  
  // Sleep deprivation risk
  if (sleepHours < 6) {
    riskScore += 30;
    factors.push('Severe sleep deprivation');
  } else if (sleepHours < 7) {
    riskScore += 15;
    factors.push('Insufficient sleep');
  }
  
  // Overwork risk
  if (studyHours > 8) {
    riskScore += 25;
    factors.push('Excessive study hours');
  } else if (studyHours > 6) {
    riskScore += 10;
    factors.push('High study load');
  }
  
  // Lack of breaks/recreation
  if (distractionHours < 0.5) {
    riskScore += 20;
    factors.push('No recreation time');
  } else if (distractionHours < 1) {
    riskScore += 10;
    factors.push('Minimal breaks');
  }
  
  // Deadline pressure
  if (upcomingDeadlines > 3) {
    riskScore += 15;
    factors.push('Multiple deadlines');
  } else if (upcomingDeadlines > 1) {
    riskScore += 10;
    factors.push('Upcoming deadlines');
  }
  
  // Cap at 100
  riskScore = Math.min(riskScore, 100);
  
  let level, message, color;
  if (riskScore >= 70) {
    level = 'High';
    message = 'High burnout risk! Take immediate action to reduce stress.';
    color = 'red';
  } else if (riskScore >= 40) {
    level = 'Medium';
    message = 'Moderate burnout risk. Consider adjusting your schedule.';
    color = 'orange';
  } else {
    level = 'Low';
    message = 'Low burnout risk. Keep maintaining balance!';
    color = 'green';
  }
  
  return {
    score: riskScore,
    level,
    message,
    color,
    factors
  };
}

export function analyzeStudyPattern(studySessions) {
  if (!studySessions || studySessions.length === 0) {
    return null;
  }
  
  const totalSessions = studySessions.length;
  const totalMinutes = studySessions.reduce((sum, session) => sum + session.duration, 0);
  const avgDuration = totalMinutes / totalSessions;
  
  // Group by subject
  const subjectStats = {};
  studySessions.forEach(session => {
    if (!subjectStats[session.subject]) {
      subjectStats[session.subject] = { count: 0, totalTime: 0 };
    }
    subjectStats[session.subject].count++;
    subjectStats[session.subject].totalTime += session.duration;
  });
  
  // Find most studied subject
  let mostStudiedSubject = null;
  let maxTime = 0;
  for (const [subject, stats] of Object.entries(subjectStats)) {
    if (stats.totalTime > maxTime) {
      maxTime = stats.totalTime;
      mostStudiedSubject = subject;
    }
  }
  
  return {
    totalSessions,
    totalHours: (totalMinutes / 60).toFixed(1),
    avgSessionMinutes: Math.round(avgDuration),
    mostStudiedSubject,
    subjectBreakdown: subjectStats
  };
}
