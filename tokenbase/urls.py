from django.urls import path

from .views import CitizenPortalView, ClassifiedBriefingView

urlpatterns = [
    path('portal/', CitizenPortalView.as_view(), name='citizen-portal'),
    path('classified-briefing/', ClassifiedBriefingView.as_view(), name='classified-briefing'),
]