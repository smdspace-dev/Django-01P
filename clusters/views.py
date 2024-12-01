from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cluster
from .serializers import ClusterSerializer

class ClusterViewSet(viewsets.ModelViewSet):
    queryset = Cluster.objects.all()
    serializer_class = ClusterSerializer

    def get_queryset(self):
        queryset = Cluster.objects.all()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset

    @action(detail=False, methods=['get'])
    def active_clusters(self, request):
        """Get only active clusters for dropdowns"""
        clusters = Cluster.objects.filter(is_active=True).order_by('cluster_id')
        serializer = self.get_serializer(clusters, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle cluster active status"""
        cluster = self.get_object()
        cluster.is_active = not cluster.is_active
        cluster.save()
        serializer = self.get_serializer(cluster)
        return Response(serializer.data)
