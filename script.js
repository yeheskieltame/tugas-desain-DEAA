// DOM Elements
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');
const homeSection = document.getElementById('home');
const habitsSection = document.getElementById('habits');
const progressSection = document.getElementById('progress');
const reportsSection = document.getElementById('reports');
const settingsSection = document.getElementById('settings');
const getStartedBtn = document.getElementById('get-started-btn');
const addHabitBtn = document.getElementById('add-habit-btn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');
const saveHabitBtn = document.getElementById('save-habit-btn');
const habitList = document.getElementById('habit-list');
const monthList = document.getElementById('month-list');
const settingsForm = document.getElementById('settings-form');
const themeSelect = document.getElementById('theme');
const notificationsCheckbox = document.getElementById('notifications');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const totalSaving = document.getElementById('total-saving');
const progressAnalysis = document.getElementById('progress-analysis');
const progressRecommendation = document.getElementById('progress-recommendation');
const reportAnalysis = document.getElementById('report-analysis');
const reportRecommendation = document.getElementById('report-recommendation');

// Contoh data kebiasaan finansial
let habits = [
  { name: "Gaji Bulanan", type: "income", amount: 5000000, date: "2023-10-01" },
  { name: "Belanja Bulanan", type: "expense", amount: 2000000, date: "2023-10-05" },
  { name: "Tabungan", type: "saving", amount: 1000000, date: "2023-10-10" },
  { name: "Bonus Projek", type: "income", amount: 1500000, date: "2023-11-01" },
  { name: "Bayar Listrik", type: "expense", amount: 500000, date: "2023-11-05" },
  { name: "Tabungan", type: "saving", amount: 1000000, date: "2023-11-10" },
  { name: "Gaji Bulanan", type: "income", amount: 5000000, date: "2023-12-01" },
  { name: "Belanja Bulanan", type: "expense", amount: 2500000, date: "2023-12-05" },
  { name: "Tabungan", type: "saving", amount: 1000000, date: "2023-12-10" },
];

// Inisialisasi Chart.js
const progressCtx = document.getElementById('progress-chart').getContext('2d');
const progressChart = new Chart(progressCtx, {
  type: 'pie',
  data: {
    labels: ['Pemasukan', 'Pengeluaran', 'Tabungan'],
    datasets: [{
      label: 'Total (Rp)',
      data: [0, 0, 0],
      backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
    }]
  },
  options: {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
          let percentage = (value * 100 / sum).toFixed(2) + "%";
          return percentage;
        },
        color: '#fff',
      }
    }
  }
});

const financeCtx = document.getElementById('finance-chart').getContext('2d');
const financeChart = new Chart(financeCtx, {
  type: 'pie',
  data: {
    labels: ['Pemasukan', 'Pengeluaran', 'Tabungan'],
    datasets: [{
      label: 'Total (Rp)',
      data: [0, 0, 0],
      backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
    }]
  },
  options: {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
          let percentage = (value * 100 / sum).toFixed(2) + "%";
          return percentage;
        },
        color: '#fff',
      }
    }
  }
});

// Fungsi untuk mengubah tema
settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const theme = themeSelect.value;
  document.body.className = theme;
  localStorage.setItem('theme', theme);
});

// Fungsi untuk menampilkan section berdasarkan navigasi
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSection = link.getAttribute('href').substring(1);
    showSection(targetSection);
    navLinks.forEach(link => link.classList.remove('active'));
    link.classList.add('active');
  });
});

// Fungsi untuk menampilkan section tertentu
function showSection(sectionId) {
  sections.forEach(section => {
    section.classList.remove('active-section');
    if (section.id === sectionId) {
      section.classList.add('active-section');
    }
  });
}

// Fungsi untuk menampilkan modal
addHabitBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// Fungsi untuk menutup modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fungsi untuk menyimpan kebiasaan baru
saveHabitBtn.addEventListener('click', () => {
  const habitName = document.getElementById('habit-name').value.trim();
  const habitType = document.getElementById('habit-type').value;
  const habitAmount = parseFloat(document.getElementById('habit-amount').value);
  const habitDate = document.getElementById('habit-date').value;
  if (habitName && !isNaN(habitAmount) && habitDate) {
    habits.push({ name: habitName, type: habitType, amount: habitAmount, date: habitDate });
    renderHabits();
    updateSummary();
    updateCharts();
    updateMonthList();
    modal.style.display = 'none';
  }
});

// Fungsi untuk merender daftar kebiasaan
function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const habitItem = document.createElement('div');
    habitItem.classList.add('habit-item');
    habitItem.innerHTML = `
      <span>${habit.name} (${habit.type === 'income' ? 'Pemasukan' : habit.type === 'expense' ? 'Pengeluaran' : 'Tabungan'}): Rp ${habit.amount.toLocaleString()} - ${habit.date}</span>
      <button onclick="deleteHabit(${index})">Hapus</button>
    `;
    habitList.appendChild(habitItem);
  });
}

// Fungsi untuk menghapus kebiasaan
function deleteHabit(index) {
  habits.splice(index, 1);
  renderHabits();
  updateSummary();
  updateCharts();
  updateMonthList();
}

// Fungsi untuk memperbarui ringkasan di Home
function updateSummary() {
  const totalIncomeAmount = habits.filter(habit => habit.type === 'income').reduce((sum, habit) => sum + habit.amount, 0);
  const totalExpenseAmount = habits.filter(habit => habit.type === 'expense').reduce((sum, habit) => sum + habit.amount, 0);
  const totalSavingAmount = habits.filter(habit => habit.type === 'saving').reduce((sum, habit) => sum + habit.amount, 0);

  totalIncome.textContent = `Rp ${totalIncomeAmount.toLocaleString()}`;
  totalExpense.textContent = `Rp ${totalExpenseAmount.toLocaleString()}`;
  totalSaving.textContent = `Rp ${totalSavingAmount.toLocaleString()}`;
}

