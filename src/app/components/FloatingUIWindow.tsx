import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Message } from "@/types/types";

type Props = {
  messages: Message[]; // 全メッセージを受け取る
  sendMessage: (input: string) => Promise<void>;
  isLoading: boolean; // ローディング状態
  handleGameEnd: () => void; // ゲーム終了処理
};

export default function AliceResponseWindow({
  messages,
  sendMessage,
  isLoading,
  handleGameEnd,
}: Props) {
  const [input, setInput] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // アリスの最新のメッセージを取得
  const aliceMessages = messages.filter((msg) => msg.sender === "bot");
  const latestMessage = aliceMessages.at(-1)?.text || "待機中...";

  // メッセージ送信ハンドラー
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  // メニューハンドラー
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGameEndClick = () => {
    handleGameEnd();
    handleMenuClose();
  };

  return (
    <>
      {/* 3点リーダーメニュー */}
      <Box
        sx={{
          position: "absolute",
          top: "15px",
          right: "15px",
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={handleMenuClick}
          sx={{
            backgroundColor: "#4CAF50",
            color: "white",
            "&:hover": {
              backgroundColor: "#45A049",
            },
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleGameEndClick}>ゲームを終了</MenuItem>
        </Menu>
      </Box>

      {/* アリスのメッセージウィンドウ */}
      <Box
        sx={{
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: "800px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: 2,
          p: 3,
          boxShadow: 3,
          color: "white",
          textAlign: "left",
          fontSize: "18px",
          lineHeight: 1.6,
        }}
      >
        {/* アリスのメッセージ */}
        <Box>
          <Typography variant="body1">{latestMessage}</Typography>
        </Box>

        {/* ローディング中のインジケータ */}
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            <CircularProgress size={24} sx={{ color: "#bbb" }} />
            <Typography variant="body2" color="text.primary">
              考え中...
            </Typography>
          </Box>
        )}
      </Box>

      {/* ユーザー入力ウィンドウ */}
      <Box
        sx={{
          position: "absolute",
          bottom: "2%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: "800px",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            variant="outlined"
            size="small"
            disabled={isLoading} // ローディング中は入力不可
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />
          <Button
            onClick={handleSendMessage}
            variant="contained"
            color="primary"
            disabled={isLoading || !input.trim()}
            sx={{
              fontWeight: "bold",
              boxShadow: 2,
            }}
          >
            送信
          </Button>
        </Box>
      </Box>
    </>
  );
}
