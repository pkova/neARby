import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  Text
} from 'react-native';
import styles from '../styles/style';
import { drawerState, resetSearch } from '../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SearchPanel extends Component {
  constructor(props) {
    super(props);
    console.log(this, 'search');
  }

  resetSearch() {
    this.props.action.resetSearch();
    let positionObj = {
      latitude: this.props.currentPosition.latitude,
      longitude: this.props.currentPosition.longitude,
      threejsLat: this.props.threeLat,
      threejsLon: this.props.threeLon
    };

    this.props.action.fetchPlaces(positionObj)
    .then(() => {this.props.action.userPlacesQuery(positionObj)});

  }

  render() {
    return (
      <View style={{justifyContent: 'center'}}>
        <Text style={styles.heading}>search</Text>
        <View style={{alignItems: 'center', justifyContent: 'center', height: 400}}>
          <TouchableHighlight style={styles.searchButtons} onPress={() => { this.props.action.drawerState('Places'); }}>
            <Text style={styles.searchButtonText}>places</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.searchButtons} onPress={() => { this.props.action.drawerState('Events'); }}>
            <Text style={styles.searchButtonText}>events</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.placeOrEventButton} onPress={() => { this.resetSearch(); }}>
            <Text style={styles.buttonText}>reset</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    user: state.user,
    currentPosition: state.Geolocation.currentPosition,
    threeLat: state.Geolocation.threeLat,
    threeLon: state.Geolocation.threeLon
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ drawerState, resetSearch }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
