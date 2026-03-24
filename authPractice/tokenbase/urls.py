from django.urls import path
from .views import CategoryView, MenuItemView, SingleMenuItemView, secret, manager_view, throttle_check

from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('category/', CategoryView.as_view()),
    path('menu/', MenuItemView.as_view()),
    path('menu/<str:pk>', SingleMenuItemView.as_view()),
    path('secret/', secret),
    path('api-token-auth/', obtain_auth_token),
    path('manager/', manager_view),
    path('throttle-check/', throttle_check)
]