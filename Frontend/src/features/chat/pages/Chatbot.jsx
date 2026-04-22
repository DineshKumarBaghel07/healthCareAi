import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { initializeSocketConnection } from "../service/chat.socket.js";
import "./Chatbot.css";

const TRIAGE_QUESTIONS = [
  {
    id: "primary_symptom",
    text: "Sabse zyada issue kis type ka hai?",
    options: [
      {
        value: "chest",
        label: "Chest pain ya saans ki dikkat",
        scores: { cardiologist: 3, pulmonologist: 2 },
      },
      {
        value: "skin",
        label: "Skin, allergy, rashes",
        scores: { dermatologist: 3 },
      },
      {
        value: "stomach",
        label: "Pet, acidity, digestion",
        scores: { gastroenterologist: 3 },
      },
      {
        value: "bone",
        label: "Joints, back ya bone pain",
        scores: { orthopedist: 3 },
      },
      {
        value: "mind",
        label: "Stress, sleep, anxiety, headache",
        scores: { psychiatrist: 2, neurologist: 2 },
      },
      {
        value: "general",
        label: "Fever, weakness, general problem",
        scores: { general_physician: 3 },
      },
    ],
  },
  {
    id: "duration",
    text: "Ye problem kitne time se hai?",
    options: [
      {
        value: "short",
        label: "1-3 din",
        scores: { general_physician: 2 },
      },
      {
        value: "medium",
        label: "4-14 din",
        scores: { general_physician: 1 },
      },
      {
        value: "long",
        label: "2 hafte se zyada",
        scores: { cardiologist: 1, neurologist: 1, gastroenterologist: 1, dermatologist: 1, orthopedist: 1 },
      },
    ],
  },
  {
    id: "severity",
    text: "Abhi severity kya hai?",
    options: [
      {
        value: "mild",
        label: "Mild - normal kaam ho raha hai",
        scores: { general_physician: 1 },
      },
      {
        value: "moderate",
        label: "Moderate - discomfort zyada hai",
        scores: { general_physician: 1 },
      },
      {
        value: "severe",
        label: "Severe - bahut takleef / emergency lag rahi",
        scores: {},
        emergency: true,
      },
    ],
  },
  {
    id: "age_group",
    text: "Patient kis age group mein aata hai?",
    options: [
      {
        value: "child",
        label: "Child (0-14)",
        scores: { pediatrician: 3 },
      },
      {
        value: "adult",
        label: "Adult (15-59)",
        scores: {},
      },
      {
        value: "senior",
        label: "Senior (60+)",
        scores: { cardiologist: 1, neurologist: 1, general_physician: 1 },
      },
    ],
  },
];

const SPECIALTY_LABELS = {
  cardiologist: "Cardiologist",
  pulmonologist: "Pulmonologist",
  dermatologist: "Dermatologist",
  gastroenterologist: "Gastroenterologist",
  orthopedist: "Orthopedist",
  psychiatrist: "Psychiatrist",
  neurologist: "Neurologist",
  pediatrician: "Pediatrician",
  general_physician: "General Physician",
};

const nextMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function Chatbot({ onClose }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");

  const [triageStep, setTriageStep] = useState(0);
  const [triageDone, setTriageDone] = useState(false);
  const [triageScores, setTriageScores] = useState({});
  const [emergencyFlag, setEmergencyFlag] = useState(false);

  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  const pushBotMessage = useCallback((text) => {
    setMessages((prev) => [...prev, { id: nextMessageId(), text, sender: "bot" }]);
  }, []);

  const pushUserMessage = useCallback((text) => {
    setMessages((prev) => [...prev, { id: nextMessageId(), text, sender: "user" }]);
  }, []);

  const askCurrentQuestion = useCallback(
    (stepIndex) => {
      const question = TRIAGE_QUESTIONS[stepIndex];
      if (!question) return;
      pushBotMessage(question.text);
    },
    [pushBotMessage],
  );

  useEffect(() => {
    const socket = initializeSocketConnection();
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      setError("");
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = () => {
      setError("Unable to connect to chat server.");
      setIsConnected(false);
    };

    const addIncomingMessage = (message, sender) => {
      if (!message?._id || messageIdsRef.current.has(message._id)) return;
      messageIdsRef.current.add(message._id);
      setMessages((prev) => [
        ...prev,
        { id: message._id, text: message.content, sender },
      ]);
    };

    const handleChatResponse = (payload) => {
      if (!payload?.success) return;
      if (payload.chatId) setChatId(payload.chatId);

      addIncomingMessage(payload.userMessage, "user");
      addIncomingMessage(payload.aiMessage, "bot");
      setTyping(false);
      setError("");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("chat:response", handleChatResponse);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("chat:response", handleChatResponse);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    pushBotMessage("Namaste, pehle quick health assessment karte hain.");
    askCurrentQuestion(0);
  }, [askCurrentQuestion, pushBotMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const getSuggestedSpecialty = (scores) => {
    const entries = Object.entries(scores || {});
    if (!entries.length) return "general_physician";

    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0] || "general_physician";
  };

  const completeTriage = (scores, isEmergency) => {
    if (isEmergency) {
      pushBotMessage("Aapke answers emergency indicate karte hain. Kripya turant nearest emergency ya hospital visit karein.");
      pushBotMessage("Agar stable ho, to abhi ke liye General Physician se immediate consult karein.");
      setTriageDone(true);
      return;
    }

    const specialty = getSuggestedSpecialty(scores);
    const label = SPECIALTY_LABELS[specialty] || "General Physician";

    pushBotMessage(`Aapke answers ke base par recommended doctor: ${label}`);
    pushBotMessage("Aap /doctors page par specialist dekh sakte hain. Chahein to ab mujhe follow-up question text me pooch sakte hain.");
    setTriageDone(true);
  };

  const handleOptionSelect = (option) => {
    if (triageDone) return;

    pushUserMessage(option.label);

    const nextScores = { ...triageScores };
    Object.entries(option.scores || {}).forEach(([key, value]) => {
      nextScores[key] = (nextScores[key] || 0) + value;
    });

    const isEmergency = emergencyFlag || Boolean(option.emergency);
    setTriageScores(nextScores);
    setEmergencyFlag(isEmergency);

    const nextStep = triageStep + 1;
    if (nextStep >= TRIAGE_QUESTIONS.length) {
      completeTriage(nextScores, isEmergency);
      setTriageStep(nextStep);
      return;
    }

    setTriageStep(nextStep);
    askCurrentQuestion(nextStep);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !socketRef.current || !isConnected || typing || !triageDone) return;

    setTyping(true);
    setError("");

    socketRef.current.emit("chat:send", { message: text, chatId }, (ack) => {
      if (!ack?.success) {
        setTyping(false);
        setError(ack?.error || "Failed to send message.");
      }
    });

    setInput("");
  };

  const currentQuestion = TRIAGE_QUESTIONS[triageStep];

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>AI Health Assistant</span>
        <small className="chat-status">{isConnected ? "Live" : "Connecting..."}</small>
        {onClose && (
          <button className="chat-close-btn" onClick={onClose}>
            x
          </button>
        )}
      </div>

      <div className="chat-box">
        <ul className="chat-list">
          {messages.map((msg) => (
            <li key={msg.id} className={`chat-bubble ${msg.sender}`}>
              {msg.text}
            </li>
          ))}

          {typing && (
            <li className="chat-bubble bot typing">
              <span></span>
              <span></span>
              <span></span>
            </li>
          )}
        </ul>

        {!triageDone && currentQuestion && (
          <div className="triage-options">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className="triage-option-btn"
                onClick={() => handleOptionSelect(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {triageDone && (
          <button
            type="button"
            className="doctor-cta-btn"
            onClick={() => navigate("/doctors")}
          >
            View Suggested Doctors
          </button>
        )}

        {error && <p className="chat-error">{error}</p>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-box">
        <input
          type="text"
          value={input}
          placeholder={triageDone ? "Type a follow-up question..." : "Pehle upar diye options select karein"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!isConnected || typing || !triageDone}
        />
        <button onClick={sendMessage} disabled={!isConnected || typing || !triageDone}>
          {typing ? "..." : ">"}
        </button>
      </div>
    </div>
  );
}
