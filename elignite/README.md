# ELIGNITE (Django Edition)

Production-ready school management system built with Django templates.

## Quick start

1. Create and activate virtualenv.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
4. Create admin user:
   ```bash
   python manage.py createsuperuser
   ```
5. Start server:
   ```bash
   python manage.py runserver
   ```
6. Seed local AI Assistant knowledge database (optional but recommended):
   ```bash
   python manage.py seed_ai_knowledge
   ```

## Main modules
- Custom user model with role-based access (Admin/Teacher/Student).
- Program + enrollment workflow (admin approval + matricule generation).
- Student and teacher dashboards.
- Attendance, exercises, projects, payments, testimonials.
- Services/About CMS blocks.
- Enrollment PDF export including CEO signature.
- Offline AI Assistant powered by internal database content (no API key).

## Required settings
- `AUTH_USER_MODEL = 'students.User'`
- Add `students.context_processors.system_settings` to templates context processors.
