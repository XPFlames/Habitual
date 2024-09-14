// Local Storage for habits and badges
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let badges = JSON.parse(localStorage.getItem('badges')) || [];

// DOM elements
const habitForm = document.getElementById('habit-form');
const habitList = document.getElementById('habit-list');
const badgeSection = document.getElementById('badge-section');
const leaderboardList = document.getElementById('leaderboard-list');

// Badge Templates
const badgeTemplates = [
  { name: "3 Day Streak", condition: 3 },
  { name: "7 Day Streak", condition: 7 },
  { name: "30 Day Streak", condition: 30 },
];

// Create a new habit
habitForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const habitName = document.getElementById('habit-name').value;
  const habitCategory = document.getElementById('habit-category').value;
  const habitGoal = document.getElementById('habit-goal').value;
  const habitStreakGoal = document.getElementById('habit-streak-goal').value;

  const newHabit = {
    id: Date.now(),
    name: habitName,
    category: habitCategory,
    goal: habitGoal,
    streakGoal: habitStreakGoal,
    progress: 0,  // Track how much the user has done today
    streak: 0,    // Current streak in days
    completed: false  // Whether today's task is completed
  };

  habits.push(newHabit);
  localStorage.setItem('habits', JSON.stringify(habits));
  alert('Habit Created!');
  habitForm.reset();
  displayHabits();
});

// Function to display habits
function displayHabits() {
  habitList.innerHTML = '';

  habits.forEach(habit => {
    const habitDiv = document.createElement('div');
    habitDiv.className = 'bg-white p-4 shadow-md rounded-lg mb-4';

    habitDiv.innerHTML = `
      <h3 class="text-xl font-bold">${habit.name}</h3>
      <p>Category: ${habit.category}</p>
      <p>Streak Goal: ${habit.streakGoal} days</p>
      <div class="w-full bg-gray-200 rounded-full mt-2">
        <div class="bg-blue-600 text-xs leading-none py-1 text-center text-white rounded-full" style="width:${habit.progress}%"> ${habit.progress}%</div>
      </div>
      <button onclick="completeHabit(${habit.id})" class="mt-4 bg-green-500 text-white p-2 rounded-md">Mark as Complete</button>
      <button onclick="editHabit(${habit.id})" class="mt-2 bg-yellow-500 text-white p-2 rounded-md">Edit Habit</button>
      <button onclick="deleteHabit(${habit.id})" class="mt-2 bg-red-500 text-white p-2 rounded-md">Delete Habit</button>
    `;

    habitList.appendChild(habitDiv);
  });
}

// Function to complete a habit
function completeHabit(habitId) {
  habits = habits.map(habit => {
    if (habit.id === habitId) {
      habit.completed = true;
      habit.streak++;
      habit.progress = 100;  // Habit complete for the day
    }
    return habit;
  });
  localStorage.setItem('habits', JSON.stringify(habits));
  checkBadges();
  notifyUser('Habit Completed!', 'You have completed your daily habit!');
  displayHabits();
}

// Function to edit a habit
function editHabit(habitId) {
  const habitToEdit = habits.find(habit => habit.id === habitId);
  document.getElementById('habit-name').value = habitToEdit.name;
  document.getElementById('habit-category').value = habitToEdit.category;
  document.getElementById('habit-goal').value = habitToEdit.goal;
  document.getElementById('habit-streak-goal').value = habitToEdit.streakGoal;

  deleteHabit(habitId);  // Remove old habit before editing
}

// Function to delete a habit
function deleteHabit(habitId) {
  habits = habits.filter(habit => habit.id !== habitId);
  localStorage.setItem('habits', JSON.stringify(habits));
  displayHabits();
}

// Function to check for badge awards
function checkBadges() {
  badges = badges || [];
  habits.forEach(habit => {
    badgeTemplates.forEach(badge => {
      if (habit.streak >= badge.condition && !badges.includes(badge.name)) {
        badges.push(badge.name);
      }
    });
  });
  localStorage.setItem('badges', JSON.stringify(badges));
  displayBadges();
}

// Function to display badges
function displayBadges() {
  badgeSection.innerHTML = '';
  badges.forEach(badge => {
    const badgeDiv = document.createElement('div');
    badgeDiv.className = 'p-4 bg-yellow-400 rounded-lg shadow-md';
    badgeDiv.textContent = badge;
    badgeSection.appendChild(badgeDiv);
  });
}

// Function to notify the user
function notifyUser(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }
}

// Request notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Load initial data
displayHabits();
displayBadges();
