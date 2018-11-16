import React from 'react';
import { Camera, Permissions } from 'expo';
import _ from "lodash";
import { connect } from 'react-redux';
import { Keyboard, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import SimpleButton from "./SimpleButton";
import { updateNote, setCameraType, receiveCameraPermissionResult } from "../Actions/noteActions";

class CameraScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Take Picture',
            headerLeft: (
                <SimpleButton
                    style={styles.navBarLeftButton}
                    textStyle={styles.navBarButtonText}
                    onPress={() => navigation.pop()}
                    customText='Back'
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
        this.requestCamPermission();

    }

    requestCamPermission = async ()=>{
        let { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.props.setCameraPermissionStatus(status === 'granted');
        // if (status !== 'granted') {
        //     this.props.onCamPermDenied();
        // }else{
        //     this.props.onCamPermApproved();
        // }
        //
        // this.hasCameraPermission = status === 'granted';
    };

    _takePicture = async () => {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync();
            this.props._saveNoteImage(photo);
            this.props.navigation.goBack();
        }
    };

    render(){
        if (this.props.hasCameraPermission === null) {
            return <View />;
        } else if (this.props.hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else{
            return (
                <View style={{ flex: 1 }}>
                    <Camera
                        ref={ref => { this.camera = ref; }}
                        style={{ flex: 1 }} type={this.props.cameraType}>
                        <View style={styles.cameraButtonContainer}>
                            <SimpleButton
                                style={styles.cameraButton}
                                textStyle={styles.cameraButtonText}
                                onPress={this._takePicture.bind(this)}
                                customText='Capture'
                            />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                                justifyContent:'flex-end',
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-start',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.props._setCameraType(
                                        this.props.cameraType === Camera.Constants.Type.back
                                           ? Camera.Constants.Type.front
                                           : Camera.Constants.Type.back,
                                    );
                                }}>
                                <Text
                                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                    {' '}Flip{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}

var styles = StyleSheet.create({
    cameraButtonContainer:{
        position: 'absolute',
        bottom: 20,
        left:20,
        right:20
    },
    cameraButton:{
        backgroundColor:'#5B29C1',
        borderRadius:4,
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    cameraButtonText:{
        color: 'white',
        textAlign: 'center'
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

const mapStateToProps = state => {
    return {
        hasCameraPermission: state.hasCameraPermission,
        cameraType: state.cameraType
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setCameraPermissionStatus: (status)=>{
            dispatch(receiveCameraPermissionResult(status));
        },
        _setCameraType: (type)=>{
            dispatch(setCameraType(type));
        },
        _saveNoteImage: async (image)=>{
            const note = ownProps.navigation.getParam('note');
            dispatch(updateNote(note.id, note.title, note.body, image.uri));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);