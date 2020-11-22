import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';

class Exercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
        this.getDate = this.getDate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    getDate(date) {
        date = new Date(date);
        let newDate = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
        return <Text>{newDate}</Text>;
    }
    
    handleDelete() {
      this.props.removeActivity(this.props.id);
      setTimeout(function() {alert("Successfully deleted activity!")}, 1000);
    }

    render() {
        return (
            <View style={styles.box}>
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1, width: '100%'}}>
                <Text style={{borderColor: 'black', borderBottomWidth: 1, borderRadius: 10, textAlign: 'center'}}>{this.props.name}</Text>
              </View>
              <View style={{marginTop: 10}}>
                <Text>Date: {this.getDate(this.props.date)}</Text>
                <Text>Calories Burned: {this.props.calories}</Text>
                <Text>Duration: {this.props.duration} Minutes</Text>
              </View>

              {
                (this.props.viewOnly) ?
                <View></View>
                :
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: 10 }}>
                  <TouchableOpacity style={styles.button} onPress={() => this.props.showEditModal(this.props.id)}>
                    <Text style={{color: 'white'}}>Edit <Ionicons name="md-create" color={'yellow'}></Ionicons></Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={this.handleDelete}>
                    <Text style={{color: 'white'}}>Delete <Ionicons name="ios-trash" color={'red'}></Ionicons></Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
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
    },
    box: {
      padding: 10,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 10,
      width: 300,
      height: 150,
      display: 'flex',
      marginTop: 20,
      backgroundColor: '#FFF'
    }, 
    buttonInline: {
      display: "flex"
    },
    button: {
      alignItems: "center",
      backgroundColor: "#942a21",
      padding: 10,
      borderRadius: 10
    }
});

export default Exercise;