import React, { Component } from 'react';
import { translate, } from 'react-i18next';
import OrderInfo from './OrderInfo';
import MapsInfo from './MapInfo';
import Page404 from '../ErrorPages/404';
import NoInternet from '../ErrorPages/NoInternet';
import {commonApi} from '../../../utility/api';
//import _ from 'lodash';
import Loader from '../Loader';
import Header from './OrderInfo/Header';
import $ from 'jquery';

var timerObject;
let scrollTopRider, scrollToBottom, preOffset;

class Tracker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isValidId: true,
			online: window.navigator.onLine,
			appData: {},
			refreshSeconds: 30000,
			isLoading: true,
			availWidth: $(window).width(),
			availHeight: $(window).height(),
			loaderWidth: '20%',
			isBusy: false
		};
	}

	componentDidMount() {
		let uId = this.props.match.params.uid;
		let { initialize } = this;
		let { refreshSeconds } = this.state;
		let self = this;
		let isAnimate = false;

		const getOffset = () => {
			return ($('#riderBox') && $('#riderBox').offset() ? $('#riderBox').offset().top - 72 : ($('#statusBox') && $('#statusBox').offset() ? $('#statusBox').offset().top - 72 : 0));
		}

		const eveScroll = () => {
			if(this.state.availWidth <= 767) {
				if(scrollToBottom && preOffset > getOffset()) {
					return;
				} else if(getOffset() < 0) {
					$("#orderDetailContent").css({
							paddingBottom: 0
					});
				} else if(getOffset() > 0.1953124 && scrollToBottom) {
					if(!isAnimate) {
						isAnimate = true;
						$(this.oTap).animate({
							scrollTop: 0
						}, 600, () => {
							setTimeout(() => { isAnimate = false; }, 100);
							scrollToBottom = false;
						});
					}
				} else if(getOffset() <= scrollTopRider) {
					if(this.oTap.scrollHeight - scrollTopRider < (scrollTopRider + 72)) {
						$("#orderDetailContent").css({
							paddingBottom: (scrollTopRider + 72 + (18*(this.oTap.scrollHeight - scrollTopRider)/100) - (this.oTap.scrollHeight - scrollTopRider)) + 'px'
						});
					}

					if(!isAnimate) {
						isAnimate = true;
						$(this.oTap).animate({
							scrollTop: scrollTopRider
						}, 600, () => {
							setTimeout(() => { isAnimate = false; }, 100);
							scrollToBottom = true;
							preOffset = getOffset();
						});
					}
				}
			}
		}

		const onTap = () => {
			$(document).on('click', '.on-tap', function(ev) {
				isAnimate = false;
				eveScroll();
			});

			$(document).on('click', '.order-details-collapsed', function(ev) {
				ev.stopPropagation();
			})
		}

		if(!uId) {
			this.setState({
				isValidId: false
			})
		} else {
			setTimeout(() => { 
				self.setState({ loaderWidth: '50%'}, () => { 
					//Make server call to fetch initial and tracking data
					initialize('', () => {
						scrollTopRider = getOffset();
					});
				});
			}, 100);

			//And it will call every refreshSeconds
			timerObject = setInterval(()=>{ initialize() }, refreshSeconds);
		}

		window.addEventListener("resize", (e) => {
			self.setState({
				availWidth: $(window).width(),
				availHeight: $(window).height()
			})
		});

		let detectScroll = () => {
			if(this.oTap)
				$(this.oTap).scroll((eve) => {
					eveScroll();
				});
			else setTimeout(() => detectScroll() , 100);
		}

		let updatePage = () => {
			if(self.fCon) self.fCon.scrollTop = 0;
			else setTimeout(() => updatePage(), 100);
		}

		updatePage();
		detectScroll();
		onTap();
	}

	componentWillUnmount() {
		clearInterval(timerObject);
	}

	initialize = (e, cb) => {
		let self = this;
		let { state } = self;

		if(!this.state.isBusy)
			this.setState({ isBusy: true }, () => {
				commonApi("get", "https://api.locus.sh/v1/trip/" + self.props.match.params.uid + "/info").then((res) => {
					if(res.data && res.data.settings) {
						if(res.data.settings.displayName) window.document.title = res.data.settings.displayName;
						if(res.data.settings.favicon) $("link[rel='shortcut icon']").attr("href", res.data.settings.favicon);
					}
					
					self.setState({
						isValidId: res.data && Object.keys(res.data).length,
						appData: res.data && Object.keys(res.data).length ? res.data : {},
						loaderWidth: '80%'
					}, () => {
						setTimeout(() => { 
							self.setState({ isLoading: false }, () => { if(cb) setTimeout(cb, 100); }); 
							setTimeout(() => { self.setState({ isBusy: false }) }, 100);
						}, 200);
					});
				}).catch((err)=>{
					console.log(err);
					self.setState({
						...state,
						isValidId: false,
						isLoading: false,
						isBusy: false
					});
				});
			})
	}

	render() {
		let { online, isValidId, appData, isLoading, availWidth, availHeight, loaderWidth, isBusy } = this.state;
		let { initialize } = this;
		let { t } = this.props;
		
		return (
			<div>
				{online ?
					isValidId ?
					isLoading ?
						<Loader width={loaderWidth}/> :
							<div className="outer-flex-container" ref={(ref) => this.oTap = ref}>
								<Header
									{...appData.settings} 
									userName={appData.customerName} 
									taskId={appData.visitId.taskId}
									t={t} 
									style={{display: availWidth <= 767 ? 'block' : 'none'}}/>
								<div ref={(ref) => this.fCon = ref} 
									className="flex-container">
									<OrderInfo { ...appData } availWidth={availWidth}/>
									<MapsInfo { ...appData } isBusy={isBusy} refresh={ initialize } availWidth={availWidth}/>
								</div>
							</div> : <Page404 availWidth={availWidth} availHeight={availHeight}/> : <NoInternet availWidth={availWidth}/>}
			</div>
		);
	}
}

export default translate('translations')(Tracker);
