(async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tp8test@example.com', password: 'pass12345' })
    });
    const loginData = await loginRes.json();
    console.log('login status', loginRes.status);
    console.log(JSON.stringify(loginData, null, 2));

    const token = loginData.token;
    const meRes = await fetch('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await meRes.json();
    console.log('me status', meRes.status);
    console.log(JSON.stringify(meData, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
