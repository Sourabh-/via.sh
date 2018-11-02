import React from 'react';

import './index.css';

const Header=({logo, websiteUrl, title, taskId, userName, t, style}) => {
  return (
    <div className="card order-details-header outer-pad-16" style={style} id="header">
      <div className="card-content">
          <div className="row valign-wrapper" style={{height: "64px"}}>
            <div className="col s3 inner-pad-left-0">
                    <a href={websiteUrl}>
                      <img src={logo ? logo : ""} className="left client-img" alt={title}/>
                    </a>
            </div>
              <div className="col s9 right-align inner-pad-right-0">
                <div className="order-details-header-right">
                  {t('order')}&nbsp; <a href="javsscript:void(0)" className="task-id-link light-black-fg opacity-7">{`${taskId}`}</a>
                </div>
                <div className="order-details-header-rn">{userName}</div>
              </div>
          </div>
      </div>
    </div>

  )
}

export default Header;