// Fungsi untuk memperbarui grafik
function updateCharts() {
  const totalIncomeAmount = habits.filter(habit => habit.type === 'income').reduce((sum, habit) => sum + habit.amount, 0);
  const totalExpenseAmount = habits.filter(habit => habit.type === 'expense').reduce((sum, habit) => sum + habit.amount, 0);
  const totalSavingAmount = habits.filter(habit => habit.type === 'saving').reduce((sum, habit) => sum + habit.amount, 0);

  // Update Progress Chart
  progressChart.data.datasets[0].data = [totalIncomeAmount, totalExpenseAmount, totalSavingAmount];
  progressChart.update();

  // Update Finance Chart
  financeChart.data.datasets[0].data = [totalIncomeAmount, totalExpenseAmount, totalSavingAmount];
  financeChart.update();

  // Update Analisis dan Rekomendasi
  updateAnalysis();
}

// Fungsi untuk memperbarui daftar bulan
function updateMonthList() {
  const months = [...new Set(habits.map(habit => habit.date.slice(0, 7)))];
  monthList.innerHTML = '';
  months.forEach(month => {
    const listItem = document.createElement('li');
    listItem.textContent = month;
    listItem.addEventListener('click', () => showReport(month));
    monthList.appendChild(listItem);
  });
}

// Fungsi untuk menampilkan laporan bulanan
function showReport(month) {
  const filteredHabits = habits.filter(habit => habit.date.slice(0, 7) === month);
  const totalIncomeAmount = filteredHabits.filter(habit => habit.type === 'income').reduce((sum, habit) => sum + habit.amount, 0);
  const totalExpenseAmount = filteredHabits.filter(habit => habit.type === 'expense').reduce((sum, habit) => sum + habit.amount, 0);
  const totalSavingAmount = filteredHabits.filter(habit => habit.type === 'saving').reduce((sum, habit) => sum + habit.amount, 0);

  financeChart.data.datasets[0].data = [totalIncomeAmount, totalExpenseAmount, totalSavingAmount];
  financeChart.update();

  // Update Analisis dan Rekomendasi
  updateAnalysis(month);
}

// Fungsi untuk memperbarui analisis dan rekomendasi
function updateAnalysis(month = null) {
  const filteredHabits = month ? habits.filter(habit => habit.date.slice(0, 7) === month) : habits;
  const totalIncomeAmount = filteredHabits.filter(habit => habit.type === 'income').reduce((sum, habit) => sum + habit.amount, 0);
  const totalExpenseAmount = filteredHabits.filter(habit => habit.type === 'expense').reduce((sum, habit) => sum + habit.amount, 0);
  const totalSavingAmount = filteredHabits.filter(habit => habit.type === 'saving').reduce((sum, habit) => sum + habit.amount, 0);

  const total = totalIncomeAmount + totalExpenseAmount + totalSavingAmount;
  const incomePercentage = ((totalIncomeAmount / total) * 100).toFixed(2);
  const expensePercentage = ((totalExpenseAmount / total) * 100).toFixed(2);
  const savingPercentage = ((totalSavingAmount / total) * 100).toFixed(2);

  // Analisis
  const analysis = `
    <ul>
      <li>Pemasukan: ${incomePercentage}%</li>
      <li>Pengeluaran: ${expensePercentage}%</li>
      <li>Tabungan: ${savingPercentage}%</li>
    </ul>
  `;

  // Rekomendasi
  let recommendation = '';
  if (expensePercentage > 50) {
    recommendation += 'Anda menghabiskan lebih dari 50% pendapatan. Pertimbangkan untuk mengurangi pengeluaran. ';
  }
  if (savingPercentage < 20) {
    recommendation += 'Tabungan Anda kurang dari 20% pendapatan. Prioritaskan menabung lebih banyak. ';
  }
  if (recommendation === '') {
    recommendation = 'Keuangan Anda sehat! Pertahankan kebiasaan baik Anda.';
  }

  if (month) {
    reportAnalysis.innerHTML = analysis;
    reportRecommendation.textContent = recommendation;
  } else {
    progressAnalysis.innerHTML = analysis;
    progressRecommendation.textContent = recommendation;
  }
}

// Render awal
renderHabits();
updateSummary();
updateCharts();
updateMonthList();
showSection('home');

// Handle the single dropdown menu
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.querySelector('.menu-dropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    // Toggle dropdown menu
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      menuDropdown.classList.toggle('active');
    });
    
    // Handle dropdown item clicks
    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the target section
        const targetSection = item.getAttribute('href').substring(1);
        
        // Show the section
        showSection(targetSection);
        
        // Update active states
        dropdownItems.forEach(link => link.classList.remove('active'));
        item.classList.add('active');
        
        // Close the dropdown
        menuDropdown.classList.remove('active');
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuDropdown.contains(e.target)) {
        menuDropdown.classList.remove('active');
      }
    });
    
    // Set active menu item based on current section
    function updateActiveMenuItem() {
      const currentSection = document.querySelector('section.active-section').id;
      dropdownItems.forEach(item => {
        const itemSection = item.getAttribute('href').substring(1);
        if (itemSection === currentSection) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
    
    // Update active menu item on page load
    updateActiveMenuItem();
  });
