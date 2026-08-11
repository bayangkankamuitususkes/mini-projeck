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

  renderFeed();
  renderChart();
}

function getEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
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
  renderFeed();
  renderChart();
}

function resetForm() {
  form.reset();
  dateInput.value = new Date().toISOString().split('T')[0];
  moodInput.value = '';
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  editingId = null;
  submitBtn.textContent = 'Simpan';
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
  submitBtn.textContent = 'Perbarui';
  cancelBtn.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth' });
}

function deleteEntry(id) {
  if (!confirm('Hapus catatan ini?')) return;
  const entries = getEntries().filter(e => e.id !== id);
  saveEntries(entries);
  if (editingId === id) resetForm();
  renderFeed();
  renderChart();
}

function renderFeed() {
  const query = searchInput.value.toLowerCase().trim();
  let entries = getEntries();
  if (query) entries = entries.filter(e => e.text.toLowerCase().includes(query) || e.date.includes(query));

  entries.sort((a, b) => b.date.localeCompare(a.date));

  if (!entries.length) {
    feed.innerHTML = '';
    emptyState.style.display = 'block';
    emptyState.textContent = query ? 'Tidak ada hasil ditemukan.' : 'Belum ada catatan. Mulai tulis hari ini! ✨';
    return;
  }

  emptyState.style.display = 'none';
  feed.innerHTML = entries.map(e => `
    <div class="entry-card">
      <div class="entry-header">
        <span class="entry-date">${formatDate(e.date)}</span>
        <span class="entry-mood" title="${MOOD_LABELS[e.mood]}">${MOOD_EMOJIS[e.mood]}</span>
      </div>
      <div class="entry-text">${escapeHtml(e.text)}</div>
      <div class="entry-actions">
        <button class="btn-edit" onclick="editEntry('${e.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteEntry('${e.id}')">Hapus</button>
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
  const entries = getEntries();
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recent = entries.filter(e => new Date(e.date) >= weekAgo);
  const counts = {};
  Object.keys(MOOD_EMOJIS).forEach(m => counts[m] = 0);
  recent.forEach(e => { if (counts[e.mood] !== undefined) counts[e.mood]++; });

  const labels = Object.keys(counts).map(m => `${MOOD_EMOJIS[m]} ${MOOD_LABELS[m]}`);
  const data = Object.values(counts);
  const colors = Object.keys(counts).map(m => MOOD_COLORS[m]);

  const ctx = $('#mood-chart').getContext('2d');
  if (moodChart) moodChart.destroy();

  moodChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 14, font: { size: 13 } } }
      }
    }
  });
}

init();
