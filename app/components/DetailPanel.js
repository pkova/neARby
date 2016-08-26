import React, { Component } from 'react';
import {
  View,
  MapView,
  ScrollView,
  Text,
  Image
} from 'react-native';
import styles from '../styles/style';
import { drawerState, placeQuery } from '../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class PlacePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null
    };
  }



  render() {
    var render;
    if (this.props.type === 'events') {
      render = (
        <View>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.detailsHeading}>{this.props.detail.name}</Text>
          <Text style={styles.detailsHeading}>Start Time: {this.props.detail.startTime}</Text>
          <Text style={styles.detailsHeading}>{this.props.detail.venue}</Text>
          <Text style={styles.detailsHeading}>Event Details</Text>
          <Text>{this.props.detail.details}</Text>
          <ScrollView horizontal={true} style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row'}}>
            {this.props.photos.map(function(item, key) {
              return (
                <Image key={key} source={{uri: item}} style={styles.images} />
                );
              })
            }
          </View>
        </ScrollView>
        <View>
          <Text style={styles.detailsHeading}>Walking Directions</Text>
          {this.props.directions.map(function(item, key) {
            if (key === 0) {
              return (
                <Text key={key}>{item}</Text>
              );
            } else {
              return (
                <Text key={key}>  {key}. {item}</Text>
              );
            }
            })
          }
          <Text>Arrive at {this.props.detail.address}</Text>
        </View>
        <MapView
          style={{
            height: 250, margin: 20
          }}
          showsUserLocation={true}
          region={{
            latitude: Number(this.props.detail.realLat),
            longitude: Number(this.props.detail.realLon),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          annotations={[{latitude: Number(this.props.detail.realLat), longitude: Number(this.props.detail.realLon), title: this.props.detail.name}]}
        />
        </ScrollView>
        </View>
        );
    } else {
      render = (
      <View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.detailsHeading}>{this.props.detail.name}</Text>
        <Text style={styles.detailsHeading}>{this.props.detail.address}</Text>
        <Text style={styles.distanceText}>{this.props.detail.distance} feet away</Text>
        <ScrollView horizontal={true} style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row'}}>
            {this.props.photos.map(function(item, key) {
              return (
                <Image key={key} source={{uri: item}} style={styles.images} />
                );
              })
            }
          </View>
        </ScrollView>
        <View>
          <Text style={styles.detailsHeading}>Walking Directions</Text>
          {this.props.directions.map(function(item, key) {
            if (key === 0) {
              return (
                <Text key={key}>{item}</Text>
              );
            } else {
              return (
                <Text key={key}>{key}. {item}</Text>
              );
            }
            })
          }
        </View>
        <MapView
          style={{
            height: 250, margin: 20
          }}
          showsUserLocation={true}
          region={{
            latitude: Number(this.props.detail.realLat),
            longitude: Number(this.props.detail.realLon),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          annotations={[{latitude: Number(this.props.detail.realLat), longitude: Number(this.props.detail.realLon), title: this.props.detail.name}]}
        />
        </ScrollView>
      </View>
      );
    }
    return (
      <View>
      {render}
      </View>
    );
  }

}



const mapStateToProps = function(state) {
  return {
    detail: state.detail.selectedEvent,
    photos: state.photos.photos,
    directions: state.directions.directions,
    type: state.places.searchMode,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ drawerState, placeQuery}, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacePanel);
