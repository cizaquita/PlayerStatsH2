from django.db import models

# Create your models here.

class Player(models.Model):
	"""docstring for Player"""
	name = models.CharField(max_length=100, unique=True)
	isMember = models.BooleanField(default=False)
	#place = models.CharField(max_length=200)
	#average_life = models.CharField(max_length=200)
	best_spree = models.IntegerField(default=0, null=True)
	best_spree_game_map = models.CharField(max_length=50, null=True, default='None')
	best_spree_game_type = models.CharField(max_length=50, null=True, default='None')
	best_spree_game_variant = models.CharField(max_length=50, null=True, default='None')

	score = models.IntegerField(default=0, null=True)
	kills = models.IntegerField(default=0, null=True)
	assists = models.IntegerField(default=0, null=True)
	deaths = models.IntegerField(default=0, null=True)
	suicides = models.IntegerField(default=0, null=True)

	register_date = models.DateTimeField(auto_now_add=True, null=True)
	modification_date = models.DateTimeField(auto_now_add=True, null=True)

	last_game_map = models.CharField(max_length=100, null=True, default='None')
	last_game_type = models.CharField(max_length=100, null=True, default='None')
	last_game_variant = models.CharField(max_length=100, null=True, default='None')

	#tournaments


	def __str__(self):
		return self.name

class File(models.Model):
	"""docstring for File"""
	name = models.CharField(max_length=100, unique=True)
	content = models.TextField(blank=True, null=True)

	def __str__(self):
		return self.name

class Tournament(models.Model):
	"""docstring for File"""
	name = models.CharField(max_length=100, unique=True)
	description = models.CharField(max_length=200, unique=True)
	participants = models.ManyToManyField(Player)

	def __str__(self):
		return self.name