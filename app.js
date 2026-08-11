const STORAGE_KEY = 'journal_entries';
const MOOD_EMOJIS = { senang: '😊', biasa: '😐', sedih: '😢', marah: '😠', cemas: '😰' };
const MOOD_COLORS = { senang: '#22c55e', biasa: '#eab308', sedih: '#3b82f6', marah: '#ef4444', cemas: '#a855f7' };
const MOOD_LABELS = { senang: 'Senang', biasa: 'Biasa', sedih: 'Sedih', marah: 'Marah', cemas: 'Cemas' };

let editingId = null;
let moodChart = null;

const $ = (s) => document.querySelector(s);
const form = $('#journal-form');
const dateInput = $('#entry-date');
const moodInput = $('#selected-mood');
const textInput = $('#entry-text');
const searchInput = $('#search-input');
const feed = $('#entries-feed');
const emptyState = $('#empty-state');
const submitBtn = $('#submit-btn');
const cancelBtn = $('#cancel-btn');

function init() {
  dateInput.value = new Date().toISOString().split('T')[0];

  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      moodInput.value = btn.dataset.mood;
    });
  });

  form.addEventListener('submit', handleSubmit);
  cancelBtn.addEventListener('click', resetForm);
  searchInput.addEventListener('input', renderFeed);

  refreshDashboard();
}

function refreshDashboard() {
  renderStats();
  renderFeed();
  renderChart();
  renderMoodBars();
}

function getEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getWeekEntries(entries) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);
  return entries.filter(e => new Date(e.date + 'T00:00:00') >= weekAgo);
}

function getStreak(entries) {
  if (!entries.length) return 0;

  const dates = [...new Set(entries.map(e => e.date))].sort((a, b) => b.localeCompare(a));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latest = new Date(dates[0] + 'T00:00:00');
  const diffDays = Math.round((today - latest) / 86400000);
  if (diffDays > 1) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + 'T00:00:00');
    const curr = new Date(dates[i] + 'T00:00:00');
    if (Math.round((prev - curr) / 86400000) === 1) streak++;
    else break;
  }
  return streak;
}

function getDominantMood(entries) {
  const weekEntries = getWeekEntries(entries);
  if (!weekEntries.length) return null;

  const counts = {};
  weekEntries.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1; });

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function getMoodCounts(entries) {
  const recent = getWeekEntries(entries);
  const counts = {};
  Object.keys(MOOD_EMOJIS).forEach(m => counts[m] = 0);
  recent.forEach(e => { if (counts[e.mood] !== undefined) counts[e.mood]++; });
  return counts;
}

function renderStats() {
  const entries = getEntries();
  const weekEntries = getWeekEntries(entries);
  const dominant = getDominantMood(entries);
  const streak = getStreak(entries);

  $('#stat-total').textContent = entries.length;
  $('#stat-week').textContent = weekEntries.length;
  $('#stat-streak').textContent = streak;

  const moodEl = $('#stat-mood');
  const moodIcon = $('#stat-mood-icon');
  if (dominant) {
    moodEl.textContent = MOOD_LABELS[dominant];
    moodIcon.textContent = MOOD_EMOJIS[dominant];
  } else {
    moodEl.textContent = '—';
    moodIcon.textContent = '😊';
  }
}

function renderMoodBars() {
  const counts = getMoodCounts(getEntries());
  const max = Math.max(...Object.values(counts), 1);
  const barsEl = $('#mood-bars');

  barsEl.innerHTML = Object.keys(MOOD_EMOJIS).map(mood => {
    const count = counts[mood];
    const pct = Math.round((count / max) * 100);
    return `
      <div class="mood-bar-row">
        <span class="mood-bar-label">${MOOD_EMOJIS[mood]} ${MOOD_LABELS[mood]}</span>
        <div class="mood-bar-track">
          <div class="mood-bar-fill" style="width:${pct}%;background:${MOOD_COLORS[mood]}"></div>
        </div>
        <span class="mood-bar-count">${count}</span>
      </div>
    `;
  }).join('');
}

