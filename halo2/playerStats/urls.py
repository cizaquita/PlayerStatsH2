from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
	path('clow_players/', views.clow_players, name='clow_players'),
	path('top_kills/', views.top_kills, name='top_kills'),
	path('top_spree/', views.top_spree, name='top_spree'),
	path('search_player/', views.search_player, name='search_player'),
	path('last_activity/', views.last_activity, name='last_activity'),
	path('get_motd/', views.get_motd, name='get_motd'),
	path('set_motd/', views.set_motd, name='set_motd'),
]