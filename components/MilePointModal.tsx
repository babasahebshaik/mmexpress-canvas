import React, { useState, useEffect, useCallback } from "react";
import { getCPImageByType } from "./image-module";

interface MilePointModalProps {
  agencyName: string;
}

const MilePointModal: React.FC<MilePointModalProps> = ({ agencyName }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const controlImages = [
    "County Boundary",
    "MAINTENANCE BOUNDARY",
    "Township Boundary",
    "Corporation Limit",
    "State Boundary",
    "Bridge (Hwy Over Railroad)",
    "Bridge",
    "1-lane Bridge",
    "Bridge (Hwy Over Hwy)",
    "Cul De Sac",
    "Road End",
    "Hwy Under Railroad",
    "Hwy Under Hwy",
    "Intersection",
    "Miscellaneous",
    "Railroad",
    "School Zone",
    "Speed Zone",
    "1-lane Tunnel",
    "Tunnel",
  ];

  const getCPImage = (type: string) => {
    return getCPImageByType(type);
  };

  const handleKeydown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClose();
    }
  }, []);

  useEffect(() => {
    if (open) {
      const inputElement = document.getElementById("milePointInput");
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeydown);
    } else {
      document.removeEventListener("keydown", handleKeydown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [open, handleKeydown]);

  return (
    <div>
      <button onClick={handleOpen} aria-label="Open Mile Point Modal">
        Graphical Index
      </button>
      {open && (
        <div
          className="modal"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-hidden={!open}
        >
          <div className="modal-content">
            <span
              className="close"
              onClick={handleClose}
              role="button"
              aria-label="Close modal"
            >
              &times;
            </span>
            <h4
              id="modalTitle"
              style={{ display: "flex", justifyContent: "center" }}
            >
              {agencyName}
            </h4>
            <h5 style={{ display: "flex", justifyContent: "center" }}>
              No Passing Zone Graphical Index
            </h5>
            <h6 style={{ display: "flex", justifyContent: "center" }}>
              Ordered by: Route
            </h6>
            <div
              style={{
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <div style={{ display: "flex", padding: "10px 0px 10px 0px" }}>
                <h5 style={{ marginRight: "25px" }}>Image</h5>
                <h5>Description</h5>
              </div>
              {controlImages.map((control, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={getCPImage(control)}
                    alt={control}
                    style={{
                      width: "20px",
                      height: "auto",
                      marginRight: "40px",
                    }}
                  />
                  <span style={{ fontSize: "16px" }}>{control}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <hr
                  style={{
                    border: "none",
                    borderTop: "5px dashed green",
                    width: "40px",
                    marginRight: "20px",
                  }}
                />
                Passing Zone Length
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <hr
                  style={{
                    border: "none",
                    borderTop: "5px solid red",
                    width: "40px",
                    marginRight: "20px",
                  }}
                />
                No Passing Zone Length
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <hr
                  style={{
                    border: "none",
                    borderTop: "5px solid blue",
                    width: "40px",
                    marginRight: "20px",
                  }}
                />
                Difference Length
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    borderLeft: "5px solid green",
                    height: "20px",
                    marginRight: "35px",
                    marginLeft: "20px",
                  }}
                ></div>
                Recommended extends beyond Current
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    borderLeft: "5px solid red",
                    height: "20px",
                    marginRight: "35px",
                    marginLeft: "20px",
                  }}
                ></div>
                Current extends beyond Recommended
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .modal {
          display: block;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
          animation: fadeIn 0.3s ease-out;
        }
        .modal-content {
          background-color: #fefefe;
          margin: 4% auto;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 600px;
          animation: slideIn 0.3s ease-out;
        }
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
        }
        .close:hover,
        .close:focus {
          color: black;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateY(-50px);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MilePointModal;
