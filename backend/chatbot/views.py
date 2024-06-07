from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def test(request):
    data = {'message': 'Hello, chatbot!'}
    return JsonResponse(data)

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        message = data.get('message', '')

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": message}
            ],
            max_tokens=100)
        print(response.choices[0].message.content)
        return JsonResponse(
            {
                'message': response.choices[0].message.content
            }
        )

    else:
        return JsonResponse({'error': 'Invalid request method'})
