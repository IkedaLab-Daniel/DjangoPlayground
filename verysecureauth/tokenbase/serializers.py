from djoser.serializers import UserCreateSerializer, UserSerializer

from .models import GovernmentUser


class GovernmentUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = GovernmentUser
        fields = ("id", "username", "email", "password", "re_password", "mfa_verified")


class GovernmentUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = GovernmentUser
        fields = ("id", "username", "email", "mfa_verified", "government_id")


class GovernmentCurrentUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = GovernmentUser
        fields = ("id", "username", "email", "government_id", "mfa_verified", "aura", "role")
        read_only_fields = ("government_id",)
