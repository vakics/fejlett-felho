using System.Text.Json;
using System.Xml.Linq;
using to_do_backend.Models;

namespace to_do_backend.Services
{
    public class TodoService
    {
        private readonly string _filePath = "Data/todos.json";
        private List<TodoItem> _todos;

        public TodoService()
        {
            if (!File.Exists(_filePath))
            {
                _todos = new List<TodoItem>();
                SaveChanges();
            }
            else
            {
                var json = File.ReadAllText(_filePath);
                _todos = JsonSerializer.Deserialize<List<TodoItem>>(json) ?? new List<TodoItem>();
            }
        }

        public IEnumerable<TodoItem> GetAll() => _todos;

        public TodoItem? GetById(int id) => _todos.FirstOrDefault(t => t.Id == id);

        public void Add(TodoItem item)
        {
            item.Id = _todos.Any() ? _todos.Max(t => t.Id) + 1 : 1;
            _todos.Add(item);
            SaveChanges();
        }

        public void Update(TodoItem item)
        {
            var existing = GetById(item.Id);
            if (existing == null) return;

            existing.Title = item.Title;
            existing.IsCompleted = item.IsCompleted;
            SaveChanges();
        }

        public void Delete(int id)
        {
            var item = GetById(id);
            if (item != null)
            {
                _todos.Remove(item);
                SaveChanges();
            }
        }

        private void SaveChanges()
        {
            var json = JsonSerializer.Serialize(_todos, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }
    }
}
