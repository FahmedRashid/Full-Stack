import React from "react";
import { Modal } from "./Modal";

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({message, onConfirm, onCancel}) =>{
    return (
        <Modal onClose={onCancel} showCloseButton={false}> 

            <div className="confirm-modal-overlay">
                <div className="confirm-modal">
                    <p>{message}</p> 
                    <button className="confirm-yes" onClick={onConfirm}>
                        Yes
                    </button>
                    <button className="confirm-no" onClick={onCancel}>
                        No
                    </button>
                </div>
            </div>
        </Modal>
    )
}