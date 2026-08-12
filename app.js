const STORAGE_KEY = 'journal_entries';
const MOOD_EMOJIS = { senang: '😊', biasa: '😐', sedih: '😢', marah: '😠', cemas: '😰' };
const MOOD_COLORS = { senang: '#22c55e', biasa: '#eab308', sedih: '#3b82f6', marah: '#ef4444', cemas: '#a855f7' };
const MOOD_LABELS = { senang: 'Senang', biasa: 'Biasa', sedih: 'Sedih', marah: 'Marah', cemas: 'Cemas' };
const MOOD_ORDER = { senang: 0, biasa: 1, sedih: 2, marah: 3, cemas: 4 };
const DATE_PRESET_LABELS = {
  all: 'Semua waktu',
  today: 'Hari ini',
  week: 'Minggu ini',
  month: 'Bulan ini',
  custom: 'Rentang kustom'
};

let editingId = null;
let moodChart = null;

const $ = (s) => document.querySelector(s);
const form = $('#journal-form');
const dateInput = $('#entry-date');
const timeInput = $('#entry-time');
const moodInput = $('#selected-mood');
const textInput = $('#entry-text');
const searchInput = $('#search-input');
const sortSelect = $('#sort-select');
const filterDateFrom = $('#filter-date-from');
const filterDateTo = $('#filter-date-to');
const customDateRange = $('#custom-date-range');
const activeFiltersEl = $('#active-filters');
const clearFiltersBtn = $('#clear-filters');
const searchResultsCount = $('#search-results-count');
const feed = $('#entries-feed');
const emptyState = $('#empty-state');
const submitBtn = $('#submit-btn');
const cancelBtn = $('#cancel-btn');

function init() {
  dateInput.value = new Date().toISOString().split('T')[0];
  timeInput.value = getCurrentTime();

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
  sortSelect.addEventListener('change', renderFeed);
  filterDateFrom.addEventListener('change', renderFeed);
  filterDateTo.addEventListener('change', renderFeed);
  clearFiltersBtn.addEventListener('click', clearAllFilters);

  document.querySelectorAll('.filter-mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      renderFeed();
    });
  });

  document.querySelectorAll('.date-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.date-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isCustom = btn.dataset.preset === 'custom';
      customDateRange.hidden = !isCustom;
      if (!isCustom) {
        filterDateFrom.value = '';
        filterDateTo.value = '';
      }
      renderFeed();
    });
  });

  refreshDashboard();
}

function refreshDashboard() {
  renderStats();
  renderFeed();
  renderChart();
  renderMoodBars();
}

function getEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map(normalizeEntry);
}

function normalizeEntry(entry) {
  if (entry.datetime) {
    const [date] = entry.datetime.split('T');
    return { ...entry, date };
  }
  if (entry.date) {
    return { ...entry, datetime: `${entry.date}T00:00` };
  }
  return entry;
}

function getEntryDatetime(entry) {
  return entry.datetime || `${entry.date}T00:00`;
}

function getEntryDate(entry) {
  return getEntryDatetime(entry).split('T')[0];
}

function getEntryTime(entry) {
  return getEntryDatetime(entry).split('T')[1] || '00:00';
}

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function buildDatetime(date, time) {
  return `${date}T${time || '00:00'}`;
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getWeekEntries(entries) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);
  return entries.filter(e => new Date(getEntryDate(e) + 'T00:00:00') >= weekAgo);
}

function getStreak(entries) {
  if (!entries.length) return 0;

  const dates = [...new Set(entries.map(e => getEntryDate(e)))].sort((a, b) => b.localeCompare(a));
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
  const datetime = buildDatetime(dateInput.value, timeInput.value);
  const data = {
    datetime,
    date: dateInput.value,
    mood: moodInput.value,
    text: textInput.value.trim()
  };

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
  timeInput.value = getCurrentTime();
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
  dateInput.value = getEntryDate(entry);
  timeInput.value = getEntryTime(entry);
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

function getSelectedMoods() {
  return [...document.querySelectorAll('.filter-mood-btn.active')].map(btn => btn.dataset.mood);
}

function getActiveDatePreset() {
  return document.querySelector('.date-preset-btn.active')?.dataset.preset || 'all';
}

function toISODate(date) {
  return date.toISOString().split('T')[0];
}

function getDateRange() {
  const preset = getActiveDatePreset();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (preset) {
    case 'today':
      return { from: toISODate(today), to: toISODate(today) };
    case 'week': {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { from: toISODate(start), to: toISODate(today) };
    }
    case 'month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: toISODate(start), to: toISODate(today) };
    }
    case 'custom': {
      const from = filterDateFrom.value;
      const to = filterDateTo.value;
      if (!from && !to) return null;
      return {
        from: from || '0000-01-01',
        to: to || '9999-12-31'
      };
    }
    default:
      return null;
  }
}

