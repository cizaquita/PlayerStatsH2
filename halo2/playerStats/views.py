from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.clickjacking import xframe_options_exempt
from django.core import serializers
#Minidom read XML stats file
from .models import *


# Create your views here.
def index(request):
    return HttpResponse("Página en construcción...")


@xframe_options_exempt
@csrf_exempt
def get_players(request):
	if request.method == "GET":
		try:
			players = Player.objects.all()
			data = serializers.serialize('json', list(players))
			response = JsonResponse(data, safe=False)
			response['Access-Control-Allow-Origin'] = '*'
			return response

		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de PLAYERS o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response

# ClowList
@xframe_options_exempt
@csrf_exempt
def clow_players(request):
	if request.method == "GET":
		try:
			players = Player.objects.filter(name__icontains='clow', isMember=True)
			data = serializers.serialize('json', list(players))
			response = JsonResponse(data, safe=False)
			response['Access-Control-Allow-Origin'] = '*'
			return response

		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de PLAYERS o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response

# TopKills
@xframe_options_exempt
@csrf_exempt
def top_kills(request):
	if request.method == "GET":
		try:
			players = (Player.objects.order_by('-kills')[:50])
			data = serializers.serialize('json', list(players))
			response = JsonResponse(data, safe=False)
			response['Access-Control-Allow-Origin'] = '*'
			return response

		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de PLAYERS o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response

# TopSpree
@xframe_options_exempt
@csrf_exempt
def top_spree(request):
	if request.method == "GET":
		try:
			players = (Player.objects.order_by('-best_spree')[:50])
			data = serializers.serialize('json', list(players))
			response = JsonResponse(data, safe=False)
			response['Access-Control-Allow-Origin'] = '*'
			return response
		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de PLAYERS o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response

# Search player
@csrf_exempt
def search_player(request):
	if request.method == "GET":
		try:
			name_search = request.GET["q"]
			if name_search and len(name_search) > 2:
				players = Player.objects.filter(name__icontains = name_search)
				data = serializers.serialize('json', list(players))
				response = JsonResponse(data, safe=False)
				response['Access-Control-Allow-Origin'] = '*'
				return response  

			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de PLAYERS o solicitud vacia'})
			response['Access-Control-Allow-Origin'] = '*'
			return response   		
		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de PLAYERS o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response

# Last Activity
@xframe_options_exempt
@csrf_exempt
def last_activity(request):
	if request.method == "GET":
		try:
			players = (Player.objects.order_by('-modification_date')[:100])
			data = serializers.serialize('json', list(players))
			response = JsonResponse(data, safe=False)
			response['Access-Control-Allow-Origin'] = '*'
			return response

		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de PLAYERS o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response

# Last MOTD
@xframe_options_exempt
@csrf_exempt
def get_motd(request):
	if request.method == "GET":
		try:
			motd = (MOTD.objects.order_by('-creation_date')[:5])
			data = serializers.serialize('json', list(motd))
			response = JsonResponse(data, safe=False)
			response['Access-Control-Allow-Origin'] = '*'
			return response

		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de MOTD o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response
# Last MOTD
@xframe_options_exempt
@csrf_exempt
def set_motd(request):
	if request.method == "GET":
		try:
			token = request.GET["token"]
			title = request.GET["title"]
			message = request.GET["message"]
			if (title and len(title) > 3) and (message and len(message) > 10) and (token == 'chris420') :
				motd = MOTD(title=title, message=message)
				motd.save()
				response = JsonResponse({'status':'ok'})
				response['Access-Control-Allow-Origin'] = '*'
				return response

			response = JsonResponse({'status':'error', 'response':'No data.'})
			response['Access-Control-Allow-Origin'] = '*'
			return response

		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de MOTD o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response

# Update VIP
@xframe_options_exempt
@csrf_exempt
def update_vip(request):
	if request.method == "GET":
		try:
			token = request.GET["token"]
			if (token == 'chris420' ):
				players = (Player.objects.order_by('-kills')[:20])
				Player.objects.filter(pk__in=players).update(isVIP = True)

				response = JsonResponse({'status':'ok'})
				response['Access-Control-Allow-Origin'] = '*'
				return response

			response = JsonResponse({'status':'error', 'response':'No data.'})
			response['Access-Control-Allow-Origin'] = '*'
			return response

		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'Error actualizando miembros VIP o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response



# Search player
@csrf_exempt
def get_player(request):
	if request.method == "GET":
		try:
			id = request.GET["id"]
			players = Player.objects.filter(pk = id)
			data = serializers.serialize('json', list(players))
			response = JsonResponse(data, safe=False)
			response['Access-Control-Allow-Origin'] = '*'
			return response  		
		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de PLAYERS o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response

# Update VIP
@xframe_options_exempt
@csrf_exempt
def set_vip(request):
	if request.method == "GET":
		try:
			token = request.GET["token"]
			id = request.GET["id"]

			if (token == 'chris420' ):
				player = Player.objects.filter(pk=id).update(isVIP = True)

				response = JsonResponse({'status':'ok'})
				response['Access-Control-Allow-Origin'] = '*'
				return response

			response = JsonResponse({'status':'error', 'response':'No data.'})
			response['Access-Control-Allow-Origin'] = '*'
			return response

		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'Error actualizando miembros VIP o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response

