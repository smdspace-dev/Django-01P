from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, StudentBulkUpload
import random
import string

class StudentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    cluster_name = serializers.CharField(source='cluster.cluster_name', read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'student_id', 'name', 'email', 'phone', 'roll_number', 
            'year_of_admission', 'current_semester', 'cluster', 'cluster_name',
            'is_active', 'can_change_club', 'password', 'username', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['student_id', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Create a new student with associated user account"""
        # Generate password if not provided
        password = validated_data.pop('password', None)
        if not password:
            password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        
        # Generate unique student ID
        cluster = validated_data['cluster']
        student_id = f"{cluster.cluster_code}{random.randint(1000, 9999)}"
        while Student.objects.filter(student_id=student_id).exists():
            student_id = f"{cluster.cluster_code}{random.randint(1000, 9999)}"
        
        # Create User instance
        username = validated_data['email'].split('@')[0] + '_' + student_id
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=password,
            first_name=validated_data['name'].split()[0],
            last_name=' '.join(validated_data['name'].split()[1:]) if len(validated_data['name'].split()) > 1 else ''
        )
        
        # Create Student instance
        student = Student.objects.create(
            user=user,
            student_id=student_id,
            password=password,  # Store plain password for initial email
            **validated_data
        )
        
        return student

    def update(self, instance, validated_data):
        """Update student instance"""
        password = validated_data.pop('password', None)
        
        # Update user fields if needed
        if 'email' in validated_data:
            instance.user.email = validated_data['email']
        if 'name' in validated_data:
            name_parts = validated_data['name'].split()
            instance.user.first_name = name_parts[0]
            instance.user.last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        
        if password:
            instance.user.set_password(password)
            instance.password = password
        
        instance.user.save()
        
        # Update student fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance

    def validate_email(self, value):
        """Ensure email is unique"""
        if self.instance and self.instance.email == value:
            return value
        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_roll_number(self, value):
        """Ensure roll number is unique"""
        if self.instance and self.instance.roll_number == value:
            return value
        if Student.objects.filter(roll_number=value).exists():
            raise serializers.ValidationError("Roll number already exists.")
        return value

class StudentBulkUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentBulkUpload
        fields = [
            'id', 'filename', 'total_records', 'successful_records',
            'failed_records', 'status', 'uploaded_by', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
