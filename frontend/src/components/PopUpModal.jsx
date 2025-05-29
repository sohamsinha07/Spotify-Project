import React, { useEffect } from "react";
import "../styles/popUpModal.css";

/* this is the modal the createForum will use- it will pop up so we can type in what we wanted */
const PopUpModal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (!isOpen) return;

        //handle the esc or the close button
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
            tabIndex="-1"
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                tabIndex="0"
            >
                <button
                    className="modal-close-button"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    X
                </button>
                {children}
            </div>
        </div>
    );
};

export default PopUpModal;