function handleSubmit(e) {
  e.preventDefault();
  if (!moodInput.value) { alert('Pilih mood terlebih dahulu!'); return; }

  const entries = getEntries();
  const data = { date: dateInput.value, mood: moodInput.value, text: textInput.value.trim() };

  if (editingId) {
    const idx = entries.findIndex(en => en.id === editingId);
    if (idx !== -1) entries[idx] = { ...entries[idx], ...data };
    editingId = null;
  } else {
    data.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    entries.unshift(data);
  }

  saveEntries(entries);
  resetForm();
  refreshDashboard();
}

function resetForm() {
  form.reset();
  dateInput.value = new Date().toISOString().split('T')[0];
  moodInput.value = '';
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  editingId = null;
  submitBtn.innerHTML = '<span class="btn-icon">💾</span> Simpan';
  cancelBtn.style.display = 'none';
}

function editEntry(id) {
  const entry = getEntries().find(e => e.id === id);
  if (!entry) return;
  editingId = id;
  dateInput.value = entry.date;
  textInput.value = entry.text;
  moodInput.value = entry.mood;
  document.querySelectorAll('.mood-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mood === entry.mood);
  });
  submitBtn.innerHTML = '<span class="btn-icon">✅</span> Perbarui';
  cancelBtn.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth' });
}

function deleteEntry(id) {
  if (!confirm('Hapus catatan ini?')) return;
  const entries = getEntries().filter(e => e.id !== id);
  saveEntries(entries);
  if (editingId === id) resetForm();
  refreshDashboard();
}

function renderFeed() {
  const query = searchInput.value.toLowerCase().trim();
  let entries = getEntries();
  if (query) entries = entries.filter(e => e.text.toLowerCase().includes(query) || e.date.includes(query));

  entries.sort((a, b) => b.date.localeCompare(a.date));

  if (!entries.length) {
    feed.innerHTML = '';
    emptyState.style.display = 'block';
    if (query) {
      emptyState.querySelector('.empty-icon').textContent = '🔎';
      emptyState.querySelector('.empty-title').textContent = 'Tidak ada hasil';
      emptyState.querySelector('.empty-desc').textContent = 'Coba kata kunci lain atau hapus pencarian.';
    } else {
      emptyState.querySelector('.empty-icon').textContent = '📭';
      emptyState.querySelector('.empty-title').textContent = 'Belum ada catatan';
      emptyState.querySelector('.empty-desc').textContent = 'Mulai tulis hari ini dan lacak perjalanan emosimu! ✨';
    }
    return;
  }

  emptyState.style.display = 'none';
  feed.innerHTML = entries.map(e => `
    <div class="entry-card mood-${e.mood}">
      <div class="entry-header">
        <span class="entry-date">${formatDate(e.date)}</span>
        <span class="entry-mood-badge mood-${e.mood}">
          <span class="entry-mood-emoji">${MOOD_EMOJIS[e.mood]}</span>
          ${MOOD_LABELS[e.mood]}
        </span>
      </div>
      <div class="entry-text">${escapeHtml(e.text)}</div>
      <div class="entry-actions">
        <button class="btn-edit" onclick="editEntry('${e.id}')">✏️ Edit</button>
        <button class="btn-delete" onclick="deleteEntry('${e.id}')">🗑️ Hapus</button>
      </div>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderChart() {
  const counts = getMoodCounts(getEntries());
  const labels = Object.keys(counts).map(m => `${MOOD_EMOJIS[m]} ${MOOD_LABELS[m]}`);
  const data = Object.values(counts);
  const colors = Object.keys(counts).map(m => MOOD_COLORS[m]);

  const ctx = $('#mood-chart').getContext('2d');
  if (moodChart) moodChart.destroy();

  moodChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            font: { size: 12, family: 'Inter, sans-serif', weight: '500' },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    }
  });
}

init();
