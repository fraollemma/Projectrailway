



Internal Database URL = postgresql://postgres_xf9a_user:AWs5EvfJmzQCtblnzyGFTiBIeYEQQ0LW@dpg-d1fhd4hr0fns73cf3n90-a/postgres_xf9a


PSQL Command 
 render psql dpg-d1fhd4hr0fns73cf3n90-a






git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/fraollemma/poultry.git
git push -u origin main


git remote remove origin
git remote add origin https://github.com/fraollemma/poultry.git

0975516360
0913610673


Make a css that makes contact us page formal contact us page.

1 django-admin makemessages -l om
 //
django-admin makemessages

2 django-admin compilemessages
3 npx expo start --web



{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EthioPoultry - Ethiopian Poultry Marketplace</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{% static 'home/CSS/styles.css' %}">
</head>
<body>
    <header class="ethio-header">
        <div class="container">
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">
                        <img src="{% static 'home/images/logo-1.jpg' %}" alt="EthioPoultry Logo" height="50">
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="{% url 'items:item_list' %}">Marketplace</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{% url 'items:item_create' %}">Add Item</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Contact Us</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">About</a>
                            </li>
                        </ul>
                        <div class="d-flex">
                                <a href="{% url 'items:item_create' %}" class="btn btn-outline-light me-2">
                                    <i class="fas fa-plus"></i> Sell
                                </a>
                                <div class="dropdown">
                                    <button class="btn btn-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                                        <i class="fas fa-user"></i> {{ user.username }}
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">My Profile</a></li>
                                        <li><a class="dropdown-item" href="#">My Listings</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" href="/">Logout</a></li>
                                    </ul>
                                </div>
                                <a href="#" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#registerModal">Register</a>
                                <a href="/" class="btn btn-outline-light me-2">Login</a>
                            
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </header>


    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="registerModalLabel">User Registration</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form method="POST" action="{% url 'users:register' %}">
                        {% csrf_token %}
                        {{ form.as_p }}
                        <button type="submit" class="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
        </div>
    </div>


   
    <div class="language-selector">
        <div class="container text-end py-2">
            <form action="/" method="post" id="language-form">
                {% csrf_token %}
                <input name="next" type="hidden" value="{{ request.path }}">
                <div class="btn-group" role="group">
                    <button type="submit" name="language" value="en" 
                            class="btn btn-sm btn-outline-secondary {% if LANGUAGE_CODE == 'en' %}active{% endif %}">
                        English
                    </button>
                    <button type="submit" name="language" value="am" 
                            class="btn btn-sm btn-outline-secondary {% if LANGUAGE_CODE == 'am' %}active{% endif %}">
                        አማርኛ
                    </button>
                    <button type="submit" name="language" value="om" 
                            class="btn btn-sm btn-outline-secondary {% if LANGUAGE_CODE == 'om' %}active{% endif %}">
                        Oromiffa
                    </button>
                </div>
            </form>
        </div>
    </div>

   
    <main class="container my-4">
        {% block content %}
      
        <div id="heroSection" class="hero-section text-center py-5" >
            
            <h1>Welcome to EthioPoultry</h1>
            <p class="lead">Connecting Ethiopian poultry farmers with buyers nationwide</p>
            <a href="{% url 'items:item_list' %}" class="btn btn-primary btn-lg">Browse Marketplace</a>
        </div>
        {% endblock %}
    </main>

<footer class="ethio-footer">
    <div class="container py-3">  
        <div class="row">
            <div class="col-md-4">
                <img src="{% static 'home/images/logo-2.png' %}" alt="EthioPoultry Logo" height="30"> 
                <p class="mt-2 small">Empowering Ethiopian poultry farmers through digital marketplace solutions.</p> 
            </div>
            <div class="col-md-2">
                <h5 class="h6">Quick Links</h5>  
                <ul class="list-unstyled small"> 
                    <li><a href="#">Buy Items Know</a></li>
                    <li><a href="#">Add Items To Sell</a></li>
                    <li><a href="#">Contact Us</a></li>
                </ul>
            </div>
            <div class="col-md-3">
                <h5 class="h6">Contact</h5>  
                <ul class="list-unstyled small">
                    <li><i class="fas fa-phone me-2"></i> +251 2525 9294</li>
                    <li><i class="fas fa-envelope me-2"></i> fraollemma0506@gmail.com</li>
                    <li><i class="fas fa-map-marker-alt me-2"></i> Addis Ababa, Ethiopia</li>
                </ul>
            </div>
            <div class="col-md-3">
                <h5 class="h6">Follow Us</h5> 
                <div class="social-icons">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-telegram"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
        <hr>
        <div class="text-center small">
            <p>&copy; {% now "Y" %} EthioPoultry. All rights reserved.</p>
        </div>
    </div>
</footer>

  
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  
    <script src="{% static 'home/JS/script.js' %}"></script>
</body>
</html>

























































































































































{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EthioPoultry - Ethiopian Poultry Marketplace</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{% static 'home/CSS/styles.css' %}">
    <style>
        /* Custom styles to match FarmStyle design */
        :root {
            --primary-green: #4a8f29;
            --light-beige: #f8f5f0;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--light-beige);
        }
        .ethio-header {
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .navbar-brand img {
            height: 40px;
        }
        .nav-link {
            color: #333 !important;
            font-weight: 500;
        }
        .hero-section {
            background-color: white;
            padding: 5rem 0;
            margin-bottom: 3rem;
            text-align: center;
        }
        .section-title {
            color: var(--primary-green);
            font-weight: 700;
            margin-bottom: 2rem;
            text-align: center;
        }
        .product-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: transform 0.3s;
            margin-bottom: 2rem;
            overflow: hidden;
        }
        .product-card:hover {
            transform: translateY(-5px);
        }
        .product-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .product-card-body {
            padding: 1.5rem;
        }
        .product-title {
            font-weight: 600;
            color: #333;
        }
        .product-price {
            color: var(--primary-green);
            font-weight: 700;
        }
        .btn-view {
            background-color: var(--primary-green);
            color: white;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin-top: 1rem;
        }
        .btn-view:hover {
            background-color: #3a7720;
            color: white;
        }
    </style>
</head>
<body>
    <header class="ethio-header">
        <div class="container">
            <nav class="navbar navbar-expand-lg py-3">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">
                        <img src="{% static 'home/images/logo-1.jpg' %}" alt="EthioPoultry Logo">
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link active" href="/">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{% url 'items:item_list' %}">Shop</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">About Us</a>
                            </li>
                        </ul>
                        <div class="d-flex align-items-center">
                                <div class="dropdown">
                                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                                        <i class="fas fa-user me-1"></i> {{ user.username }}
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">My Profile</a></li>
                                        <li class="nav-item"><a class="nav-link" href="{% url 'items:item_create' %}">Add Item</a>
                                       </li>
                                        <li><a class="dropdown-item" href="#">My Listings</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" href="/">Logout</a></li>
                                    </ul>
                                </div>
                                <a href="/" class="btn btn-outline-secondary me-2">Login</a>
                                <a href="#" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#registerModal">Register</a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </header>
    <main class="container my-4">
        <!-- Hero Section -->
        <section class="hero-section rounded-3">
            <div class="container py-5">
                <h1 class="display-4 fw-bold mb-3">FARM PRODUCTS</h1>
                <p class="lead mb-4">Shop sustainably from nearby farms</p>
                <a href="{% url 'items:item_list' %}" class="btn-view">View Details</a>
            </div>
        </section>
    </main>
    <footer class="ethio-footer bg-white py-4 mt-5">
        <div class="container">
            <div class="text-center">
                <p class="mb-0">&copy; {% now "Y" %} EthioPoultry. All rights reserved.</p>
            </div>
        </div>
    </footer>
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>


























above home 
below create































{% extends 'home/home.html' %}
{% load static %}

{% block content %}
<div class="item-form-container">
    <h1 class="item-form-title">Create New Item</h1>
    <form method="post" enctype="multipart/form-data" class="item-form">
        {% csrf_token %}
        
        {% for field in form %}
        <div class="form-group">
            {{ field.label_tag }}
            {% if field.errors %}
                <ul class="errorlist">
                    {% for error in field.errors %}
                        <li>{{ error }}</li>
                    {% endfor %}
                </ul>
            {% endif %}
            {{ field }}
            {% if field.help_text %}
                <small class="help-text">{{ field.help_text }}</small>
            {% endif %}
        </div>
        {% endfor %}
        
        <button type="submit" class="submit-btn">Save Item</button>
    </form>
</div>

<!-- Include your static files -->
<link rel="stylesheet" href="{% static 'items/css/item_create.css' %}">
<script src="{% static 'items/js/item_create.js' %}"></script>
{% endblock %}









































































{% extends 'home/home.html' %}
{% load static %}

{% block content %}
<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-sm border-0">
                <div class="card-header bg-white border-0 py-3">
                    <h2 class="h4 text-center mb-0" style="color: #4a8f29;">
                        <i class="fas fa-feather-alt me-2"></i>Add New Poultry Product
                    </h2>
                </div>
                <div class="card-body px-4 py-4">
                    <form method="post" enctype="multipart/form-data" class="needs-validation" novalidate>
                        {% csrf_token %}
                        
                        <div class="row g-3">
                            {% for field in form %}
                            <div class="col-md-{% if field.name == 'description' %}12{% else %}6{% endif %} mb-3">
                                <label for="{{ field.id_for_label }}" class="form-label fw-semibold">
                                    {{ field.label }}
                                    {% if field.field.required %}<span class="text-danger">*</span>{% endif %}
                                </label>
                                
                                {% if field.field.widget.input_type == 'file' %}
                                    <div class="file-upload-wrapper">
                                        {{ field }}
                                        <small class="d-block text-muted mt-1">{{ field.help_text }}</small>
                                    </div>
                                {% else %}
                                    {{ field }}
                                    {% if field.help_text %}
                                        <small class="form-text text-muted">{{ field.help_text }}</small>
                                    {% endif %}
                                {% endif %}
                                
                                {% if field.errors %}
                                    <div class="invalid-feedback d-block">
                                        {% for error in field.errors %}
                                            {{ error }}
                                        {% endfor %}
                                    </div>
                                {% endif %}
                            </div>
                            {% endfor %}
                        </div>

                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <a href="{% url 'items:item_list' %}" class="btn btn-outline-secondary me-md-2">
                                <i class="fas fa-times me-1"></i> Cancel
                            </a>
                            <button type="submit" class="btn btn-success px-4">
                                <i class="fas fa-save me-1"></i> Save Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Custom styles matching FarmStyle theme */
    .card {
        border-radius: 12px;
        border: 1px solid rgba(0, 0, 0, 0.08);
    }
    
    .form-control, .form-select {
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 10px 15px;
        transition: all 0.3s;
    }
    
    .form-control:focus, .form-select:focus {
        border-color: #4a8f29;
        box-shadow: 0 0 0 0.25rem rgba(74, 143, 41, 0.25);
    }
    
    .file-upload-wrapper {
        position: relative;
        margin-bottom: 1rem;
    }
    
    .file-upload-wrapper input[type="file"] {
        width: 100%;
        height: auto;
        opacity: 1;
        position: relative;
    }
    
    .btn-success {
        background-color: #4a8f29;
        border-color: #4a8f29;
    }
    
    .btn-success:hover {
        background-color: #3a7720;
        border-color: #3a7720;
    }
    
    textarea.form-control {
        min-height: 120px;
    }
</style>

<script>
    // Client-side form validation
    (function () {
        'use strict'
        
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')
        
        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    
                    form.classList.add('was-validated')
                }, false)
            })
    })()
