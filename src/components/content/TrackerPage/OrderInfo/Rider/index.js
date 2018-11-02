import React from "react";
import './index.css';

const Rider = ({userName, userPhotoUrl, userNumber, availWidth, t, enrouteOrders, userDisplayText}) => {

  return (
    <div id="riderBox" className="card outer-pad-18 on-tap rider-card" style={{lineHeight: "20px",marginTop: "-12px"}}>
      <div className="card-content" style={{ padding: 0 }}>
          <div className="row valign-wrapper rider-details-box">
            <div className="col s8 rider-details-box-pic inner-pad-left-0">
                <div className="row  left-align">
                  <div className="col 12 rider-image-container">
                    <img src={userPhotoUrl || require('../../../../../assets/images/rider.png')} alt="" className="circle profile-img-rider"/>
                    <div className="rider-details-name roboto-regular">
                      <span className="rider-details-name-s1">{userName}</span><br/>
                      <span className="rider-details-name-s2">{userDisplayText}</span>
                    </div>
                  </div>
                </div>
            </div>
            <div className="col s4 right-align rider-mobno-container inner-pad-right-0">
                {availWidth <= 1025 ? 
                  <div>
                    <div className="line-ver"></div>
                    <div className="call-rider-sym">
                      <a href={`tel:` + userNumber}><i className="material-icons light-green-fg f-size-30">call</i></a>
                    </div>
                  </div> : 
                  <span className="rider-mobno">{`${userNumber}`}</span>}
            </div>
          </div>
      </div>
    </div>
  );
};

export default Rider;
