from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import GovernmentUser


@admin.register(GovernmentUser)
class GovernmentUserAdmin(UserAdmin):
	list_display = (
		'username',
		'email',
		'government_id',
		'agency_name',
		'security_clearance',
		'is_staff',
	)
	fieldsets = UserAdmin.fieldsets + (
		(
			'Government Access',
			{
				'fields': (
					'government_id',
					'agency_name',
					'security_clearance',
					'mfa_verified',
					'last_security_training',
				)
			},
		),
	)
	add_fieldsets = UserAdmin.add_fieldsets + (
		(
			'Government Access',
			{
				'fields': (
					'agency_name',
					'security_clearance',
				)
			},
		),
	)
