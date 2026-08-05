"use client";

import { useState } from "react";
import { Mic, MicOff, Sparkles, Volume2, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

interface VoiceReportInputProps {
  onTranscriptReceived?: (text: string) => void;
}

export function VoiceReportInput({ onTranscriptReceived }: VoiceReportInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { showToast } = useToast();

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      showToast("Speech Recognition is not supported in this browser. Type notes manually.", "warning");
      return;
    }

    try {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition: new () => SpeechRecognitionInstance }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US"; // Supports English and mixed field notes

      recognition.onstart = () => {
        setIsListening(true);
        showToast("Voice Note Listening... Speak civil engineering field notes.", "info");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        if (onTranscriptReceived) {
          onTranscriptReceived(currentText);
        }
      };

      recognition.onerror = (err) => {
        console.error("Speech Recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech Recognition start error:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>AI Voice Note Speech-to-Text</span>
        </div>

        <button
          onClick={startListening}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer ${
            isListening
              ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
              : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Recording...</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>Speak Notes</span>
            </>
          )}
        </button>
      </div>

      {transcript && (
        <div className="p-3 rounded-lg bg-slate-950 border border-purple-500/30 text-xs text-purple-200 font-mono flex items-start gap-2">
          <Volume2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{transcript}</span>
        </div>
      )}
    </div>
  );
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (err: unknown) => void;
  onend: () => void;
  start: () => void;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}
