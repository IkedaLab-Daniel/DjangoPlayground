from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UserManager
from django.contrib.auth.hashers import identify_hasher, make_password
import uuid


def generate_government_id():
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

    class Role(models.TextChoices):
        HR = "HR", "Hr"
        ADMIN = "ADMIN", "Admin"
        RECRUITMENT = "RECRUITMENT", "Recruitment"
        

    
    government_id = models.CharField(
        max_length=30, 
        unique=True,
        editable=True,
        default=generate_government_id
    )
    mfa_verified = models.BooleanField(default=False)
    aura = models.CharField(
        max_length=10,
        choices=Aura.choices,
        default=Aura.MID
    )

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.ADMIN
    )

    REQUIRED_FIELDS = ["email", "mfa_verified",]

    objects = GovernmentUserManager()

    def save(self, *args, **kwargs):
        # Guardrail: if a raw password is assigned directly, hash it before save.
        if self.password and not self.password.startswith("!"):
            try:
                identify_hasher(self.password)
            except Exception:
                self.password = make_password(self.password)

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.username} {self.government_id}'