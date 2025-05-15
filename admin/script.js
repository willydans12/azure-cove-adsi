window.addEventListener('DOMContentLoaded', () => {
  fetch('get_data.php')
    .then(res => res.json())
    .then(data => {
      // Metrics
      document.getElementById('total-visitors').textContent = data.metrics.visitors;
      document.getElementById('change-visitors').textContent = data.metrics.visitors_change;
      document.getElementById('total-revenue').textContent = data.metrics.revenue;
      document.getElementById('change-revenue').textContent = data.metrics.revenue_change;
      document.getElementById('occupancy').textContent = data.metrics.occupancy;
      document.getElementById('change-occupancy').textContent = data.metrics.occupancy_change;

      // Booking Table
      const tbody = document.querySelector('#booking-table tbody');
      data.bookings.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.booking_id}</td>
          <td><strong>${r.guest_name}</strong><br><small>${r.guest_email}</small></td>
          <td>${r.check_in}</td>
          <td>${r.check_out}</td>
          <td>${r.room}</td>
          <td>${r.total}</td>
          <td><span class="badge bg-${getBadgeClass(r.status)}">${r.status}</span></td>
        `;
        tbody.appendChild(tr);
      });

      // Charts
      new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
          labels: data.charts.revenue.labels,
          datasets: [{
            label: 'Pendapatan',
            data: data.charts.revenue.values,
            tension: 0.4,
            borderColor: 'blue'
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      });

      new Chart(document.getElementById('visitorsChart'), {
        type: 'line',
        data: {
          labels: data.charts.visitors.labels,
          datasets: [{
            label: 'Pengunjung',
            data: data.charts.visitors.values,
            tension: 0.4,
            borderColor: 'green'
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      });
    })
    .catch(e => console.error(e));
});

function getBadgeClass(status) {
  switch (status.toLowerCase()) {
    case 'check in': return 'success';
    case 'confirmed': return 'primary';
    case 'check out': return 'secondary';
    default: return 'light';
  }
}
