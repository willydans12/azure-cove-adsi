document.querySelectorAll('.rates-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.room-card');
      const rates = card.querySelector('.rates-section');
      rates.classList.toggle('d-none');
      btn.textContent = rates.classList.contains('d-none')
        ? 'Show Rates'
        : 'Hide Rates';
    });
  });
  
  // Fungsi update sidebar
  const reservation = document.querySelector('.reservation-items');
  const totalDisplay = document.querySelector('.total-price');
  
  function updateTotal() {
    let sum = 0;
    reservation.querySelectorAll('.res-item').forEach(item => {
      const price = +item.dataset.price;
      const qty   = +item.dataset.qty;
      sum += price * qty;
    });
    totalDisplay.textContent = `IDR ${sum.toLocaleString()}`;
    document.querySelector('.reservation button').disabled = sum === 0;
  }
  
  // Event delegation untuk qty controls
  document.body.addEventListener('click', e => {
    if (e.target.matches('.qty-increase, .qty-decrease')) {
      const row = e.target.closest('.rate-row');
      const room = row.closest('.room-card').dataset.room;
      const rate = row.dataset.rate;
      const price = +row.dataset.price;
      const isPlus = e.target.classList.contains('qty-increase');
      const qtyEl = row.querySelector('.qty');
      let qty = +qtyEl.textContent + (isPlus ? 1 : -1);
      qty = Math.max(0, qty);
      qtyEl.textContent = qty;
  
      // Update sidebar entry
      const key = `${room}-${rate}`;  // unique key
      let entry = reservation.querySelector(`[data-key="${key}"]`);
      if (qty > 0) {
        if (!entry) {
          entry = document.createElement('div');
          entry.className = 'res-item d-flex justify-content-between align-items-center mb-2';
          entry.dataset.key = key;
          entry.dataset.price = price;
          entry.dataset.qty = qty;
          entry.innerHTML = `
            <div>
              <strong>${room.charAt(0).toUpperCase()+room.slice(1)} (${rate.replace('-', ' ')})</strong>
              <div>${qty} × IDR ${price.toLocaleString()}</div>
            </div>
            <button class="btn btn-sm btn-outline-secondary remove-item">&times;</button>
          `;
          reservation.append(entry);
        } else {
          entry.dataset.qty = qty;
          entry.querySelector('div div').textContent =
            `${qty} × IDR ${price.toLocaleString()}`;
        }
      } else if (entry) {
        entry.remove();
      }
  
      updateTotal();
    }
  
    // Remove item dari sidebar
    if (e.target.matches('.remove-item')) {
      const item = e.target.closest('.res-item');
      const [room, rate] = item.dataset.key.split('-');
      // reset qty di card
      const row = document.querySelector(`.room-card[data-room="${room}"] .rate-row[data-rate="${rate}"]`);
      row.querySelector('.qty').textContent = '0';
      item.remove();
      updateTotal();
    }
  });
  