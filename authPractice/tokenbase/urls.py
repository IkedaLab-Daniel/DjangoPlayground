from django.urls import path
from .views import CategoryView, MenuItemView, SingleMenuItemView, secret, manager_view

from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('category/', CategoryView.as_view()),
    path('menu/', MenuItemView.as_view()),
    path('menu/<str:pk>', SingleMenuItemView.as_view()),
    path('secret/', secret),
    path('api-token-auth/', obtain_auth_token),
    path('manager/', manager_view)
]

# > John Doe: 16c68b453466946dc7f0fe6ae22a01879a42660c
# > Jimmy Doe: f479feb8442d8d142951a07c1ab488189799ff11