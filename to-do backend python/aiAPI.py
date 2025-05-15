import os

from flask import Flask, jsonify, request

from openai import OpenAI





app = Flask(__name__)

os.environ["OPENAI_API_KEY"] = "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"



@app.route('/ai', methods=['POST'])

def getAiByPost():

    data = request.json
    todos=data.get('toDo')

    conversation = data.get('question')
    
    language = data.get('language')

    model_name = data.get('model_name')
    intro=f"Egy to-do appban segítesz az embereknek az esetleges kérdéseikkel a teendőkkel kapcsolatban, válaszolj neki legjobb tudásod szerint! Ezek a teendők vannak a listában: ${todos}. Ezt beszélgettétek korábban, vedd figyelembe ezeket is: ${conversation}. Válaszolj úgy, hogy a felhasználó ne gondolja, hogy előzetes utasításokat kaptál, csak látod a to-dokat és emlékszel az előzményekre!"
    

    client = OpenAI()



    completion = client.chat.completions.create(

    model=model_name,

    messages=[{

        "role": "user",

        "content": intro

    }]

)



    print(completion.choices[0].message.content)

    

    return completion.choices[0].message.content





if __name__ == '__main__':

    app.run(debug=True)