function matchesDateRange(entry, range) {
  if (!range) return true;
  const entryDate = getEntryDate(entry);
  return entryDate >= range.from && entryDate <= range.to;
}

function entryHaystack(entry) {
  return `${entry.text.toLowerCase()} ${getEntryDate(entry)} ${getEntryTime(entry)} ${MOOD_LABELS[entry.mood].toLowerCase()}`;
}

function matchesSearch(entry, query) {
  const trimmed = query.trim();
  if (!trimmed) return true;

  const haystack = entryHaystack(entry);
  const lower = trimmed.toLowerCase();
  const hasOperators = /\s+OR\s+|\||\s+AND\s+|NOT\s+|(?:^|\s)-\S+/i.test(trimmed);

  if (!hasOperators) return haystack.includes(lower);

  const orGroups = trimmed.split(/\s+OR\s+|\|/i).map(g => g.trim()).filter(Boolean);
  return orGroups.some(group => {
    const andParts = group.split(/\s+AND\s+/i).map(p => p.trim()).filter(Boolean);
    return andParts.every(part => {
      if (/^NOT\s+/i.test(part)) {
        const term = part.replace(/^NOT\s+/i, '').toLowerCase();
        return term && !haystack.includes(term);
      }
      if (/^-\S+/.test(part)) {
        const term = part.slice(1).toLowerCase();
        return term && !haystack.includes(term);
      }
      return haystack.includes(part.toLowerCase());
    });
  });
}

function getHighlightTerms(query) {
  if (!query.trim()) return [];

  const terms = [];
  query.split(/\s+OR\s+|\|/i).forEach(group => {
    group.split(/\s+AND\s+/i).forEach(part => {
      let term = part.trim();
      if (/^NOT\s+/i.test(term)) term = term.replace(/^NOT\s+/i, '');
      else if (/^-\S+/.test(term)) term = term.slice(1);
      if (term) terms.push(term);
    });
  });

  return [...new Set(terms)].sort((a, b) => b.length - a.length);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text, query) {
  const safe = escapeHtml(text);
  const terms = getHighlightTerms(query);
  if (!terms.length) return safe;

  const pattern = new RegExp(`(${terms.map(escapeRegex).join('|')})`, 'gi');
  return safe.replace(pattern, '<mark class="search-highlight">$1</mark>');
}

function sortEntries(entries) {
  const sortBy = sortSelect.value;
  const sorted = [...entries];

  if (sortBy === 'date-asc') {
    sorted.sort((a, b) => getEntryDatetime(a).localeCompare(getEntryDatetime(b)));
  } else if (sortBy === 'mood') {
    sorted.sort((a, b) => {
      const moodDiff = MOOD_ORDER[a.mood] - MOOD_ORDER[b.mood];
      return moodDiff !== 0 ? moodDiff : getEntryDatetime(b).localeCompare(getEntryDatetime(a));
    });
  } else {
    sorted.sort((a, b) => getEntryDatetime(b).localeCompare(getEntryDatetime(a)));
  }

  return sorted;
}

function hasActiveFilters() {
  return Boolean(
    searchInput.value.trim() ||
    getSelectedMoods().length ||
    getActiveDatePreset() !== 'all' ||
    filterDateFrom.value ||
    filterDateTo.value
  );
}

