from django.db import models
from django.contrib.auth.models import AbstractUser

class GovernmentUser(AbstractUser):
    class Aura(models.TextChoices):
        MAXIMUM = 'MAXIMUM', 'Maximum'
        MID = 'MID', 'Mid'
        LOW = 'LOW', 'Low'

    
    government_id = models.CharField(max_length=30, unique=True)
    mfa_verified = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.username} {self.government_id}'