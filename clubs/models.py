from django.db import models
from django.utils import timezone
from staff.models import Staff
import uuid

class ClubSettings(models.Model):
    """Global settings for club management"""
    student_join_period_start = models.DateTimeField(null=True, blank=True)
    student_join_period_end = models.DateTimeField(null=True, blank=True)
    is_joining_open = models.BooleanField(default=False)
    max_clubs_per_student = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'club_settings'

    def __str__(self):
        return f"Club Settings - Joining {'Open' if self.is_joining_open else 'Closed'}"

    def is_joining_period_active(self):
        now = timezone.now()
        if not self.is_joining_open:
            return False
        if self.student_join_period_start and self.student_join_period_end:
            return self.student_join_period_start <= now <= self.student_join_period_end
        return self.is_joining_open

class Club(models.Model):
    """Club model for managing student clubs"""
    club_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    coordinator = models.ForeignKey(
        Staff, 
        on_delete=models.CASCADE, 
        related_name='coordinated_clubs'
    )
    max_members = models.IntegerField(default=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'clubs'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} (ID: {str(self.club_id)[:8]})"

    @property
    def member_count(self):
        return self.members.filter(is_active=True).count()

    @property
    def representative_count(self):
        return self.members.filter(is_representative=True, is_active=True).count()

class ClubMember(models.Model):
    """Membership model linking students to clubs"""
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='members')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='club_memberships')
    is_representative = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'club_members'
        unique_together = ['club', 'student']

    def __str__(self):
        return f"{self.student.name} - {self.club.name}"
