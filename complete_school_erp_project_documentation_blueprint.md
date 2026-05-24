# Smart School ERP – Complete Project Documentation

# 1. Project Overview

## Project Name
Schoolites Smart School ERP

## Project Type
Multi-Platform School Management System

## Platforms
- Web Admin Panel
- Teacher Dashboard
- Parent Dashboard
- Student Dashboard
- Mobile App
- REST API Backend

---

# 2. Technology Stack

| Module | Technology |
|---|---|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Backend | Laravel 11 |
| Authentication | Laravel Sanctum / JWT |
| Database | MySQL / MariaDB |
| Mobile App | React Native |
| Notifications | Firebase FCM |
| File Storage | Local Storage / Cloudinary |
| Hosting | LiteSpeed Shared Hosting |
| CDN | Cloudflare |
| Payment Gateway | Razorpay |
| Charts | ApexCharts |
| State Management | Redux Toolkit |
| API Client | Axios |

---

# 3. Project Architecture

```txt
React Frontend
        ↓
Laravel REST API
        ↓
MySQL Database
        ↓
Firebase Notifications
```

---

# 4. User Roles

## Main Roles

1. Super Admin
2. School Admin
3. Principal
4. Teacher
5. Accountant
6. Student
7. Parent
8. Librarian
9. Transport Manager
10. Receptionist

---

# 5. Role Permissions

# Super Admin Permissions
- Manage all schools
- Manage subscriptions
- Create school admins
- Full access
- System settings
- Analytics

# School Admin Permissions
- Manage teachers
- Manage students
- Fees management
- Attendance management
- Timetable management
- Notification management
- Reports

# Teacher Permissions
- Attendance marking
- Homework upload
- Exam marks upload
- Student performance
- View timetable

# Parent Permissions
- View child attendance
- View fees
- Receive notifications
- Download report card
- Chat with teacher

# Student Permissions
- View homework
- View timetable
- View attendance
- View results

# Accountant Permissions
- Fee collection
- Expense entries
- Salary management
- Receipt generation

---

# 6. Main Modules

1. Authentication
2. Student Management
3. Teacher Management
4. Attendance
5. Fees Management
6. Timetable
7. Homework
8. Exams & Results
9. Notifications
10. Transport
11. Library
12. Reports
13. Settings
14. Mobile App APIs
15. Chat System
16. AI Automation

---

# 7. Database Design

# DATABASE NAME
school_erp

---

# 8. Tables Documentation

# users Table

| Column | Type |
|---|---|
| id | bigint |
| school_id | bigint |
| role_id | bigint |
| name | varchar(255) |
| email | varchar(255) |
| phone | varchar(20) |
| password | varchar(255) |
| profile_image | text |
| gender | enum |
| dob | date |
| address | text |
| status | tinyint |
| last_login | timestamp |
| created_at | timestamp |
| updated_at | timestamp |

---

# roles Table

| Column | Type |
|---|---|
| id | bigint |
| role_name | varchar(100) |
| created_at | timestamp |
| updated_at | timestamp |

---

# permissions Table

| Column | Type |
|---|---|
| id | bigint |
| permission_name | varchar(255) |
| module | varchar(100) |
| created_at | timestamp |

---

# role_permissions Table

| Column | Type |
|---|---|
| id | bigint |
| role_id | bigint |
| permission_id | bigint |

---

# schools Table

| Column | Type |
|---|---|
| id | bigint |
| school_name | varchar(255) |
| logo | text |
| email | varchar(255) |
| phone | varchar(20) |
| address | text |
| city | varchar(100) |
| state | varchar(100) |
| country | varchar(100) |
| pincode | varchar(20) |
| timezone | varchar(50) |
| subscription_plan | varchar(50) |
| subscription_expiry | date |
| status | tinyint |
| created_at | timestamp |

---

# classes Table

| Column | Type |
|---|---|
| id | bigint |
| school_id | bigint |
| class_name | varchar(100) |
| section | varchar(10) |
| class_teacher_id | bigint |
| created_at | timestamp |

---

# students Table

| Column | Type |
|---|---|
| id | bigint |
| user_id | bigint |
| admission_no | varchar(100) |
| class_id | bigint |
| roll_number | varchar(50) |
| father_name | varchar(255) |
| mother_name | varchar(255) |
| parent_phone | varchar(20) |
| blood_group | varchar(10) |
| religion | varchar(100) |
| category | varchar(100) |
| transport_route_id | bigint |
| admission_date | date |
| created_at | timestamp |

---

# teachers Table

| Column | Type |
|---|---|
| id | bigint |
| user_id | bigint |
| employee_id | varchar(100) |
| qualification | varchar(255) |
| experience | varchar(50) |
| salary | decimal |
| joining_date | date |
| created_at | timestamp |

---

