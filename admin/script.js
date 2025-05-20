// script.js
window.addEventListener('DOMContentLoaded', () => {
  const HOTEL_CAPACITY = 500; // kapasitas hotel

  fetch('get_data.php')
    .then(res => res.json())
    .then(data => {
      // === Total Pengunjung ===
      const visitors = Number(data.metrics.visitors) || 0;
      document.getElementById('total-visitors').textContent =
        visitors > 0 ? visitors : '-';

      const vchg = Number(data.metrics.visitors_change);
      const visBadge = document.getElementById('change-visitors');
      if (isNaN(vchg)) {
        visBadge.textContent = '-';
        visBadge.className = 'badge ms-2 bg-secondary';
      } else {
        visBadge.textContent = (vchg > 0 ? '+' : '') + vchg.toFixed(0) + '%';
        visBadge.className = `badge ms-2 bg-${vchg >= 0 ? 'success' : 'danger'}`;
      }

      // === Total Pendapatan ===
      const revRaw = data.metrics.revenue;
      const revEl  = document.getElementById('total-revenue');
      if (!isNaN(Number(revRaw))) {
        revEl.textContent = `Rp ${Number(revRaw).toLocaleString('id-ID')}M`;
      } else {
        revEl.textContent = '-';
      }
      const rchg = Number(data.metrics.revenue_change);
      const revBadge = document.getElementById('change-revenue');
      if (isNaN(rchg)) {
        revBadge.textContent = '-';
        revBadge.className = 'badge ms-2 bg-secondary';
      } else {
        revBadge.textContent = (rchg > 0 ? '+' : '') + rchg.toFixed(0) + '%';
        revBadge.className = `badge ms-2 bg-${rchg >= 0 ? 'success' : 'danger'}`;
      }

      // === Tingkat Hunian (persentase terhadap kapasitas) ===
      const occPercent = HOTEL_CAPACITY
        ? (visitors / HOTEL_CAPACITY) * 100
        : 0;
      // format dua desimal dengan koma
      const occFormatted = occPercent
        .toFixed(2)
        .replace('.', ',') + '%';
      document.getElementById('occupancy').textContent = occFormatted;

      // untuk vs bulan lalu, kita ambil selisih persen dari data.metrics.occupancy_change_percent
      // (anda dapat menghitung di server: (visitors-thisMonth)/(visitors-lastMonth)*100 - 100)
      const ochgPct = Number(data.metrics.occupancy_change_percent);
      const occBadge = document.getElementById('change-occupancy');
      if (isNaN(ochgPct)) {
        occBadge.textContent = '-';
        occBadge.className = 'badge ms-2 bg-secondary';
      } else {
        // format +X,XX% atau -X,XX%
        const sign = ochgPct > 0 ? '+' : '';
        const pctStr = sign + ochgPct.toFixed(2).replace('.', ',') + '%';
        occBadge.textContent = pctStr;
        occBadge.className = `badge ms-2 bg-${ochgPct >= 0 ? 'success' : 'danger'}`;
      }

      // === Booking Table ===
      const tbody = document.querySelector('#booking-table tbody');
      tbody.innerHTML = '';
      data.bookings.forEach(r => {
        const cls = getBadgeClass(r.status);
        // gunakan r.total langsung, asumsi string "48.300.000" atau number
        let totalDisplay = '-';
        if (r.total != null && r.total !== '') {
          // jika number
          if (!isNaN(Number(r.total))) {
            totalDisplay = Number(r.total).toLocaleString('id-ID');
          } else {
            totalDisplay = r.total;
          }
          totalDisplay = 'Rp ' + totalDisplay;
        }

        tbody.innerHTML += `
          <tr>
            <td>${r.booking_id}</td>
            <td><strong>${r.guest_name}</strong><br><small>${r.guest_email}</small></td>
            <td>${r.check_in}</td>
            <td>${r.check_out}</td>
            <td>${r.room}</td>
            <td>${totalDisplay}</td>
            <td><span class="badge bg-${cls}">${r.status}</span></td>
          </tr>`;
      });

      // === Grafik Pendapatan ===
      new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
          labels: data.charts.revenue.labels,
          datasets: [{
            label: 'Pendapatan',
            data: data.charts.revenue.values,
            tension: 0.4,
            fill: false,
            borderWidth: 3,
            borderColor: 'blue'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: v => `Rp ${v}M`
              }
            }
          },
          plugins: { legend: { display: false } }
        }
      });

      // === Grafik Pengunjung ===
      new Chart(document.getElementById('visitorsChart'), {
        type: 'line',
        data: {
          labels: data.charts.visitors.labels,
          datasets: [{
            label: 'Pengunjung',
            data: data.charts.visitors.values,
            tension: 0.4,
            fill: false,
            borderWidth: 3,
            borderColor: 'green'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: v => v }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    })
    .catch(e => console.error('Error loading dashboard data:', e));
});

// helper untuk badge status
function getBadgeClass(status) {
  switch (status.toLowerCase()) {
    case 'check in':   return 'success';
    case 'confirmed':  return 'primary';
    case 'check out':  return 'secondary';
    default:           return 'danger';
  }
}
