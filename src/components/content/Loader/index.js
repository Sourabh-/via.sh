import React from 'react';
import PreLoader from '../../uiComponents/materializecss/PreLoader';
import logo3x from '../../../assets/images/logo/logo@3x.png';

const Loader = ({width}) => {
	return (
		<div className="page-loader">
			<div>
				<img src={logo3x} width='120px' style={{ "marginBottom": "10px" }} alt="..."/> 
				<PreLoader width={width || '70%'} backgroundColor="#0089ec"/>
			</div>
		</div>
	);
} 

export default Loader;