# attendance Table

| Column | Type |
|---|---|
| id | bigint |
| student_id | bigint |
| class_id | bigint |
| attendance_date | date |
| status | enum(Present,Absent,Leave) |
| remarks | text |
| created_by | bigint |
| created_at | timestamp |

---

# fee_categories Table

| Column | Type |
|---|---|
| id | bigint |
| category_name | varchar(255) |
| amount | decimal |
| frequency | enum(Monthly,Yearly) |
| created_at | timestamp |

---

# fee_payments Table

| Column | Type |
|---|---|
| id | bigint |
| student_id | bigint |
| fee_category_id | bigint |
| amount | decimal |
| payment_method | varchar(50) |
| transaction_id | varchar(255) |
| payment_date | date |
| receipt_no | varchar(100) |
| status | enum(Paid,Pending,Failed) |
| created_at | timestamp |

---

# subjects Table

| Column | Type |
|---|---|
| id | bigint |
| class_id | bigint |
| subject_name | varchar(255) |
| subject_code | varchar(100) |
| teacher_id | bigint |
| created_at | timestamp |

---

# timetable Table

| Column | Type |
|---|---|
| id | bigint |
| class_id | bigint |
| subject_id | bigint |
| teacher_id | bigint |
| day | varchar(20) |
| start_time | time |
| end_time | time |
| room_number | varchar(50) |
| created_at | timestamp |

---

# homework Table

| Column | Type |
|---|---|
| id | bigint |
| class_id | bigint |
| subject_id | bigint |
| teacher_id | bigint |
| title | varchar(255) |
| description | text |
| attachment | text |
| due_date | date |
| created_at | timestamp |

---

# exams Table

| Column | Type |
|---|---|
| id | bigint |
| exam_name | varchar(255) |
| class_id | bigint |
| start_date | date |
| end_date | date |
| created_at | timestamp |

---

# exam_results Table

| Column | Type |
|---|---|
| id | bigint |
| exam_id | bigint |
| student_id | bigint |
| subject_id | bigint |
| marks | decimal |
| grade | varchar(10) |
| remarks | text |
| created_at | timestamp |

---

# notifications Table

| Column | Type |
|---|---|
| id | bigint |
| title | varchar(255) |
| message | text |
| user_id | bigint |
| type | varchar(50) |
| is_read | tinyint |
| created_at | timestamp |

---

# chat_messages Table

| Column | Type |
|---|---|
| id | bigint |
| sender_id | bigint |
| receiver_id | bigint |
| message | text |
| attachment | text |
| created_at | timestamp |

---

# transport_routes Table

| Column | Type |
|---|---|
| id | bigint |
| route_name | varchar(255) |
| vehicle_number | varchar(100) |
| driver_name | varchar(255) |
| driver_phone | varchar(20) |
| pickup_points | text |
| created_at | timestamp |

---

# library_books Table

| Column | Type |
|---|---|
| id | bigint |
| book_name | varchar(255) |
| author | varchar(255) |
| quantity | int |
| available_quantity | int |
| created_at | timestamp |

---

# book_issues Table

| Column | Type |
|---|---|
| id | bigint |
| book_id | bigint |
| student_id | bigint |
| issue_date | date |
| return_date | date |
| fine | decimal |
| status | varchar(50) |

---

# 9. Authentication System

## Login Methods
- Email Login
- Phone Login
- OTP Login
- Parent Login
- Student Login

## Security
- JWT/Sanctum Tokens
- Password Hashing
- API Rate Limiting
- Role Middleware
- CORS Protection

---

# 10. API Structure

# Auth APIs

| API | Method |
|---|---|
| /api/login | POST |
| /api/register | POST |
| /api/logout | POST |
| /api/forgot-password | POST |

---

# Student APIs

| API | Method |
|---|---|
| /api/students | GET |
| /api/students/store | POST |
| /api/students/update | POST |
| /api/students/delete | DELETE |

---

# Attendance APIs

| API | Method |
|---|---|
| /api/attendance/mark | POST |
| /api/attendance/list | GET |
| /api/attendance/report | GET |

---

# Fees APIs

| API | Method |
|---|---|
| /api/fees/pay | POST |
| /api/fees/history | GET |
| /api/fees/receipt | GET |

---

# 11. React Frontend Pages

# Public Pages
- Home
- About
- Features
- Pricing
- Contact
- Login

# Dashboard Pages
- Dashboard
- Students
- Teachers
- Attendance
- Fees
- Timetable
- Homework
- Notifications
- Reports
- Settings

---

# 12. Mobile App Screens

1. Splash Screen
2. Login Screen
3. Dashboard
4. Attendance
5. Homework
6. Timetable
7. Notifications
8. Profile
9. Fees Payment
10. Results

---

# 13. Notification System

