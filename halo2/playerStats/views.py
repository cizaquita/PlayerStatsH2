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
	# La peticion debe ser en metodo GET
	if request.method == "GET":
		try:
			players = Player.objects.all()
			data = serializers.serialize('json', list(players))
			response = JsonResponse(data, safe=False)
			#response = HttpResponse(json.dumps(data, cls=DjangoJSONEncoder))
			response['Access-Control-Allow-Origin'] = '*'
			return response

		except Exception as e:
			response = JsonResponse({'status':'error', 'response':'No se encuentran registros de PLAYERS o ' + str(e)})
			response['Access-Control-Allow-Origin'] = '*'
			return response
