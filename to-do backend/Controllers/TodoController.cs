using Microsoft.AspNetCore.Mvc;
using to_do_backend.Models;
using to_do_backend.Services;

namespace to_do_backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class TodoController : ControllerBase
    {
        private readonly TodoService _service;

        public TodoController()
        {
            _service = new TodoService();
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var todo = _service.GetById(id);
            return todo == null ? NotFound() : Ok(todo);
        }

        [HttpPost]
        public IActionResult Create(TodoItem item)
        {
            _service.Add(item);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, TodoItem item)
        {
            if (id != item.Id) return BadRequest();
            _service.Update(item);
            return Ok(item);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return NoContent();
        }
    }
}
