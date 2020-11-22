import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import Exercise from './Exercise';
import GoalView from './GoalView';

class TodayView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null
        }
        this.getDate = this.getDate.bind(this);
        this.renderExercises = this.renderExercises.bind(this);
        this.compareDate = this.compareDate.bind(this);
    }

   
    getDate() {
        let date = new Date(Date.now());
        let newDate = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
        return <Text>{newDate}</Text>;
    }

    compareDate(dateToCompare) {
        const date = new Date(Date.now());
        const currDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        dateToCompare = dateToCompare.toString().split("T")[0];

        if (currDate.toString() == dateToCompare) {
            return true;
        } else {
            return false;
        }
    }


    renderExercises() {
        let excerices = [];
        for (let i = 0; i < this.props.activities.length; i++) {
            console.log(this.compareDate(this.props.activities[i].date));
            if (this.compareDate(this.props.activities[i].date)) {
                excerices.push(<Exercise viewOnly={true} key={this.props.activities[i].id} removeActivity={(id) => this.props.removeActivity(id)} modifyActivity={(id, activity) => this.props.modifyActivity(id, activity)} id={this.props.activities[i].id} name={this.props.activities[i].name} duration={this.props.activities[i].duration} date={this.props.activities[i].date} calories={this.props.activities[i].calories}></Exercise>)
            }
        }
        console.log(this.props.activities);
        return excerices;
    }

    render() {
        return (
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <Text style={styles.header}><Ionicons name="ios-sunny" size={30} color={'orange'} /> Today: {this.getDate()}</Text>
                <Text style={{marginTop: 15}}>What's on the agenda for today?</Text>
                <Text>Below are all of your goals and exercises.</Text>


                <GoalView username={this.props.username} accessToken={this.props.accessToken} compareDate={(date) => this.compareDate(date)}></GoalView>

                <Text style={{...styles.header, marginTop: 40}}><Ionicons name="md-walk" size={30} color={'orange'} /> Exercises</Text>
                {this.renderExercises()}

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    },
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
    }
});

export default TodayView;