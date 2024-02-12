"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import { useChat } from "ai/react";

export default function Page() {
  interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  }

  const [disease, setDisease] = useState("");
  const diseaseRef = useRef(disease); // Create a ref for the disease state
  const notesRef = useRef<null | HTMLDivElement>(null);
  const [isReadyForSubmit, setIsReadyForSubmit] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [notes, setNotes] = useState<ChatMessage[]>([]);

  // Options for different roles with a placeholder for selection
  const roleOptions = {
    "": "Select your role...",
    emergency_room_physician: "Emergency Room Physician",
    ambulatory_physician: "Ambulatory Physician",
    inpatient_physician: "Inpatient Physician",
    general_physician: "General Physician",
    // Add any other roles you require
  };

  // Update onChange handler for the dropdown
  const handleRoleChange = (e : any) => {
    setSelectedRole(e.target.value);
  };

  // Frontend code snippet that listens to SSE
const eventSource = new EventSource('/api/chat');
eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  // Update your UI with the data received from the server
};

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const scrollToNotes = () => {
    if (notesRef.current !== null) {
      notesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      body: { disease, role: selectedRole },
      onResponse() {
        scrollToNotes();
      },
    });

  const submitEventRef = useRef(null);

  const copyToClipboard = async (text: string) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource('/api/chat');

    eventSource.onmessage = function(event) {
      const newMessage: ChatMessage = JSON.parse(event.data);
      setNotes(prevNotes => [...prevNotes, newMessage]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = { disease: input, role: selectedRole };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // No need to do anything here, as the message will be streamed back and handled by the SSE connection.
    } catch (error) {
      console.error('Error submitting form: ', error);
      toast.error('Error generating notes.');
    } 
  };

  const lastMessage = messages[messages.length - 1];
  const generatedNote =
    lastMessage?.role === "assistant" ? lastMessage.content : null;

  const transformNote = (note: string) => {
    // Split the note into sections wherever <sep /> appears
    const noteSections = note.split("<sep />");
    return noteSections;
  };

  // Then, add this additional line to transform the GPT output into sections:
  const transformedNote = generatedNote && transformNote(generatedNote);

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
    <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/echotech/med-notes"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Automate your SOAP notes with GPT.
        </h1>
        {/* Accordion for Legal Disclaimer */}
        <div style={{ width: "100%", marginTop: "20px" }}>
          <button
            style={{
              width: "100%",
              textAlign: "left",
              backgroundColor: "#f3f3f3",
              padding: "10px",
              fontSize: "18px",
              border: "none",
              outline: "none",
              cursor: "pointer",
            }}
            onClick={toggleAccordion}
          >
            Legal Disclaimer (Click To Expand)
          </button>
          {isAccordionOpen && (
            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "15px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              {/* Insert your disclaimer text here */}
              <p>
                This tool, <strong>GPT SOAP Notes</strong>, utilizes OpenAI's
                GPT-4 technology to generate SOAP notes intended for use in
                medical settings. The following points constitute the legal
                disclaimer associated with its use:
              </p>
              <br />

              <p>
                <strong>Auxiliary Tool Only:</strong>{" "}
                <strong>GPT SOAP Notes</strong> is designed to be an auxiliary
                tool for healthcare professionals. It is not a substitute for
                direct patient care or professional medical judgment. Users are
                responsible for reviewing and confirming the accuracy and
                relevance of the generated content in the context of each
                patient's specific medical situation.
              </p>
              <br />

              <p>
                <strong>No Medical Advice:</strong> The content generated by{" "}
                <strong>GPT SOAP Notes</strong> does not constitute medical
                advice, diagnosis, or treatment. Reliance on any information
                provided by this tool is solely at the user's own risk.
              </p>
              <br />

              <p>
                <strong>Limitation of Liability:</strong>{" "}
                <strong>HelloIT LLC</strong> (the developer of{" "}
                <strong>GPT SOAP Notes</strong>) is not liable for any errors,
                omissions, or inaccuracies in the content generated by GPT SOAP
                Notes, nor for any user's reliance on this content. The user
                assumes full responsibility for any decisions or actions taken
                based on the information provided by this tool.
              </p>
              <br />

              <p>
                <strong>Compliance with Laws and Regulations:</strong> Users are
                responsible for ensuring that their use of GPT SOAP Notes
                complies with all applicable laws, regulations, and professional
                guidelines, including those pertaining to patient data privacy
                and security.
              </p>
              <br />

              <p>
                <strong>Indemnification:</strong> Users agree to indemnify and
                hold harmless HelloIT LLC and its affiliates, officers, agents,
                employees, and partners from any claim or demand, including
                reasonable attorneys' fees, arising from or related to the use
                of GPT SOAP Notes or violation of this disclaimer.
              </p>
              <br />

              <p>
                <strong>Amendments and Updates:</strong> This disclaimer is
                subject to change, and users are advised to review it
                periodically. Continued use of GPT SOAP Notes after any such
                changes constitutes acceptance of the new terms.
              </p>
              <br />

              <p>
                <strong>Governing Law:</strong> This disclaimer shall be
                governed by the laws of the State of Utah and the United States
                of America.
              </p>
              <br />

              <p>
                <strong>Acknowledgment:</strong> By using{" "}
                <strong>GPT SOAP Notes</strong>, users acknowledge that they
                have read, understood, and agreed to this disclaimer.
              </p>
              <br />

              <p>
                <strong>Contact Information:</strong> For any questions or
                concerns regarding this disclaimer, please contact{" "}
                <a href="https://buttonfortheinter.net">HelloIT LLC</a>.
              </p>
            </div>
          )}
        </div>
        <form className="max-w-xl w-full" onSubmit={onSubmit}>
          <div className="flex mt-10 items-center space-x-3">
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            >
              {Object.entries(roleOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Enter a disease <span className="text-slate-500"></span>.
            </p>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            rows={1}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={"Enter a disease name..."}
          />

          {!isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="submit"
            >
              Generate your notes &rarr;
            </button>
          )}
          {isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
              </span>
            </button>
          )}
        </form>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        
      <output className="space-y-10 my-10">
        {transformedNote && (
          <>
            <div>
              <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto" ref={notesRef}>
                Your generated Note
              </h2>
            </div>
            <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
              {transformedNote.map((section, idx) => (
                // ... your existing note section ...
              ))}
            </div>
          </>
        )}

        {/* Additional rendering of notes received from SSE */}
        {notes.map((note, idx) => (
          <div key={idx} className="chat-message">
            {note.role === 'assistant' ? ( /* Update the condition based on how you want to differentiate user vs assistant messages */
              <div className="assistant-message"> {/* Update classNames as needed */}
                <span>Assistant:</span>
                <p>{note.content}</p>
              </div>
            ) : ( /* This is where you would handle messages with role: "user", if needed */ )}
          </div>
        ))}
      </output>
      </main>
      <Footer />
    </div>
  );
}
