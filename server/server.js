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

// ----------------- Authentication Middleware -----------------
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
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

// ----------------- User Registration -----------------
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

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

// ----------------- User Login -----------------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

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

// ----------------- Student Endpoints -----------------
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
  if (!id || !name || !program || !year || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const [existingStudent] = await pool.execute(
      'SELECT id FROM students WHERE id = ?',
      [id]
    );
    if (existingStudent.length > 0) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }

    const [existingEmail] = await pool.execute(
      'SELECT email FROM students WHERE email = ?',
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

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
    return res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    return res.status(500).json({ error: 'Failed to delete student' });
  }
});

// ----------------- Attendance Endpoints -----------------
// GET attendance for a month
app.get('/api/attendance/:month', authenticateToken, async (req, res) => {
  const month = req.params.month;
  try {
    const [attendance] = await pool.execute(
      `SELECT student_id, date, status FROM attendance WHERE DATE_FORMAT(date, '%Y-%m') = ?`,
      [month]
    );
    res.json(attendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
});

// POST (upsert) single attendance record
app.post('/api/attendance', authenticateToken, async (req, res) => {
  const { studentId, date, status } = req.body;
  try {
    await pool.execute(
      `INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?`,
      [studentId, date, status, status]
    );
    res.json({ message: 'Attendance saved successfully' });
  } catch (err) {
    console.error('Error saving attendance:', err);
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});

// POST batch attendance
app.post('/api/attendance/batch', authenticateToken, async (req, res) => {
  const { records } = req.body; // [{ studentId, date, status }, ...]
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const stmt = `INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?`;
    for (const rec of records) {
      const { studentId, date, status } = rec;
      await conn.execute(stmt, [studentId, date, status, status]);
    }
    await conn.commit();
    res.json({ message: 'Batch attendance saved successfully' });
  } catch (err) {
    await conn.rollback();
    console.error('Error saving batch attendance:', err);
    res.status(500).json({ error: 'Failed to save batch attendance' });
  } finally {
    conn.release();
  }
});

// ----------------- Marks Endpoints -----------------
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
    res.json(marks.length > 0 ? marks[0] : {});
  } catch (err) {
    console.error('Error fetching student marks:', err);
    res.status(500).json({ error: 'Failed to fetch student marks' });
  }
});

// POST create/update marks
app.post('/api/marks', authenticateToken, async (req, res) => {
  const m = req.body;
  try {
    const [existing] = await pool.execute('SELECT * FROM marks WHERE student_id = ?', [m.student_id]);
    if (existing.length > 0) {
      await pool.execute(
        `UPDATE marks SET quiz1=?, quiz2=?, quiz3=?, midExam=?, finalExam=?, assignment1=?, assignment2=? WHERE student_id=?`,
        [m.quiz1||null, m.quiz2||null, m.quiz3||null, m.midExam||null, m.finalExam||null, m.assignment1||null, m.assignment2||null, m.student_id]
      );
    } else {
      await pool.execute(
        `INSERT INTO marks (student_id, quiz1, quiz2, quiz3, midExam, finalExam, assignment1, assignment2) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [m.student_id, m.quiz1||null, m.quiz2||null, m.quiz3||null, m.midExam||null, m.finalExam||null, m.assignment1||null, m.assignment2||null]
      );
    }
    res.json({ message: 'Marks saved successfully' });
  } catch (err) {
    console.error('Error saving marks:', err);
    res.status(500).json({ error: 'Failed to save marks', details: err.message });
  }
});

// ----------------- Start Server -----------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
