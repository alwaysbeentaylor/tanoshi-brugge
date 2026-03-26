const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function generateCode() {
  const prefix = 'TANOSHI';
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${random}`;
}

app.post('/api/submit', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Naam en email zijn verplicht.' });
  }

  const code = generateCode();
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] Naam: ${name} | Email: ${email} | Code: ${code}\n`;

  fs.appendFile(path.join(__dirname, 'reviews.txt'), entry, (err) => {
    if (err) {
      console.error('Fout bij opslaan:', err);
      return res.status(500).json({ error: 'Er ging iets mis.' });
    }
    console.log(`Nieuwe review claim: ${name} (${email}) - ${code}`);
    res.json({ code });
  });
});

app.listen(PORT, () => {
  console.log(`Tanoshi Sushi server draait op http://localhost:${PORT}`);
});
