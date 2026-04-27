from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q


class GovernmentIDOrUsernameBackend(ModelBackend):
    """Authenticate users with either username or government_id."""

    def authenticate(self, request, username=None, password=None, **kwargs):
        user_model = get_user_model()

        if username is None:
            username = kwargs.get(user_model.USERNAME_FIELD)

        if username is None or password is None:
            return None

        user = (
            user_model._default_manager.filter(
                Q(**{user_model.USERNAME_FIELD: username}) | Q(government_id=username)
            )
            .order_by('id')
            .first()
        )

        if user is None:
            # Run the hasher to reduce user enumeration timing differences.
            user_model().set_password(password)
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user

        return None
