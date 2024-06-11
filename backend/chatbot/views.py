from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def test():
    data = {'message': 'Hello, chatbot!'}
    return JsonResponse(data)

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        messages = data.get('messages', '')

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=100,
        )

        return JsonResponse(
            {
                'message': response.choices[0].message.content
            }
        )

    else:
        return JsonResponse({'error': 'Invalid request method'})