</script>
{% endblock %}















below detail












{% extends 'home/home.html' %}
{% load static %}

{% block content %}


{% if messages %}
<div class="messages">
    {% for message in messages %}
    <div class="alert alert-{{ message.tags }}">
        {{ message }}
    </div>
    {% endfor %}
</div>
{% endif %}


<div class="item-detail-container">
    <h1 class="item-title">{{ item.name }}</h1>
    
    <div class="main-image-container">
        <img src="{{ item.main_image.url }}" alt="{{ item.name }}" class="main-image">
    </div>
    <p class="item-price">Price: ETB {{ item.price }}</p>
    <div class="item-description">
        {{ item.description }}
    </div>
    <div class="gallery-section">
        <h2 class="gallery-title">Gallery</h2>
        <div class="gallery-grid">
            {% for image in item.sub_images.all %}
            <img src="{{ image.image.url }}" alt="Sub Image {{ forloop.counter }}" class="gallery-thumbnail">
            {% endfor %}
        </div>
    </div>
</div>

<link rel="stylesheet" href="{% static 'items/css/item_detail.css' %}">
<script src="{% static 'items/js/item_detail.js' %}"></script>
{% endblock %}













































































































{% extends 'home/home.html' %}
{% load static %}

{% block content %}
<div class="container my-5">
    {% if messages %}
    <div class="messages">
        {% for message in messages %}
        <div class="alert alert-{{ message.tags }} alert-dismissible fade show" role="alert">
            {{ message }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        {% endfor %}
    </div>
    {% endif %}

    <div class="row">
        <!-- Main Image Column -->
        <div class="col-lg-7 mb-4">
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                <img src="{{ item.main_image.url }}" class="img-fluid product-main-image" alt="{{ item.name }}" style="max-height: 500px; object-fit: cover;">
                
                {% if item.sub_images.all %}
                <div class="p-3 bg-light">
                    <h5 class="text-muted mb-3">More Images</h5>
                    <div class="d-flex flex-wrap gap-2">
                        {% for image in item.sub_images.all %}
                        <img src="{{ image.image.url }}" class="gallery-thumbnail rounded-2" 
                             style="width: 80px; height: 80px; object-fit: cover; cursor: pointer;"
                             onclick="document.querySelector('.product-main-image').src = this.src">
                        {% endfor %}
                    </div>
                </div>
                {% endif %}
            </div>
        </div>

        <!-- Details Column -->
        <div class="col-lg-5">
            <div class="card border-0 shadow-sm rounded-3 h-100">
                <div class="card-body p-4">
                    <h1 class="h2 mb-3" style="color: #4a8f29;">{{ item.name }}</h1>
                    
                    <div class="d-flex align-items-center mb-4">
                        <span class="h3 fw-bold me-2">ETB {{ item.price }}</span>
                        {% if item.is_negotiable %}
                        <span class="badge bg-success bg-opacity-10 text-success ms-2">Negotiable</span>
                        {% endif %}
                    </div>

                    <div class="mb-4">
                        <h5 class="d-flex align-items-center mb-3">
                            <i class="fas fa-info-circle text-muted me-2"></i> Description
                        </h5>
                        <div class="ps-3">
                            <p class="text-muted">{{ item.description|linebreaks }}</p>
                        </div>
                    </div>

                    <div class="border-top pt-3 mb-4">
                        <h5 class="d-flex align-items-center mb-3">
                            <i class="fas fa-user-circle text-muted me-2"></i> Seller Info
                        </h5>
                        <div class="d-flex align-items-center ps-3">
                            <div class="flex-shrink-0">
                                <img src="{% if item.seller.profile.image %}{{ item.seller.profile.image.url }}{% else %}{% static 'home/images/default-profile.png' %}{% endif %}" 
                                     class="rounded-circle" width="50" height="50" alt="Seller">
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-0">{{ item.seller.username }}</h6>
                                <small class="text-muted">Member since {{ item.seller.date_joined|date:"M Y" }}</small>
                            </div>
                        </div>
                    </div>

                    <div class="d-grid gap-2 mt-4">
                        <button class="btn btn-success btn-lg py-3">
                            <i class="fas fa-phone-alt me-2"></i> Contact Seller
                        </button>
                        <button class="btn btn-outline-secondary">
                            <i class="fas fa-bookmark me-2"></i> Save Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Additional Details Section -->
    <div class="row mt-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm rounded-3">
                <div class="card-body p-4">
                    <h3 class="h5 mb-4" style="color: #4a8f29;">
                        <i class="fas fa-clipboard-list me-2"></i> Product Details
                    </h3>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <ul class="list-unstyled">
                                <li class="mb-2"><strong>Category:</strong> {{ item.category }}</li>
                                <li class="mb-2"><strong>Quantity Available:</strong> {{ item.quantity }}</li>
                                <li class="mb-2"><strong>Location:</strong> {{ item.location }}</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="list-unstyled">
                                <li class="mb-2"><strong>Posted:</strong> {{ item.created_at|timesince }} ago</li>
                                <li class="mb-2"><strong>Condition:</strong> {{ item.condition }}</li>
                                <li class="mb-2"><strong>Delivery:</strong> {% if item.delivery_available %}Available{% else %}Not Available{% endif %}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Custom styling matching FarmStyle theme */
    .product-main-image {
        transition: transform 0.3s;
    }
    
    .gallery-thumbnail:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .card {
        transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    
    .btn-success {
        background-color: #4a8f29;
        border-color: #4a8f29;
    }
    
    .btn-success:hover {
        background-color: #3a7720;
        border-color: #3a7720;
    }
    
    .badge {
        padding: 0.35em 0.65em;
        font-size: 0.75em;
    }
</style>

<script>
    // Simple image gallery functionality
    document.addEventListener('DOMContentLoaded', function() {
        const thumbnails = document.querySelectorAll('.gallery-thumbnail');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                thumbnails.forEach(t => t.classList.remove('border', 'border-2', 'border-success'));
                this.classList.add('border', 'border-2', 'border-success');
            });
        });
        
        // Initialize first thumbnail as active if exists
        if (thumbnails.length > 0) {
            thumbnails[0].classList.add('border', 'border-2', 'border-success');
        }
    });
