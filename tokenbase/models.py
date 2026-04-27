import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager


def generate_government_id():
    # Keep IDs short and human-readable while remaining highly unique.
    return f"GOV-{uuid.uuid4().hex[:10].upper()}"


class GovernmentUserManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("mfa_verified", False)
        return super().create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)

class GovernmentUser(AbstractUser):
    class Aura(models.TextChoices):
        MAXIMUM = 'MAXIMUM', 'Maximum'
        MID = 'MID', 'Mid'
        LOW = 'LOW', 'Low'

    
    government_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
        default=generate_government_id,
    )
    mfa_verified = models.BooleanField(default=False)

    REQUIRED_FIELDS = ["email", "mfa_verified"]

    objects = GovernmentUserManager()

    def __str__(self):
        return f'{self.username} {self.government_id}'