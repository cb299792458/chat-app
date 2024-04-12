from django.http import JsonResponse

# Create your views here.
def test(request):
    data = {'message': 'Hello, world!'}
    return JsonResponse(data)