</script>
{% endblock %}
























































































below profile_update.html














{% extends 'home/home.html' %}
{% load static %}
{% block content %}

<div class="container">
    <h2>Update Profile</h2>
    <form method="POST" enctype="multipart/form-data">
        {% csrf_token %}
        {{ form.non_field_errors }}

        <div>
            {{ form.profile_picture.label_tag }}
            {{ form.profile_picture }}
            {{ form.profile_picture.errors }}
        </div>

        <div>
            {{ form.bio.label_tag }}
            {{ form.bio }}
            {{ form.bio.errors }}
        </div>

        <div>
            {{ form.email.label_tag }}
            {{ form.email }}
            {{ form.email.errors }}
        </div>

        <div>
            {{ form.location.label_tag }}
            {{ form.location }}
            {{ form.location.errors }}
        </div>

        <div>
            {{ form.phone_number.label_tag }}
            {{ form.phone_number }}
            {{ form.phone_number.errors }}
        </div>

        <div>
            {{ form.user.label_tag }}
            {{ form.user }}
            {{ form.user.errors }}
        </div>

        <button type="submit">Update Profile</button>
    </form>
</div>

{% endblock %}
















































{% extends 'home/home.html' %}
{% load static %}

{% block content %}
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div class="card-header bg-white py-3 border-0">
                    <h2 class="h4 text-center mb-0" style="color: #4a8f29;">
                        <i class="fas fa-user-edit me-2"></i>Update Your Profile
                    </h2>
                </div>
                <div class="card-body p-4">
                    <form method="POST" enctype="multipart/form-data" class="needs-validation" novalidate>
                        {% csrf_token %}
                        {{ form.non_field_errors }}

                        <div class="row">
                            <!-- Profile Picture Column -->
                            <div class="col-md-4 text-center mb-4 mb-md-0">
                                <div class="position-relative mx-auto" style="width: 150px; height: 150px;">
                                    <img id="profile-preview" 
                                         src="{% if form.profile_picture.value %}{{ form.profile_picture.value.url }}{% else %}{% static 'home/images/default-profile.png' %}{% endif %}" 
                                         class="rounded-circle border w-100 h-100 object-fit-cover"
                                         alt="Profile picture">
                                    <label for="id_profile_picture" class="btn btn-sm btn-success position-absolute bottom-0 end-0 rounded-circle p-2">
                                        <i class="fas fa-camera"></i>
                                    </label>
                                    {{ form.profile_picture }}
                                </div>
                                <small class="text-muted d-block mt-2">Click camera to update</small>
                                {{ form.profile_picture.errors }}
                            </div>

                            <!-- Form Fields Column -->
                            <div class="col-md-8">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label for="{{ form.bio.id_for_label }}" class="form-label fw-semibold">
                                            Bio
                                        </label>
                                        {{ form.bio }}
                                        {{ form.bio.errors }}
                                    </div>

                                    <div class="col-md-6">
                                        <label for="{{ form.email.id_for_label }}" class="form-label fw-semibold">
                                            Email
                                        </label>
                                        {{ form.email }}
                                        {{ form.email.errors }}
                                    </div>

                                    <div class="col-md-6">
                                        <label for="{{ form.phone_number.id_for_label }}" class="form-label fw-semibold">
                                            Phone Number
                                        </label>
                                        {{ form.phone_number }}
                                        {{ form.phone_number.errors }}
                                    </div>

                                    <div class="col-12">
                                        <label for="{{ form.location.id_for_label }}" class="form-label fw-semibold">
                                            Location
                                        </label>
                                        {{ form.location }}
                                        {{ form.location.errors }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between mt-4 pt-3 border-top">
                            <a href="{% url 'users:profile' %}" class="btn btn-outline-secondary px-4">
                                <i class="fas fa-arrow-left me-2"></i>Cancel
                            </a>
                            <button type="submit" class="btn btn-success px-4">
                                <i class="fas fa-save me-2"></i>Update Profile
                            </button>
                        </div>

                        <!-- Hidden user field -->
                        {{ form.user }}
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Custom styling matching FarmStyle theme */
    .card {
        transition: transform 0.3s, box-shadow 0.3s;
    }
    
    #id_profile_picture {
        display: none;
    }
    
    .form-control, .form-select {
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 10px 15px;
    }
    
    .form-control:focus, .form-select:focus {
        border-color: #4a8f29;
        box-shadow: 0 0 0 0.25rem rgba(74, 143, 41, 0.25);
    }
    
    textarea.form-control {
        min-height: 100px;
    }
    
    .btn-success {
        background-color: #4a8f29;
        border-color: #4a8f29;
    }
    
    .btn-success:hover {
        background-color: #3a7720;
        border-color: #3a7720;
    }
    
    .object-fit-cover {
        object-fit: cover;
    }
