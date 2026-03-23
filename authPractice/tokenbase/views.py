from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework import generics
from .serializers import CategorySerializer, MenuItemSerializer
from .models import Category, MenuItem

# > Auth modules - function-based
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

class CategoryView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MenuItemView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    ordering_fields = ['price', 'inventory']
    filterset_fields = ['price', 'inventory']
    search_fields = ['title']

class SingleMenuItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

# > Protect - function-based view
@api_view()
@permission_classes([IsAuthenticated])
def secret(request):
    return Response({"message": "Some Secret Message"})