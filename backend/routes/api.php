<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\FeeCategoryController;
use App\Http\Controllers\Api\FeePaymentController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\HomeworkController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\ExamResultController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\TransportController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TwoFactorController;
use App\Http\Controllers\Api\PaymentGatewayController;
use App\Http\Controllers\Api\TenantOnboardingController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\Api\SubscriptionController;
use Illuminate\Support\Facades\Route;

// ─── Public Routes ───────────────────────────────────────────
Route::get('/plans/public', [SubscriptionController::class, 'getPublicPlans']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [TenantOnboardingController::class, 'register']); // SaaS Onboarding
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// ─── Protected Routes ────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Schools
    Route::apiResource('schools', SchoolController::class);

    // SaaS Plans
    Route::apiResource('plans', PlanController::class);

    // Classes
    Route::apiResource('classes', ClassController::class);

    // Students
    Route::apiResource('students', StudentController::class);

    // Teachers
    Route::apiResource('teachers', TeacherController::class);

    // Subjects
    Route::apiResource('subjects', SubjectController::class);

    // Attendance
    Route::post('/attendance/mark', [AttendanceController::class, 'mark']);
    Route::get('/attendance/list', [AttendanceController::class, 'getAttendance']);
    Route::get('/attendance/report', [AttendanceController::class, 'report']);

    // Fees
    Route::get('/fees/categories', [FeeCategoryController::class, 'index']);
    Route::post('/fees/categories', [FeeCategoryController::class, 'store']);
    Route::put('/fees/categories/{feeCategory}', [FeeCategoryController::class, 'update']);
    Route::delete('/fees/categories/{feeCategory}', [FeeCategoryController::class, 'destroy']);
    Route::get('/fees/payments', [FeePaymentController::class, 'index']);
    Route::post('/fees/payments', [FeePaymentController::class, 'store']);
    Route::get('/fees/receipt/{feePayment}', [FeePaymentController::class, 'receipt']);

    // Timetable
    Route::apiResource('timetable', TimetableController::class)->parameters(['timetable' => 'timetable']);

    // Homework
    Route::apiResource('homework', HomeworkController::class);

    // Exams
    Route::apiResource('exams', ExamController::class);

    // Exam Results
    Route::get('/exam-results', [ExamResultController::class, 'index']);
    Route::post('/exam-results', [ExamResultController::class, 'store']);
    Route::get('/exam-results/{examResult}', [ExamResultController::class, 'show']);
    Route::delete('/exam-results/{examResult}', [ExamResultController::class, 'destroy']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // Transport
    Route::apiResource('transport', TransportController::class);

    // Library
    Route::apiResource('library', LibraryController::class);
    Route::get('/library-issues', [LibraryController::class, 'issues']);
    Route::post('/library-issues', [LibraryController::class, 'issueBook']);
    Route::patch('/library-issues/{bookIssue}/return', [LibraryController::class, 'returnBook']);

    // Chat
    Route::get('/chat/conversations', [ChatController::class, 'conversations']);
    Route::get('/chat/messages/{partnerId}', [ChatController::class, 'messages']);
    Route::post('/chat/send', [ChatController::class, 'send']);

    // Reports
    Route::get('/reports/overview', [ReportController::class, 'overviewReport']);
    Route::get('/reports/attendance', [ReportController::class, 'attendanceReport']);
    Route::get('/reports/fee-collection', [ReportController::class, 'feeCollectionReport']);
    Route::get('/reports/exam', [ReportController::class, 'examReport']);
    Route::get('/reports/student-performance', [ReportController::class, 'studentPerformanceReport']);
    Route::get('/reports/teacher', [ReportController::class, 'teacherReport']);

    // Settings
    Route::get('/settings/school', [SettingsController::class, 'getSchoolSettings']);
    Route::post('/settings/school', [SettingsController::class, 'updateSchoolSettings']);
    Route::post('/settings/profile', [SettingsController::class, 'updateProfile']);
    Route::post('/settings/change-password', [SettingsController::class, 'changePassword']);
    
    // Gateways
    Route::get('/settings/gateways', [PaymentGatewayController::class, 'index']);
    Route::post('/settings/gateways', [PaymentGatewayController::class, 'configure']);

    // 2FA
    Route::get('/2fa/setup', [TwoFactorController::class, 'setup']);
    Route::post('/2fa/enable', [TwoFactorController::class, 'enable']);
    Route::post('/2fa/disable', [TwoFactorController::class, 'disable']);

    // SaaS Subscriptions
    Route::get('/subscription/status', [SubscriptionController::class, 'getStatus']);
    Route::get('/subscription/payment-gateways', [SubscriptionController::class, 'getSaaSPaymentGateways']);
    Route::post('/subscription/checkout', [SubscriptionController::class, 'checkout']);
});
