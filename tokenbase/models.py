from django.contrib.auth.models import AbstractUser
from django.db import models


class GovernmentUser(AbstractUser):
	class SecurityClearance(models.TextChoices):
		PUBLIC = 'PUBLIC', 'Public'
		CONFIDENTIAL = 'CONFIDENTIAL', 'Confidential'
		SECRET = 'SECRET', 'Secret'
		TOP_SECRET = 'TOP_SECRET', 'Top Secret'

	government_id = models.CharField(max_length=30, unique=True)
	agency_name = models.CharField(max_length=120)
	security_clearance = models.CharField(
		max_length=20,
		choices=SecurityClearance.choices,
		default=SecurityClearance.PUBLIC,
	)
	mfa_verified = models.BooleanField(default=False)
	last_security_training = models.DateField(null=True, blank=True)

	def __str__(self) -> str:
		return f'{self.username} ({self.government_id})'
