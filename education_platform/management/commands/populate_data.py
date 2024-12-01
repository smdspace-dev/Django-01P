"""
Management command to populate database with sample data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from clusters.models import Cluster
from staff.models import Department, Staff
from clubs.models import Club

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to populate database...'))
        
        # Create clusters
        clusters_data = [
            {'cluster_name': 'Bachelor of Computer Applications', 'cluster_code': 'BCA', 'description': 'Undergraduate computer applications program'},
            {'cluster_name': 'Bachelor of Commerce', 'cluster_code': 'BCOM', 'description': 'Undergraduate commerce program'},
            {'cluster_name': 'Master of Commerce', 'cluster_code': 'MCOM', 'description': 'Postgraduate commerce program'},
            {'cluster_name': 'Bachelor of Arts', 'cluster_code': 'BA', 'description': 'Undergraduate arts program'},
        ]
        
        for cluster_data in clusters_data:
            cluster, created = Cluster.objects.get_or_create(
                cluster_code=cluster_data['cluster_code'],
                defaults=cluster_data
            )
            if created:
                self.stdout.write(f"Created cluster: {cluster.cluster_name}")
        
        # Create departments
        departments_data = [
            {'name': 'Computer Science', 'code': 'CS', 'description': 'Department of Computer Science'},
            {'name': 'Commerce', 'code': 'COM', 'description': 'Department of Commerce'},
            {'name': 'Arts', 'code': 'ARTS', 'description': 'Department of Arts'},
            {'name': 'Mathematics', 'code': 'MATH', 'description': 'Department of Mathematics'},
        ]
        
        for dept_data in departments_data:
            dept, created = Department.objects.get_or_create(
                code=dept_data['code'],
                defaults=dept_data
            )
            if created:
                self.stdout.write(f"Created department: {dept.name}")
        
        # Create sample staff
        cs_dept = Department.objects.get(code='CS')
        com_dept = Department.objects.get(code='COM')
        bca_cluster = Cluster.objects.get(cluster_code='BCA')
        
        staff_data = [
            {
                'staff_id': 'STF001',
                'name': 'Dr. John Smith',
                'email': 'john.smith@edu.com',
                'subject_expertise': 'Data Structures, Algorithms',
                'qualification': 'PhD Computer Science',
                'department': cs_dept,
                'mentor_access_enabled': True,
                'mentor_cluster': bca_cluster,
                'departmental_access_enabled': True
            },
            {
                'staff_id': 'STF002',
                'name': 'Prof. Sarah Johnson',
                'email': 'sarah.j@edu.com',
                'subject_expertise': 'Accounting, Finance',
                'qualification': 'MBA Finance',
                'department': com_dept,
                'mentor_access_enabled': False,
                'departmental_access_enabled': True
            }
        ]
        
        for staff_info in staff_data:
            # Create user for staff
            user, user_created = User.objects.get_or_create(
                username=staff_info['staff_id'],
                defaults={
                    'email': staff_info['email'],
                    'first_name': staff_info['name'].split()[1] if len(staff_info['name'].split()) > 1 else staff_info['name'],
                    'last_name': staff_info['name'].split()[-1] if len(staff_info['name'].split()) > 1 else ''
                }
            )
            if user_created:
                user.set_password('temp123')
                user.save()
            
            # Create staff
            staff, created = Staff.objects.get_or_create(
                staff_id=staff_info['staff_id'],
                defaults={**staff_info, 'user': user}
            )
            if created:
                self.stdout.write(f"Created staff: {staff.name}")
        
        # Create sample clubs
        clubs_data = [
            {
                'name': 'Programming Club',
                'description': 'A club for students interested in programming and software development',
                'category': 'Technical',
                'max_members': 50,
                'is_active': True
            },
            {
                'name': 'Photography Club',
                'description': 'Capture moments and learn photography techniques',
                'category': 'Creative',
                'max_members': 30,
                'is_active': True
            },
            {
                'name': 'Literature Club',
                'description': 'For book lovers and creative writers',
                'category': 'Cultural',
                'max_members': 25,
                'is_active': True
            },
            {
                'name': 'Sports Club',
                'description': 'Promoting physical fitness and sports activities',
                'category': 'Sports',
                'max_members': 40,
                'is_active': True
            },
            {
                'name': 'Music Club',
                'description': 'For music enthusiasts and performers',
                'category': 'Cultural',
                'max_members': 35,
                'is_active': True
            },
            {
                'name': 'Debate Club',
                'description': 'Enhance your speaking and argumentation skills',
                'category': 'Academic',
                'max_members': 20,
                'is_active': True
            }
        ]
        
        for club_data in clubs_data:
            club, created = Club.objects.get_or_create(
                name=club_data['name'],
                defaults=club_data
            )
            if created:
                self.stdout.write(f"Created club: {club.name}")
        
        self.stdout.write(self.style.SUCCESS('Database population completed successfully!'))
