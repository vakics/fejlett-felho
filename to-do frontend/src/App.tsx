import { useEffect, useState } from "react";
import "./assets/App.css";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";
import { Chatbox } from "./Chatbox";

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
}

function App() {
  const baseURL = "https://localhost:7036/api";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [show, setShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const fetchTodos = () => {
    axios
      .get(`${baseURL}`)
      .then((resp) => {
        setTasks(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    axios
      .post(`${baseURL}`, {
        title: newTask,
        isCompleted: false,
        dueDate: newDueDate || null,
      })
      .then((resp) => {
        setTasks([
          ...tasks,
          {
            id: resp.data.id,
            title: resp.data.title,
            isCompleted: resp.data.isCompleted,
            dueDate: resp.data.dueDate,
          },
        ]);
        setNewTask("");
        setNewDueDate("");
        setToastMessage("Task successfully added!");
        setToastVariant("success");
        setShow(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleTask = (id: number) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    if (!taskToUpdate) return;

    const updatedTask = {
      ...taskToUpdate,
      isCompleted: !taskToUpdate.isCompleted,
    };

    axios
      .put(`${baseURL}/${id}`, updatedTask)
      .then(() => {
        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteTask = (id: number) => {
    axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setToastMessage("Task deleted!");
        setToastVariant("danger");
        setShow(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
      <div className="bg-dark position-relative">
        <ToastContainer
          position="top-end"
          className="p-3"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 99,
          }}
        >
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={3000}
            autohide
            bg={toastVariant}
          >
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Todo App</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
      <form onSubmit={handleAddTask}>
        <h2>To-do</h2>
        <div className="add-area">
          <input
            type="text"
            placeholder="Place a task here!"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <button type="submit" className="btn btn-success">
            +
          </button>
        </div>
        <div>
          <table>
            <tbody>
              {tasks.map((t) => (
                <tr className="task" key={t.id}>
                  <td
                    style={{
                      textDecoration: t.isCompleted ? "line-through" : "none",
                    }}
                  >
                    {t.title}
                  </td>
                  <td>
                    {t.dueDate && (
                      <small
                        style={{
                          marginLeft: "10px",
                          fontStyle: "italic",
                          color: "#888",
                        }}
                      >
                        (Due: {t.dueDate.slice(0, t.dueDate.length - 9)})
                      </small>
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={t.isCompleted}
                      onChange={() => toggleTask(t.id)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteTask(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
      <Chatbox />
    </div>
  );
}

export default App;
