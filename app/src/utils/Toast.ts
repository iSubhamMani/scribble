import toast from "react-hot-toast";

const successToast = (message: string) => {
  toast.success(message, {
    duration: 2500,
    position: "bottom-right",
  });
};

const errorToast = (message: string) => {
  toast.error(message, {
    duration: 2500,
    position: "bottom-right",
  });
};

export { successToast, errorToast };
