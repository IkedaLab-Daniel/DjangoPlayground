from django.urls import path
from .views import CitizenPortalView

urlpatterns = [
    path('portal/', CitizenPortalView.as_view(), name='citizen-portal')
]