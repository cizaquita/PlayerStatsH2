import os
import requests
import sched, time, json, glob, pytz
from playerStats.models import *
from xml.dom import minidom
from datetime import datetime
from django.utils import timezone
#from scheduler.config_stuff import config

#Check data, new stats to be saved
def check_new_data():
    #El ultimo archivo creado en la carpeta de estadísticas
    files_root = 'C:\\Users\\Acer\\Desktop\\H2Server\\stats\\'
    list_of_files = glob.glob(files_root + '*') # * means all if need specific format then *.csv
    latest_file = max(list_of_files, key=os.path.getctime)
    #latest_file_path = files_root + latest_file

    try:
        file = File.objects.get(name=latest_file)
        print(".", end="", flush=True)
    except Exception as e:
        new_file = File(name=latest_file)

        with open(latest_file, 'U', encoding='UTF8') as f:
            newText=f.read().replace("", "")
        with open(latest_file, "w", encoding='UTF8') as f:
            f.write(newText)
        new_file.content = newText
        new_file.save()

        doc = minidom.parse(latest_file)
        # doc.getElementsByTagName returns NodeList
        game_map = doc.getElementsByTagName("Map")[0].firstChild.data if doc.getElementsByTagName("Map")[0].firstChild is not None else 'CustomMap'
        game_type = doc.getElementsByTagName("Game_Type")[0].firstChild.data
        game_variant = doc.getElementsByTagName("Variant")[0].firstChild.data
        game_start_time = doc.getElementsByTagName("Start_Time")[0].firstChild.data
        game_end_time = doc.getElementsByTagName("End_Time")[0].firstChild.data

        #print(game_map.firstChild.data)

        players = doc.getElementsByTagName("Player")
        for player in players:
            #pname = player.getAttribute("id")
            pname = player.getElementsByTagName("Name")[0].firstChild.data
            try:
                get_player = Player.objects.get(name=pname)
                pbest_spree = int(player.getElementsByTagName("Best_Spree")[0].firstChild.data)
                # Update best spree
                if get_player.best_spree <  pbest_spree:
                    get_player.best_spree = pbest_spree
                    get_player.best_spree_game_map = game_map
                    get_player.best_spree_game_type = game_type
                    get_player.best_spree_game_variant = game_variant

                get_player.score = get_player.score + int(player.getElementsByTagName("Score")[0].firstChild.data)
                get_player.kills = get_player.kills + int(player.getElementsByTagName("Kills")[0].firstChild.data)
                get_player.assists = get_player.assists + int(player.getElementsByTagName("Assists")[0].firstChild.data)
                get_player.deaths += int(player.getElementsByTagName("Deaths")[0].firstChild.data)
                get_player.suicides += int(player.getElementsByTagName("Suicides")[0].firstChild.data)

                get_player.modification_date = timezone.now()
                get_player.last_game_map = game_map
                get_player.last_game_type = game_type
                get_player.last_game_variant = game_variant
                get_player.save()

                print('['+str(get_player.pk)+']'+get_player.name + ' actualizado.')
                #response = JsonResponse({'status':'ok', 'response':'Player Updated'})
                #response['Access-Control-Allow-Origin'] = '*'
                #return response
            except Exception as e:
                new_player = Player(name=pname)

                print("SCORE: " + player.getElementsByTagName("Score")[0].firstChild.data)
                new_player.score += int(player.getElementsByTagName("Score")[0].firstChild.data)
                new_player.kills += int(player.getElementsByTagName("Kills")[0].firstChild.data)
                new_player.assists += int(player.getElementsByTagName("Assists")[0].firstChild.data)
                new_player.deaths += int(player.getElementsByTagName("Deaths")[0].firstChild.data)
                new_player.suicides += int(player.getElementsByTagName("Suicides")[0].firstChild.data)

                new_player.register_date = timezone.now()

                new_player.last_game_map = game_map
                new_player.last_game_type = game_type
                new_player.last_game_variant = game_variant
                new_player.save()
                
                print('['+str(new_player.pk)+']'+new_player.name + ' creado.')
