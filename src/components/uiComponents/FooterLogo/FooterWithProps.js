import React from "react";
import logo2x from '../../../assets/images/logo/logo@2x.png';

const FooterWithProps = ({styles, label, marginTop}) => {
	return (
		<div className="footer-404" style={styles}>
			<div className="powder-by-footer" style={{"marginTop": marginTop || "2px"}}> {label} </div>
			<div>
				<img src={logo2x} width='100px' alt="..."/>
			</div>
		</div>
	);
}

export default FooterWithProps;
