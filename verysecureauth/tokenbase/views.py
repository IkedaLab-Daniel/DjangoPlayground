from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

class CitizenPortalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                'message': 'Authenticated access granted to citizen service',
                'profile': {
                    'username': user.username,
					'government_id': user.government_id,
					'agency_name': user.agency_name,
					'security_clearance': user.security_clearance,
					'mfa_verified': user.mfa_verified,
                },
            },
            status=status.HTTP_200_OK
        )