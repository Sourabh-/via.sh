import React from "react";

const PreLoaderLinear = ({ width, backgroundColor }) => {
  return (
    <div className="progress" style={{backgroundColor: "#eee"}}>
      <div className="determinate" style={{width: width || "70%", backgroundColor: backgroundColor || "#26a69a"}}></div>
  	</div>
  )
}

export default PreLoaderLinear;