"use client";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import { useTheme } from 'next-themes';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const getRandomUsername = () =>
  "User" + Math.floor(Math.random() * 10000);

export default function Page() {
  const { sendMessage, messages, status, clearMessages, typingUsers, sendTyping, activeCount, toastMsg, setToastMsg } = useSocket();
  const [message, setMessage] = useState("");
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("username") || getRandomUsername()
      : getRandomUsername()
  );
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("username", username);
    }
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage({ message, username });
      setMessage("");
      setShowEmoji(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    sendTyping(username);
  };

  const handleEmoji = (emoji: string) => {
    setMessage((msg) => msg + emoji);
    setShowEmoji(false);
  };

  return (
    <div className={classes["chat-container"] + (theme === "dark" ? " dark" : "") }>
      <div className={classes.header}>
        Shrestha's Chat Room
        <IconButton
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{ float: "right", marginLeft: 8 }}
          color="primary"
        >
          {theme === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <Button
          variant="outlined"
          onClick={clearMessages}
          style={{ float: "right", marginRight: 8 }}
        >
          Clear
        </Button>
      </div>
      <div className={classes.status}>
        {status} <PeopleAltIcon fontSize="small" style={{ verticalAlign: 'middle' }} /> {activeCount}
      </div>
      <div className={classes.username}>
        Username: <TextField
          value={username}
          onChange={e => setUsername(e.target.value)}
          variant="standard"
          size="small"
          InputProps={{ style: { fontWeight: 600, color: 'inherit', background: 'transparent' } }}
        />
      </div>
      <div className={classes.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              classes.message +
              " " +
              (msg.username === username ? classes.you : classes.other)
            }
          >
            <div className={classes["message-content"]}>
              <span className={classes["user-label"]}>
                {msg.username === username ? "You" : msg.username}
              </span>
              <span className={classes["msg-text"]}>{msg.message}</span>
              <div className={classes.timestamp}>{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={classes.status}>
        {typingUsers.length > 0 && (
          <span>
            {typingUsers.filter(u => u !== username).join(", ")} typing...
          </span>
        )}
      </div>
      <div className={classes.inputRow}>
        <TextField
          value={message}
          onChange={handleInput}
          type="text"
          className={classes["chat-input"]}
          placeholder="Enter message"
          onFocus={() => setShowEmoji(false)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSend();
          }}
          size="small"
        />
        <IconButton
          onClick={() => setShowEmoji((s) => !s)}
          color="primary"
        >
          <EmojiEmotionsIcon />
        </IconButton>
        <Button
          variant="contained"
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
      {showEmoji && (
        <div className={classes["emoji-picker"]}>
          {["😀","😂","😍","😎","👍","🎉","❤️","🔥","🙏","🥳"].map(e => (
            <IconButton
              key={e}
              onClick={() => handleEmoji(e)}
              style={{ fontSize: 24 }}
            >
              {e}
            </IconButton>
          ))}
        </div>
      )}
      <Snackbar
        open={!!toastMsg}
        autoHideDuration={2000}
        onClose={() => setToastMsg("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" severity="success">
          {toastMsg}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
