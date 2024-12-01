from django.db import models

class Cluster(models.Model):
    """
    Cluster model for managing academic clusters (BCA, B.com, M.com, etc.)
    Each cluster has an auto-generated ID and a text description
    """
    cluster_id = models.AutoField(primary_key=True)
    cluster_name = models.CharField(max_length=100, unique=True)
    cluster_code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['cluster_id']
        db_table = 'clusters'

    def __str__(self):
        return f"{self.cluster_id} - {self.cluster_name}"

    @property
    def display_name(self):
        return f"{self.cluster_code} ({self.cluster_name})"
