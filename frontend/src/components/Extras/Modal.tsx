import React from "react";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    showCloseButton?: boolean; //this prop to control the visibility of the close button
}

export const Modal : React.FC<ModalProps> = ({ children, onClose, showCloseButton = true }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
            className="modal"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            >
                {showCloseButton && (
                    <button className="modal-close" onClick={onClose}>x</button>
                )}                
                {children}
            </div>
        </div>
    )
}