from rest_framework.throttling import UserRateThrottle

class TenCallPerMinute(UserRateThrottle):
    scope = 'ten'
    