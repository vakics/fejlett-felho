using System.Text.Json;

namespace to_do_backend.Models
{
    public class AiAPI
    {
        private static readonly HttpClient client = new HttpClient();
        public AiAPI()
        {

            // This is a constructor

        }



        public async Task<List<Message>> callPythonAPI()

        {

            // This is a method

            string link = "http://127.0.0.1:5000/books";


            var requestBody = new

            {

                question = "",

                language = "Hungarian",

                model_name = "4o"

            };

            List<Message> books2 = new List<Message>();

            var response2 = await client.PostAsJsonAsync(link, requestBody);

            if (response2.IsSuccessStatusCode)

            {

                var responseContent = await response2.Content.ReadAsStringAsync();

                books2 = JsonSerializer.Deserialize<List<Message>>(responseContent);

            }



            return books2;



        }

        public async Task<String> callChatGpt(List<Message> messages, List<TodoItem> todos)
        {
            string link = "http://127.0.0.1:5000/ai";

            var requestBody = new

            {

                question = messages,

                toDo= todos,

                language = "Hungarian",

                model_name = "gpt-4o-mini"

            };
            var response2 = await client.PostAsJsonAsync(link, requestBody);
            if (response2.IsSuccessStatusCode)
            {
                var responseContent = await response2.Content.ReadAsStringAsync();
                return responseContent;
            }
            return "Hiba történt a ChatGpt hívás során.";

        }

    }

    public class Message
    {
        public string Sender { get; set; }
        public string Text { get; set; }
    }
}
