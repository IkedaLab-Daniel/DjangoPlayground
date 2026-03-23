from django.urls import path
from .views import CategoryView, MenuItemView, SingleMenuItemView

urlpatterns = [
    path('category/', CategoryView.as_view()),
    path('menu/', MenuItemView.as_view()),
    path('menu/<str:pk>', SingleMenuItemView.as_view())
]
