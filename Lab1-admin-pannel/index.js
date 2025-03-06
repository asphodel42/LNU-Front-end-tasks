const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

const localhost = '127.0.0.1';
const port = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src/data', express.static(path.join(__dirname, 'src/data')));

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to serve the form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/form/form.html'));
});

// Route to serve the admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/admin/admin.html'));
});

// DELETE endpoint to handle user deletion
app.delete('/delete-user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    // Read the current users from the JSON file
    const data = await fs.readFile(path.join(__dirname, 'src/data/clients.json'), 'utf8');
    const users = JSON.parse(data);

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    users.splice(userIndex, 1);

    await fs.writeFile(
      path.join(__dirname, 'src/data/clients.json'),
      JSON.stringify(users, null, 2),
      'utf8'
    );

    // Send a success response
    res.json({ message: `User with id ${userId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.put('/update-user/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;

    const data = await fs.readFile('src/data/clients.json', 'utf8');
    let users = JSON.parse(data);

    const userIndex = users.findIndex(user => user.id == userId);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    updatedUser.photo = users[userIndex].photo;

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    await fs.writeFile('src/data/clients.json', JSON.stringify(users, null, 2));

    res.json({ message: 'User updated successfully', user: users[userIndex] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(port, localhost, () => {
  console.log(`Server is running on http://${localhost}:${port}`);
});