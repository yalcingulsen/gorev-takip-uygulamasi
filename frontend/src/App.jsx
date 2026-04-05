import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const API_URL = "https://backend-api-6o8q.onrender.com";

  const showMessage = (type, message) => {
    if (type === "error") {
      setErrorMessage(message);
      setSuccessMessage("");
    } else {
      setSuccessMessage(message);
      setErrorMessage("");
    }

    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 2500);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      showMessage("error", "Görevler alınamadı");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      showMessage("error", "Görev başlığı boş olamaz");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage("error", data.message || "Görev eklenemedi");
        return;
      }

      setTitle("");
      setDescription("");
      fetchTasks();
      showMessage("success", "Görev başarıyla eklendi");
    } catch (error) {
      showMessage("error", "Görev eklenirken hata oluştu");
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage("error", data.message || "Görev silinemedi");
        return;
      }

      fetchTasks();
      showMessage("success", "Görev silindi");
    } catch (error) {
      showMessage("error", "Görev silinirken hata oluştu");
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT"
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage("error", data.message || "Görev güncellenemedi");
        return;
      }

      fetchTasks();
      showMessage("success", "Görev durumu güncellendi");
    } catch (error) {
      showMessage("error", "Durum değiştirilirken hata oluştu");
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      showMessage("error", "Görev başlığı boş olamaz");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage("error", data.message || "Görev güncellenemedi");
        return;
      }

      setEditingTaskId(null);
      setEditTitle("");
      setEditDescription("");
      fetchTasks();
      showMessage("success", "Görev güncellendi");
    } catch (error) {
      showMessage("error", "Görev düzenlenirken hata oluştu");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const safeTitle = task.title || "";
    const safeDescription = task.description || "";

    const matchesSearch =
      safeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeDescription.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "completed") {
      return matchesSearch && task.completed;
    }

    if (filter === "pending") {
      return matchesSearch && !task.completed;
    }

    return matchesSearch;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #e0f2fe 100%)",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif"
    },
    container: {
      maxWidth: "860px",
      margin: "0 auto",
      backgroundColor: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(6px)",
      padding: "32px",
      borderRadius: "24px",
      boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
      border: "1px solid rgba(255,255,255,0.7)"
    },
    title: {
      textAlign: "center",
      marginBottom: "8px",
      color: "#0f172a",
      fontSize: "36px"
    },
    subtitle: {
      textAlign: "center",
      color: "#475569",
      marginBottom: "28px",
      fontSize: "16px"
    },
    messageError: {
      backgroundColor: "#fef2f2",
      color: "#b91c1c",
      padding: "12px 14px",
      borderRadius: "12px",
      marginBottom: "16px",
      border: "1px solid #fecaca"
    },
    messageSuccess: {
      backgroundColor: "#ecfdf5",
      color: "#166534",
      padding: "12px 14px",
      borderRadius: "12px",
      marginBottom: "16px",
      border: "1px solid #bbf7d0"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "14px",
      marginBottom: "28px"
    },
    statCardBlue: {
      background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
      padding: "20px",
      borderRadius: "18px",
      textAlign: "center",
      border: "1px solid #bfdbfe",
      boxShadow: "0 8px 20px rgba(59, 130, 246, 0.10)"
    },
    statCardGreen: {
      background: "linear-gradient(135deg, #dcfce7, #f0fdf4)",
      padding: "20px",
      borderRadius: "18px",
      textAlign: "center",
      border: "1px solid #bbf7d0",
      boxShadow: "0 8px 20px rgba(34, 197, 94, 0.10)"
    },
    statCardOrange: {
      background: "linear-gradient(135deg, #ffedd5, #fff7ed)",
      padding: "20px",
      borderRadius: "18px",
      textAlign: "center",
      border: "1px solid #fdba74",
      boxShadow: "0 8px 20px rgba(249, 115, 22, 0.10)"
    },
    statTitle: {
      margin: "0 0 8px 0",
      color: "#1e293b",
      fontSize: "16px"
    },
    statNumber: {
      margin: 0,
      fontSize: "28px",
      fontWeight: "bold",
      color: "#0f172a"
    },
    sectionCard: {
      backgroundColor: "#ffffff",
      borderRadius: "18px",
      padding: "18px",
      marginBottom: "22px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)"
    },
    input: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      fontSize: "15px",
      boxSizing: "border-box",
      outline: "none",
      marginBottom: "12px",
      backgroundColor: "#f8fafc"
    },
    textarea: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      fontSize: "15px",
      minHeight: "95px",
      resize: "vertical",
      boxSizing: "border-box",
      outline: "none",
      marginBottom: "12px",
      backgroundColor: "#f8fafc"
    },
    primaryButton: {
      padding: "13px 18px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      color: "white",
      fontSize: "15px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(37, 99, 235, 0.20)"
    },
    filterRow: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap"
    },
    taskCard: (completed) => ({
      border: completed ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
      borderRadius: "18px",
      padding: "20px",
      marginBottom: "16px",
      background: completed
        ? "linear-gradient(135deg, #f0fdf4, #f8fafc)"
        : "linear-gradient(135deg, #ffffff, #f8fafc)",
      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)"
    }),
    taskTitle: (completed) => ({
      margin: "0 0 10px 0",
      color: completed ? "#166534" : "#0f172a",
      textDecoration: completed ? "line-through" : "none",
      fontSize: "20px"
    }),
    taskDescription: {
      margin: "0 0 10px 0",
      color: "#475569",
      lineHeight: "1.5"
    },
    taskDate: {
      margin: "0 0 15px 0",
      color: "#64748b",
      fontSize: "14px"
    },
    buttonRow: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap"
    },
    greenButton: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold"
    },
    orangeButton: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg, #fb923c, #f97316)",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold"
    },
    blueButton: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold"
    },
    redButton: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg, #ef4444, #dc2626)",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold"
    },
    grayButton: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg, #94a3b8, #64748b)",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold"
    },
    filterButton: (active, type) => {
      const backgrounds = {
        all: active
          ? "linear-gradient(135deg, #1e293b, #0f172a)"
          : "#cbd5e1",
        completed: active
          ? "linear-gradient(135deg, #22c55e, #16a34a)"
          : "#cbd5e1",
        pending: active
          ? "linear-gradient(135deg, #fb923c, #f97316)"
          : "#cbd5e1"
      };

      return {
        padding: "10px 14px",
        borderRadius: "10px",
        border: "none",
        background: backgrounds[type],
        color: "white",
        cursor: "pointer",
        fontWeight: "bold"
      };
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Görev Takip Uygulaması</h1>
        <p style={styles.subtitle}>
          Günlük işlerini düzenle, filtrele, güncelle ve kontrol altında tut.
        </p>

        {errorMessage && <div style={styles.messageError}>{errorMessage}</div>}
        {successMessage && <div style={styles.messageSuccess}>{successMessage}</div>}

        <div style={styles.statsGrid}>
          <div style={styles.statCardBlue}>
            <h3 style={styles.statTitle}>Toplam Görev</h3>
            <p style={styles.statNumber}>{totalTasks}</p>
          </div>

          <div style={styles.statCardGreen}>
            <h3 style={styles.statTitle}>Tamamlanan</h3>
            <p style={styles.statNumber}>{completedTasks}</p>
          </div>

          <div style={styles.statCardOrange}>
            <h3 style={styles.statTitle}>Tamamlanmayan</h3>
            <p style={styles.statNumber}>{pendingTasks}</p>
          </div>
        </div>

        <div style={styles.sectionCard}>
          <input
            type="text"
            placeholder="Görev başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Görev açıklaması"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />

          <button onClick={addTask} style={styles.primaryButton}>
            Görev Ekle
          </button>
        </div>

        <div style={styles.sectionCard}>
          <input
            type="text"
            placeholder="Görev ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...styles.input, marginBottom: "14px" }}
          />

          <div style={styles.filterRow}>
            <button
              onClick={() => setFilter("all")}
              style={styles.filterButton(filter === "all", "all")}
            >
              Tümü
            </button>

            <button
              onClick={() => setFilter("completed")}
              style={styles.filterButton(filter === "completed", "completed")}
            >
              Tamamlananlar
            </button>

            <button
              onClick={() => setFilter("pending")}
              style={styles.filterButton(filter === "pending", "pending")}
            >
              Tamamlanmayanlar
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div style={styles.sectionCard}>
            <p style={{ textAlign: "center", color: "#64748b", margin: 0 }}>
              Görev bulunamadı.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} style={styles.taskCard(task.completed)}>
              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={styles.input}
                  />

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={styles.textarea}
                  />

                  <div style={styles.buttonRow}>
                    <button
                      onClick={() => saveEdit(task.id)}
                      style={styles.blueButton}
                    >
                      Kaydet
                    </button>

                    <button onClick={cancelEditing} style={styles.grayButton}>
                      İptal
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={styles.taskTitle(task.completed)}>{task.title}</h3>

                  <p style={styles.taskDescription}>
                    {task.description || "Açıklama yok"}
                  </p>

                  <p style={styles.taskDate}>
                    Oluşturulma tarihi: {task.createdAt || "Tarih yok"}
                  </p>

                  <div style={styles.buttonRow}>
                    <button
                      onClick={() => toggleTask(task.id)}
                      style={task.completed ? styles.orangeButton : styles.greenButton}
                    >
                      {task.completed ? "Tamamlanmadı" : "Tamamlandı"}
                    </button>

                    <button
                      onClick={() => startEditing(task)}
                      style={styles.blueButton}
                    >
                      Düzenle
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      style={styles.redButton}
                    >
                      Sil
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;