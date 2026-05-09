import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../api/eventApi.js";
import Loading from "../components/Loading.jsx";
import { formatDateTime, getApiMessage } from "../utils/formatters.js";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  startDateTime: "",
  endDateTime: "",
  capacity: "",
  category: "",
  image: ""
};

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    getEvents()
      .then(setEvents)
      .catch((err) => setError(getApiMessage(err, "Unable to load events.")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.title || !form.description || !form.location || !form.startDateTime || !form.endDateTime || !form.capacity || !form.category) {
      setError("Complete all required event fields.");
      return;
    }
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (editingId) {
        await updateEvent(editingId, payload);
        setMessage("Event updated successfully.");
      } else {
        await createEvent(payload);
        setMessage("Event created successfully.");
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(getApiMessage(err, "Unable to save event."));
    }
  };

  const uploadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Please choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setError("");
      setForm((current) => ({ ...current, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const edit = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      startDateTime: event.startDateTime?.slice(0, 16) || "",
      endDateTime: event.endDateTime?.slice(0, 16) || "",
      capacity: event.capacity || "",
      category: event.category || "",
      image: event.image || ""
    });
  };

  const remove = async (id) => {
    try {
      await deleteEvent(id);
      setEvents((items) => items.filter((event) => event.id !== id));
      setMessage("Event deleted successfully.");
    } catch (err) {
      setError(getApiMessage(err, "Unable to delete event."));
    }
  };

  if (loading) return <Loading label="Loading admin events" />;

  return (
    <section className="admin-layout">
      <div>
        <span className="eyebrow">Manage events</span>
        <h1>{editingId ? "Edit event" : "Create event"}</h1>
        <form className="admin-form" onSubmit={submit}>
          <label className="image-upload">
            <input type="file" accept="image/*" onChange={uploadImage} />
            <span><ImagePlus size={18} /> Upload event image</span>
          </label>
          {form.image && (
            <div className="image-preview">
              <img src={form.image} alt="Event preview" />
              <button className="button ghost small" type="button" onClick={() => setForm({ ...form, image: "" })}>
                <X size={16} /> Remove image
              </button>
            </div>
          )}
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" />
          <div className="form-grid">
            <input type="datetime-local" value={form.startDateTime} onChange={(e) => setForm({ ...form, startDateTime: e.target.value })} />
            <input type="datetime-local" value={form.endDateTime} onChange={(e) => setForm({ ...form, endDateTime: e.target.value })} />
          </div>
          <div className="form-grid">
            <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Capacity" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" />
          </div>
          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}
          <div className="button-row">
            <button className="button primary" type="submit"><Plus size={17} /> {editingId ? "Update Event" : "Create Event"}</button>
            {editingId && <button className="button ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</button>}
          </div>
        </form>
      </div>
      <div className="admin-list">
        {events.map((event) => (
          <article className="admin-row" key={event.id}>
            <div className="admin-event-summary">
              <div className="admin-event-thumb" style={{ backgroundImage: event.image ? `url(${event.image})` : undefined }}>
                {!event.image && <span>{event.category?.charAt(0) || "E"}</span>}
              </div>
              <div>
                <strong>{event.title}</strong>
                <span>{event.location} - {formatDateTime(event.startDateTime)}</span>
              </div>
            </div>
            <div className="row-actions">
              <button className="icon-button" type="button" onClick={() => edit(event)} aria-label="Edit event"><Pencil size={18} /></button>
              <button className="icon-button danger-soft" type="button" onClick={() => remove(event.id)} aria-label="Delete event"><Trash2 size={18} /></button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
