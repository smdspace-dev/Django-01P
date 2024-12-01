from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'clubs', views.ClubViewSet)
router.register(r'club-settings', views.ClubSettingsViewSet)

urlpatterns = router.urls
