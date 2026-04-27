from django.contrib.auth.hashers import identify_hasher, make_password
from django.db import migrations


def hash_plaintext_passwords(apps, schema_editor):
    GovernmentUser = apps.get_model('tokenbase', 'GovernmentUser')

    for user in GovernmentUser.objects.all():
        password = user.password

        if not password or password.startswith('!'):
            continue

        try:
            identify_hasher(password)
        except Exception:
            user.password = make_password(password)
            user.save(update_fields=['password'])


def noop_reverse(apps, schema_editor):
    # Password hashes are one-way; do not attempt reversal.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('tokenbase', '0004_alter_governmentuser_managers_governmentuser_role'),
    ]

    operations = [
        migrations.RunPython(hash_plaintext_passwords, noop_reverse),
    ]
