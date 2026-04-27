from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


def generate_government_id():
    return f"GOV-{uuid.uuid4().hex[:10].upper()}"

class GovernmentUser(AbstractUser):
    class Aura(models.TextChoices):
        MAXIMUM = 'MAXIMUM', 'Maximum'
        MID = 'MID', 'Mid'
        LOW = 'LOW', 'Low'

    
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

    def __str__(self):
        return f'{self.username} {self.government_id}'