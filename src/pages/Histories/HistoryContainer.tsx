import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

const HistoryContainer: FC = () => {
    const navigate = useNavigate();
    return (
        <div className="row">
            <div className="col-md-12">
                <button className="btn btn-primary" onClick={() => {
                    navigate("/histories/BLND");
                }}>BLND</button>
            </div>
        </div>
    )
}

export default HistoryContainer;
