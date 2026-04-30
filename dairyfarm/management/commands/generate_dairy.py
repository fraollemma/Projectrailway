from django.core.management.base import BaseCommand
from dairyfarm.models import DairyFarm, VehicleImage
from django.contrib.auth import get_user_model
import random
import uuid
from faker import Faker

fake = Faker()
User = get_user_model()


class Command(BaseCommand):
    help = "Generate fake DairyFarm products with images"

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=20,
            help='Number of items to generate'
        )

    def handle(self, *args, **kwargs):

        count = kwargs['count']

        user = User.objects.first()
        if not user:
            self.stdout.write(self.style.ERROR("No user found. Create a user first."))
            return

        for i in range(count):

            make = fake.company()
            model = fake.word()

            item = DairyFarm.objects.create(
                category=random.choice(['car','truck','motorcycle','bicycle']),
                vehicle_type=random.choice(['car','truck','motorcycle','bicycle']),
                make=make,
                model=model,
                year=random.randint(2005, 2026),
                price=random.randint(10000, 90000),
                mileage=random.randint(10000, 200000),
                fuel_type=random.choice(['petrol','diesel','electric','hybrid','none']),
                engine_size=str(random.randint(1000, 5000)) + "cc",
                color=random.choice(['red','black','white','blue','gray']),
                description=fake.text(max_nb_chars=200),
                is_featured=True,
                created_by=user,
                slug=str(uuid.uuid4())[:10],
            )

            # images
            for j in range(random.randint(1, 2)):
                VehicleImage.objects.create(
                    vehicle=item,
                    image="vehicle_images/default.jpg",
                    is_featured=(j == 0),
                    alt_text=f"{make} {model}"
                )

        self.stdout.write(self.style.SUCCESS(f"{count} items created successfully!"))