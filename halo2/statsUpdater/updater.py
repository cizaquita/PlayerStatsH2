from datetime import datetime
import os

from apscheduler.schedulers.background import BackgroundScheduler
from statsUpdater import check_data

        
def start():
	print("Scheduler started...")
	scheduler = BackgroundScheduler()
	scheduler.add_job(check_data.check_new_data, 'interval', minutes=0.1)
	scheduler.start()
    