</style>

<script>
    // Profile picture preview
    document.getElementById('id_profile_picture').addEventListener('change', function(e) {
        const [file] = e.target.files;
        if (file) {
            document.getElementById('profile-preview').src = URL.createObjectURL(file);
        }
    });

    // Client-side form validation
    (function () {
        'use strict'
        var forms = document.querySelectorAll('.needs-validation')
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    form.classList.add('was-validated')
                }, false)
            })
    })()
</script>
{% endblock %}











































below registration.html

























{% extends 'home/home.html' %}
{% load static %}
{% block content %}

<div class="container">
    <h2>Register</h2>
    <form method="POST" action="{% url 'users:register' %}">
        {% csrf_token %}
        {{ form.non_field_errors }}
        
        <div>
            {{ form.username.label_tag }}
            {{ form.username }}
            {{ form.username.errors }}
        </div>

        <div>
            {{ form.phone_number.label_tag }}
            {{ form.phone_number }}
            {{ form.phone_number.errors }}
        </div>

        <button type="submit">Sign Up</button>
    </form>
</div>

{% endblock %}









































{% extends 'home/home.html' %}
{% load static %}

{% block content %}
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div class="card-header bg-white py-4 border-0 text-center">
                    <img src="{% static 'home/images/logo-1.jpg' %}" alt="EthioPoultry Logo" height="50" class="mb-3">
                    <h2 class="h4 mb-0" style="color: #4a8f29;">
                        <i class="fas fa-user-plus me-2"></i>Create Your Account
                    </h2>
                </div>
                <div class="card-body p-4 p-md-5">
                    <form method="POST" action="{% url 'users:register' %}" class="needs-validation" novalidate>
                        {% csrf_token %}
                        {{ form.non_field_errors }}

                        <div class="mb-4">
                            <label for="{{ form.username.id_for_label }}" class="form-label fw-semibold">
                                <i class="fas fa-user me-1"></i> Username
                            </label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="fas fa-at text-muted"></i>
                                </span>
                                {{ form.username }}
                            </div>
                            <div class="form-text">Choose a unique username</div>
                            {{ form.username.errors }}
                        </div>

                        <div class="mb-4">
                            <label for="{{ form.phone_number.id_for_label }}" class="form-label fw-semibold">
                                <i class="fas fa-phone me-1"></i> Phone Number
                            </label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    +251
                                </span>
                                {{ form.phone_number }}
                            </div>
                            {{ form.phone_number.errors }}
                        </div>

                        <div class="mb-4">
                            <label for="{{ form.password1.id_for_label }}" class="form-label fw-semibold">
                                <i class="fas fa-lock me-1"></i> Password
                            </label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="fas fa-key text-muted"></i>
                                </span>
                                {{ form.password1 }}
                                <button class="btn btn-outline-secondary toggle-password" type="button">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            {{ form.password1.errors }}
                        </div>

                        <div class="mb-4">
                            <label for="{{ form.password2.id_for_label }}" class="form-label fw-semibold">
                                <i class="fas fa-lock me-1"></i> Confirm Password
                            </label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="fas fa-key text-muted"></i>
                                </span>
                                {{ form.password2 }}
                                <button class="btn btn-outline-secondary toggle-password" type="button">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            {{ form.password2.errors }}
                        </div>

                        <div class="d-grid gap-2 mt-4">
                            <button type="submit" class="btn btn-success btn-lg py-3">
                                <i class="fas fa-user-plus me-2"></i> Create Account
                            </button>
                        </div>

                        <div class="text-center mt-4 pt-3 border-top">
                            <p class="small text-muted mb-0">Already have an account? 
                                <a href="{% url 'users:login' %}" class="text-success">Sign In</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Custom styling matching FarmStyle theme */
    .card {
        transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .form-control, .form-select {
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 10px 15px;
    }
    
    .form-control:focus {
        border-color: #4a8f29;
        box-shadow: 0 0 0 0.25rem rgba(74, 143, 41, 0.25);
    }
    
    .input-group-text {
        background-color: #f8f9fa;
        border-right: 0;
    }
    
    .input-group .form-control {
        border-left: 0;
    }
    
    .btn-success {
        background-color: #4a8f29;
        border-color: #4a8f29;
    }
    
    .btn-success:hover {
        background-color: #3a7720;
        border-color: #3a7720;
    }
    
    .toggle-password {
        border-left: 0;
        border-radius: 0 8px 8px 0;
    }
</style>

<script>
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(function(button) {
        button.addEventListener('click', function() {
            const input = this.parentNode.querySelector('input');
            const icon = this.querySelector('i');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // Client-side form validation
    (function () {
        'use strict'
        var forms = document.querySelectorAll('.needs-validation')
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    form.classList.add('was-validated')
                }, false)
            })
    })()
</script>
{% endblock %}





MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# project/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('', include('base.urls')),
    path('users/', include('users.urls')),
    path('items/', include('items.urls')),
    path('conversation/', include('conversation.urls')),
    path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('contact/', include('contact.urls')),
)




