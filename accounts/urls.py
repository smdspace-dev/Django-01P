from django.urls import path
from django.http import JsonResponse

def accounts_placeholder(request):
    return JsonResponse({'message': 'Accounts API placeholder'})

urlpatterns = [
    path('accounts/', accounts_placeholder, name='accounts_placeholder'),
]
