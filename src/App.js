import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

const exercises = [
  { id: "1", name: "Wrist Extensor Stretch", image: "/images/wrist_extensor.jpg" },
  { id: "2", name: "Wrist Flexor Stretch", image: "/images/wrist_flexor.jpg" },
  { id: "3", name: "Wrist Extension", image: "/images/wrist_extension.jpg" },
  { id: "4", name: "Wrist Flexion", image: "/images/wrist_flexion.jpg" },
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function loadData() {
  return JSON.parse(localStorage.getItem("exerciseData") || "{}");
}

function saveData(data) {
  localStorage.setItem("exerciseData", JSON.stringify(data));
}

function Home() {
  return (
    <div style={{padding:20}}>
      <h2>Daily Exercise Tracker</h2>
      {exercises.map(ex => (
        <div key={ex.id}>
          <Link to={`/exercise/${ex.id}`}>{ex.name}</Link>
        </div>
      ))}
      <br/>
      <Link to="/calendar">View Calendar</Link>
    </div>
  );
}

function ExercisePage() {
  const { id } = useParams();
  const exercise = exercises.find(e => e.id === id);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const data = loadData();
    const today = getToday();
    setCompleted(data[today]?.[id] || false);
  }, [id]);

  const toggle = () => {
    const data = loadData();
    const today = getToday();
    if (!data[today]) data[today] = {};
    data[today][id] = !completed;
    saveData(data);
    setCompleted(!completed);
  };

  return (
    <div style={{padding:20}}>
      <h2>{exercise?.name}</h2>
      <img src={exercise?.image} alt="" style={{width:"100%", maxWidth:300}} />
      <br/><br/>
      <button onClick={toggle}>
        {completed ? "Completed" : "Mark Complete"}
      </button>
      <br/><br/>
      <Link to="/">Back</Link>
    </div>
  );
}

function Calendar() {
  const data = loadData();
  return (
    <div style={{padding:20}}>
      <h2>Calendar</h2>
      {Object.keys(data).map(day => (
        <div key={day}>
          <b>{day}</b>
          <ul>
            {Object.entries(data[day]).map(([id,val]) => val && <li key={id}>{exercises.find(e=>e.id===id)?.name}</li>)}
          </ul>
        </div>
      ))}
      <Link to="/">Back</Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExercisePage />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}
