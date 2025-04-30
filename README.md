# 📚 Student Preformance Tracker System (SPTS) 🏫

✨ A modern web application for managing student records, attendance, and marks with a clean UI and RESTful API.

## 🚀 Features
- 👨‍🎓 Student profile management
- 📅 Attendance tracking by month
- 📊 Marks/grades management
- 📈 Dashboard with statistics
- 🔐 JWT authentication

## 🛠️ Installation

### Prerequisites
- Node.js v18+
- npm or pnpm
- MySQL database

### Backend Setup
1. Navigate to `server` folder
2. Create `.env` file (use `.env.example` as template)
3. Install dependencies:
```bash
npm install
```
4. Start server:
```bash
npm start
```

### Frontend Setup
1. Navigate to project root
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm start
```

## 🌐 API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `GET /api/attendance/:month` - Get monthly attendance
- `POST /api/attendance` - Save single attendance
- `POST /api/attendance/batch` - Save batch attendance

### Marks
- `GET /api/marks` - Get all marks
- `GET /api/marks/:studentId` - Get student marks
- `POST /api/marks` - Create/update marks

## 📦 Project Structure
```
smps2/
├── server/          # Backend code
├── src/             # Frontend code
│   ├── api/         # API services
│   ├── components/  # UI components
│   ├── pages/       # Page components
│   └── ...
├── public/          # Static assets
└── database/        # Database schema
```

## 🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss changes.

## 📄 License
EssamCSE
