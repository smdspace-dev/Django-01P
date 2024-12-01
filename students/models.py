from django.db import models
from django.contrib.auth.models import User
from clusters.models import Cluster
import random
import string

class Student(models.Model):
    """Student model for managing student accounts"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    student_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=20, blank=True, null=True)
    year_of_admission = models.IntegerField()
    current_semester = models.IntegerField(default=1)
    password = models.CharField(max_length=100, blank=True, null=True)  # Store initial password for email
    
    # Club related
    can_change_club = models.BooleanField(default=False)
    club_change_expires_at = models.DateTimeField(null=True, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    credentials_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'students'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.student_id})"

    @staticmethod
    def generate_username(name, cluster_code):
        """Generate unique username for student"""
        base_username = f"{name.lower().replace(' ', '')}_{cluster_code.lower()}"
        # Add random suffix to ensure uniqueness
        suffix = ''.join(random.choices(string.digits, k=3))
        return f"{base_username}_{suffix}"

    @staticmethod
    def generate_password():
        """Generate random password for student"""
        return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

    def get_current_club(self):
        """Get student's current active club"""
        from clubs.models import ClubMember
        try:
            membership = ClubMember.objects.get(student=self, is_active=True)
            return membership.club
        except ClubMember.DoesNotExist:
            return None

class StudentBulkUpload(models.Model):
    """Track bulk upload operations"""
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    total_students = models.IntegerField(default=0)
    successful_uploads = models.IntegerField(default=0)
    failed_uploads = models.IntegerField(default=0)
    upload_date = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    error_log = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'student_bulk_uploads'

    def __str__(self):
        return f"Bulk Upload - {self.file_name} ({self.upload_date})"
