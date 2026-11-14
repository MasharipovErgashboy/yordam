from rest_framework import serializers
from .models import MurojaatCategory, MurojaatTemplate

class MurojaatTemplateSerializer(serializers.ModelSerializer):
    categoryId = serializers.ReadOnlyField(source='category.id')
    categoryName = serializers.ReadOnlyField(source='category.name')
    targetOrg = serializers.CharField(source='target_org', required=False, allow_blank=True)
    durationDays = serializers.CharField(source='duration_days', required=False, allow_blank=True)
    requiredDocs = serializers.ListField(source='required_docs', required=False)

    class Meta:
        model = MurojaatTemplate
        fields = [
            'id',
            'categoryId',
            'categoryName',
            'title',
            'durationDays',
            'description',
            'targetOrg',
            'law',
            'requiredDocs',
            'created_at',
            'updated_at',
        ]

class MurojaatCategorySerializer(serializers.ModelSerializer):
    templatesCount = serializers.SerializerMethodField()

    class Meta:
        model = MurojaatCategory
        fields = ['id', 'name', 'created_at', 'templatesCount']

    def get_templatesCount(self, obj):
        return obj.templates.count()
