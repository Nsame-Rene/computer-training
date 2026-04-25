from django.core.management.base import BaseCommand

from students.models import AIAssistantKnowledge


KNOWLEDGE_DATA = [
    {
        'title': 'Student Login Guide',
        'question': 'How does a student log in with matricule?',
        'keywords': 'student login matricule password account approved activation',
        'answer': (
            'Students must log in with the matricule assigned after enrollment approval. '
            'Use the login form and enter matricule in the username field plus your password. '
            'If access is blocked, verify account approval status with admin first because only approved students can use dashboards. '
            'After login, the platform redirects to the Student Dashboard where attendance, scores, projects, payments, and testimonials are managed.'
        ),
        'role_target': 'STU',
        'priority': 10,
    },
    {
        'title': 'Teacher Workflow',
        'question': 'How can teachers use ELIGNITE daily?',
        'keywords': 'teacher dashboard exercises projects attendance students performance',
        'answer': (
            'Teachers open the Teacher Dashboard to manage assigned programs. '
            'From there, they create exercises, create projects, and submit attendance records by student, program, and date. '
            'The dashboard also displays student performance snapshots so instructors can detect weak performance early and schedule interventions. '
            'A good daily routine is: review assigned programs, add assessments, mark attendance, then verify score completeness.'
        ),
        'role_target': 'TEA',
        'priority': 10,
    },
    {
        'title': 'Enrollment Approval',
        'question': 'How does enrollment approval and matricule generation work?',
        'keywords': 'enrollment approval matricule admin pending approved rejected prefix role',
        'answer': (
            'Public users submit enrollment forms from the Enroll page. '
            'Admin reviews each application and approves or rejects it. '
            'When approved, the system creates a student account and generates matricule in PREFIX-ROLE-XXXX format, such as ELI-STU-0001. '
            'Only approved users receive active access to protected dashboards. '
            'Admins should verify program assignment during approval to keep analytics accurate.'
        ),
        'role_target': 'ADM',
        'priority': 9,
    },
    {
        'title': 'Attendance Tracking',
        'question': 'How do I manage attendance and attendance statistics?',
        'keywords': 'attendance present absent mark stats program filter teacher student',
        'answer': (
            'Attendance is created by teachers using present or absent values for each student and program date. '
            'The attendance statistics page summarizes present versus absent counts grouped by program. '
            'Students can view their attendance history in their dashboard to understand consistency and punctuality trends. '
            'For data quality, teachers should avoid duplicate records for the same student, program, and day.'
        ),
        'role_target': 'ALL',
        'priority': 8,
    },
    {
        'title': 'Payments Management',
        'question': 'How do payments and paid/unpaid statuses work?',
        'keywords': 'payment fees paid unpaid student program finance',
        'answer': (
            'Payments are linked directly to both student and program. '
            'Each payment record stores amount, paid flag, optional payment timestamp, and notes for reconciliation. '
            'Students can see paid and unpaid items in their dashboard, while admins can monitor overall financial status in the back office. '
            'Maintain consistent notes for installment plans, partial settlements, and manual transfer references.'
        ),
        'role_target': 'ALL',
        'priority': 8,
    },
    {
        'title': 'Testimonials',
        'question': 'How do students submit testimonials?',
        'keywords': 'testimonial rating review student program home page',
        'answer': (
            'Students submit testimonials from the Student Dashboard using program, feedback text, and a rating from 1 to 5. '
            'Testimonials are stored and can be moderated before public display. '
            'Approved testimonials appear on the homepage and program details to improve trust and conversion for new applicants. '
            'Encourage students to provide specific outcomes and learning impact rather than generic comments.'
        ),
        'role_target': 'STU',
        'priority': 7,
    },
    {
        'title': 'Program Page Usage',
        'question': 'What should be shown on program detail pages?',
        'keywords': 'program detail instructor image students testimonials who is for duration price location',
        'answer': (
            'Every program page should include clear learning value: description, who it is for, duration, tuition, location, and instructor profile. '
            'It also shows student count and testimonials to build social proof. '
            'Use concise sections with readable typography and call-to-action links to enrollment. '
            'Program owners should update stale details regularly to avoid applicant confusion.'
        ),
        'role_target': 'ALL',
        'priority': 6,
    },
]


class Command(BaseCommand):
    help = 'Seed local AI assistant knowledge entries (offline, no API key).'

    def handle(self, *args, **options):
        created = 0
        updated = 0

        for item in KNOWLEDGE_DATA:
            _, was_created = AIAssistantKnowledge.objects.update_or_create(
                title=item['title'],
                defaults=item,
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'AI knowledge sync complete. Created: {created}, Updated: {updated}, Total: {AIAssistantKnowledge.objects.count()}'
            )
        )
