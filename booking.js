const API_URL = 'http://localhost:3000';

function fetchBookings() {
    return fetch(`${API_URL}/bookings`).then(r => r.json());
}

function updateBookingsTable(bookings) {
    const tbody = document.querySelector('#bookingsTable tbody');
    tbody.innerHTML = '';
    bookings.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${b.name}</td><td>${b.date}</td><td>${b.time}</td>`;
        tbody.appendChild(tr);
    });
}

function isSlotTaken(bookings, date, time) {
    return bookings.some(b => b.date === date && b.time === time);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const success = document.getElementById('bookingSuccess');
    const error = document.getElementById('bookingError');
    let bookings = [];

    function refresh() {
        fetchBookings().then(data => {
            bookings = data;
            updateBookingsTable(bookings);
        });
    }

    refresh();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        error.style.display = 'none';
        const formData = new FormData(form);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const date = formData.get('date');
        const time = formData.get('time');
        if (isSlotTaken(bookings, date, time)) {
            error.textContent = 'Это время уже занято!';
            error.style.display = 'block';
            return;
        }
        fetch(`${API_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, date, time })
        })
        .then(r => {
            if (r.status === 409) throw new Error('Это время уже занято!');
            return r.json();
        })
        .then(() => {
            form.style.display = 'none';
            success.style.display = 'block';
            refresh();
        })
        .catch(err => {
            error.textContent = err.message;
            error.style.display = 'block';
        });
    });
}); 