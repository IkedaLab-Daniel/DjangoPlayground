from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework import generics
from .serializers import CategorySerializer, MenuItemSerializer
from .models import Category, MenuItem

# > Auth modules - function-based
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

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
@api_view()
@permission_classes([IsAuthenticated])
def manager_view(request):
    if request.user.groups.filter(name="Manager").exists():
        return Response({"message": "Only manager should see thi"})
    
    return Response({"message": "You are not authorized"}, 403)
    
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