from django.db import models
from django.contrib.auth.models import User
from clusters.models import Cluster

class Department(models.Model):
    """Department model for organizing staff members"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Staff(models.Model):
    """
    Staff model with details for teachers and administrative staff
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    staff_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    subject_expertise = models.CharField(max_length=200)
    qualification = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='staff_photos/', blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    
    # Access Controls
    departmental_access_enabled = models.BooleanField(default=False)
    mentor_access_enabled = models.BooleanField(default=False)
    mentor_cluster = models.ForeignKey(
        Cluster, 
        on_delete=models.SET_NULL, 
        blank=True, 
        null=True,
        help_text="Cluster assigned if mentor access is enabled"
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'staff'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.staff_id})"

    @property
    def display_name_with_photo(self):
        """For dropdown display with name and photo info"""
        return {
            'name': self.name,
            'photo': self.photo.url if self.photo else None,
            'department': self.department.name,
            'id': self.id
        }
