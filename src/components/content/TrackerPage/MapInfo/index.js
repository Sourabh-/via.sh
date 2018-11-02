import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { MapWithDirectionsRenderer } from '../../../uiComponents/maps';
import _ from 'lodash';
const moment = require('moment');

class MapsInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			source: null,
			destination: null,
			userLocation: null,
			eta: -99999,
			tripStatus: "",
			dNearBy: false,
			enrouteOrders: null,
			showLocationTrail: false,
			rnd: Math.random()
		};
	}

	componentDidMount() {
		let { props } = this;
		this.initializeMap(props);
	}

	getETA = (eta) => {
		let e1 = moment(eta).valueOf();
		let e2 = new Date().getTime();
		let newEta = (e1 - e2)/(1000 * 60);
		return Math.floor(Math.abs(newEta));
	}

	initializeMap(props) {
		this.setState({
			source: props.source,
			destination: props.destination,
			userLocation: props.userLocation,
			eta: props.eta ? this.getETA(props.eta) : -99999,
			showLocationTrail: props.showLocationTrail || false,
			tripStatus: props.status && props.status.status ? props.status.status.toUpperCase() : '',
			dNearBy: props.enrouteOrders && props.enrouteOrders.length,
			enrouteOrders: props.enrouteOrders,
			vehicleIconUrl: props.vehicleIconUrl
		})
	}

	componentWillReceiveProps(nextProps) {
		if(!_.isEqual(this.props, nextProps)) {
			this.initializeMap(nextProps);
		}
	}

	/*c_loc = () => {
		this.setState({
			rnd: Math.random()
		})
	}*/

	render() {
		const { source, destination, userLocation, enrouteOrders, eta, tripStatus, dNearBy, showLocationTrail, vehicleIconUrl, rnd } = this.state;
		const { refresh, t, availWidth, isBusy } = this.props;
		//const { c_loc } = this;

		return (
			<div className="map-box" style={{
					height: availWidth > 767 ? 'auto' : (72*window.innerHeight/100),
					right: availWidth > 767 ? 0 : (/mobi/i.test(navigator.userAgent)) ? 0 : '18px',
					paddingLeft: availWidth > 767 ? 0 : (/mobi/i.test(navigator.userAgent)) ? 0 : '18px'
				}}>
			{/*eslint-disable no-script-url*/}
				<button style={{cursor: isBusy ? 'default' : 'pointer'}} className="refresh-btn btn-floating btn-large waves-effect waves-light lightBlack" onClick={refresh}>
					{!isBusy && <i className="material-icons">refresh</i>}
				</button>
				{isBusy && <div className="btn-loading">
                        <div className="dot"></div>
                        <div className="pulse"></div>
                </div>}
				{/*<a className="center-btn btn-floating btn-small waves-effect waves-light" href="javascript:void(0)" onClick={c_loc}>
					<i className="material-icons">my_location</i>
				</a>*/}
				<MapWithDirectionsRenderer 
					availWidth={availWidth}
					source={source} 
					destination={destination} 
					userLocation={userLocation} 
					showLocationTrail={showLocationTrail} 
					yetToStartLabel={t('trackingYetToStart')} 
					eta={eta}
					tripStatus={tripStatus}
					dNearBy={dNearBy}
					enrouteOrders={enrouteOrders}
					dNearByLabel={t('deliveringOrdersNearBy')}
					vehicleIconUrl={vehicleIconUrl}
					rnd={rnd}/>
			</div>
		);
	}
}

export default translate('translations')(MapsInfo);
