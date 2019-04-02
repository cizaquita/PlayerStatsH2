from django.apps import AppConfig


class PlayerstatsConfig(AppConfig):
	name = 'playerStats'

	def ready(self):
		from statsUpdater import updater
		updater.start()