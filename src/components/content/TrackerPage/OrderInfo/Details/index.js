import React from "react";
import './index.css';

const Details = ({orderDetail, amount, t, availWidth}) => {
  let { lineItems }=orderDetail;

  return (
    <div className="card">
      <div className="card-content order-details-content">
          <div className="row marginBottomZero order-details-content-header outer-pad-18">
            <div className="col s12 inner-pad-0">
              <div className="left roboto-medium">{t('orderDetails')}</div>
              <div className="right roboto-regular opacity-7">{lineItems && `${lineItems.length} ${t("items")}` }</div>
            </div>
          </div>

          <div className="separator-dashed"/>
          {
            lineItems && lineItems.map((item, index)=>{
              return (
                <div key={index}>
                  <div className="row marginBottomZero roboto-regular outer-pad-18">
                    <div className="col s12 opacity-7 order-details-item inner-pad-0">
                      <div className="left item-container">
                        <div className="item-name" title={item.name}>{`${item.name}`}</div>
                        <div>{item.quantity && <span>&nbsp;x {item.quantity}</span>}</div>
                      </div>
                      {
                        item.price && item.price.amount != null ? <div className="right">
                          &#x20b9;{`${item.price && parseFloat(item.price.amount).toFixed(2)}`}
                        </div> : ""
                      }
                    </div>
                  </div>
                  { index !== lineItems.length - 1 || (index === lineItems.length - 1 && amount && amount.amount && amount.amount.amount !== null) ? <div className="separator"/> : "" }
                </div>
              )
            })
          }

          {amount && amount.amount && amount.amount.amount !== null ? <div className="row marginBottomZero roboto-medium outer-pad-18">
            <div className="col s12 inner-pad-0">
              <span className="left">{t("totalAmount")}</span>
              <span className="right f-size-16">&#x20b9;{`${(amount.amount.amount === 0 ? 0 : parseFloat(amount.amount.amount).toFixed(2))}`}</span>
            </div>
          </div> : ""}


      </div>
    </div>
  );
};

export default Details;
