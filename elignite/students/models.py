from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.urls import reverse


class User(AbstractUser):
    ROLE_ADMIN = 'ADM'
    ROLE_TEACHER = 'TEA'
    ROLE_STUDENT = 'STU'

    ROLE_CHOICES = (
        (ROLE_ADMIN, 'Admin'),
        (ROLE_TEACHER, 'Teacher'),
        (ROLE_STUDENT, 'Student'),
    )

    matricule = models.CharField(max_length=32, unique=True)
    role = models.CharField(max_length=3, choices=ROLE_CHOICES, default=ROLE_STUDENT)
    phone = models.CharField(max_length=30, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)

    REQUIRED_FIELDS = ['email', 'matricule']

    def __str__(self) -> str:
        return f'{self.get_full_name() or self.username} ({self.matricule})'


class SystemSetting(models.Model):
    site_name = models.CharField(max_length=120, default='ELIGNITE')
    logo = models.ImageField(upload_to='branding/', blank=True, null=True)
    matricule_prefix = models.CharField(max_length=10, default='ELI')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.site_name


class Program(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    who_is_for = models.TextField(help_text='Who this program is for')
    duration = models.CharField(max_length=60)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=150)
    instructor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='teaching_programs',
        limit_choices_to={'role': User.ROLE_TEACHER},
    )
    icon = models.ImageField(upload_to='programs/icons/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name

    def get_absolute_url(self):
        return reverse('program_detail', args=[self.pk])


class Enrollment(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_CHOICES = (
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    address = models.TextField(blank=True)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='enrollments')
    user = models.OneToOneField(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='enrollment')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    matricule = models.CharField(max_length=32, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.program.name}'


class StudentProgram(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrolled_programs', limit_choices_to={'role': User.ROLE_STUDENT})
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='student_links')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'program')

    def __str__(self):
        return f'{self.student.matricule} -> {self.program.name}'


class Exercise(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=120)
    max_score = models.PositiveIntegerField(default=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_exercises')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.program.name} - {self.name}'


class Project(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=120)
    max_score = models.PositiveIntegerField(default=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_projects')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.program.name} - {self.name}'


class ExerciseResult(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exercise_results', limit_choices_to={'role': User.ROLE_STUDENT})
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='results')
    score = models.FloatField(default=0)

    class Meta:
        unique_together = ('student', 'exercise')


class ProjectResult(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_results', limit_choices_to={'role': User.ROLE_STUDENT})
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='results')
    score = models.FloatField(default=0)

    class Meta:
        unique_together = ('student', 'project')


class Attendance(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance', limit_choices_to={'role': User.ROLE_STUDENT})
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    present = models.BooleanField(default=True)
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='marked_attendance')

    class Meta:
        unique_together = ('student', 'program', 'date')
        ordering = ['-date']


class Payment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments', limit_choices_to={'role': User.ROLE_STUDENT})
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(blank=True, null=True)
    notes = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ['-id']


class Testimonial(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='testimonials', limit_choices_to={'role': User.ROLE_STUDENT})
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='testimonials')
    text = models.TextField()
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class SiteContent(models.Model):
    about_vision_text = models.TextField(blank=True)
    about_vision_image = models.ImageField(upload_to='about/', blank=True, null=True)
    about_mission_text = models.TextField(blank=True)
    about_mission_image = models.ImageField(upload_to='about/', blank=True, null=True)
    services_text = models.TextField(blank=True)

    def __str__(self):
        return 'Site Content'


class AIAssistantKnowledge(models.Model):
    ROLE_ALL = 'ALL'
    ROLE_ADMIN = User.ROLE_ADMIN
    ROLE_TEACHER = User.ROLE_TEACHER
    ROLE_STUDENT = User.ROLE_STUDENT

    ROLE_CHOICES = (
        (ROLE_ALL, 'All Users'),
        (ROLE_ADMIN, 'Admin'),
        (ROLE_TEACHER, 'Teacher'),
        (ROLE_STUDENT, 'Student'),
    )

    title = models.CharField(max_length=120)
    question = models.CharField(max_length=255)
    keywords = models.CharField(
        max_length=255,
        help_text='Comma-separated words used by the local assistant to match requests.',
    )
    answer = models.TextField(help_text='Detailed local answer stored in DB (no API key required).')
    role_target = models.CharField(max_length=3, choices=ROLE_CHOICES, default=ROLE_ALL)
    priority = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-priority', 'title']
        verbose_name = 'AI Assistant Knowledge'
        verbose_name_plural = 'AI Assistant Knowledge'

    def __str__(self):
        return f'{self.title} ({self.role_target})'