which one should I have to use for render project ?
gunicorn project.wsgi:application --bind 0.0.0.0:$PORT --workers 4 --timeout 120
or
daphne -b 0.0.0.0 -p $PORT project.asgi:application










#ffa31a, #808080, #292929, #1b1b1b and  #ffffff	

 I am using #ffa31a, #808080, #292929, #1b1b1b and  #ffffff colors for my E-commerce website design. Can You help me make a formal web page. help me with making CSS and JS




-----------------------------------
--------------------------------------
-------------------------------------
-------------------------------------
---------------------------------------------------------------------------------------------------------
---------------------------------
----------------------------
------------------------------------




Select the repository with your poultry website

Configure the service:

Name: poultry-website (or your preferred name)

Region: Choose closest to your users

Branch: main/master

Runtime: Python 3

Build Command: ./build.sh

Start Command: gunicorn project.wsgi:application

Add environment variables:

SECRET_KEY: Generate a new one

DISABLE_COLLECTSTATIC: 0

Your Cloudinary credentials

Click "Create Web Service"

8. Set Up the Database
In Render, go to "Databases"

Create a new PostgreSQL database

Note the connection string and update your DATABASE_URL in environment variables

9. Configure Static Files
Since you're using Whitenoise, your static files should be served automatically after the build process runs collectstatic.

