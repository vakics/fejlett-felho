using Microsoft.AspNetCore.Mvc;
using to_do_backend.Models;
using to_do_backend.Services;

namespace to_do_backend.Controllers
{
    [Route("ai")]
    [ApiController]

    public class AiController : Controller
    {
        private TodoService todoService = new TodoService();
        [HttpPost("ask")]
        public async Task<IActionResult> AskAI([FromBody] ChatRequest request)
        {
            var ai = new AiAPI();
            var response = await ai.callChatGpt(request.Message, (List<TodoItem>)todoService.GetAll());
            return Ok(new { reply = response });
        }

    }
    public class ChatRequest
    {
        public List<Message> Message { get; set; }
    }
}
