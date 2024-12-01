# Create sample data script
from clusters.models import Cluster
from staff.models import Department

# Create clusters
clusters_data = [
    {'cluster_name': 'Bachelor of Computer Applications', 'cluster_code': 'BCA', 'description': 'Undergraduate computer applications program'},
    {'cluster_name': 'Bachelor of Commerce', 'cluster_code': 'BCOM', 'description': 'Undergraduate commerce program'},  
    {'cluster_name': 'Master of Commerce', 'cluster_code': 'MCOM', 'description': 'Postgraduate commerce program'},
]

for cluster_data in clusters_data:
    cluster, created = Cluster.objects.get_or_create(
        cluster_code=cluster_data['cluster_code'],
        defaults=cluster_data
    )
    if created:
        print(f"Created cluster: {cluster.cluster_name}")

# Create departments
departments_data = [
    {'name': 'Computer Science', 'code': 'CS', 'description': 'Department of Computer Science'},
    {'name': 'Commerce', 'code': 'COM', 'description': 'Department of Commerce'},
    {'name': 'Arts', 'code': 'ARTS', 'description': 'Department of Arts'},
]

for dept_data in departments_data:
    dept, created = Department.objects.get_or_create(
        code=dept_data['code'],
        defaults=dept_data
    )
    if created:
        print(f"Created department: {dept.name}")

print("Sample data created successfully!")