10. Final Checks
Check the build logs for any errors

Once deployed, test all functionality

Set up a custom domain if needed

Important Notes
Security: Remove hardcoded secrets from your settings.py (like Cloudinary credentials) and use environment variables instead.

Redis: For production, you'll need a Redis instance. Render offers Redis as an add-on.

Media Files: For production, you should use Cloudinary for media storage since Render doesn't provide persistent storage.

Scaling: The free tier has limitations. Consider upgrading if you expect significant traffic.

Would you like me to elaborate on any specific part of this deployment process?






























postgresql://postgres:zjZosoHJkNujXTmksFvjqKwHnTAnhoBt@monorail.proxy.rlwy.net:42376/railway




# project/settings.py
import os
import dj_database_url
from pathlib import Path
from django.utils.translation import gettext_lazy as _

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'unsafe-secret-key')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'fraollemma.online',
    'www.fraollemma.online',
    '.railway.app',
]

LANGUAGES = [
    ('en', _('English')),
    ('am', _('Amharic')),
    ('om', _('Oromiffa')),
]
LOCALE_PATHS = [os.path.join(BASE_DIR, 'locale')]
LANGUAGE_COOKIE_NAME = 'django_language'
LANGUAGE_COOKIE_HTTPONLY = False
LANGUAGE_COOKIE_SAMESITE = 'Lax'

