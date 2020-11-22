import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, DatePickerIOS } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import Exercise from './Exercise';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';

class ExercisesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            name: "",
            duration: 0.0,
            calories: 0.0,
            date: new Date(Date.now()),
            show: false,
            editMode: false,
            id: -1
        }
        this.renderExercises = this.renderExercises.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        // this.getDateAndTime = this.getDateAndTime.bind(this);
    }

    getDateAndTime() {
        let newDate = (this.state.date.getMonth() + 1) + '-' + this.state.date.getDate() + '-' + this.state.date.getFullYear() + " " + this.state.date.getHours() + ":" + this.state.date.getMinutes() + ":" + this.state.date.getMinutes();
        return <Text>{newDate}</Text>;
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    renderExercises() {
        let exercises = [];
        for (let i = 0; i < this.props.activities.length; i++) {
            exercises.push(<Exercise showEditModal={this.showEditModal} viewOnly={false} key={this.props.activities[i].id} removeActivity={(id) => this.props.removeActivity(id)} modifyActivity={(id, activity) => this.props.modifyActivity(id, activity)} id={this.props.activities[i].id} name={this.props.activities[i].name} duration={this.props.activities[i].duration} date={this.props.activities[i].date} calories={this.props.activities[i].calories}></Exercise>)
        }
        return exercises;
    }

    addActivity() {
        let activity = {};
        activity['date'] = new Date(this.state.date.toLocaleDateString()).toISOString();
        activity['name'] = this.state.name;
        activity['duration'] = this.state.duration;
        activity['calories'] = this.state.calories;

        this.props.addActivity(activity);
        this.closeEditModal();

        setTimeout(function() {alert("Successfully added new activity!");}, 1000);

    }

    editActivity() {
        let activity = {};
        activity['date'] = new Date(this.state.date.toLocaleDateString()).toISOString();
        activity['name'] = this.state.name;
        activity['duration'] = this.state.duration;
        activity['calories'] = this.state.calories;
        activity['id'] = this.state.id;

        this.props.modifyActivity(this.state.id, activity);

        this.setState({
            name: "",
            calories: 0.0,
            duration: 0.0,
            date: new Date()
        });
        this.closeEditModal();

        setTimeout(function() {alert("Successfully edited activity!");}, 1000);
    }

    showEditModal(id) {        
        const activities = this.props.activities;
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].id == id) {
                this.setState({
                    name: activities[i].name,
                    date: new Date(activities[i].date),
                    calories: activities[i].calories,
                    duration: activities[i].duration,
                    editMode: true,
                    modalVisible: true,
                    id: id
                });
                break;
            }
        }
    }

    closeEditModal() {
        this.setState({
            modalVisible: false,
            name: "",
            calories: 0.0,
            duration: 0.0,
            date: new Date(),
            editMode: false,
            id: -1
        });
    }

    render() {
        return (
            <ScrollView style={{...styles.mainContainer}} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.modalCenter}>
                        <View style={styles.modalView}>
                            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                                <Text style={styles.header}>Add Exercise</Text>
                                    <View>
                                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Name</Text>
                                        </View>
                                        <TextInput style={styles.input}
                                        underlineColorAndroid="transparent"
                                        placeholder="Run"
                                        placeholderTextColor="#d9bebd"
                                        value={this.state.name}
                                        onChangeText={(name) => this.setState({ name: name })}
                                        autoCapitalize="none" />
                                    <View style={styles.spaceSmall}></View>

                                    <View>
                                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (minutes)</Text>
                                    </View>
                                    <TextInput style={styles.input}
                                        underlineColorAndroid="transparent"
                                        placeholder="30"
                                        placeholderTextColor="#d9bebd"
                                        onChangeText={(duration) => this.setState({ duration: duration })}
                                        autoCapitalize="none"
                                        keyboardType={'numeric'}
                                    >
                                        {this.state.duration}
                                    </TextInput>
                                    <View style={styles.spaceSmall}></View>

                                    <View>
                                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories Burnt</Text>
                                    </View>
                                    <TextInput style={styles.input}
                                        underlineColorAndroid="transparent"
                                        placeholder="100"
                                        placeholderTextColor="#d9bebd"
                                        onChangeText={(calories) => this.setState({ calories: calories })}
                                        autoCapitalize="none"
                                        keyboardType={'numeric'}
                                    >
                                        {this.state.calories}
                                    </TextInput>
                                    <View style={styles.spaceSmall}></View>

                                    <View>
                                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Date and Time</Text>
                                    </View>
                                    {this.getDateAndTime()}
                                    
                                    <DatePicker
                                        style={styles.datePickerStyle}
                                        date={this.state.date} // Initial date from state
                                        mode="datetime" // The enum of date, datetime and time
                                        placeholder="select date"
                                        format="MM-DD-YYYY"
                                        minDate="01-01-2016"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                            //display: 'none',
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            },
                                            dateInput: {
                                            marginLeft: 36,
                                            },
                                        }}
                                        onDateChange={(date, time) => {
                                            this.setState({date: time});
                                        }}
                                    />
                                    <View style={styles.spaceSmall}></View>

                                    <View style={{ flexDirection: 'row', textlign: 'center', justifyContent: 'space-around', marginBottom: 30}}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => this.closeEditModal()}
                                        >
                                            <Text style={{color: 'white', textAlign: 'center'}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <View style={styles.spaceHorizontal} />
                                        <View style={styles.spaceHorizontal} />
                                        <View style={styles.spaceHorizontal} />

                                        {
                                            (this.state.editMode) ?
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => {
                                                
                                                this.editActivity();
                                                }}
                                             >
                                                 <Text style={{color: 'white', textAlign: 'center'}}>Edit</Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => {
                                                
                                                this.addActivity();
                                                }}
                                             >
                                                 <Text style={{color: 'white', textAlign: 'center'}}>Add</Text>
                                            </TouchableOpacity>
                                        }
                                        
                                    </View>
                            </ScrollView>

                        </View>
                    </View>
                </Modal>

                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Ionicons name="md-walk" size={40} color="#900" style={{ marginRight: 20 }} />
                    <Text style={styles.bigText}>Exercises</Text>
                </View>

                <Text style={{marginTop: 10}}>Let's get to work!</Text>
                <Text style={{marginBottom: 10}}>Record your exercises below.</Text>

                <TouchableOpacity style={styles.button} onPress={() => {this.setModalVisible(true);}}>
                    <Text style={{color: '#FFF'}}>ADD EXERCISE</Text>
                </TouchableOpacity>

                {this.renderExercises()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20
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
    button: {
      alignItems: "center",
      backgroundColor: "#942a21",
      padding: 10,
      borderRadius: 10,
    },
    modalCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 350,
        height: 500
      },
    modalBtn: {
        backgroundColor: "#F194FF",
        borderRadius: 10,
        padding: 10,
        elevation: 2
    },
    datePickerStyle: {
        width: 200,
        marginTop: 10,
        marginBottom: 15
    }
  });

export default ExercisesView;