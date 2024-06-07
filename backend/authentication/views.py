from django.http import JsonResponse

# Create your views here.
def test(request):
    data = {'message': 'Hello, auth!'}
    return JsonResponse(data)
