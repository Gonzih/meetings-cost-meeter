'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableNativeFeedback,
} = React;

var tickInterval = 100;
var priceDivider = 1000 / tickInterval;
var currencyLabel = '€';

export class CurrentCost extends React.Component {
  render() {
    let n = (this.props.rate * this.props.people * (this.props.time / priceDivider / 3600)).toFixed(2);

    return (
      <TouchableNativeFeedback onPress={this.props.onClick}>
        <View>
          <Text style={styles.header}>
            So far: {n} {currencyLabel}
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
};

export class RateView extends React.Component {
  render() {
    return (
      <Text>
        Avg. hourly rate: {this.props.rate} {currencyLabel}
      </Text>
    );
  }
};

export class RateEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.value};
  }

  render() {
    return (
      <TextInput
        keyboardType='numeric'
        value={this.props.rate}
        onChangeText={(v) => this.setState({value: v})}
        onSubmitEditing={() => this.props.onChange(parseInt(this.state.value))} />
    );
  }
};

export class HourlyRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {edit: false};
  }

  toggleEdit() {
    this.setState({edit: !this.state.edit});
  }

  onChange(i) {
    this.props.onChange(i);
    this.toggleEdit();
  }

  render() {
    let component;

    if (this.state.edit) {
      component = <RateEdit rate={this.props.rate} onChange={this.onChange.bind(this)}/>;
    } else {
      component = <RateView rate={this.props.rate}/>;
    }

    return (
      <TouchableNativeFeedback onPress={this.toggleEdit.bind(this)}>
        <View style={styles.information}>
          {component}
        </View>
      </TouchableNativeFeedback>
    );
  }
};

export class PeopleView extends React.Component {
  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onClick}>
        <View style={styles.peopleInformation}>
          <Text>
            x {this.props.people} participants
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

export class StartStopButton extends React.Component {
  constructor(props) {
    super(props);
  }

  genLabel() {
    let label = "Start";

    if (this.props.inProgress) {
      if (this.props.isPaused) {
        label = "Continue";
      } else {
        label = "Pause";
      }
    };

    return label;
  }

  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onClick}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            {this.genLabel()}
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
};

export class MeetingCostMeter extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.startTimerLoop();
  }

  initialState() {
    return {time: 0, paused: true, started: false, rate: 20, people: 1};
  }

  resetState() {
    this.setState(this.initialState());
  }

  tick() {
    if (!this.state.paused) {
      this.setState({time: this.state.time + 1});
    }
  }

  startTimerLoop() {
    setInterval(this.tick.bind(this), tickInterval);
  }

  startPauseContinue() {
    this.setState({paused: !this.state.paused, started: true});
  }

  setRate(v) {
    let rate = v || this.state.rate;

    this.setState({rate: rate});
  }

  incPeople() {
    this.setState({people: this.state.people + 1});
  }

  render() {
    return (
      <View style={styles.container}>
        <CurrentCost
          onClick={this.resetState.bind(this)}
          people={this.state.people}
          time={this.state.time}
          rate={this.state.rate}/>
        <HourlyRate
          rate={this.state.rate}
          onChange={this.setRate.bind(this)}/>
        <PeopleView
          onClick={this.incPeople.bind(this)}
          people={this.state.people}/>
        <StartStopButton
          inProgress={this.state.started}
          isPaused={this.state.paused}
          onClick={this.startPauseContinue.bind(this)}/>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
  },
  information: {
    margin: 15,
    textAlign: 'center',
    color: '#333333',
  },
  peopleInformation: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
  },
  button: {
    width: 120,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 5,
    padding: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
  },
});

AppRegistry.registerComponent('MeetingCostMeter', () => MeetingCostMeter);
