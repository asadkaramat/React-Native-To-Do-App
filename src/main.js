import React, {component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

module.exports = React.createClass({
  getInitialState () {
    return ({
      tasks: [],
      completed: [],
      task: ''
    });
  },
  saveTasks() {
    AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));
    AsyncStorage.setItem('completed', JSON.stringify(this.state.completed));
  },
  componentWillMount() {
    AsyncStorage.getItem('tasks')
      .then((response) => {
        this.setState({tasks: JSON.parse(response)})
      });
    AsyncStorage.getItem('completed')
      .then((response) => {
        this.setState({completed: JSON.parse(response)});
      });
  },
  componentDidUpdate() {
    this.saveTasks();
  },
  renderList(tasks) {
    return(
      tasks.map((task, index) => {
        return (
          <View key={index} style = {styles.task}>
            <Text>
              {task}
            </Text>
            <TouchableOpacity
             onPress={() => this.compeleteTask(index)}>
              <Text>
                &#10003;
              </Text>
              </TouchableOpacity>
          </View>
        )
      })
    );

  },
  compeleteTask(index) {
    let tasks = this.state.tasks;
    let task = tasks.splice(index, 1);
    let completed = this.state.completed;
    completed.push(task);
    this.setState({completed});
        this.setState({tasks});
  },
  addTask() {
    if(this.state.task === null || this.state.task === '') {
      return;
    }
    let tasks = this.state.tasks.concat(this.state.task);
    this.setState({tasks});
    this.setState({task:''});
  },
  deleteTask(index) {
    let completed = this.state.completed;
    completed.splice(index, 1);
    this.setState({completed});
  },
  renderCompleted(completed) {
    return(
      completed.map((task, index) =>{
        return (
          <View key={index} style = {styles.task}>
            <Text style = {styles.completed}>
              {task}
            </Text>
            <TouchableOpacity
             onPress={() => this.deleteTask(index)}>
              <Text>
                &#10005;
              </Text>
            </TouchableOpacity>
          </View>
        );
      })
    );
  },
  render() {
    return (
      <View style = {styles.container}>
        <Text style={styles.header}>
          To-Do
        </Text>
        <TextInput
            underlineColorAndroid='transparent'
            style={ styles.input}
            placeholder="Add a task..."
            onChangeText= {(text) => {
              this.setState({task:text});
            }}
            onEndEditing= {() => {this.addTask()}} />
        {this.renderList(this.state.tasks)}
        {this.renderCompleted(this.state.completed)}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    margin: 30,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18
  },
  task: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderColor: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    textAlign: 'center',
    margin: 10
  },
  completed: {
    color: '#555',
    textDecorationLine: 'line-through'
  }
});
