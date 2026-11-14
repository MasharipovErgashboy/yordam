from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import MurojaatCategory, MurojaatTemplate
from .serializers import MurojaatCategorySerializer, MurojaatTemplateSerializer

@api_view(['GET'])
def murojaat_all(request):
    """Barcha kategoriyalar va andozalarni qaytaruvchi umumiy endpoint"""
    categories = MurojaatCategory.objects.all()
    templates = MurojaatTemplate.objects.all()

    cat_serializer = MurojaatCategorySerializer(categories, many=True)
    tpl_serializer = MurojaatTemplateSerializer(templates, many=True)

    return Response({
        'success': True,
        'categories': cat_serializer.data,
        'templates': tpl_serializer.data,
    })

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = MurojaatCategory.objects.all()
    serializer_class = MurojaatCategorySerializer

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = MurojaatTemplate.objects.all()
    serializer_class = MurojaatTemplateSerializer
