import { useParams } from "react-router-dom";
import Question from "./Question";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { io } from "socket.io-client";

// Create socket connection (you can move this to a separate file)
const socket = io(serverEndpoint, {
  withCredentials: true,
});

function Room() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(null);
  const [questions, setQuestions] = useState([]);
  const[topQuestions, setTopQuestions] =useState([]);

  const fetchTopQuestions = async() => {
    try{
      const response = await.get(`${serverEndpoint}/room/${code}/top-questions`,{
        withCredentials:true
      });
      setTopQuestions(response.data || []);
    }catch(error){
      console.log(error);
      setErrors({message:'Unable to fetch top Questions'});
    }
  };

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/room/${code}`, {
        withCredentials: true,
      });
      setRoom(response.data);
    } catch (err) {
      console.error(err);
      setError({ message: "Unable to fetch room details. Please try again." });
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/room/${code}/question`, {
        withCredentials: true,
      });
      setQuestions(response.data);
    } catch (err) {
      console.error(err);
      setError({ message: "Unable to fetch questions. Please try again." });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchRoom();
      await fetchQuestions();
      setLoading(false);
    };

    fetchData();

    // Join room via socket
    socket.emit("join-room", code);

    // Listen for new questions
    socket.on("new-question", (question) => {
      setQuestions((prev) => [question, ...prev]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("new-question");
    };
  }, [code]);

  if (loading) return <div className="container py-5">Loading...</div>;

  if (error) return <div className="container py-5 text-danger">{error.message}</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-2">Room: {code}</h2>
      <button className="btn btn-sm btn-outline-success" onClick={fetchTopQuestions}>
        Get Top Questions
      </button>
      <hr/>
      {topQuestions.length >0 &&}
      <div className="row mb-4">
        <div className="col">
          <ul className="list-group">
            {questions.map((ques) => (
              <li key={ques._id} className="list-group-item">
                {ques.content}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row">
        <Question roomCode={code} />
      </div>
    </div>
  );
}

export default Room;
