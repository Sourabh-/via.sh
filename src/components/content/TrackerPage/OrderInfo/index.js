import React, { Component } from 'react';
import { translate } from 'react-i18next';
import Header from './Header';
import Rider from './Rider';
import Status from './Status';
import Details from './Details';
import FooterLogo from '../../../uiComponents/FooterLogo';
//import logo2x from '../../../../assets/images/logo/logo@2x.png';

class OrderInfo extends Component {

	checkIfAllDetailsExist = (orderDetail) => {
		if(orderDetail && orderDetail.lineItems && orderDetail.lineItems.length) {
			for(let i=0; i<orderDetail.lineItems.length; i++) {
				if(!orderDetail.lineItems[i].name)
					return false;
			}
			return true;
		} else {
			return false;
		}
	}

	render() {
		let { settings, customerName, visitId, orderDetail, amount, status, source, destination, userName, userNumber, userPhotoUrl, availWidth, t, eta, pin, userDisplayText, tripDisplayText} = this.props;
		let { checkIfAllDetailsExist } = this;
		return (
			<div className="order-box" style={{marginTop: availWidth > 767 ? '0px' : (72*window.innerHeight/100)}}>
					<Header 
							{...settings} 
							userName={customerName} 
							taskId={visitId.taskId}
							t={t}
							style={{display: availWidth <= 767 ? 'none' : 'block'}}
							/>
					<div className="order-box-content">
						<div id="orderDetailContent" className="order-detail-box">
							{status && status.status !== "COMPLETED" && status.status !== "CANCELLED" && <Rider 
								userName={userName} 
								userNumber={userNumber} 
								userPhotoUrl={userPhotoUrl} 
								availWidth={availWidth} 
								enrouteOrders={this.props.enrouteOrders || []}
								userDisplayText={userDisplayText}
								t={t}/>}
							<Status 
								status={status} 
								source={source} 
								destination={destination} 
								from={settings && settings.displayName} 
								to={customerName && customerName} 
								amount={amount} 
								clientName={settings.displayName} 
								userName={userName} 
								eta={eta}
								pin={pin}
								tripDisplayText={tripDisplayText}/>
							{
								checkIfAllDetailsExist(orderDetail) ? 
								<Details 
									orderDetail={orderDetail} 
									amount={amount}
									t={t}
									availWidth={availWidth}/> :
								""
							}
						</div>
						<FooterLogo label={t('poweredBy')}/>
					</div>
			</div>
		);
	}
}

export default translate('translations')(OrderInfo);
