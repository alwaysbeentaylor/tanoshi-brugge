const crypto = require('crypto');

function generateCode() {
  const prefix = 'TANOSHI';
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${random}`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Naam en email zijn verplicht.' });
  }

  const code = generateCode();
  const timestamp = new Date().toISOString();

  // Log to Vercel logs (visible in dashboard → Logs)
  console.log(`[REVIEW] ${timestamp} | Naam: ${name} | Email: ${email} | Code: ${code}`);

  res.json({ code });
};
