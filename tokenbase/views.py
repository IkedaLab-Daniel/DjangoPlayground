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
				'message': 'Authenticated access granted to Citizen Service Portal.',
				'profile': {
					'username': user.username,
					'government_id': user.government_id,
					'agency_name': user.agency_name,
					'security_clearance': user.security_clearance,
					'mfa_verified': user.mfa_verified,
				},
			},
			status=status.HTTP_200_OK,
		)


class ClassifiedBriefingView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		high_clearance = {
			user.SecurityClearance.SECRET,
			user.SecurityClearance.TOP_SECRET,
		}

		if not user.mfa_verified or user.security_clearance not in high_clearance:
			return Response(
				{
					'detail': (
						'Access denied: high security clearance and MFA verification '
						'are required.'
					)
				},
				status=status.HTTP_403_FORBIDDEN,
			)

		return Response(
			{
				'message': 'Classified briefing unlocked.',
				'briefing': {
					'operation': 'Civic Shield',
					'priority': 'High',
					'status': 'Monitoring active cyber threats on public systems.',
				},
			},
			status=status.HTTP_200_OK,
		)
