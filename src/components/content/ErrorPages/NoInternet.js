/*NOT REQUIRED AS PER NEW DESIGNS*/

import React, { Component } from "react";
import { translate } from 'react-i18next';
import FooterWithProps from '../../uiComponents/FooterLogo/FooterWithProps';

import background from '../../../assets/images/background/large/background.png';
import background2x from '../../../assets/images/background/large/background@2x.png';
import background3x from '../../../assets/images/background/large/background@3x.png';

import backgroundS from '../../../assets/images/background/small/background.png';

class NoInternet extends Component {

	render() {
		const { t, availWidth } = this.props;

		return (
			<div className="page-404">
				<img className="image-404" src={availWidth < 479 ? backgroundS : (availWidth < 769 ? background : (availWidth < 1025 ? background2x : background3x))} width="100%" height="100%" alt={t('message404')}/>
				<div className="overlay-text" style={{"minWidth" : (availWidth > 550 ? "550px" : "270px")}}>
					<div className="conn-header-in poppins-medium opacity-95">{t('noInternet')}</div>
					<br/>
					<div className="conn-subheader poppins-medium opacity-95">{t('noConnection')}</div>
					<br/>
					<div className="conn-detail poppins-regular opacity-95">{t('onyxWireMessage')}</div>
				</div>
				<FooterWithProps styles={{left: "50%"}} label={t('poweredBy')}/>
			</div>
		);
	}
}

export default translate('translations')(NoInternet);