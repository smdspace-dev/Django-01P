from rest_framework import serializers
from .models import Club, ClubSettings
from staff.models import Staff

class ClubSerializer(serializers.ModelSerializer):
    coordinator_name = serializers.CharField(source='coordinator.name', read_only=True)
    department_name = serializers.CharField(source='coordinator.department.name', read_only=True)
    
    class Meta:
        model = Club
        fields = [
            'club_id', 'name', 'description', 'coordinator', 'coordinator_name',
            'department_name', 'max_members', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['club_id', 'created_at', 'updated_at']

    def validate_coordinator(self, value):
        """Ensure coordinator is an active staff member"""
        if not value.is_active:
            raise serializers.ValidationError("Coordinator must be an active staff member.")
        return value

class ClubSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClubSettings
        fields = [
            'student_join_period_start', 'student_join_period_end',
            'is_joining_open', 'max_clubs_per_student', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
