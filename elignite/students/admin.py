from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
    AIAssistantKnowledge,
    Attendance,
    Enrollment,
    Exercise,
    ExerciseResult,
    Payment,
    Program,
    Project,
    ProjectResult,
    SiteContent,
    StudentProgram,
    SystemSetting,
    Testimonial,
    User,
)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('ELIGNITE', {'fields': ('matricule', 'role', 'phone', 'profile_image', 'is_approved')}),
    )
    list_display = ('username', 'matricule', 'role', 'is_approved', 'is_staff')
    search_fields = ('username', 'matricule', 'email')


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'instructor', 'duration', 'price', 'location')
    search_fields = ('name', 'location')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'program', 'status', 'matricule', 'created_at')
    list_filter = ('status', 'program')


@admin.register(AIAssistantKnowledge)
class AIAssistantKnowledgeAdmin(admin.ModelAdmin):
    list_display = ('title', 'role_target', 'priority', 'is_active', 'updated_at')
    list_filter = ('role_target', 'is_active')
    search_fields = ('title', 'question', 'keywords', 'answer')


admin.site.register([SystemSetting, StudentProgram, Exercise, Project, ExerciseResult, ProjectResult, Attendance, Payment, Testimonial, SiteContent])
