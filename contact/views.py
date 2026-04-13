from django.views.generic import ListView, DetailView, CreateView, DeleteView
from django.urls import reverse_lazy
from django.contrib import messages
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import ContactMessage
from .forms import ContactForm
from django.shortcuts import render, redirect, get_object_or_404

class ContactUsView(CreateView):
    model = ContactMessage
    form_class = ContactForm
    template_name = 'contact/contact_us.html'
    success_url = reverse_lazy('contact:contact_us')

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, _('Thank you for your message! We will get back to you soon.'))
        return redirect('base:index')

class ReceivedMessagesView(LoginRequiredMixin, ListView):
    model = ContactMessage
    template_name = 'contact/received_messages.html'
    context_object_name = 'messages_list'
    paginate_by = 10
    login_url = reverse_lazy('login')

    def get_queryset(self):
        return ContactMessage.objects.all().order_by('-created_at')

class ViewMessageView(LoginRequiredMixin, DetailView):
    model = ContactMessage
    template_name = 'contact/view_message.html'
    context_object_name = 'message'
    login_url = reverse_lazy('login')

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        if not self.object.is_read:
            self.object.is_read = True
            self.object.save()
        return response

class DeleteMessageView(LoginRequiredMixin, DeleteView):
    model = ContactMessage
    template_name = 'contact/confirm_delete.html'
    success_url = reverse_lazy('contact:received_messages')
    login_url = reverse_lazy('login')

    def delete(self, request, *args, **kwargs):
        messages.success(request, _('Message has been deleted successfully.'))
        return super().delete(request, *args, **kwargs)