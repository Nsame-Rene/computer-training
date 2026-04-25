from django.contrib.auth.views import LogoutView
from django.urls import path

from .views import (
    EnrollmentCreateView,
    MatriculeLoginView,
    ProgramDetailView,
    ProgramListView,
    about_page,
    attendance_stats,
    create_exercise,
    create_project,
    enrollment_pdf,
    enrollment_success,
    home,
    mark_attendance,
    role_redirect,
    services_page,
    student_dashboard,
    submit_testimonial,
    teacher_dashboard,
)

urlpatterns = [
    path('', home, name='home'),
    path('login/', MatriculeLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('redirect/', role_redirect, name='role_redirect'),
    path('programs/', ProgramListView.as_view(), name='program_list'),
    path('programs/<int:pk>/', ProgramDetailView.as_view(), name='program_detail'),
    path('enroll/', EnrollmentCreateView.as_view(), name='enroll'),
    path('enroll/success/', enrollment_success, name='enrollment_success'),
    path('enroll/<int:pk>/pdf/', enrollment_pdf, name='enrollment_pdf'),
    path('dashboard/student/', student_dashboard, name='student_dashboard'),
    path('dashboard/teacher/', teacher_dashboard, name='teacher_dashboard'),
    path('dashboard/teacher/exercises/create/', create_exercise, name='create_exercise'),
    path('dashboard/teacher/projects/create/', create_project, name='create_project'),
    path('dashboard/teacher/attendance/create/', mark_attendance, name='mark_attendance'),
    path('dashboard/student/testimonial/', submit_testimonial, name='submit_testimonial'),
    path('dashboard/attendance-stats/', attendance_stats, name='attendance_stats'),
    path('services/', services_page, name='services'),
    path('about/', about_page, name='about'),
]
