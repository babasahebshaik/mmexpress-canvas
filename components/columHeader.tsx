import React from 'react';

const ColumnHeader: React.FC = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                width: "600px",
                padding: "0px 30px 0px 30px",
                fontSize: "small",
            }}
        >
            <h5>Control Points</h5>
            <h5 style={{ position: "relative", right: "-25px" }}>C-Length-R</h5>
            <h5 style={{ position: "relative", right: "-5px" }}>C-Left-R</h5>
            <h5 style={{ position: "relative", right: "-5px" }}>C/L</h5>
            <h5 style={{ position: "relative", right: "0px" }}>C-Right-R</h5>
            <h5 style={{ position: "relative", right: "20px" }}>C-Length-R</h5>
            <h5>Control Points</h5>
        </div>
    );
};

export default ColumnHeader;