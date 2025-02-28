import axios from "axios";

export const deleteWhiteboard = async (whiteboardId: string) => {
  const res = await axios.delete(`/api/whiteboard/${whiteboardId}`);
  return res.data.data;
};

export const renameWhiteboard = async (
  whiteboardId: string,
  newWhiteboardName: string
) => {
  const res = await axios.patch(`/api/whiteboard/${whiteboardId}`, {
    name: newWhiteboardName,
  });
  return res.data.data;
};

export const markFavourite = async (whiteboardId: string) => {
  const res = await axios.post(`/api/whiteboard/favourite/${whiteboardId}`);
  return res.data.data;
};
