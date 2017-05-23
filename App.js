import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { Constants, ImagePicker } from 'expo';

export default class App extends React.Component {
    state = {
        image: null,
        uploading: false,
    };

    _handleButtonPress = async () => {

        // let result = await takeAndUploadPhotoAsync();
        Alert.alert(
            'Button pressed!',
            'You did it!',
            JSON.stringify(await takeAndUploadPhotoAsync())
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <Button
                    title="Press me"
                    onPress={this._handleButtonPress}
                />

                <Text style={styles.paragraph}>
                    Change code in the editor and watch it change on your phone!
                    Save to get a shareable url. You get a new url each time you save.32
                </Text>
            </View>
        );
    }


    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center'}]}>
                    <ActivityIndicator
                        color="#fff"
                        animating
                        size="large"
                    />
                </View>
            );
        }
    }

    _maybeRenderImage = () => {
        let { image } = this.state;
        if (!image) {
            return;
        }

        return (
            <View style={{
                marginTop: 30,
                width: 250,
                borderRadius: 3,
                elevation: 2,
                shadowColor: 'rgba(0,0,0,1)',
                shadowOffset: {width: 4, height: 4},
                shadowRadius: 5,
            }}>
                <View style={{borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden'}}>
                    <Image
                        source={{uri: image}}
                        style={{width: 250, height: 250}}
                    />
                </View>

                <Text
                    onPress={this._copyToClipboard}
                    onLongPress={this._share}
                    style={{paddingVertical: 10, paddingHorizontal: 10}}>
                    {image}
                </Text>
            </View>
        );
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

    return await fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBEaHFEEekV13OtzI9ds3LRBT61-TxD58M', {
        method: 'POST',
        body: {
            "requests": [
                {
                    "image": {
                        "source": {
                            "imageUri": "https://cloud.google.com/vision/docs/images/ferris-wheel.jpg"
                        }
                    },
                    "features": [
                        {
                            "type": "LABEL_DETECTION"
                        }
                    ]
                }
            ]
        }
    });
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
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