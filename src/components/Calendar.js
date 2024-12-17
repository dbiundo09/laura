import React from 'react';
import '../styles/Calendar.css';
import { resetCalendarData } from '../firebase/firebase';

function Calendar({ currentDate, calendarDays, changeMonth, incrementNumber, onReset }) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getMoodEmoji = (number) => {
    switch (number) {
      case 1:
        return { emoji: '😢', mood: 'Sad' };
      case 2:
        return { emoji: '😕', mood: 'Meh' };
      case 3:
        return { emoji: '😊', mood: 'Good' };
      case 4:
        return { emoji: '😄', mood: 'Happy' };
      case 5:
        return { emoji: '🥰', mood: 'Super Happy' };
      case 6:
      default:
        return { emoji: '❓', mood: 'Unknown' };
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all moods? This cannot be undone!')) {
      try {
        await resetCalendarData();
        onReset(); // This will trigger a reload of the calendar data
      } catch (error) {
        console.error('Error resetting calendar:', error);
        alert('Failed to reset calendar');
      }
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>
      <div className="mood-legend">
        <div className="legend-title">Laura's Mood Scale</div>
        <div className="legend-items">
          {[1, 2, 3, 4, 5].map(num => (
            <div key={num} className="legend-item">
              <span className="legend-emoji">{getMoodEmoji(num).emoji}</span>
              <span className="legend-text">{getMoodEmoji(num).mood}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-grid">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
        
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`calendar-day ${!day.date ? 'empty' : ''}`}
            onClick={() => day.date && incrementNumber(index)}
          >
            {day.date && (
              <>
                <div className="date">{day.date}</div>
                <div className="mood">
                  <span className="mood-emoji">{getMoodEmoji(day.number).emoji}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar; 