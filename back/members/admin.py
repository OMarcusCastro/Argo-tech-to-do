from django.contrib import admin
from .models import User

# Register your models here.


class MemberAdmin(admin.ModelAdmin):
    list_display = ("user_id", 'email', 'username', 'is_active', 'is_staff')


admin.site.register(User, MemberAdmin)