REDIS_URL = os.environ.get('REDIS_URL')

CSRF_TRUSTED_ORIGINS = [
    "https://fraollemma.online",
    "https://www.fraollemma.online",
    "https://*.railway.app",
]

if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
else:
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False

INSTALLED_APPS = [
    'daphne',
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'channels',
    'rest_framework',
    'corsheaders',
    
    'cloudinary',
    'cloudinary_storage',
    
    "crispy_forms",
    "crispy_bootstrap5",
    
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
    
]

CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5" 
CRISPY_TEMPLATE_PACK = "bootstrap5" 

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
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
    'default': dj_database_url.config(default=os.environ.get("DATABASE_URL"))
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [REDIS_URL] if REDIS_URL else [('localhost', 6379)],
        },
    },
}

AUTH_USER_MODEL = 'users.CustomUser'
AUTHENTICATION_BACKENDS = ['users.backends.UsernamePhoneBackend']
LOGIN_URL = 'login'
LOGIN_REDIRECT_URL = 'dashboard'
LOGOUT_REDIRECT_URL = 'home'

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = []
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

if DEBUG:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
else:
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
        'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
        'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
    }
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
    MEDIA_URL = '/media/'

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

WHITENOISE_AUTOREFRESH = DEBUG










set DATABASE_URL=postgresql://postgres:zjZosoHJkNujXTmksFvjqKwHnTAnhoBt@monorail.proxy.rlwy.net:42376/railway
set CLOUDINARY_CLOUD_NAME=doixo5oiw
set CLOUDINARY_API_KEY=334318349795623
set CLOUDINARY_API_SECRET=uF3V8cdoExU5JyI1L_Nl3mYh2uw

python manage.py makemigrations
python manage.py migrate

python manage.py shell

from django.contrib.auth import get_user_model
from poultryitems.models import EggOrder

User = get_user_model()
user = User.objects.get(username='zero')
print(f"Orders for {user.username}: {EggOrder.objects.filter(user=user).count()}")