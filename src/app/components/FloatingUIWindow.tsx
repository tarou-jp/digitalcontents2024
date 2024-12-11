import { useEffect, useState } from "react";
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
import { UserProgress } from "@/utils/localStrage";

type Props = {
  progress: UserProgress; // ゲーム進行状況を受け取る
  sendMessage: (input: string) => Promise<void>;
  isLoading: boolean;
  handleGameEnd: () => void;
  currentTurn: number;
  handleSelectTurn: (turn: number) => void; // ターン選択処理
};

export default function FloatingUIWindow({
  progress,
  sendMessage,
  isLoading,
  handleGameEnd,
  currentTurn,
  handleSelectTurn,
}: Props) {
  const [input, setInput] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

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

  useEffect(() => {
    console.log(progress.currentChapter);
  }, []);

  return (
    <>
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
          <MenuItem
            onClick={() => {
              handleSelectTurn(Math.max(0, currentTurn - 1));
              handleMenuClose();
            }}
            disabled={currentTurn === 0}
          >
            前の会話
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleSelectTurn(
                Math.min(progress.history.length - 1, currentTurn + 1)
              );
              handleMenuClose();
            }}
            disabled={currentTurn * 2 === progress.history.length - 1}
          >
            次の会話
          </MenuItem>
          <MenuItem onClick={handleGameEndClick}>ゲームを終了</MenuItem>
        </Menu>
      </Box>

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
        <Box>
          <Typography variant="body1">
            {progress.history[currentTurn * 2]?.text || "待機中..."}
          </Typography>
        </Box>
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            <CircularProgress size={24} sx={{ color: "#bbb", mr: 1 }} />
            <Typography variant="body2" color="text.primary">
              考え中...
            </Typography>
          </Box>
        )}
      </Box>

      {/* ユーザー入力ウィンドウ */}
      {progress.currentChapter !== "finish" ? (
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
              value={
                currentTurn * 2 === progress.history.length - 1
                  ? input
                  : progress.history[currentTurn * 2 + 1]?.text || ""
              }
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力..."
              variant="outlined"
              size="small"
              disabled={currentTurn * 2 !== progress.history.length - 1}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <Button
              onClick={handleSendMessage}
              variant="contained"
              color="primary"
              disabled={
                isLoading ||
                !input.trim() ||
                currentTurn * 2 !== progress.history.length - 1
              }
              sx={{ fontWeight: "bold", boxShadow: 2 }}
            >
              送信
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            bottom: "2%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            maxWidth: "800px",
            textAlign: "center",
          }}
        >
          <Button
            onClick={handleGameEnd}
            variant="contained"
            color="error"
            sx={{ fontWeight: "bold", boxShadow: 2 }}
          >
            ゲームを終了
          </Button>
        </Box>
      )}
    </>
  );
}
