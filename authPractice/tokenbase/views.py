from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework import generics, status
from .serializers import CategorySerializer, MenuItemSerializer
from .models import Category, MenuItem

# > Auth modules - function-based
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import permission_classes

# > Groups
from django.contrib.auth.models import User, Group

# > Throttle
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework.decorators import throttle_classes
from .throttle import TenCallPerMinute

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

# > Manager view - Only for use with role "Manager"
@api_view(['POST', 'DELETE'])
@permission_classes([IsAdminUser])
def manager_view(request):
    username = request.data['username']
    if username:
        user = get_object_or_404(User, username=username)
        managers = Group.objects.get(name="Manager")
        
        if request.method == 'POST':
            managers.user_set.add(user)
        elif request.method == 'DELETE':
            managers.user_set.remove(user)

        return Response({"message": "process done"})
    
    return Response({"message": "error"}, status.HTTP_400_BAD_REQUEST)
    
# > Throttle test
@api_view()
@throttle_classes([AnonRateThrottle])
def throttle_check(request):
    return Response({"message": "successful"})

@api_view()
@permission_classes([IsAuthenticated])
@throttle_classes([TenCallPerMinute])
def throttle_check_auth(request):
    return Response({"message": "successful"})