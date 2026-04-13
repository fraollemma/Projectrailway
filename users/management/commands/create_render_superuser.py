from django.core.management.base import BaseCommand
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Creates a superuser for Render.com'

    def handle(self, *args, **options):
        if not CustomUser.objects.filter(username="admin").exists():
            CustomUser.objects.create_superuser(
                username="admin",
                phone_number="0975060586"  # Change this!
            )
            self.stdout.write(self.style.SUCCESS('Superuser created!'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists!'))