function renderActiveFilters() {
  const chips = [];
  const query = searchInput.value.trim();
  const moods = getSelectedMoods();
  const preset = getActiveDatePreset();
  const range = getDateRange();

  if (query) {
    chips.push({ type: 'query', label: `Kata kunci: "${query}"` });
  }

  moods.forEach(mood => {
    chips.push({ type: 'mood', mood, label: `${MOOD_EMOJIS[mood]} ${MOOD_LABELS[mood]}` });
  });

  if (preset === 'custom' && range) {
    chips.push({
      type: 'date-custom',
      label: `📅 ${range.from} — ${range.to}`
    });
  } else if (preset !== 'all') {
    chips.push({ type: 'date-preset', preset, label: `📅 ${DATE_PRESET_LABELS[preset]}` });
  }

  if (!chips.length) {
    activeFiltersEl.hidden = true;
    activeFiltersEl.innerHTML = '';
    return;
  }

  activeFiltersEl.hidden = false;
  activeFiltersEl.innerHTML = chips.map(chip => `
    <button type="button" class="filter-chip" data-filter-type="${chip.type}"${chip.mood ? ` data-mood="${chip.mood}"` : ''}${chip.preset ? ` data-preset="${chip.preset}"` : ''}>
      ${chip.label}
      <span class="filter-chip-remove" aria-hidden="true">×</span>
    </button>
  `).join('');

  activeFiltersEl.querySelectorAll('.filter-chip').forEach(chipEl => {
    chipEl.addEventListener('click', () => removeFilterChip(chipEl));
  });
}

function removeFilterChip(chipEl) {
  const { filterType, mood, preset } = chipEl.dataset;

  if (filterType === 'query') searchInput.value = '';
  if (filterType === 'mood') {
    document.querySelector(`.filter-mood-btn[data-mood="${mood}"]`)?.classList.remove('active');
  }
  if (filterType === 'date-preset' || filterType === 'date-custom') {
    document.querySelectorAll('.date-preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === 'all');
    });
    customDateRange.hidden = true;
    filterDateFrom.value = '';
    filterDateTo.value = '';
  }

  renderFeed();
}

function clearAllFilters() {
  searchInput.value = '';
  document.querySelectorAll('.filter-mood-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.date-preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === 'all');
  });
  customDateRange.hidden = true;
  filterDateFrom.value = '';
  filterDateTo.value = '';
  sortSelect.value = 'date-desc';
  renderFeed();
}

function getFilteredEntries() {
  const query = searchInput.value.trim();
  const moods = getSelectedMoods();
  const range = getDateRange();

  return sortEntries(
    getEntries().filter(entry =>
      matchesMood(entry, moods) &&
      matchesDateRange(entry, range) &&
      matchesSearch(entry, query)
    )
  );
}

function matchesMood(entry, moods) {
  if (!moods.length) return true;
  return moods.includes(entry.mood);
}

function renderFeed() {
  const query = searchInput.value.trim();
  const allEntries = getEntries();
  const entries = getFilteredEntries();
  const filtersActive = hasActiveFilters();

  renderActiveFilters();

  if (allEntries.length) {
    searchResultsCount.textContent = filtersActive
      ? `Ditemukan ${entries.length} catatan`
      : `Menampilkan ${entries.length} catatan`;
  } else {
    searchResultsCount.textContent = '';
  }

  if (!entries.length) {
    feed.innerHTML = '';
    emptyState.style.display = 'block';
    if (filtersActive) {
      emptyState.querySelector('.empty-icon').textContent = '🔎';
      emptyState.querySelector('.empty-title').textContent = 'Tidak ada hasil';
      emptyState.querySelector('.empty-desc').textContent = 'Coba ubah filter atau kata kunci pencarian.';
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
        <span class="entry-date">${formatDateTime(e)}</span>
        <span class="entry-mood-badge mood-${e.mood}">
          <span class="entry-mood-emoji">${MOOD_EMOJIS[e.mood]}</span>
          ${MOOD_LABELS[e.mood]}
        </span>
      </div>
      <div class="entry-text">${highlightText(e.text, query)}</div>
      <div class="entry-actions">
        <button class="btn-edit" onclick="editEntry('${e.id}')">✏️ Edit</button>
        <button class="btn-delete" onclick="deleteEntry('${e.id}')">🗑️ Hapus</button>
      </div>
    </div>
  `).join('');
}

function formatDateTime(entry) {
  const dateStr = getEntryDate(entry);
  const timeStr = getEntryTime(entry);
  const formatted = new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  return `${formatted} · ⏰ ${timeStr}`;
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
        borderColor: '#18181b',
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
            color: '#a1a1aa',
            font: { size: 12, family: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", Inter, sans-serif', weight: '500' },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    }
  });
}

init();
