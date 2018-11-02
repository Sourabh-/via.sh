import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import pickup2x from '../../../assets/images/pickup/pickup@2x.png';
import drop2xdel from '../../../assets/images/drop/delivered/drop@2x.png';
import drop2xong from '../../../assets/images/drop/ongoing/drop@2x.png';
import drop2xcan from '../../../assets/images/drop/cancelled/drop@2x.png';

const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Marker,
  Circle
} = require("react-google-maps");

const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");

let bounds;

/*const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
})*/

let gMap;

//const car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
export const MapWithDirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA_jSl2ApNAau0-HI7Tx17wdeViLwJt2nU&v=3.32&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%`, minWidth: `300px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      this.setState({ heading: '', _userLocation: null });
      this.reRender(this.props);
    },

    componentWillReceiveProps(nextProps) {
      if(!_.isEqual(this.props, nextProps)) {
        this.reRender(nextProps, nextProps.rnd !== this.props.rnd);
      }
    },

    reRender(props, rndBool) {
        const DirectionsService = new window.google.maps.DirectionsService();
        bounds = new window.google.maps.LatLngBounds();
        let count = !props.showLocationTrail && props.source && props.source.latLng ? 2 : 1; //1: if don't want to show pickup
        let waypts = [];
        var autoDriveSteps = [];
        var speedFactor = 10; // 10x faster animated drive

        const fitBound = () => {
          count--;
          if(count === 0 && gMap) {
            bounds.extend(new window.google.maps.LatLng(props.destination.latLng.lat-0.000396, props.destination.latLng.lng+0.001867));
            gMap.fitBounds(bounds);
          }
        }

        const getPointBetween = (a, b, ratio) => {
            return {
              latLng: { 
                lat: a.lat() + (b.lat() - a.lat()) * ratio, 
                lng: a.lng() + (b.lng() - a.lng()) * ratio
              }
            };
        }

        const checkForUserLocation = () => {
          if(props.userLocation && props.userLocation.latLng) {
            /*==USER LOCATION ANIMATION==*/
            if(!this.state._userLocation) {
              this.setState({ _userLocation:  props.userLocation});
            } else if(!_.isEqual(this.state._userLocation, props.userLocation)){
              DirectionsService.route({
                origin: new window.google.maps.LatLng(this.state._userLocation.latLng.lat, this.state._userLocation.latLng.lng),
                destination: new window.google.maps.LatLng(props.userLocation.latLng.lat, props.userLocation.latLng.lng),
                travelMode: window.google.maps.TravelMode.DRIVING,
                optimizeWaypoints: true
              }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  autoDriveSteps = [];
                  var remainingSeconds = 0;
                  var leg = result.routes[0].legs[0]; // supporting single route, single legs currently
                  leg.steps.forEach(function(step) {
                      var stepSeconds = step.duration.value;
                      var nextStopSeconds = speedFactor - remainingSeconds;
                      while (nextStopSeconds <= stepSeconds) {
                          var nextStopLatLng = getPointBetween(step.start_location, step.end_location, nextStopSeconds / stepSeconds);
                          autoDriveSteps.push(nextStopLatLng);
                          nextStopSeconds += speedFactor;
                      }
                      remainingSeconds = stepSeconds + speedFactor - nextStopSeconds;
                  });
                  if (remainingSeconds > 0) {
                      autoDriveSteps.push({ latLng: { lat: leg.end_location.lat(), lng: leg.end_location.lng() } });
                  }

                  var autoDriveTimer = setInterval( () => {
                      // stop the timer if the route is finished
                      if (autoDriveSteps.length === 0) {
                          clearInterval(autoDriveTimer);
                          getDestinationDirection();
                      } else {
                          // move marker to the next position (always the first in the array)
                          let rotate = window.google.maps.geometry.spherical.computeHeading(new window.google.maps.LatLng(this.state._userLocation.latLng.lat, this.state._userLocation.latLng.lng), new window.google.maps.LatLng(autoDriveSteps[0].latLng.lat, autoDriveSteps[0].latLng.lng));
                          this.setState({ 
                            _userLocation: autoDriveSteps[0] 
                          });
                          $(`img[src="${this.props.vehicleIconUrl}"]`).css({
                              '-webkit-transform' : 'rotate('+ rotate +'deg)',
                               '-moz-transform' : 'rotate('+ rotate +'deg)',
                               '-ms-transform' : 'rotate('+ rotate +'deg)',
                               'transform' : 'rotate('+ rotate +'deg)'
                          }); 
                          // remove the processed position
                          autoDriveSteps.shift();
                      }
                  },
                  100);
                }
              })
            } else {
              this.setState({ _userLocation:  props.userLocation});
            }
            /*===========================*/
          }
        }

        const getDestinationDirection = (sCheckBool) => {
          DirectionsService.route({
            origin: new window.google.maps.LatLng(props.userLocation && props.userLocation.latLng ? props.userLocation.latLng.lat : props.destination.latLng.lat, props.userLocation && props.userLocation.latLng ? props.userLocation.latLng.lng : props.destination.latLng.lng),
            destination: new window.google.maps.LatLng(props.destination.latLng.lat, props.destination.latLng.lng),
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: waypts,
            optimizeWaypoints: true
          }, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              this.setState({
                directions: result,
                heading: props.userLocation && props.userLocation.latLng ? window.google.maps.geometry.spherical.computeHeading(new window.google.maps.LatLng(props.userLocation.latLng.lat, props.userLocation.latLng.lng), new window.google.maps.LatLng(result.routes[0].legs[0] && result.routes[0].legs[0].steps && result.routes[0].legs[0].steps.length ? result.routes[0].legs[0].steps[0].start_location.lat() : props.destination.latLng.lat, result.routes[0].legs[0] && result.routes[0].legs[0].steps && result.routes[0].legs[0].steps.length ? result.routes[0].legs[0].steps[0].start_location.lng() : props.destination.latLng.lng)) : '',
                waypoints: waypts
              }, () => {
                if(this.state.heading && ["COMPLETED", "CANCELLED", "NOT_STARTED"].indexOf(this.props.tripStatus) === -1) {
                  setTimeout(() => {
                    let rotate = this.state.heading;
                    $(`img[src="${this.props.vehicleIconUrl}"]`).css({
                        '-webkit-transform' : 'rotate('+ rotate +'deg)',
                         '-moz-transform' : 'rotate('+ rotate +'deg)',
                         '-ms-transform' : 'rotate('+ rotate +'deg)',
                         'transform' : 'rotate('+ rotate +'deg)'
                    }); 
                  }, 1500)
                } 
              });

              if(sCheckBool) {
                bounds.union(result.routes[0].bounds);
                fitBound();
                checkForUserLocation();
              }
            }
          });
        }

        if(props.enrouteOrders && props.enrouteOrders.length) {
          for(let i=0; i< props.enrouteOrders.length; i++) {
            waypts.push({
              location: new window.google.maps.LatLng(props.enrouteOrders[i].latLng.lat, props.enrouteOrders[i].latLng.lng),
              stopover: true
            })
          }
        } 

        if(rndBool) {
          getDestinationDirection(true);
        } else if(props.destination && props.destination.latLng && (!this.state || (this.state && !this.state._userLocation))) {
          getDestinationDirection(true);
        } else if(!props.userLocation && this.state && this.state._userLocation) {
          getDestinationDirection();
        } else {
          checkForUserLocation();
        }

        //DO THIS ONLY IF WE NEED TO SHOW PICKUP LOCATION BASED ON API CONFIGURATION
        if(!props.showLocationTrail && props.source && props.source.latLng && (!this.state || (this.state && !this.state._userLocation))) {
          DirectionsService.route({
            origin: new window.google.maps.LatLng(props.source.latLng.lat, props.source.latLng.lng),
            destination: new window.google.maps.LatLng(props.userLocation && props.userLocation.latLng ? props.userLocation.latLng.lat : props.source.latLng.lat, props.userLocation && props.userLocation.latLng ? props.userLocation.latLng.lng : props.source.latLng.lng),
            travelMode: window.google.maps.TravelMode.DRIVING,
          }, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              this.setState({
                pickupDirections: result
              });

              bounds.union(result.routes[0].bounds);
              fitBound();
            } else {
              //console.error(`Error fetching directions ${result}`);
            }
          });
        }
    }
  })
)(props => {
  return (<div>
    { (props.tripStatus !== "NOT_STARTED" && props.eta !== -99999) 
      ?
      <GoogleMap
        ref={ el => { gMap = el; } }
        defaultOptions={{
          mapTypeControl: false
        }}
        options={{
          mapTypeControl: false,
          disableDoubleClickZoom: false,
          draggable: true,
          fullscreenControl: false,
          scaleControl: true,
          scrollwheel: true,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_BOTTOM
          },
          styles: [
              {
                featureType: 'poi.business',
                stylers: [{visibility: 'off'}]
              },
              {
                featureType: 'poi',
                stylers: [{visibility: 'off'}]
              },
              {
                featureType: 'transit',
                elementType: 'labels.icon',
                stylers: [{visibility: 'visible'}]
              },
              {
                featureType: 'transit.line',
                stylers: [{visibility: 'off'}]
              },
              {elementType: 'labels.text.stroke', stylers: [{visibility: 'visible'}]},
              {elementType: 'labels.text.fill', stylers: [{visibility: 'visible'}]},
          ]}
        }
      >
        {props.pickupDirections && <Marker
          zIndex={-1}
          position={{ lat: props.source.latLng.lat, lng: props.source.latLng.lng }}
          icon={{
            url: (pickup2x),
            scaledSize: (props.availWidth < 479 ? new window.google.maps.Size(24, 24) : new window.google.maps.Size(32, 32)),
          }}
        />}

        {props.showLocationTrail && props.directions && ["COMPLETED", "CANCELLED"].indexOf(props.tripStatus) === -1 && <DirectionsRenderer 
                                directions={props.directions} 
                                options={{
                                  preserveViewport: true,
                                  suppressMarkers: true,
                                  polylineOptions: {
                                    strokeColor: '#0bb4f1',
                                    strokeOpacity: 0,
                                    icons: [{
                                        icon: {
                                            path: window.google.maps.SymbolPath.CIRCLE,
                                            fillOpacity: 1,
                                            scale: 3
                                        },
                                        offset: '0',
                                        repeat: '1px'
                                    }]
                                  }
                                }}/>}
        {props._userLocation && props._userLocation.latLng ? <Marker
          position={{ 
            lat: props.tripStatus === "COMPLETED" ? props.destination.latLng.lat : props.tripStatus === "CANCELLED" ? (props.source && props.source && props.source.latLng ? props.source.latLng.lat : props.destination.latLng.lat) : props._userLocation.latLng.lat, 
            lng: props.tripStatus === "COMPLETED" ? props.destination.latLng.lng : props.tripStatus === "CANCELLED" ? (props.source && props.source && props.source.latLng ? props.source.latLng.lng : props.destination.latLng.lng) : props._userLocation.latLng.lng 
          }}
          zIndex={2}
          icon={{
            url: props.vehicleIconUrl,
            scaledSize: new window.google.maps.Size(50, 50), // scaled size
            origin: new window.google.maps.Point(0, 0),
            //path: car,
            //scale: .7,
            //strokeColor: 'white',
            //strokeWeight: .10,
            //fillOpacity: 1,
            //fillColor: '#404040',
            //offset: '5%',
            //rotation: props.heading,
            anchor: (props.tripStatus === "COMPLETED" ? new window.google.maps.Point(24, 25) :  props.tripStatus === "CANCELLED" ? new window.google.maps.Point(24, 25) : new window.google.maps.Point(20, 25))
          }}
        >
        
        </Marker> : ''}
        <MarkerWithLabel
          zIndex={3}
          position={{ lat: props.destination.latLng.lat, lng: props.destination.latLng.lng }}
          labelAnchor={new window.google.maps.Point(-10, -10)}
          labelStyle={{"boxShadow": "0px 0px 5px 0px rgba(0,0,0,0.43)"}}
          icon={{
            url: (props.tripStatus === 'COMPLETED' ? drop2xdel : props.tripStatus === 'CANCELLED' ? drop2xcan : drop2xong),
            scaledSize: (props.availWidth < 479 ? new window.google.maps.Size(24, 24) : new window.google.maps.Size(32, 32))
          }}
        >
          {["COMPLETED", "CANCELLED"].indexOf(props.tripStatus) === -1 ? !props.dNearBy ? 
            <div className="eta-box">
              <div className="eta-box-time">{props.eta}</div>
              <div className="eta-box-text"> &nbsp;MIN <br/>ETA</div>
            </div> :
            <div className="d-box">{props.dNearByLabel}</div> : <div></div>}
        </MarkerWithLabel>

        {
          props.waypoints && props.waypoints.length 
          ?
          props.waypoints.map((wp, i) => {
            return (
              <Marker
                key={i}
                position={wp.location}></Marker>
            );
          }) 
          : 
          <span></span>
        }
      </GoogleMap>
      :
      <div>
        <div className="trackInWhile">{props.yetToStartLabel}</div>
        <GoogleMap
          defaultZoom={19}
          defaultCenter={{ lat: 12.969158, lng: 77.600947 }}
          clickableIcons={false}
          options={{
            mapTypeControl: false,
            disableDoubleClickZoom: true,
            draggable: false,
            fullscreenControl: false,
            scaleControl: false,
            scrollwheel: false,
            streetViewControl: false,
            zoomControl: false,
            styles: [
                {
                  featureType: 'poi.business',
                  stylers: [{visibility: 'off'}]
                },
                {
                  featureType: 'transit',
                  elementType: 'labels.icon',
                  stylers: [{visibility: 'off'}]
                },
                {
                  featureType: 'transit.line',
                  stylers: [{visibility: 'off'}]
                },
                {elementType: 'labels.text.stroke', stylers: [{visibility: 'off'}]},
                {elementType: 'labels.text.fill', stylers: [{visibility: 'off'}]},
            ]}
          }
        >
          <Marker
            position={{ lat: 12.969158, lng: 77.600947 }}
            icon={{
              url: props.vehicleIconUrl,
              scaledSize: new window.google.maps.Size(50, 50), // scaled size
              origin: new window.google.maps.Point(0, 0),
              /*path: car,
              scale: 1,
              strokeColor: 'white',
              strokeWeight: .10,
              fillOpacity: 1,
              fillColor: '#404040',
              offset: '5%',
              rotation: 0,*/
              anchor: new window.google.maps.Point(10, 55)
            }}>
          </Marker>
          <Circle
            center={{ lat: 12.969238, lng: 77.600987 }}
            radius={10}
            options={{
              strokeWeight: 0,
              fillColor: '#009dff',
              fillOpacity: 0.35
            }}></Circle>
          <Circle
            center={{ lat: 12.969238, lng: 77.600987 }}
            radius={20}
            options={{
              strokeWeight: 0,
              fillColor: '#009dff',
              fillOpacity: 0.35
            }}></Circle>
        </GoogleMap>
      </div>
    }
  </div>);
});