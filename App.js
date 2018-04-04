import React, {Component} from 'react';
import {Text, View, StyleSheet, Alert, NativeModules, ToastAndroid} from 'react-native';
import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-spinkit';
import config from './config';

export default class App extends React.Component {
    state = {
        loading: false,
    };

    render() {
        console.log('Starting app');
        console.log('config', config);

        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}
                    playSoundOnCapture={false}>
                    <View><Text>{this.state.loading}</Text></View>
                    {
                        (!this.state.loading) ?
                                <Text
                                    style={styles.capture}
                                    onPress={this.takePicture.bind(this)}/>
                            :
                            <View>
                                <Spinner
                                    style={styles.spinner}
                                    isVisible={true}
                                    size={70}
                                    type={'Bounce'}
                                    color={'white'}/>
                            </View>

                    }
                </Camera>
            </View>
        );
    }

    takePicture() {
        if (!this.state.loading) {
            this.setState({
                loading: true
            });

            const options = {};
            this.camera.capture({metadata: options})
                .then((data) => {

                    resizeImage(data.path, (resizedImageUri) => {
                        NativeModules.RNImageToBase64.getBase64String(resizedImageUri, async (err, base64) => {
                            // Do something with the base64 string
                            if (err) {
                                console.error(err)
                            }
                            console.log('converted to base64');
                            // ToastAndroid.show('converted to base64', ToastAndroid.SHORT);

                            let result = await checkForLabels(base64);
                            console.log(result);
                            // ToastAndroid.show(JSON.stringify(result), ToastAndroid.SHORT);

                            //custom filter
                            let filteredResult = filterLabelsList(result.responses[0], 0.3);
                            displayResult(filteredResult);

                            this.setState({
                                loading: false
                            });
                        })
                    })
                })
                .catch(err => console.error(err));
        } else {
            console.log('NO GO' + this.state.loading)
        }
    }
}

function displayResult(filteredResult) {
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
            'Its a ' + filteredResult[0].description + '!',
            labelString
        );
    } else {
        Alert.alert(
            'Its a ' + filteredResult[0].description + '!'
        );
    }
}

// according to https://cloud.google.com/vision/docs/supported-files, recommended image size for labels detection is 640x480
function resizeImage(path, callback, width = 640, height = 480) {
    ImageResizer.createResizedImage(path, width, height, 'JPEG', 80).then((resizedImageUri) => {
        callback(resizedImageUri);

    }).catch((err) => {
        console.error(err)
    });
}

//run filter for frontend side logic (filter for hotdog, if you wanna do a "is hotdog or not" app)
function filterLabelsList(response, minConfidence = 0) {
    let resultArr = [];
    response.labelAnnotations.forEach((label) => {
        if (label.score > minConfidence) {
            resultArr.push(label);
        }
    });
    return resultArr;
}

// API call to google cloud
async function checkForLabels(base64) {

    return await
        fetch(config.googleCloud.api + config.googleCloud.apiKey, {
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
        }, (err) => {
            console.error('promise rejected')
            console.error(err)
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
        borderRadius: 50,
        padding: 10,
        margin: 50,
        height: 70,
        width: 70,
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 15
    },
    loadingMsg: {
        position: 'absolute',
        top: '50%',
        left: '50%'
    },
    loadingText: {
        fontSize: 18,
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'white',
        margin: 30
    },
    spinner: {
        marginBottom: 50
    },
});