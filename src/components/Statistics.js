import React from 'react';
import '../styles/Statistics.css';

const Statistics = ({ calendarDays }) => {
  const calculateStats = () => {
    if (!calendarDays.length) return null;

    // Filter out empty days and unknown moods (6)
    const validDays = calendarDays.filter(day => day.date && day.number !== 6);
    
    if (!validDays.length) return null;

    // Calculate average happiness (1-5 scale)
    const averageHappiness = validDays.reduce((sum, day) => sum + day.number, 0) / validDays.length;
    
    // Find happiest week
    let happiestWeek = {
      startDate: null,
      average: 0
    };

    for (let i = 0; i < validDays.length - 6; i++) {
      const weekDays = validDays.slice(i, i + 7);
      if (weekDays.length === 7) {
        const weekAvg = weekDays.reduce((sum, day) => sum + day.number, 0) / 7;
        if (weekAvg > happiestWeek.average) {
          happiestWeek = {
            startDate: weekDays[0].date,
            average: weekAvg
          };
        }
      }
    }

    // Count mood frequencies
    const moodCounts = validDays.reduce((acc, day) => {
      acc[day.number] = (acc[day.number] || 0) + 1;
      return acc;
    }, {});

    // Find most common mood
    let mostCommonMood = 0;
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonMood = Number(mood);
      }
    });

    return {
      averageHappiness,
      happiestWeek,
      mostCommonMood,
      moodCounts
    };
  };

  const getMoodEmoji = (number) => {
    const emojis = {
      1: '😢',
      2: '😕',
      3: '😊',
      4: '😄',
      5: '🥰'
    };
    return emojis[number] || '❓';
  };

  const stats = calculateStats();

  if (!stats) return null;

  return (
    <div className="statistics-container">
      <h2>Mood Statistics 📊</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Average Happiness</h3>
          <div className="stat-value">
            {stats.averageHappiness.toFixed(1)}
            <span className="stat-emoji">{getMoodEmoji(Math.round(stats.averageHappiness))}</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>Happiest Week</h3>
          <div className="stat-value">
            {stats.happiestWeek.startDate ? `Starting Day ${stats.happiestWeek.startDate}` : 'Not enough data'}
            <span className="stat-emoji">🌟</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>Most Common Mood</h3>
          <div className="stat-value">
            {getMoodEmoji(stats.mostCommonMood)}
          </div>
        </div>

        <div className="stat-card">
          <h3>Mood Distribution</h3>
          <div className="mood-bars">
            {[1, 2, 3, 4, 5].map(mood => (
              <div key={mood} className="mood-bar-container">
                <div className="mood-label">{getMoodEmoji(mood)}</div>
                <div className="mood-bar">
                  <div 
                    className="mood-bar-fill"
                    style={{ 
                      width: `${((stats.moodCounts[mood] || 0) / Object.values(stats.moodCounts).reduce((a, b) => a + b, 0)) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 