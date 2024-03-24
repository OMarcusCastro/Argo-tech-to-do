from django.db import models
from members.models import User
# Create your models here.


class TodoItem(models.Model):

    status_options = [
        ("completed", 'completed'),
        ("pending", 'pending')

    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='todos')
    id = models.AutoField(primary_key=True)
    parent_task = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name='subtasks')

    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(
        default="pending", choices=status_options, max_length=10)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self) -> None:
        if not self.status in "completed pending":
            raise ValueError("Status must be 'completed' or 'pending'.")

        if self.parent_task and not self.parent_task.user == self.user:
            raise ValueError(
                "Parent task must belong to the same user as the subtask.")

    def __str__(self):
        return str(f"{self.title} - id: {self.id} ")
