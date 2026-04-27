from djoser.serializers import UserCreateSerializer, UserSerializer

from .models import GovernmentUser


class GovernmentUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = GovernmentUser
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            're_password',
            'agency_name',
            'security_clearance',
        )


class GovernmentUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = GovernmentUser
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'government_id',
            'agency_name',
            'security_clearance',
            'mfa_verified',
            'last_security_training',
        )