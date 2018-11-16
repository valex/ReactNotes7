import React from 'react';
import _ from "lodash";
import { connect } from 'react-redux';
import {Image, Keyboard, StyleSheet, Text, View} from "react-native";
import SimpleButton from "./SimpleButton";
import {updateNote} from "../Actions/noteActions";


class NoteImageScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const note = navigation.getParam('note');
        return {
            title: 'Note Image Screen',
            headerLeft: (
                <SimpleButton
                    style={styles.navBarLeftButton}
                    textStyle={styles.navBarButtonText}
                    onPress={() => navigation.pop()}
                    customText='Back'
                />
            ),
            headerRight:(
                <SimpleButton
                    style={styles.navBarRightButton}
                    textStyle={styles.navBarButtonText}
                    onPress={() => {navigation.state.params.onDeleteImageClick(note); navigation.pop();}}
                    customText='Delete'
                />
            ),
            headerStyle:                styles.navBar,
            headerTitleStyle:           styles.navBarTitleText,
            //headerRightContainerStyle : styles.navBarRightButton
        };
    };

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>{Keyboard.dismiss();});
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onDeleteImageClick: this.props._onDeleteImageClick
        });
    }


    render(){
        return (
            <View style={styles.container}>
                <Image
                    source={{uri:this.props.note.imagePath}}
                    style={styles.image}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
    },
    navBar: {
        backgroundColor: '#5B29C1',
        borderBottomColor: '#48209A',
        borderBottomWidth: 1
    },
    navBarTitleText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 16
    },
    navBarLeftButton: {
        paddingLeft: 10
    },
    navBarRightButton: {
        paddingRight: 10
    },
    navBarButtonText: {
        color: '#EEE',
        fontSize: 16,
        marginVertical: 16
    }
});

const mapStateToProps = (state, ownProps) => {
    const note = ownProps.navigation.getParam('note');
    const noteId = note.id;
    return {
        note: state.notes[noteId]
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        _onDeleteImageClick: (note) => {
            dispatch(updateNote(note.id, note.title, note.body, null));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteImageScreen);