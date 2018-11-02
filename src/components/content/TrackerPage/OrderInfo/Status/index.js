import React from "react";
import { translate } from 'react-i18next';
import './index.css';
const moment = require('moment');

let monthNames = [
  "January", 
  "February", 
  "March", 
  "April", 
  "May", 
  "June",
  "July", 
  "August", 
  "September", 
  "October", 
  "November", 
  "December"
];
class Status extends React.Component {
  state={
    extend: false
  }

  _handleExtend =(e)=>{
    /*if(!this.state.extend && $(window).width() <= 767 && ($('.outer-flex-container').prop('scrollHeight') - scrollTopRider) >= (scrollTopRider + 72)) {
      $("#orderDetailContent").css({
        paddingBottom: 20
      });
    } else if(this.state.extend && $(window).width() <= 767 && ($('.outer-flex-container').prop('scrollHeight') - scrollTopRider) < (scrollTopRider + 72)) {
      alert("1");
      $("#orderDetailContent").css({
        paddingBottom: (scrollTopRider + 72 + 20 - ($('.outer-flex-container').prop('scrollHeight') - scrollTopRider)) + 'px'
      });
    }*/

    if((this.props.source && this.props.source.address) || (this.props.destination && this.props.destination.address))
      this.setState({
        extend:!this.state.extend
      })
  }

  calcWidth = (status, eta) => {
    if(status) status = status.toUpperCase();
    if(status === 'COMPLETED') {
      return { width: '100%' };
    } else if(status === 'cancelled') {
      return { width: '0%' };
    } else if((moment(eta).valueOf() - new Date().getTime()) <= 10 && ((moment(eta).valueOf() - new Date().getTime()) > -1)) {
      return {width: ((moment(eta).valueOf() - new Date().getTime()) * 100)/moment(eta).valueOf() + '%'};
    }
    return { width: '70%' }; 
  }

  _statusSecton = (status, triggeredOn, amount, clientName, eta, t, pin, displayText) => {
    if(status) status = status.toUpperCase();
    if ((status==="STARTED") || (status==="NOT_STARTED")) {
      return (
        <div className="roboto-regular light-black-fg outer-pad-18">
            <div className="row status-header">
              <div className="col s12 inner-pad-0">
                  <span className="left opacity-7 f-size-14 status-eta">{t("esAT")}</span>
                  {
                    pin ? 
                    <span className="order-pin-box right">{`${t("pin")}: ${pin}`}</span> :
                    ""
                  }
              </div>
            </div>

            <div className="row">
              <div className="col s12 inner-pad-0">
                  <span className="left f-size-40">
                    <strong>
                      {
                        status==="STARTED" ? 
                        <span>
                          <span className="roboto-light">{('0' + (new Date(eta).getHours() % 12 || 12)).slice(-2)}:{('0' + new Date(eta).getMinutes()).slice(-2)}</span>
                          <span className="pm">{(new Date(eta).getHours() >= 12) ? "PM" : "AM"}</span> 
                        </span> : 
                        <span>
                          <span className="roboto-light">{new Date(eta).getDate()}</span>
                          <span className="pm">
                            {monthNames[new Date(eta).getMonth()]}
                          </span>
                        </span>
                      }
                    </strong>
                  </span>
                  {
                    amount && amount.amount && amount.amount.amount !== null ? 
                      <div className="right order-details-amount-text">
                        <span className="order-details-amount-pay">
                         {
                            amount.exchangeType === 'COLLECT' ? `${t('pay')}: ` : amount.exchangeType === 'GIVE' ? `${t('receive')}: ` : `${t('paid')}: `
                         }
                        </span>
                        <span className="order-details-amount">
                          &#x20b9;{amount.amount.amount === 0 ? 0 : parseFloat(amount.amount.amount).toFixed(2)}
                        </span>
                      </div> :
                      ""
                  }
              </div>
            </div>

            <div className="row margin-top-minus-30">
              <div className="col s12 inner-pad-0">
                <div className="progress light-grey-bg">
                  <div className="determinate light-blue-bg" style={this.calcWidth(status, eta)}></div>
                </div>
              </div>
            </div>
          </div>
      )
    } else {
      return (
        <div>
          <div className="row roboto-regular light-black-fg outer-pad-18">
            <div className="col s12 inner-pad-0">
                <span className="left order-client-name roboto-regular">{`${clientName}`}</span>
            </div>
           </div>

           <div className="row margin-top-minus-30 outer-pad-18">
             <div className="col s12 inner-pad-0" style={{marginTop: "-6px"}}>
                 { 
                   status === "COMPLETED" ?
                   <span className="order-deli-text left roboto-medium">{displayText}</span> :
                   <span className="order-cancel-text left roboto-medium">{displayText}</span>
                 }
                 <span className="order-time-text right roboto-regular">{moment(triggeredOn).format('MMM Do YYYY, h:mm a')}</span>
             </div>
           </div>
        </div>
      )
    }
  }

  render() {
    const {_handleExtend, _statusSecton} = this;
    const {extend}= this.state;
    const {
      status, 
      source, 
      destination, 
      from, 
      to, 
      amount, 
      clientName, 
      eta,
      t,
      pin,
      tripDisplayText
    }= this.props;

    return (
      <div id="statusBox" className="card on-tap status-card">
        <div className="card-content order-status-box">
          {_statusSecton(status.status, status.triggeredOn, amount, clientName, moment(eta).valueOf(), t, pin, status.displayText)}
          {(status.status && (status.status.toUpperCase() === "CANCELLED" || status.status.toUpperCase() === "COMPLETED")) && <div className="separator-other"></div>}
          <div className="collapsible-header margin-top-minus-30 order-details-collapsed roboto-regular f-size-14 outer-pad-18" onClick={_handleExtend}>
            <span className="left">{tripDisplayText}</span> 
            {
              (source && source.address) || (destination && destination.address) ?
              <span className="right arrow-key"> {extend ? <i className="material-icons">keyboard_arrow_up</i> : <i className="material-icons">keyboard_arrow_down</i>}</span> :
              ""
            }
          </div>
            { extend && <div className="statusAddressSection outer-pad-18">
                {
                  source && source.address ? 
                    <div className="row">
                      <div className="col s2 roboto-medium inner-pad-left-0">
                        {t('from')}:
                      </div>
                      <div className="col s10 roboto-regular inner-pad-right-0">
                        {from ? <span><span className="f-size-14 light-black-fg">{from}</span><br/></span> : ""}
                        <span>{source && source.address}</span>
                        <div className="divider divider-margin"/>
                      </div>
                    </div> : ""
                }

                {
                  destination && destination.address ? <div className="row">
                    <div className="col s2 roboto-medium inner-pad-left-0">
                      {t('to')}:
                    </div>
                    <div className="col s10 roboto-regular inner-pad-right-0">
                      {to ? <span><span className="f-size-14 light-black-fg">{to}</span><br/></span> : ""}
                      <span>{destination && destination.address}</span>
                    </div>
                  </div> : ""
                }
              </div> 
            }
        </div>
      </div>
    );
  }
}

export default translate('translations')(Status);
