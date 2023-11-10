'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Footer from '../components/Footer';
import Github from '../components/GitHub';
import Header from '../components/Header';
import { useChat } from 'ai/react';

export default function Page() {
  const [disease, setDisease] = useState('');
  const notesRef = useRef<null | HTMLDivElement>(null);

  const scrollToNotes = () => {
    if (notesRef.current !== null) {
      notesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  
  const { input, handleInputChange, handleSubmit, isLoading, messages } = useChat({
    body: { disease }, 
    onResponse() {
      scrollToNotes();
    },
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();

    // Send the disease as JSON in the body of the request
    const response = await fetch('/api/chat/route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Indicate you're sending JSON
      },
      body: JSON.stringify({ disease }), // Send the disease state as JSON
    });

    if (response.ok) {
      // Handle the successful response here
      const notes = await response.json(); // Assuming the response will also be JSON
      // Process or set the state with the notes as needed
    } else {
      // Handle errors here
      console.error('Failed to fetch notes');
    }
  };
  

  // Parse the response to get the generated SOAP notes
  const generatedNotes = messages
    .filter((message) => message.role === "assistant")
    .map((message) => message.content);

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
        <form className="max-w-xl w-full" onSubmit={onSubmit}>
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Enter a disease{' '}
              <span className="text-slate-500">
              </span>
              .
            </p>
          </div>
            <textarea
    value={disease}
    onChange={(e) => setDisease(e.target.value)}
    rows={1}
    className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
    placeholder={'Enter a disease name...'}
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
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
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
      {generatedNotes && (
        <>
          <div ref={notesRef}>
            <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
              Your generated notes:
            </h2>
          </div>
          <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
            {generatedNotes.map((note, index) => {
              return (
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                  onClick={() => {
                    navigator.clipboard.writeText(note);
                    toast(`Note ${index + 1} copied to clipboard`, {
                      icon: '✂️',
                    });
                  }}
                  key={note}
                >
                  <p>{note}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </output>
      </main>
      <Footer />
    </div>
  );
}
