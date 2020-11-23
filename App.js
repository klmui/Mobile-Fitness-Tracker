import React from 'react';

import LoginView from './LoginView';
import SignupView from './SignupView';

import TodayView from './TodayView';
import ExercisesView from './ExercisesView';
import ProfileView from './ProfileView';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { TouchableOpacity, Image, View, Text } from 'react-native';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: undefined,
      username: undefined,
      activities: []
    }

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);

    this.SignoutButton = this.SignoutButton.bind(this);
    this.removeActivity = this.removeActivity.bind(this);
    this.modifyActivity = this.modifyActivity.bind(this);
    this.addActivity = this.addActivity.bind(this);
  }

  removeActivity(id) {
    let idxToRemove = -1;
    for (let i = 0; i < this.state.activities.length; i++) {
      if (this.state.activities[i].id == id) {
        idxToRemove = i;
        break;
      }
    }

    let newActivities = [...this.state.activities];
    if (idxToRemove !== -1) {
      newActivities.splice(idxToRemove, 1);
      this.setState({activities: newActivities});
    }

    fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.accessToken
      }
    })
      .then(res => res.json())
      .then(res => {
        // alert("Successfully deleted activity!");
      })
      .catch(err => {
        alert(err);
      });
  }

  modifyActivity(id, newActivity) {
    console.log('id', id);
    let newActivities = [...this.state.activities];
    for (let i = 0; i < newActivities.length; i++) {
      if (newActivities[i].id == id) {
        newActivities[i] = newActivity;
        break;
      }
    }

    this.setState({activities: newActivities});

    fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.accessToken
      },
      body: JSON.stringify({
        name: newActivity.name,
        duration: parseFloat(newActivity.duration),
        date: newActivity.date,
        calories: parseFloat(newActivity.calories)
      })
    })
      .then(res => res.json())
      .then(res => {
        // alert("Successfully added new activity!");
      })
      .catch(err => {
        alert(err);
      });
  }

  addActivity(activity) {
    const newActivities = this.state.activities.concat(activity);
    this.setState({activities: newActivities});

    fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.accessToken
      },
      body: JSON.stringify({
        name: activity.name,
        duration: parseFloat(activity.duration),
        date: activity.date,
        calories: parseFloat(activity.calories)
      })
    })
      .then(res => res.json())
      .then(res => {
        // alert("Successfully added new activity!");
      })
      .catch(err => {
        alert(err);
      });
  }

  /**
   * Store the username and accessToken here so that it can be
   * passed down to each corresponding child view.
   */
  login(username, accessToken) {
    this.setState({
      username: username,
      accessToken: accessToken
    });

    // Get activities
    fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'GET',
            headers: { 'x-access-token': this.state.accessToken }
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                activities: res.activities
            });
        })
        .catch((error) => {
            console.log("error", error);
        });
  }

  /**
   * Revokes the access token, effectively signing a user out of their session.
   */
  revokeAccessToken() {
    this.setState({
      accessToken: undefined
    });
  }

  /**
   * Defines a signout button... Your first TODO!
   */
  SignoutButton = () => {
    return <>
      <View style={{ flexDirection: 'row', marginRight: 25 }}
      accessible={true}
      accessibilityLabel="Sign out"
      accessibilityRole="button">
        <TouchableOpacity onPress={() => this.revokeAccessToken()}>
          <Ionicons name="ios-log-out" size={20} style={{marginLeft: 20}} />
        </TouchableOpacity>
      </View>
    </>
  }

  /**
   * Note that there are many ways to do navigation and this is just one!
   * I chose this way as it is likely most familiar to us, passing props
   * to child components from the parent.
   * 
   * Other options may have included contexts, which store values above
   * (similar to this implementation), or route parameters which pass
   * values from view to view along the navigation route.
   * 
   * You are by no means bound to this implementation; choose what
   * works best for your design!
   */
  render() {

    // Our primary navigator between the pre and post auth views
    // This navigator switches which screens it navigates based on
    // the existent of an access token. In the authorized view,
    // which right now only consists of the profile, you will likely
    // need to specify another set of screens or navigator; e.g. a
    // list of tabs for the Today, Exercises, and Profile views.
    let AuthStack = createStackNavigator();
    const TabNavigation = createBottomTabNavigator();

    return (
      <NavigationContainer>
        <AuthStack.Navigator>
          {!this.state.accessToken ? (
            <>
              <AuthStack.Screen
                name="SignIn"
                options={{
                  title: 'Fitness Tracker Welcome',
                }}
              >
                {(props) => <LoginView {...props} login={this.login} />}
              </AuthStack.Screen>

              <AuthStack.Screen
                name="SignUp"
                options={{
                  title: 'Fitness Tracker Signup',
                }}
              >
                {(props) => <SignupView {...props} />}
              </AuthStack.Screen>
            </>
          ) : (
              <>
                <AuthStack.Screen name="FitnessTracker" options={{
                  headerLeft: this.SignoutButton
                }}>
                  {(props) => 
                    <TabNavigation.Navigator
                    initialRouteName="TodayView"
                    tabBarOptions={{
                      activeTintColor: 'tomato',
                      inactiveTintColor: 'gray'
                    }}>
                      <TabNavigation.Screen
                        name="TodayView"
                        options={{
                          tabBarLabel: 'Today',
                          tabBarIcon: ({ focused, tintColor }) => {
                            let iconName = `ios-sunny`;
                            return <Ionicons name={iconName} size={25} color={tintColor} />;
                          },
                          tabBarOptions: {
                            activeTintColor: 'tomato',
                            inactiveTintColor: 'gray',
                          },
                          animationEnabled: true,
                          headerLeft: this.SignoutButton
                        }}
                      >
                        {(props) => <TodayView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} activities={this.state.activities} removeActivity={(id) => this.removeActivity(id)} modifyActivity={(id, activity) => this.modifyActivity(id, activity)} />}
                      </TabNavigation.Screen>
                      <TabNavigation.Screen
                        name="ExercisesView"
                        options={{
                          tabBarLabel: 'Exercises',
                          tabBarIcon: ({ focused, tintColor }) => {
                            let iconName = `md-walk`;
                            return <Ionicons name={iconName} size={25} color={tintColor} />;
                          },
                          tabBarOptions: {
                            activeTintColor: 'tomato',
                            inactiveTintColor: 'gray',
                          },
                          animationEnabled: true,
                          headerLeft: this.SignoutButton
                        }}
                      >
                        {(props) => <ExercisesView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} activities={this.state.activities} addActivity={(activity) => this.addActivity(activity)} removeActivity={(id) => this.removeActivity(id)} modifyActivity={(id, activity) => this.modifyActivity(id, activity)}/>}
                      </TabNavigation.Screen>
                      <TabNavigation.Screen
                        name="ProfileView"
                        options={{
                          tabBarLabel: 'Me',
                          tabBarIcon: ({ focused, tintColor }) => {
                            let iconName = `ios-person`;
                            return <Ionicons name={iconName} size={25} color={tintColor} />;
                          },
                          tabBarOptions: {
                            activeTintColor: 'tomato',
                            inactiveTintColor: 'gray',
                          },
                          animationEnabled: true,
                          headerLeft: this.SignoutButton
                        }}
                      >
                        {(props) => <ProfileView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />}
                      </TabNavigation.Screen>
                    </TabNavigation.Navigator>
                  }

                </AuthStack.Screen>
                  
              </>

            )}
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
