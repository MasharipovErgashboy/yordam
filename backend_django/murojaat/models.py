from django.db import models

class MurojaatCategory(models.Model):
    """Murojaat va arizalar kategoriyasi"""
    name = models.CharField(max_length=255, verbose_name="Kategoriya nomi")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaratilgan vaqt")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Yangilangan vaqt")

    class Meta:
        verbose_name = "Murojaat kategoriyasi"
        verbose_name_plural = "Murojaat kategoriyalari"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class MurojaatTemplate(models.Model):
    """Murojaat va ariza andozasi"""
    category = models.ForeignKey(
        MurojaatCategory,
        on_delete=models.CASCADE,
        related_name='templates',
        verbose_name="Kategoriya"
    )
    title = models.CharField(max_length=300, verbose_name="Andoza nomi")
    target_org = models.CharField(max_length=255, blank=True, verbose_name="Davlat organi nomi")
    duration_days = models.CharField(max_length=100, default="15 ish kuni", verbose_name="Ko‘rib chiqilish muddati")
    description = models.TextField(blank=True, verbose_name="Tavsif (Description)")
    law = models.CharField(max_length=400, blank=True, verbose_name="Qonuniy asos va moddalar")
    required_docs = models.JSONField(default=list, blank=True, verbose_name="Talab qilinadigan hujjatlar ro‘yxati")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaratilgan vaqt")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Yangilangan vaqt")

    class Meta:
        verbose_name = "Ariza andozasi"
        verbose_name_plural = "Ariza andozalari"
        ordering = ['-created_at']

    def __str__(self):
        return self.title
