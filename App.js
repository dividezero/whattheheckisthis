import React, {Component} from 'react';
import {Text, View, StyleSheet, Button, Alert, ActivityIndicator, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';

export default class App extends React.Component {
    state = {
        image: null,
        loading: false,
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
        if(!this.state.loading){
            console.log('GO'+this.state.loading)
            const options = {};
            //options.location = ...
            this.camera.capture({metadata: options})
                .then((data) => {
                    this.setState({
                        loading: true
                    });

                    ImageResizer.createResizedImage(data.path, 800, 600, 'JPEG', 80).then((resizedImageUri) => {
                        // resizeImageUri is the URI of the new image that can now be displayed, uploaded...
                        NativeModules.RNImageToBase64.getBase64String(resizedImageUri, async (err, base64) => {
                            // Do something with the base64 string
                            if (err) {
                                console.log('err')
                                console.log(err)
                            }
                            console.log('base6a42');
                            let result = await checkForLabels(base64);
                            console.log(result)
                            let filteredResult = filterLabelsList(result.responses[0], 0.3);

                            let labelString = '';
                            let count = 1;
                            if (filteredResult.length > 1) {
                                labelString = '... or it might be ';
                                filteredResult.forEach((resLabel) => {
                                    if (count == filteredResult.length) {
                                        labelString += 'a ' + resLabel.description + '! I\'m pretty sure! Maybe.'
                                    } else if (count == 1) {

                                    } else {
                                        labelString += 'a ' + resLabel.description + ' or '
                                    }
                                    count++;
                                });

                                Alert.alert(
                                    'Its a ' + result.responses[0].labelAnnotations[0].description + '!',
                                    labelString
                                );
                            } else {
                                Alert.alert(
                                    'Its a ' + result.responses[0].labelAnnotations[0].description + '!'
                                );
                            }

                            this.setState({
                                loading: false
                            });
                        })

                    }).catch((err) => {
                        // Oops, something went wrong. Check that the filename is correct and
                        // inspect err to get more details.
                        console.error(err)
                    });

                })
                .catch(err => console.error(err));
        }else{
            console.log('NO GO'+this.state.loading)
        }
    }
}

function filterLabelsList(response, confidence = 0) {
    let resultArr = [];
    response.labelAnnotations.forEach((label) => {
        if (label.score > confidence) {
            resultArr.push(label);
        }
    });
    return resultArr;
}

async function checkForLabels(base64) {

    return await
        fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCcQKFyu6aaQRuuRTELO7WMy0m7WVLxIiY', {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": base64
                        },
                        "features": [
                            {
                                "type": "LABEL_DETECTION"
                            }
                        ]
                    }
                ]
            })
        }).then((response) => {
            return response.json();
        });
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    },
    loadingMsg: {
        position: 'absolute',
        top: '50%',
        left: '50%'
    }
});