<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Attendance;
use App\Models\FeePayment;
use App\Models\Exam;
use App\Models\Notification;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = now()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();
        $monthEnd = now()->endOfMonth()->toDateString();

        // Today's attendance stats
        $todayAttendance = Attendance::where('attendance_date', $today)->get();
        $totalStudents = Student::count();
        $presentToday = $todayAttendance->where('status', 'Present')->count();
        $attendancePercentage = $totalStudents > 0
            ? round(($presentToday / $totalStudents) * 100, 1) . '%'
            : '0%';

        // Monthly fee collection
        $monthlyCollection = FeePayment::whereBetween('payment_date', [$monthStart, $monthEnd])
            ->where('status', 'Paid')
            ->sum('amount');

        $pendingFees = FeePayment::where('status', 'Pending')->sum('amount');

        // Upcoming exams
        $upcomingExams = Exam::with('class_')
            ->where('start_date', '>=', $today)
            ->orderBy('start_date')
            ->take(5)
            ->get();

        // Unread notifications count
        $unreadNotifications = $request->user()
            ? Notification::where('user_id', $request->user()->id)->where('is_read', 0)->count()
            : 0;

        return response()->json([
            'stats' => [
                'total_students'       => $totalStudents,
                'total_teachers'       => Teacher::count(),
                'today_attendance'     => $attendancePercentage,
                'today_present'        => $presentToday,
                'today_absent'         => $todayAttendance->where('status', 'Absent')->count(),
                'monthly_collection'   => $monthlyCollection,
                'pending_fees'         => $pendingFees,
                'unread_notifications' => $unreadNotifications,
            ],
            'recent_admissions' => Student::with('user', 'studentClass')->latest()->take(5)->get(),
            'upcoming_exams'    => $upcomingExams,
            'monthly_collection_chart' => [
                'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                'data'   => $this->getMonthlyCollectionData(),
            ],
        ]);
    }

    private function getMonthlyCollectionData()
    {
        $data = [];
        for ($m = 1; $m <= 12; $m++) {
            $start = now()->month($m)->startOfMonth()->toDateString();
            $end = now()->month($m)->endOfMonth()->toDateString();
            $data[] = FeePayment::whereBetween('payment_date', [$start, $end])
                ->where('status', 'Paid')
                ->sum('amount');
        }
        return $data;
    }
}
