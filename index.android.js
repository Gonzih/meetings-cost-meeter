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
var currencyLabel = '$';

export class CurrentCost extends React.Component {
  render() {
    let n = (this.props.rate * (this.props.time / priceDivider / 3600)).toFixed(2);

    return (
      <Text style={styles.header}>
        {n} {currencyLabel}
      </Text>
    );
  }
};

export class RateView extends React.Component {
  render() {
    return (
      <Text>
        Avg hourly rate: {this.props.rate} {currencyLabel}
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
    this.resetState();
    this.startTimerLoop();
  }

  resetState() {
    this.state = {time: 0, paused: true, rate: 20};
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
    this.setState({paused: !this.state.paused});
  }

  setRate(v) {
    let rate = v || 20;

    this.setState({rate: rate});
  }

  render() {
    return (
      <View style={styles.container}>
        <CurrentCost
          time={this.state.time}
          rate={this.state.rate}/>
        <HourlyRate
          rate={this.state.rate}
          onChange={this.setRate.bind(this)}/>
        <StartStopButton
          inProgress={this.state.time > 0}
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
    fontSize: 20,
    textAlign: 'center',
  },
  information: {
    margin: 15,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 5,
    padding: 5,
  },
  buttonText: {
    fontSize: 20,
  },
});

AppRegistry.registerComponent('MeetingCostMeter', () => MeetingCostMeter);
