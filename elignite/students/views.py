from io import BytesIO

from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.views import LoginView
from django.db.models import Count, Q
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy
from django.views.generic import CreateView, DetailView, ListView

from .forms import (
    AIAssistantQueryForm,
    AttendanceForm,
    EnrollmentForm,
    ExerciseForm,
    MatriculeLoginForm,
    ProjectForm,
    TestimonialForm,
)
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
from .services import answer_with_local_knowledge

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
except Exception:  # pragma: no cover
    canvas = None
    A4 = None


def is_admin(user):
    return user.is_authenticated and user.role == User.ROLE_ADMIN


def is_teacher(user):
    return user.is_authenticated and user.role == User.ROLE_TEACHER and user.is_approved


def is_student(user):
    return user.is_authenticated and user.role == User.ROLE_STUDENT and user.is_approved


class MatriculeLoginView(LoginView):
    form_class = MatriculeLoginForm
    template_name = 'auth/login.html'


def home(request):
    programs = Program.objects.all()[:6]
    testimonials = Testimonial.objects.filter(approved=True).select_related('user', 'program')[:8]
    return render(request, 'home.html', {'programs': programs, 'testimonials': testimonials})


def role_redirect(request):
    if request.user.role == User.ROLE_STUDENT:
        return redirect('student_dashboard')
    if request.user.role == User.ROLE_TEACHER:
        return redirect('teacher_dashboard')
    return redirect('admin:index')


class ProgramListView(ListView):
    model = Program
    template_name = 'programs/list.html'
    context_object_name = 'programs'


class ProgramDetailView(DetailView):
    model = Program
    template_name = 'programs/detail.html'
    context_object_name = 'program'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        program = self.object
        context['student_count'] = StudentProgram.objects.filter(program=program).count()
        context['testimonials'] = program.testimonials.filter(approved=True).select_related('user')
        return context


class EnrollmentCreateView(CreateView):
    model = Enrollment
    form_class = EnrollmentForm
    template_name = 'forms/enrollment_form.html'
    success_url = reverse_lazy('enrollment_success')


def enrollment_success(request):
    return render(request, 'success/enrollment_success.html')


@login_required
@user_passes_test(is_admin)
def admin_enrollment_approval(request, pk):
    enrollment = get_object_or_404(Enrollment, pk=pk)
    action = request.POST.get('action')

    if action == 'approve':
        enrollment.status = Enrollment.STATUS_APPROVED
        if not enrollment.user:
            generated_matricule = generate_matricule(User.ROLE_STUDENT)
            user = User.objects.create_user(
                username=generated_matricule,
                matricule=generated_matricule,
                first_name=enrollment.first_name,
                last_name=enrollment.last_name,
                email=enrollment.email,
                role=User.ROLE_STUDENT,
                is_approved=True,
                is_active=True,
                password=User.objects.make_random_password(),
            )
            enrollment.user = user
            enrollment.matricule = generated_matricule
            StudentProgram.objects.get_or_create(student=user, program=enrollment.program)
        enrollment.save()
        messages.success(request, 'Enrollment approved.')
    elif action == 'reject':
        enrollment.status = Enrollment.STATUS_REJECTED
        enrollment.save()
        messages.info(request, 'Enrollment rejected.')

    return redirect('admin:index')


def generate_matricule(role: str) -> str:
    prefix = SystemSetting.objects.first().matricule_prefix if SystemSetting.objects.exists() else 'ELI'
    serial = User.objects.filter(role=role).count() + 1
    return f'{prefix}-{role}-{serial:04d}'


@login_required
@user_passes_test(is_student)
def student_dashboard(request):
    student = request.user
    student_program_ids = student.enrolled_programs.values_list('program_id', flat=True)
    context = {
        'programs': Program.objects.filter(id__in=student_program_ids),
        'attendance': Attendance.objects.filter(student=student).select_related('program')[:10],
        'exercise_results': ExerciseResult.objects.filter(student=student).select_related('exercise__program'),
        'project_results': ProjectResult.objects.filter(student=student).select_related('project__program'),
        'payments': Payment.objects.filter(student=student).select_related('program'),
        'testimonial_form': TestimonialForm(),
    }
    return render(request, 'dashboard/student_dashboard.html', context)


