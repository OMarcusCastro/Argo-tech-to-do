from django.contrib import admin


from .models import TodoItem
# Register your models here.


class TodoItemAdmin(admin.ModelAdmin):
    list_display = ("id", 'parent_task', 'title',
                    'description', 'status', 'user')
    list_filter = ('status', 'user')
    search_fields = ('title', 'description')
    ordering = ('status', 'user')
    readonly_fields = ('created_at', 'updated_at')
    list_display_links = ('user', "id")


admin.site.register(TodoItem, TodoItemAdmin)
