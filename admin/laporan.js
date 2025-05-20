document.addEventListener('DOMContentLoaded', () => {
  const startEl = document.getElementById('startDate');
  const endEl   = document.getElementById('endDate');
  const rangeEl = document.getElementById('downloadRange');
  const btnDown = document.getElementById('btnDownload');

  const today = new Date();
  const toIso = d => d.toISOString().split('T')[0];
  endEl.value = toIso(today);
  startEl.value = toIso(new Date(today.getTime() - 6 * 86400000));

  const fmtDate = d => d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

  const qs = () => {
    const s = startEl.value, e = endEl.value;
    return (s && e) ? `?start=${s}&end=${e}` : '';
  };

  const renderTrend = pct => {
    const v = Number(pct);
    if (isNaN(v) || v === 0) return '';
    const dir = v > 0 ? 'up text-success' : 'down text-danger';
    return `<i class="bi bi-arrow-${dir} me-1"></i>${Math.abs(v)}%`;
  };

  // 0) Stats
  function loadStats() {
    fetch('stats.php' + qs())
      .then(r => r.json())
      .then(s => {
        document.getElementById('totalRevenue').innerText = s.totalRevenue ? `Rp ${s.totalRevenue}M` : '-';
        document.getElementById('trendRevenue').innerHTML = renderTrend(s.totalRevenuePct);
        document.getElementById('totalBookings').innerText = s.totalBookings ?? '-';
        document.getElementById('trendBookings').innerHTML = renderTrend(s.totalBookingsPct);
        document.getElementById('avgStay').innerText = s.avgStay != null ? `${s.avgStay} hari` : '-';
        document.getElementById('trendAvgStay').innerHTML = renderTrend(s.avgStayPct);
        document.getElementById('avgOccupancy').innerText = s.avgOccupancy != null ? `${s.avgOccupancy}%` : '-';
        document.getElementById('trendOccupancy').innerHTML = renderTrend(s.avgOccupancyPct);

        // Tampilkan metode pembayaran
        const methodsEl = document.getElementById('paymentMethodsList');
        if (methodsEl) {
          methodsEl.innerHTML = '';
          if (s.paymentMethods) {
            for (const [method, count] of Object.entries(s.paymentMethods)) {
              const li = document.createElement('li');
              li.className = 'list-group-item d-flex justify-content-between align-items-center';
              li.textContent = method;
              const span = document.createElement('span');
              span.className = 'badge bg-primary rounded-pill';
              span.textContent = count;
              li.appendChild(span);
              methodsEl.appendChild(li);
            }
          }
        }
      })
      .catch(console.error);
  }

  // 1) Charts
  function loadCharts() {
    fetch('charts.php' + qs())
      .then(r => r.json())
      .then(({ labels, revenue, occupancy }) => {
        new Chart(document.getElementById('revenueChart'), {
          type: 'line',
          data: { labels, datasets: [{ data: revenue, tension: .4, fill: false, borderWidth: 3 }] },
          options: { scales: { y: { ticks: { callback: v => 'Rp ' + v + 'M' } } }, plugins: { legend: { display: false } } }
        });
        new Chart(document.getElementById('occupancyChart'), {
          type: 'line',
          data: { labels, datasets: [{ data: occupancy, tension: .4, fill: false, borderWidth: 3 }] },
          options: { scales: { y: { min: 0, max: 100, ticks: { callback: v => v + '%' } } }, plugins: { legend: { display: false } } }
        });
      })
      .catch(console.error);
  }

  // 2) Bookings
  function loadBookings() {
    fetch('booking.php' + qs())
      .then(r => r.json())
      .then(rows => {
        const tb = document.getElementById('bookingTable');
        tb.innerHTML = '';
        rows.forEach(b => {
          const cls = b.status === 'Check In'
            ? 'bg-success text-white'
            : b.status === 'Check Out'
              ? 'bg-secondary text-white'
              : 'bg-danger text-white';
          tb.insertAdjacentHTML('beforeend', `
            <tr>
              <td>${b.booking_id}</td>
              <td><strong>${b.guest_name}</strong><br><small class="text-muted">${b.guest_email}</small></td>
              <td>${b.check_in}</td><td>${b.check_out}</td>
              <td>${b.room}</td>
              <td>Rp ${b.total}</td>
              <td><span class="badge badge-status ${cls}">${b.status}</span></td>
              <td>${b.payment_method}</td>
            </tr>`);
        });
      })
      .catch(console.error);
  }

  const update = () => {
    const s = startEl.value, e = endEl.value;
    rangeEl.textContent = `${fmtDate(s)} - ${fmtDate(e)}`;
    btnDown.disabled = !(s && e);
    loadStats();
    loadCharts();
    loadBookings();
  };

  startEl.addEventListener('change', update);
  endEl.addEventListener('change', update);

  update();

  // --- Export Handler ---
  async function fetchData(mode) {
    const q = qs();
    if (mode === 'stats') return [{ title: 'Statistik', data: await (await fetch('stats.php' + q)).json() }];
    if (mode === 'booking') return [{ title: 'Riwayat Pemesanan', data: await (await fetch('booking.php' + q)).json() }];
    const [s, b] = await Promise.all([
      fetch('stats.php' + q).then(r => r.json()),
      fetch('booking.php' + q).then(r => r.json())
    ]);
    return [{ title: 'Statistik', data: s }, { title: 'Riwayat Pemesanan', data: b }];
  }

  const modalEl = document.getElementById('downloadModal');

  btnDown.addEventListener('click', async () => {
    const fmt = document.querySelector('input[name=fmt]:checked').value;
    const mode = document.querySelector('input[name=konten]:checked').value;
    const secs = await fetchData(mode);

    if (fmt === 'pdf') {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF(); let y = 10;
      secs.forEach(sec => {
        doc.setFontSize(14); doc.text(sec.title, 10, y); y += 6;
        if (sec.title === 'Statistik') {
          const stats = Object.entries(sec.data).map(([k, v]) => {
            if (typeof v === 'object') return null;
            return `${k}: ${v}`;
          }).filter(Boolean).join(' | ');
          doc.setFontSize(11).text(stats, 10, y); y += 10;

          if (sec.data.paymentMethods) {
            doc.text('Metode Pembayaran:', 10, y); y += 6;
            Object.entries(sec.data.paymentMethods).forEach(([m, c]) => {
              doc.text(`- ${m}: ${c}`, 14, y); y += 5;
            });
            y += 5;
          }
        } else {
          const hdr = Object.keys(sec.data[0]);
          const rows = sec.data.map(o => hdr.map(h => o[h]));
          doc.autoTable({ startY: y, head: [hdr], body: rows, margin: { left: 10 } });
          y = doc.lastAutoTable.finalY + 10;
        }
      });
      doc.save('laporan.pdf');
    }
    else if (fmt === 'xlsx') {
      const wb = XLSX.utils.book_new();
      secs.forEach(sec => {
        if (sec.title === 'Statistik') {
          const flatStats = Object.entries(sec.data)
            .filter(([k, v]) => typeof v !== 'object')
            .map(([k, v]) => [k, v]);
          if (sec.data.paymentMethods) {
            flatStats.push(['', '']);
            flatStats.push(['Metode Pembayaran', 'Jumlah']);
            for (const [method, count] of Object.entries(sec.data.paymentMethods)) {
              flatStats.push([method, count]);
            }
          }
          const ws = XLSX.utils.aoa_to_sheet(flatStats);
          XLSX.utils.book_append_sheet(wb, ws, sec.title);
        } else {
          const hdr = Object.keys(sec.data[0]);
          const data = [hdr, ...sec.data.map(o => hdr.map(h => o[h]))];
          const ws = XLSX.utils.aoa_to_sheet(data);
          XLSX.utils.book_append_sheet(wb, ws, sec.title);
        }
      });
      XLSX.writeFile(wb, 'laporan.xlsx');
    }
    else {
      let csv = '';
      secs.forEach(sec => {
        csv += sec.title + '\r\n';
        if (sec.title === 'Statistik') {
          for (const [k, v] of Object.entries(sec.data)) {
            if (typeof v !== 'object') {
              csv += `"${k}","${v}"\r\n`;
            }
          }
          if (sec.data.paymentMethods) {
            csv += '\r\nMetode Pembayaran, Jumlah\r\n';
            for (const [method, count] of Object.entries(sec.data.paymentMethods)) {
              csv += `"${method}","${count}"\r\n`;
            }
          }
        } else {
          const hdr = Object.keys(sec.data[0]);
          csv += hdr.join(',') + '\r\n';
          sec.data.forEach(o => {
            csv += hdr.map(h => `"${o[h]}"`).join(',') + '\r\n';
          });
        }
        csv += '\r\n';
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'laporan.csv'; a.click();
      URL.revokeObjectURL(url);
    }

    bootstrap.Modal.getInstance(modalEl).hide();
  });
});
