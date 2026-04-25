from django import forms
from django.contrib.auth.forms import AuthenticationForm

from .models import AIAssistantKnowledge, Attendance, Enrollment, Exercise, Payment, Program, Project, Testimonial, User


class MatriculeLoginForm(AuthenticationForm):
    username = forms.CharField(label='Matricule')


class EnrollmentForm(forms.ModelForm):
    class Meta:
        model = Enrollment
        fields = ['first_name', 'last_name', 'email', 'phone', 'address', 'program']


class ProgramForm(forms.ModelForm):
    class Meta:
        model = Program
        fields = ['name', 'description', 'who_is_for', 'duration', 'price', 'location', 'instructor', 'icon']


class ExerciseForm(forms.ModelForm):
    class Meta:
        model = Exercise
        fields = ['program', 'name', 'max_score']


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['program', 'name', 'max_score']


class AttendanceForm(forms.ModelForm):
    class Meta:
        model = Attendance
        fields = ['student', 'program', 'date', 'present']


class PaymentForm(forms.ModelForm):
    class Meta:
        model = Payment
        fields = ['student', 'program', 'amount', 'paid', 'paid_at', 'notes']


class TestimonialForm(forms.ModelForm):
    class Meta:
        model = Testimonial
        fields = ['program', 'text', 'rating']


class UserApprovalForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['is_approved', 'is_active', 'role']


class AIAssistantQueryForm(forms.Form):
    query = forms.CharField(
        label='Ask ELIGNITE Assistant',
        widget=forms.Textarea(attrs={'rows': 4, 'placeholder': 'Example: How do I submit testimonials?'}),
    )


class AIAssistantKnowledgeForm(forms.ModelForm):
    class Meta:
        model = AIAssistantKnowledge
        fields = ['title', 'question', 'keywords', 'answer', 'role_target', 'priority', 'is_active']
