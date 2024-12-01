from rest_framework import serializers
from .models import Cluster

class ClusterSerializer(serializers.ModelSerializer):
    display_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Cluster
        fields = [
            'cluster_id', 'cluster_name', 'cluster_code', 
            'description', 'is_active', 'created_at', 
            'updated_at', 'display_name'
        ]
        read_only_fields = ['cluster_id', 'created_at', 'updated_at']

    def validate_cluster_code(self, value):
        """Ensure cluster code is unique and uppercase"""
        value = value.upper()
        if self.instance and self.instance.cluster_code == value:
            return value
        if Cluster.objects.filter(cluster_code=value).exists():
            raise serializers.ValidationError("Cluster code must be unique.")
        return value
