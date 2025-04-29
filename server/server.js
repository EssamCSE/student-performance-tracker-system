import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import config from './config/config.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// POST request for user registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Create and sign JWT
    const token = jwt.sign(
      { userId: result.insertId, email },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: {
        id: result.insertId,
        name,
        email
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST request for user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Get user from database
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create and sign JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// GET all students
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const [students] = await pool.execute('SELECT * FROM students');
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});



// POST new student
app.post('/api/students', authenticateToken, async (req, res) => {
  const { id, name, program, year, email, phone } = req.body;

  // Validate required fields
  if (!id || !name || !program || !year || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if student ID already exists
    const [existingStudent] = await pool.execute('SELECT id FROM students WHERE id = ?', [id]);
    if (existingStudent.length > 0) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }

    // Check if email already exists
    const [existingEmail] = await pool.execute('SELECT email FROM students WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Convert year to integer
    const yearInt = parseInt(year, 10);
    if (isNaN(yearInt)) {
      return res.status(400).json({ error: 'Year must be a valid number' });
    }

    const [result] = await pool.execute(
      'INSERT INTO students (id, name, program, year, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, program, yearInt, email, phone]
    );
    res.status(201).json({ message: 'Student added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error adding student:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Duplicate entry. Please check student ID and email.' });
    } else {
      res.status(500).json({ error: 'Failed to add student. Please try again.' });
    }

  }
});

// PUT update student
app.put('/api/students/:id', authenticateToken, async (req, res) => {
  const studentId = req.params.id;
  const { name, program, year, email, phone } = req.body;
  try {
    await pool.execute(
      'UPDATE students SET name = ?, program = ?, year = ?, email = ?, phone = ? WHERE id = ?',
      [name, program, year, email, phone, studentId]
    );
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE student
app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  const studentId = req.params.id;
  try {
    await pool.execute('DELETE FROM students WHERE id = ?', [studentId]);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// GET all marks
app.get('/api/marks', authenticateToken, async (req, res) => {
  try {
    const [marks] = await pool.execute('SELECT * FROM marks');
    res.json(marks);
  } catch (err) {
    console.error('Error fetching marks:', err);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// GET marks for specific student
app.get('/api/marks/:studentId', authenticateToken, async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const [marks] = await pool.execute('SELECT * FROM marks WHERE student_id = ?', [studentId]);
    res.json(marks[0] || {});
  } catch (err) {
    console.error('Error fetching student marks:', err);
    res.status(500).json({ error: 'Failed to fetch student marks' });
  }
});

// POST create/update marks
app.post('/api/marks', authenticateToken, async (req, res) => {
  const marksData = req.body;
  
  try {
    // Check if marks exist for this student
    const [existing] = await pool.execute('SELECT * FROM marks WHERE student_id = ?', [marksData.student_id]);
    
    if (existing.length > 0) {
      // Update existing marks
      await pool.execute(
        'UPDATE marks SET quiz1=?, quiz2=?, quiz3=?, midExam=?, finalExam=?, assignment1=?, assignment2=? WHERE student_id=?',
        [
          marksData.quiz1 || null,
          marksData.quiz2 || null,
          marksData.quiz3 || null,
          marksData.midExam || null,
          marksData.finalExam || null,
          marksData.assignment1 || null,
          marksData.assignment2 || null,
          marksData.student_id
        ]
      );
    } else {
      // Insert new marks
      await pool.execute(
        'INSERT INTO marks (student_id, quiz1, quiz2, quiz3, midExam, finalExam, assignment1, assignment2) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          marksData.student_id,
          marksData.quiz1 || null,
          marksData.quiz2 || null,
          marksData.quiz3 || null,
          marksData.midExam || null,
          marksData.finalExam || null,
          marksData.assignment1 || null,
          marksData.assignment2 || null
        ]
      );
    }
    
    res.json({ message: 'Marks saved successfully' });
  } catch (err) {
    console.error('Error saving marks:', err);
    res.status(500).json({ 
      error: 'Failed to save marks', 
      details: err.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
