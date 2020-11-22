import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

class GoalView extends React.Component {

  /**
   * Specifies the default values that will be shown for a split second
   * while data is loading in from the server.
   */
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      goalDailyCalories: 0.0,
      goalDailyProtein: 0.0,
      goalDailyCarbohydrates: 0.0,
      goalDailyFat: 0.0,
      goalDailyActivity: 0.0,
      totalDailyCalories: 0.0,
      totalDailyProtein: 0.0,
      totalDailyCarbohydrates: 0.0,
      totalDailyFat: 0.0,
      totalDailyActivity: 0.0
    }
  }

  /**
   * Fetch the data from the API after mounting; this may take a few seconds.
   * Once the data is fetched, it is stored into the state and then displayed
   * onto the fields.
   * 
   * This GET request requires us to specify our username and x-access-token,
   * both of which we inherit through props.
   */
  componentDidMount() {
    // Get all goals
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          firstName: res.firstName,
          lastName: res.lastName,
          goalDailyCalories: res.goalDailyCalories,
          goalDailyProtein: res.goalDailyProtein,
          goalDailyCarbohydrates: res.goalDailyCarbohydrates,
          goalDailyFat: res.goalDailyFat,
          goalDailyActivity: res.goalDailyActivity
        });
    });

    // Get daily nutrition
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        // Check if meal is from today
        const meals = res.meals;
        let mealIds = [];
        for (let i = 0; i < meals.length; i++) {
          if (this.props.compareDate(meals[i].date)) {
            mealIds.push(meals[i].id);
          }
        }

        for (let i = 0; i < mealIds.length; i++) {
          fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealIds[i] + '/foods', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
          })
            .then(res => res.json())
            .then(res => {
              const foods = res.foods;
              for (let j = 0; j < foods.length; j++) {
                this.setState({
                  totalDailyCalories: this.state.totalDailyCalories + foods[j].calories,
                  totalDailyCarbohydrates: this.state.totalDailyCarbohydrates + foods[j].carbohydrates,
                  totalDailyFat: this.state.totalDailyFat + foods[j].fat,
                  totalDailyProtein: this.state.totalDailyProtein + foods[j].protein
                });
              }
          });
        }
    });

    // Get daily activity
    fetch('https://mysqlcs639.cs.wisc.edu/activities', {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        const activities = res.activities;
        for (let i = 0; i < activities.length; i++) {
          if (this.props.compareDate(activities[i].date)) {
            this.setState({totalDailyActivity: this.state.totalDailyActivity + activities[i].duration});
          }
        }
    });
  }


  render() {
    return (
      <View style={styles.box}>
        <View style={{borderBottomColor: 'black', borderBottomWidth: 1, width: '100%'}}>
          <Text style={{borderColor: 'black', borderBottomWidth: 1, borderRadius: 10, textAlign: 'center'}}>Goals Status</Text>
        </View>

        <View style={styles.verticalSpacing}>
          <Text>Daily Activity: {this.state.totalDailyActivity}/{this.state.goalDailyActivity} {(this.state.totalDailyActivity >= this.state.goalDailyActivity ? <Ionicons name="ios-checkbox" size={15} color={'green'}></Ionicons> : '')}</Text>
        </View>
        <View style={styles.verticalSpacing}>
          <Text>Daily Calories: {this.state.totalDailyCalories}/{this.state.goalDailyCalories} {(this.state.totalDailyCalories >= this.state.goalDailyCalories ? <Ionicons name="ios-checkbox" size={15} color={'green'}></Ionicons> : '')}</Text>
        </View>
        <View style={styles.verticalSpacing}>
          <Text>Daily Protein: {this.state.totalDailyProtein}/{this.state.goalDailyProtein} {(this.state.totalDailyProtein >= this.state.goalDailyProtein ? <Ionicons name="ios-checkbox" size={15} color={'green'}></Ionicons> : '')}</Text>
        </View>
        <View style={styles.verticalSpacing}>
          <Text>Daily Carbohydrates: {this.state.totalDailyCarbohydrates}/{this.state.goalDailyCarbohydrates} {(this.state.totalDailyCarbohydrates >= this.state.goalDailyCarbohydrates ? <Ionicons name="ios-checkbox" size={15} color={'green'}></Ionicons> : '')}</Text>
        </View>
        <View style={styles.verticalSpacing}>
          <Text>Daily Fat: {this.state.totalDailyFat}/{this.state.goalDailyFat} {(this.state.totalDailyFat >= this.state.goalDailyFat ? <Ionicons name="ios-checkbox" size={15} color={'green'}></Ionicons> : '')}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    height: Dimensions.get('window').height
  },
  mainContainer: {
    flex: 1
  },
  scrollViewContainer: {},
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5
  },
  spaceSmall: {
    width: 20,
    height: 10,
  },
  space: {
    width: 20,
    height: 20,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20
  },
  buttonInline: {
    display: "flex"
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: '#c9392c',
    borderWidth: 1
  },
  inputInline: {
    flexDirection: "row",
    display: "flex",
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: '#c9392c',
    borderWidth: 1
  },
  box: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
    height: 180,
    display: 'flex',
    marginTop: 40,
    backgroundColor: '#FFF'
  },
  verticalSpacing: {
    marginTop: 5,
    marginBottom: 5
  }
});

export default GoalView;
