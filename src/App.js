import React, { useState, useEffect } from 'react';
import './App.css';
import { addCalendarData, getCalendarData } from './firebase/firebase';
import WelcomePage from './components/WelcomePage';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on initial render and month change
  useEffect(() => {
    if (isAuthenticated) {
      loadCalendarData();
    }
  }, [currentDate.getMonth(), currentDate.getFullYear(), isAuthenticated]);

  // Save to Firebase whenever calendarDays changes
  useEffect(() => {
    if (!isLoading && isAuthenticated && calendarDays.length > 0) {
      saveCalendarData();
    }
  }, [calendarDays]);

  const handleLogin = (password) => {
    if (password === 'poop') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const loadCalendarData = async () => {
    try {
      setIsLoading(true);
      const data = await getCalendarData(currentDate.getMonth(), currentDate.getFullYear());
      if (data && data.days) {
        setCalendarDays(data.days);
      } else {
        generateCalendarDays(currentDate);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      generateCalendarDays(currentDate);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCalendarData = async () => {
    try {
      await addCalendarData({
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        days: calendarDays
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ date: null, number: null });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: i,
        number: 6
      });
    }

    setCalendarDays(days);
  };

  const incrementNumber = (index) => {
    setCalendarDays(prevDays => {
      const newDays = [...prevDays];
      if (newDays[index].number !== null) {
        newDays[index] = {
          ...newDays[index],
          number: newDays[index].number === 5 ? 1 : 
                  newDays[index].number === 6 ? 1 :
                  newDays[index].number + 1
        };
      }
      return newDays;
    });
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
    setIsLoading(true);
  };

  const handleReset = () => {
    generateCalendarDays(currentDate);
  };

  const createFlyingText = () => {
    const text = document.createElement('div');
    text.className = 'flying-text';
    text.textContent = 'Dan is the greatest boyfriend 💕';
    document.body.appendChild(text);

    text.addEventListener('animationend', () => {
      document.body.removeChild(text);
    });
  };

  useEffect(() => {
    const interval = setInterval(createFlyingText, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return <WelcomePage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Calendar 
        currentDate={currentDate}
        calendarDays={calendarDays}
        changeMonth={changeMonth}
        incrementNumber={incrementNumber}
        onReset={handleReset}
      />
      <Statistics calendarDays={calendarDays} />
    </div>
  );
}

export default App;