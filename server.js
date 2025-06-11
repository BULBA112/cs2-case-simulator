const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Замените на свой токен и chat_id
const TELEGRAM_BOT_TOKEN = '8039799949:AAFxAF1ScVCzV-OKH3IwvN_OukHGLR1iSk0';
const TELEGRAM_CHAT_ID = '5103411502';

app.use(cors());
app.use(bodyParser.json());

// Хранилище записей (в памяти)
let bookings = [];

// Получить все записи
app.get('/bookings', (req, res) => {
    res.json(bookings);
});

// Добавить новую запись
app.post('/book', async (req, res) => {
    const { name, phone, service, date, time } = req.body;
    // Проверка на занятость
    const exists = bookings.find(b => b.date === date && b.time === time);
    if (exists) {
        return res.status(409).json({ error: 'Слот уже занят' });
    }
    const booking = { name, phone, service, date, time };
    bookings.push(booking);

    // Формируем таблицу для Telegram
    const message = `Новая запись:\n| Имя | Телефон | Услуга | Дата | Время |\n|---|---|---|---|---|\n| ${name} | ${phone} | ${service} | ${date} | ${time} |`;
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
    } catch (e) {
        console.error('Ошибка отправки в Telegram:', e.message);
    }
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
}); 