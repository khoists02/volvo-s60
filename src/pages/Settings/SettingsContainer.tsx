import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { ITickerAccount } from "../../parts/PageHeader";
import { useNavigate } from "react-router-dom";

const SettingsContainer: FC = () => {
    const navigate = useNavigate();
    const [currentAcc, setCurrentAcc] = useState<ITickerAccount>({ ticker: "", balance: "0", current: "0", id: "" });
    useEffect(() => {
        const getCurrentAcc = async () => {
            const rs = await axios.get("/account", { params: { ticker: "BLND" } });
            setCurrentAcc(rs.data);
        }

        getCurrentAcc();
    }, [])
    return (
        <div className="card">
            <div className="card-header">
                <h5 className="title">Settings</h5>
            </div>
            <div className="card-body">
                <div className="form-group row">
                    <label htmlFor="balance" className="col-md-2">Balance</label>
                    <input type="text" className="form-control col-md-5" value={currentAcc?.balance} onChange={e => {
                        setCurrentAcc({ ...currentAcc, balance: e.target.value})
                    }} />
                </div>

                <div className="form-group row">
                    <label htmlFor="current" className="col-md-2">Current</label>
                    <input type="text" className="form-control col-md-5" value={currentAcc?.current} onChange={e => {
                        setCurrentAcc({ ...currentAcc, current: e.target.value})
                    }} />
                </div>

                <div className="form-group">
                    <button className="btn btn-primary" type="button" onClick={async () => {
                        await axios.put("/account", {
                            id: currentAcc.id,
                            balance: parseFloat(currentAcc.balance),
                            current: parseFloat(currentAcc.current),
                        });
                        navigate("/home");
                    }}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default SettingsContainer;
