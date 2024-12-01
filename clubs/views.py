from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Club, ClubSettings
from .serializers import ClubSerializer, ClubSettingsSerializer

class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer

    def get_queryset(self):
        queryset = Club.objects.select_related('coordinator', 'coordinator__department').all()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset

    @action(detail=False, methods=['get'])
    def active_clubs(self, request):
        """Get only active clubs for dropdowns"""
        clubs = Club.objects.filter(is_active=True).select_related('coordinator', 'coordinator__department').order_by('name')
        serializer = self.get_serializer(clubs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle club active status"""
        club = self.get_object()
        club.is_active = not club.is_active
        club.save()
        serializer = self.get_serializer(club)
        return Response(serializer.data)

class ClubSettingsViewSet(viewsets.ModelViewSet):
    queryset = ClubSettings.objects.all()
    serializer_class = ClubSettingsSerializer
