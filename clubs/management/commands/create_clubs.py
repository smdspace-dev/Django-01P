"""
Management command to create sample clubs
"""
from django.core.management.base import BaseCommand
from clubs.models import Club
from staff.models import Staff

class Command(BaseCommand):
    help = 'Create sample clubs for the education platform'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating sample clubs...'))
        
        # Get a coordinator (first available staff member)
        try:
            coordinator = Staff.objects.first()
            if not coordinator:
                self.stdout.write(
                    self.style.ERROR('No staff members found. Please create staff members first.')
                )
                return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding staff coordinator: {e}')
            )
            return
        
        # Create sample clubs
        clubs_data = [
            {
                'name': 'Programming Club',
                'description': 'A club for students interested in programming and software development. Learn new programming languages, work on projects, and participate in coding competitions.',
                'max_members': 50,
                'is_active': True,
                'coordinator': coordinator
            },
            {
                'name': 'Photography Club',
                'description': 'Capture moments and learn photography techniques. From basic camera operations to advanced photo editing, explore the world through your lens.',
                'max_members': 30,
                'is_active': True,
                'coordinator': coordinator
            },
            {
                'name': 'Literature Club',
                'description': 'For book lovers and creative writers. Discuss literature, share your writings, and participate in creative writing workshops.',
                'max_members': 25,
                'is_active': True,
                'coordinator': coordinator
            },
            {
                'name': 'Sports Club',
                'description': 'Promoting physical fitness and sports activities. Participate in various sports, tournaments, and fitness programs.',
                'max_members': 40,
                'is_active': True,
                'coordinator': coordinator
            },
            {
                'name': 'Music Club',
                'description': 'For music enthusiasts and performers. Learn instruments, form bands, and showcase your musical talents.',
                'max_members': 35,
                'is_active': True,
                'coordinator': coordinator
            },
            {
                'name': 'Debate Club',
                'description': 'Enhance your speaking and argumentation skills. Participate in debates, public speaking events, and develop critical thinking.',
                'max_members': 20,
                'is_active': True,
                'coordinator': coordinator
            },
            {
                'name': 'Art Club',
                'description': 'Express your creativity through various art forms. Painting, drawing, sculpture, and digital art workshops.',
                'max_members': 30,
                'is_active': True,
                'coordinator': coordinator
            },
            {
                'name': 'Science Club',
                'description': 'Explore the wonders of science through experiments, projects, and scientific discussions.',
                'max_members': 35,
                'is_active': True,
                'coordinator': coordinator
            },
            {
                'name': 'Drama Club',
                'description': 'Theatrical performances, acting workshops, and dramatic arts. Bring stories to life on stage.',
                'max_members': 25,
                'is_active': True,
                'coordinator': coordinator
            },
            {
                'name': 'Environmental Club',
                'description': 'Promoting environmental awareness and sustainability. Organize eco-friendly activities and conservation projects.',
                'max_members': 40,
                'is_active': True,
                'coordinator': coordinator
            }
        ]
        
        created_count = 0
        for club_data in clubs_data:
            club, created = Club.objects.get_or_create(
                name=club_data['name'],
                defaults=club_data
            )
            if created:
                created_count += 1
                self.stdout.write(f"✓ Created club: {club.name}")
            else:
                self.stdout.write(f"  Club already exists: {club.name}")
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Club creation completed! Created {created_count} new clubs.'
            )
        )
