from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Category, Product

class ElectronicsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='seller', password='testpass123')
        self.user2 = User.objects.create_user(username='buyer', password='testpass123')
        
        self.category = Category.objects.create(name='Laptops', description='Portable computers')
        
        self.product = Product.objects.create(
            seller=self.user1,
            category=self.category,
            name='MacBook Pro',
            description='Apple laptop',
            price=1500.00,
            condition='new',
            stock=5
        )
    
    def test_product_list_view(self):
        response = self.client.get(reverse('electronics:product_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'MacBook Pro')
    
    def test_product_detail_view(self):
        response = self.client.get(reverse('electronics:product_detail', args=[self.product.id]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Apple laptop')
    
    def test_create_product_authenticated(self):
        self.client.login(username='seller', password='testpass123')
        response = self.client.post(reverse('electronics:create_product'), {
            'category': self.category.id,
            'name': 'iPhone',
            'description': 'Apple smartphone',
            'price': 999.99,
            'condition': 'new',
            'stock': 10
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Product.objects.count(), 2)
    