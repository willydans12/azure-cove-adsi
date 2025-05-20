let currentPage = 1;
const pageSize = 5;
let allData = [];
const modal = new bootstrap.Modal(document.getElementById('modalForm'));

// Reset form for Add
function clearForm() {
  document.getElementById('rec-id').value = '';
  document.getElementById('rec-name').value = '';
  document.getElementById('rec-username').value = '';
  document.getElementById('rec-email').value = '';
  document.getElementById('rec-status').value = 'Aktif';
  document.getElementById('modalTitle').textContent = 'Tambah Resepsionis';
}
document.getElementById('btn-add').addEventListener('click', clearForm);

// Submit form (Add/Edit)
document.getElementById('form-receptionist').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const id = document.getElementById('rec-id').value;
  const url = id ? 'edit_receptionist.php' : 'add_receptionist.php';
  const body = new URLSearchParams(new FormData(form));
  if (id) body.append('id', id);

  try {
    const res = await fetch(url, { method: 'POST', body });
    await res.json();
    modal.hide();
    fetchAccounts();
  } catch (err) {
    console.error('Error submit:', err);
    alert('Gagal menyimpan data.');
  }
});

// Fetch data from server
async function fetchAccounts() {
  try {
    const res = await fetch('get_accounts.php');
    allData = await res.json();
    renderTable();
    renderPagination();
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

// Render table
function renderTable() {
  const tbody = document.querySelector('#accounts-table tbody');
  tbody.innerHTML = '';

  const keyword = document.getElementById('search-input').value.toLowerCase();
  const statusFilter = document.getElementById('filter-status').value;
  let data = allData.filter(r => (
    r.name.toLowerCase().includes(keyword) ||
    r.username.toLowerCase().includes(keyword) ||
    r.email.toLowerCase().includes(keyword)
  ) && (!statusFilter || r.status === statusFilter));

  const order = document.getElementById('sort-order').value;
  data.sort((a, b) => order === 'asc'
    ? new Date(a.created_at) - new Date(b.created_at)
    : new Date(b.created_at) - new Date(a.created_at)
  );

  const start = (currentPage - 1) * pageSize;
  const pageData = data.slice(start, start + pageSize);

  pageData.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <img src="${r.avatar_url || 'https://via.placeholder.com/32'}" width="32" height="32" class="rounded-circle me-2" alt="Avatar">
        ${r.name}
      </td>
      <td>${r.username}</td>
      <td>${r.email}</td>
      <td><span class="badge badge-status badge-${r.status}">${r.status}</span></td>
      <td>${r.created_at}</td>
      <td>
        <i class="bi bi-pencil text-primary me-2" role="button" onclick="openEdit(${r.id})"></i>
        <i class="bi bi-key text-warning me-2" role="button" onclick="toggleStatus(${r.id})"></i>
        <i class="bi bi-trash text-danger" role="button" onclick="deleteRec(${r.id})"></i>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const info = document.getElementById('pagination-info');
  info.textContent = `Menampilkan ${start + 1} sampai ${start + pageData.length} dari ${data.length} hasil`;
}

// Render pagination
function renderPagination() {
  const total = allData.length;
  const pages = Math.ceil(total / pageSize);
  const ul = document.getElementById('pagination'); ul.innerHTML = '';

  for (let i = 1; i <= pages; i++) {
    const li = document.createElement('li');
    li.className = `page-item${i === currentPage ? ' active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', e => {
      e.preventDefault();
      currentPage = i;
      renderTable();
    });
    ul.appendChild(li);
  }
}

// Edit handler
window.openEdit = id => {
  id = parseInt(id);
  const r = allData.find(x => x.id === id);
  if (!r) return alert('Data tidak ditemukan');

  document.getElementById('modalTitle').textContent = 'Edit Resepsionis';
  document.getElementById('rec-id').value = r.id;
  document.getElementById('rec-name').value = r.name;
  document.getElementById('rec-username').value = r.username;
  document.getElementById('rec-email').value = r.email;
  document.getElementById('rec-status').value = r.status;
  modal.show();
};

// Toggle status handler
window.toggleStatus = id => {
  fetch('toggle_status.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) })
  }).then(() => fetchAccounts());
};

// Delete handler
window.deleteRec = id => {
  if (!confirm('Hapus resepsionis ini?')) return;
  fetch('delete_receptionist.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id) })
  })
  .then(res => res.json())
  .then(response => {
    if (response.deleted) fetchAccounts();
    else alert('Hapus gagal');
  });
};

// Re-render on filter/sort change
['search-input','filter-status','sort-order'].forEach(i =>
  document.getElementById(i).addEventListener('input', () => {
    currentPage = 1;
    renderTable();
    renderPagination();
  })
);

// Initialize
fetchAccounts();