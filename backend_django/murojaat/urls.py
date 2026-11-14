from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TemplateViewSet, murojaat_all

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'templates', TemplateViewSet, basename='template')

urlpatterns = [
    path('', murojaat_all, name='murojaat-all'),
    path('', include(router.urls)),
]
