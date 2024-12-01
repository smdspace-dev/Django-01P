from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Staff, Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'description', 'is_active', 'created_at']

class StaffSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    mentor_cluster_name = serializers.CharField(source='mentor_cluster.cluster_name', read_only=True)
    display_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Staff
        fields = [
            'id', 'staff_id', 'name', 'email', 'phone', 'subject_expertise',
            'qualification', 'department', 'department_name', 'photo',
            'departmental_access_enabled', 'mentor_access_enabled',
            'mentor_cluster', 'mentor_cluster_name', 'is_active',
            'date_joined', 'last_updated', 'display_info'
        ]

    def get_display_info(self, obj):
        """Return display info for dropdowns"""
        return obj.display_name_with_photo

    def create(self, validated_data):
        # Create user account for staff
        user = User.objects.create_user(
            username=validated_data['staff_id'],
            email=validated_data['email'],
            password='temp123'  # Temporary password
        )
        validated_data['user'] = user
        return super().create(validated_data)

    def validate_staff_id(self, value):
        """Ensure staff ID is unique"""
        if self.instance and self.instance.staff_id == value:
            return value
        if Staff.objects.filter(staff_id=value).exists():
            raise serializers.ValidationError("Staff ID must be unique.")
        return value

    def validate_email(self, value):
        """Ensure email is unique"""
        if self.instance and self.instance.email == value:
            return value
        if Staff.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email must be unique.")
        return value
