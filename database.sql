CREATE DATABASE IF NOT EXISTS spt;
USE spt;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_attendance (student_id, date)
);

CREATE TABLE IF NOT EXISTS marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    class VARCHAR(50) NOT NULL,
    term VARCHAR(50) NOT NULL,
    quiz1 INT DEFAULT 0,
    quiz2 INT DEFAULT 0,
    quiz3 INT DEFAULT 0,
    mid_exam INT DEFAULT 0,
    final_exam INT DEFAULT 0,
    assignment1 INT DEFAULT 0,
    assignment2 INT DEFAULT 0,
    total INT DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_marks (student_id, class, term)
);
