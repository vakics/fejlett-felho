import os

from flask import Flask, jsonify, request

from openai import OpenAI





app = Flask(__name__)

os.environ["OPENAI_API_KEY"] = "PUT API KEY HERE"



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

