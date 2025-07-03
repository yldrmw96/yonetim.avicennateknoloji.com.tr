import { useDispatch } from "react-redux";
import { setIsOpen } from "../slices/user-modal-slice";

export const useUserModal = () => {
  const dispatch = useDispatch();

  const openModal = () => {
    dispatch(setIsOpen(true));
  };

  const closeModal = () => {
    dispatch(setIsOpen(false));
  };

  return { openModal, closeModal };
};    