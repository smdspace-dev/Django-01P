from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Staff, Department
from .serializers import StaffSerializer, DepartmentSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    @action(detail=False, methods=['get'])
    def active_departments(self, request):
        """Get only active departments"""
        departments = Department.objects.filter(is_active=True)
        serializer = self.get_serializer(departments, many=True)
        return Response(serializer.data)

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

    def get_queryset(self):
        queryset = Staff.objects.select_related('department', 'mentor_cluster')
        
        # Filter parameters
        is_active = self.request.query_params.get('is_active', None)
        department = self.request.query_params.get('department', None)
        mentor_enabled = self.request.query_params.get('mentor_enabled', None)
        search = self.request.query_params.get('search', None)

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        if department:
            queryset = queryset.filter(department_id=department)
        
        if mentor_enabled is not None:
            queryset = queryset.filter(mentor_access_enabled=mentor_enabled.lower() == 'true')
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(staff_id__icontains=search) |
                Q(email__icontains=search)
            )
        
        return queryset

    @action(detail=False, methods=['get'])
    def mentors_by_department(self, request):
        """Get staff members who can be mentors, grouped by department"""
        department_id = request.query_params.get('department_id')
        
        queryset = Staff.objects.filter(
            is_active=True,
            departmental_access_enabled=True
        ).select_related('department')
        
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle staff active status"""
        staff = self.get_object()
        staff.is_active = not staff.is_active
        staff.save()
        serializer = self.get_serializer(staff)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_mentor_access(self, request, pk=None):
        """Toggle mentor access for staff"""
        staff = self.get_object()
        staff.mentor_access_enabled = not staff.mentor_access_enabled
        if not staff.mentor_access_enabled:
            staff.mentor_cluster = None
        staff.save()
        serializer = self.get_serializer(staff)
        return Response(serializer.data)
