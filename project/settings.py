# project/settings.py
import os
from pathlib import Path
from django.utils.translation import gettext_lazy as _

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'your-development-secret-key'
DEBUG = True
ALLOWED_HOSTS = ['*','localhost', '127.0.0.1','render-x1cx.onrender.com']

LANGUAGES = [
    ('en', _('English')),
    ('am', _('Amharic')),
    ('om', _('Oromiffa')),
]
LOCALE_PATHS = [os.path.join(BASE_DIR, 'locale')]
LANGUAGE_COOKIE_NAME = 'django_language'
LANGUAGE_COOKIE_HTTPONLY = False
LANGUAGE_COOKIE_SAMESITE = 'Lax'

REDIS_URL = 'redis://localhost:6379'

CSRF_TRUSTED_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://render-x1cx.onrender.com']
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_PROXY_SSL_HEADER = None

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'daphne',
    'django.contrib.staticfiles',
    
    'channels',
    'rest_framework',
    'corsheaders',
    
    'base',
    'poultryitems',
    'conversation',
    'users',
    'contact',
    'companies',
    'vehicles',
    'clothings',
    'admin_app',
    'electronics.apps.ElectronicsConfig',
    'houses.apps.HousesConfig',
    'cart',

    'crispy_forms',
    'crispy_bootstrap5',
    "django_browser_reload",
]

CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5" 
CRISPY_TEMPLATE_PACK = "bootstrap5" 

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    "django_browser_reload.middleware.BrowserReloadMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'project.urls'
ASGI_APPLICATION = 'project.asgi.application'
WSGI_APPLICATION = 'project.wsgi.application'
DAPHNE_TIMEOUT = 50
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [REDIS_URL],
        },
    },
}

AUTH_USER_MODEL = 'users.CustomUser'
AUTHENTICATION_BACKENDS = ['users.backends.UsernamePhoneBackend']
LOGIN_URL = 'login'
LOGIN_REDIRECT_URL = 'dashboard'
LOGOUT_REDIRECT_URL = 'home'

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfile')
STATICFILES_DIRS = [ BASE_DIR / "static",]  
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

LANGUAGE_CODE = 'en'
TIME_ZONE = 'Africa/Addis_Ababa'
USE_I18N = True
USE_TZ = True

CORS_ALLOW_ALL_ORIGINS = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'cart.context_processors.cart_item_count',
                'base.context_processors.category_counts',
            ],
        },
    },
]


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

WHITENOISE_AUTOREFRESH = True
