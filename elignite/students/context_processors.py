from .models import SystemSetting


def system_settings(request):
    return {'global_settings': SystemSetting.objects.first()}
