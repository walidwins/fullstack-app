(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'TP8 Test', email: 'tp8test@example.com', password: 'pass12345' })
    });
    const data = await res.json();
    console.log('status', res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
