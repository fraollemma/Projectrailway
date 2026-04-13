# project/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
]

urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('', include('base.urls')),
    path('users/', include('users.urls')),
    path('items/', include('poultryitems.urls')),
    path('conversation/', include('conversation.urls')),
    path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('contact/', include('contact.urls' , namespace='contact')),
    path('companies/', include('companies.urls')),
    path('vehicles/', include('vehicles.urls')),
    path('clothings/', include('clothings.urls')),
    path('electronics/', include('electronics.urls', namespace='electronics')),
    path('houses/', include('houses.urls', namespace='houses')),
    path('cart/', include('cart.urls', namespace='cart')),
    path("__reload__/", include("django_browser_reload.urls")),
    path("admin-app/", include("admin_app.urls", namespace="admin_app")),
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 
