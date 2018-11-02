import React, { Component } from "react";
import { translate } from 'react-i18next';
import FooterWithProps from '../../uiComponents/FooterLogo/FooterWithProps';

import background from '../../../assets/images/background/large/background.png';
import background2x from '../../../assets/images/background/large/background@2x.png';
import background3x from '../../../assets/images/background/large/background@3x.png';

import backgroundS from '../../../assets/images/background/small/background.png';
import backgroundS2x from '../../../assets/images/background/small/background@2x.png';
import backgroundS3x from '../../../assets/images/background/small/background@3x.png';

class Page_404 extends Component {

	getSrc = (availWidth, availHeight) => {
		if(availWidth < 479 && availHeight <= 1024) {
			return backgroundS;
		} else if(availWidth < 769 && availHeight <= 550) {
			return background2x;
		} else if(availWidth < 769) {
			return backgroundS2x;
		} else if(availWidth < 1025 && availHeight < 769) {
			return background;
		} else if(availWidth < 1025 && availHeight <= 1366) {
			return backgroundS3x;
		} else 
			return background3x;
	}

	render() {
		const { t, availWidth, availHeight } = this.props;

		return (
			<div className="page-404">
				<img className="image-404" src={this.getSrc(availWidth, availHeight)} alt={t('message404')}/>
				<div className="overlay-text" style={{"minWidth" : (availWidth > 550 ? "550px" : "270px")}}>
					<div className="conn-header poppins-medium opacity-95">4O4</div>
					
					<div className="conn-subheader poppins-medium opacity-95">
						{t('pageNotFound')}
					</div>
					<br/>
					<div className="conn-detail poppins-regular opacity-95">
						<span>{t('message404')}</span><br/>
						<span>{t('onyxMessage')}</span>
					</div>
				</div>
				<FooterWithProps styles={{left: "50%"}} label={t('poweredBy')}/>
			</div>
		);
	}
}

export default translate('translations')(Page_404);