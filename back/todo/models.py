from django.db import models

# Create your models here.


class TodoItem(models.Model):

    status_options = [
        ("completed", 'completed'),
        ("peding", 'pending')

    ]

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(
        default=False, choices=status_options, max_length=10)

    def clean(self) -> None:
        if not self.status in "completed pending":
            raise ValueError("Status must be 'completed' or 'pending'.")

    def __str__(self):
        return str(self.title)