## Notification Types
- Attendance Alert
- Fee Reminder
- Homework Alert
- Result Published
- Emergency Notification

## Delivery Channels
- Push Notification
- Email
- SMS
- WhatsApp

---

# 14. AI Features

## AI Automation Ideas
- Auto Attendance Analytics
- Student Performance Prediction
- Fee Defaulter Prediction
- Auto Timetable Suggestions
- AI Chatbot

---

# 15. Reports Module

## Reports
- Attendance Report
- Fee Collection Report
- Salary Report
- Exam Report
- Student Performance Report
- Teacher Report

---

# 16. Admin Dashboard Widgets

- Total Students
- Total Teachers
- Today Attendance
- Monthly Fees Collection
- Pending Fees
- Notifications
- Upcoming Exams
- Recent Admissions

---

# 17. Payment Gateway Integration

## Razorpay Integration

Features:
- Online Payment
- Receipt Generation
- Transaction History
- Failed Payment Retry

---

# 18. File Upload System

## Upload Types
- Student Photos
- Homework Files
- PDF Reports
- Certificates
- Teacher Documents

## Validation
- Max Size: 5MB
- Allowed Types:
  - jpg
  - png
  - pdf
  - docx

---

# 19. Performance Optimization

## Laravel Optimization

```bash
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## React Optimization
- Lazy Loading
- Code Splitting
- Image Compression
- CDN Assets

---

# 20. Deployment Structure

# Frontend

```txt
public_html/
```

# Backend

```txt
api.example.com
```

# Database

```txt
MySQL
```

---

# 21. cPanel Deployment Steps

## Backend Deployment

1. Upload Laravel ZIP
2. Extract Files
3. Configure .env
4. Create Database
5. Run Migration
6. Link Storage
7. Set Permissions
8. Setup Cron Jobs

---

# 22. Laravel Folder Structure

```txt
app/
routes/
config/
public/
storage/
resources/
```

---

# 23. React Folder Structure

```txt
src/
components/
pages/
layouts/
services/
redux/
routes/
assets/
```

---

# 24. Mobile App Folder Structure

```txt
src/
screens/
components/
api/
redux/
navigation/
assets/
```

---

# 25. Cron Jobs

## Required Cron

```bash
php artisan schedule:run
```

## Used For
- Notifications
- Fee Reminders
- Auto Backups
- Daily Reports

---

# 26. Backup System

## Backup Frequency
- Daily Database Backup
- Weekly Full Backup

## Backup Storage
- Google Drive
- Dropbox
- AWS S3

---

# 27. Security Features

- CSRF Protection
- XSS Protection
- SQL Injection Prevention
- Password Encryption
- Activity Logs
- Login Attempt Limiting

---

# 28. Activity Logs Table

| Column | Type |
|---|---|
| id | bigint |
| user_id | bigint |
| action | varchar(255) |
| ip_address | varchar(100) |
| user_agent | text |
| created_at | timestamp |

---

# 29. SaaS Multi School System

## Features
- Multiple Schools
- Separate School Databases
- Subscription Plans
- School Wise Admin

---

# 30. Subscription Plans

## Basic
- 500 Students
- Basic Modules

## Pro
- Unlimited Students
- Mobile App
- Advanced Reports

## Enterprise
- AI Features
- Custom Branding
- Priority Support

---

# 31. Future Features

- Live Classes
- Video Lectures
- AI Report Cards
- Face Attendance
- Biometric Integration
- GPS Bus Tracking
- WhatsApp Bot

---

# 32. Recommended Development Order

## Phase 1
- Authentication
- User Roles
- Student Module
- Teacher Module

## Phase 2
- Attendance
- Fees
- Timetable
- Homework

## Phase 3
- Exams
- Notifications
- Reports
- Mobile App

## Phase 4
- AI Features
- SaaS Features
- Payment Gateway

---

# 33. Estimated Development Time

| Module | Time |
|---|---|
| Backend APIs | 30 Days |
| React Frontend | 20 Days |
| Mobile App | 25 Days |
| Testing | 10 Days |
| Deployment | 5 Days |

---

# 34. Recommended Packages

## Laravel Packages
- spatie/permission
- laravel/sanctum
- intervention/image
- maatwebsite/excel

## React Packages
- axios
- react-router-dom
- redux-toolkit
- react-hook-form
- apexcharts

---

# 35. Final Production Structure

```txt
Frontend:
example.com

Backend API:
api.example.com

Admin Panel:
admin.example.com

Mobile App:
Android + iOS
```

---

# 36. Final Notes

- Use LiteSpeed shared hosting initially.
- Use Cloudflare CDN.
- Keep images optimized.
- Use queue workers for notifications.
- Store large media externally.
- Upgrade to VPS after traffic growth.
- Maintain daily backups.
- Use HTTPS everywhere.

