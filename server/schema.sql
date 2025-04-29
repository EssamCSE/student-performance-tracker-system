CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  status TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 for present, 0 for absent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (student_id, date)
);

-- Add API endpoints to server.js for attendance
-- GET /api/attendance/:month - Get attendance for a specific month
-- POST /api/attendance - Save attendance records