@login_required
@user_passes_test(is_teacher)
def teacher_dashboard(request):
    teacher = request.user
    assigned = Program.objects.filter(instructor=teacher)
    context = {
        'assigned_programs': assigned,
        'exercise_form': ExerciseForm(),
        'project_form': ProjectForm(),
        'attendance_form': AttendanceForm(),
        'student_performance': ExerciseResult.objects.filter(exercise__program__in=assigned)
        .select_related('student', 'exercise__program')
        .order_by('student__last_name')[:40],
    }
    return render(request, 'dashboard/teacher_dashboard.html', context)


@login_required
@user_passes_test(is_teacher)
def create_exercise(request):
    form = ExerciseForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        exercise = form.save(commit=False)
        exercise.created_by = request.user
        exercise.save()
        messages.success(request, 'Exercise created.')
    return redirect('teacher_dashboard')


@login_required
@user_passes_test(is_teacher)
def create_project(request):
    form = ProjectForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        project = form.save(commit=False)
        project.created_by = request.user
        project.save()
        messages.success(request, 'Project created.')
    return redirect('teacher_dashboard')


@login_required
@user_passes_test(is_teacher)
def mark_attendance(request):
    form = AttendanceForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        attendance = form.save(commit=False)
        attendance.marked_by = request.user
        attendance.save()
        messages.success(request, 'Attendance saved.')
    return redirect('teacher_dashboard')


@login_required
@user_passes_test(is_student)
def submit_testimonial(request):
    form = TestimonialForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        testimonial = form.save(commit=False)
        testimonial.user = request.user
        testimonial.save()
        messages.success(request, 'Testimonial submitted for review.')
    return redirect('student_dashboard')


def services_page(request):
    content = SiteContent.objects.first()
    return render(request, 'services/services.html', {'content': content})


def about_page(request):
    content = SiteContent.objects.first()
    teachers = User.objects.filter(role=User.ROLE_TEACHER, is_approved=True)
    return render(request, 'services/about.html', {'content': content, 'teachers': teachers})


@login_required
def enrollment_pdf(request, pk):
    enrollment = get_object_or_404(Enrollment, pk=pk)
    if not request.user.is_staff and request.user != enrollment.user:
        raise Http404('Not allowed')

    if canvas is None:
        messages.error(request, 'Install reportlab to generate PDFs.')
        return redirect('home')

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    p.setFont('Helvetica-Bold', 18)
    p.drawCentredString(width / 2, height - 70, 'ELIGNITE Enrollment Confirmation')
    p.setFont('Helvetica', 12)
    p.drawString(80, height - 120, f'Name: {enrollment.first_name} {enrollment.last_name}')
    p.drawString(80, height - 145, f'Email: {enrollment.email}')
    p.drawString(80, height - 170, f'Program: {enrollment.program.name}')
    p.drawString(80, height - 195, f'Status: {enrollment.status.title()}')

    if enrollment.status == Enrollment.STATUS_APPROVED and enrollment.matricule:
        p.drawString(80, height - 220, f'Matricule: {enrollment.matricule}')

    p.drawString(80, height - 280, 'CEO Signature: Nsame Rene Tamjong')
    p.showPage()
    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=f'enrollment-{enrollment.id}.pdf')


def attendance_stats(request):
    stats = Attendance.objects.values('program__name').annotate(
        present_count=Count('id', filter=Q(present=True)),
        absent_count=Count('id', filter=Q(present=False)),
    )
    return render(request, 'dashboard/attendance_stats.html', {'stats': stats})


@login_required
def ai_assistant(request):
    form = AIAssistantQueryForm(request.POST or None)
    response_text = ''
    matched_entries = []

    if request.method == 'POST' and form.is_valid():
        user_query = form.cleaned_data['query']
        assistant_response = answer_with_local_knowledge(user_query, request.user)
        response_text = assistant_response.answer
        matched_entries = assistant_response.matches

    knowledge_count = AIAssistantKnowledge.objects.filter(is_active=True).count()
    context = {
        'form': form,
        'response_text': response_text,
        'matched_entries': matched_entries,
        'knowledge_count': knowledge_count,
    }
    return render(request, 'dashboard/ai_assistant.html', context)
