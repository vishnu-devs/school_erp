<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Student Management
            'students.view', 'students.create', 'students.edit', 'students.delete',
            // Teacher Management
            'teachers.view', 'teachers.create', 'teachers.edit', 'teachers.delete',
            // Attendance
            'attendance.view', 'attendance.mark', 'attendance.report',
            // Fees
            'fees.view', 'fees.collect', 'fees.report',
            // Timetable
            'timetable.view', 'timetable.create', 'timetable.edit',
            // Homework
            'homework.view', 'homework.create', 'homework.edit', 'homework.delete',
            // Exams
            'exams.view', 'exams.create', 'exams.edit', 'exams.delete',
            'results.view', 'results.create', 'results.edit',
            // Notifications
            'notifications.view', 'notifications.send',
            // Transport
            'transport.view', 'transport.create', 'transport.edit', 'transport.delete',
            // Library
            'library.view', 'library.create', 'library.edit', 'library.delete',
            'library.issue', 'library.return',
            // Reports
            'reports.view', 'reports.export',
            // Chat
            'chat.view', 'chat.send',
            // Settings
            'settings.view', 'settings.edit',
            // Schools (Super Admin)
            'schools.view', 'schools.create', 'schools.edit', 'schools.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Assign all permissions to Super Admin
        $superAdmin = Role::findByName('Super Admin');
        $superAdmin->givePermissionTo(Permission::all());

        // School Admin permissions
        $schoolAdmin = Role::findByName('School Admin');
        $schoolAdmin->givePermissionTo([
            'students.view', 'students.create', 'students.edit', 'students.delete',
            'teachers.view', 'teachers.create', 'teachers.edit', 'teachers.delete',
            'attendance.view', 'attendance.mark', 'attendance.report',
            'fees.view', 'fees.collect', 'fees.report',
            'timetable.view', 'timetable.create', 'timetable.edit',
            'homework.view', 'homework.create', 'homework.edit', 'homework.delete',
            'exams.view', 'exams.create', 'exams.edit', 'exams.delete',
            'results.view', 'results.create', 'results.edit',
            'notifications.view', 'notifications.send',
            'transport.view', 'transport.create', 'transport.edit', 'transport.delete',
            'library.view', 'library.create', 'library.edit', 'library.delete',
            'library.issue', 'library.return',
            'reports.view', 'reports.export',
            'chat.view', 'chat.send',
            'settings.view', 'settings.edit',
        ]);

        // Teacher permissions
        $teacher = Role::findByName('Teacher');
        $teacher->givePermissionTo([
            'students.view',
            'attendance.view', 'attendance.mark',
            'timetable.view',
            'homework.view', 'homework.create', 'homework.edit', 'homework.delete',
            'exams.view', 'results.view', 'results.create', 'results.edit',
            'notifications.view',
            'chat.view', 'chat.send',
        ]);

        // Accountant permissions
        $accountant = Role::findByName('Accountant');
        $accountant->givePermissionTo([
            'fees.view', 'fees.collect', 'fees.report',
            'reports.view',
            'notifications.view',
        ]);

        // Parent permissions
        $parent = Role::findByName('Parent');
        $parent->givePermissionTo([
            'students.view',
            'attendance.view',
            'fees.view',
            'homework.view',
            'results.view',
            'timetable.view',
            'notifications.view',
            'chat.view', 'chat.send',
        ]);

        // Student permissions
        $student = Role::findByName('Student');
        $student->givePermissionTo([
            'attendance.view',
            'homework.view',
            'timetable.view',
            'results.view',
            'notifications.view',
        ]);

        // Librarian permissions
        $librarian = Role::findByName('Librarian');
        $librarian->givePermissionTo([
            'library.view', 'library.create', 'library.edit', 'library.delete',
            'library.issue', 'library.return',
            'notifications.view',
        ]);

        // Transport Manager permissions
        $transportManager = Role::findByName('Transport Manager');
        $transportManager->givePermissionTo([
            'transport.view', 'transport.create', 'transport.edit', 'transport.delete',
            'notifications.view',
        ]);

        // Receptionist permissions
        $receptionist = Role::findByName('Receptionist');
        $receptionist->givePermissionTo([
            'students.view', 'students.create',
            'notifications.view',
            'chat.view', 'chat.send',
        ]);

        // Principal permissions (same as School Admin minus settings)
        $principal = Role::findByName('Principal');
        $principal->givePermissionTo([
            'students.view', 'students.create', 'students.edit',
            'teachers.view',
            'attendance.view', 'attendance.report',
            'fees.view', 'fees.report',
            'timetable.view',
            'homework.view',
            'exams.view',
            'results.view',
            'notifications.view', 'notifications.send',
            'transport.view',
            'library.view',
            'reports.view', 'reports.export',
            'chat.view', 'chat.send',
        ]);
    }
}
