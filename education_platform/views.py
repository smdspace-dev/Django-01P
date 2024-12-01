from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@api_view(['GET'])
@csrf_exempt
def api_status(request):
    """Simple API endpoint to test if the backend is working"""
    return Response({
        'status': 'success',
        'message': 'Education Platform API is running',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)
