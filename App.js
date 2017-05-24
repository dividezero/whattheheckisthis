import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import Camera from 'react-native-camera';

export default class App extends React.Component {
    state = {
        image: null,
        uploading: false,
    };

    _handleButtonPress = async () => {

        let result = await takeAndUploadPhotoAsync();
        console.log('asd'+JSON.stringify( result))

        Alert.alert(
            'Its a '+JSON.parse(result._bodyInit).responses[0].labelAnnotations[0].description+'!'
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}>
                    <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
                </Camera>
            </View>
        );
    }

    takePicture() {
        const options = {};
        //options.location = ...
        this.camera.capture({metadata: options})
            .then( (data) => {
                console.log(data);
                // let result = await takeAndUploadPhotoAsync();
                // console.log('asd'+JSON.stringify( result))
                //
                // Alert.alert(
                //     'Its a '+JSON.parse(result._bodyInit).responses[0].labelAnnotations[0].description+'!'
                // );
            })
            .catch(err => console.error(err));
    }
}

async function takeAndUploadPhotoAsync() {
    // Display the camera to the user and wait for them to take a photo or to cancel
    // the action
    // let result = await ImagePicker.launchCameraAsync({
    //   allowsEditing: true,
    //   aspect: [4, 3],
    // });

    // if (result.cancelled) {
    //   return;
    // }

    // ImagePicker saves the taken photo to disk and returns a local URI to it
    // let localUri = result.uri;
    // let filename = localUri.split('/').pop();

    // // Infer the type of the image
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    // let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    // formData.append('photo', { uri: localUri, name: filename, type });

    console.log('sadasdsa')
    return await fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCHiOie9g-r8SrvsgQoA-uddzDlQFSuyHA', {
        method: 'POST',
        body: JSON.stringify({
            "requests": [
                {
                    "image": {
                        "source": {
                            "imageUri": "http://www.blogcdn.com/www.autoblog.com/media/2012/09/lead5-2012-tesla-model-s-fd-1347337015.jpg"
                        }
                    },
                    "features": [
                        {
                            "type": "LABEL_DETECTION"
                        }
                    ]
                }
            ]
        })
    });
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
});