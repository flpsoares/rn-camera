import React, { useState, useEffect, useRef } from 'react'
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image
} from 'react-native'
import { Camera } from 'expo-camera'

import { styles } from './app-style'
import { FontAwesome } from '@expo/vector-icons'

export default function App() {
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [hasPermission, setHasPermission] = useState<boolean>()
  const camRef = useRef<Camera>(null)
  const [capturedPhoto, setCapturedPhoto] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const takePicture = async () => {
    if (camRef.current) {
      const data = await camRef.current.takePictureAsync()
      if (data && data.uri) {
        setCapturedPhoto(data.uri)
        openModal()
      }
    }
  }

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    )
  }

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === null) {
    return <View />
  }

  if (hasPermission === false) {
    return <Text>Acesso a camera negado</Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camRef}>
        <View style={styles.contentButtons}>
          <TouchableOpacity onPress={flipCamera} style={styles.buttonFlip}>
            <FontAwesome name="exchange" size={23} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.buttonCamera}>
            <FontAwesome name="camera" size={23} color="#fff" />
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto ? (
        <Modal animationType="slide" transparent={true} visible={modalIsOpen}>
          <View style={styles.contentModal}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <FontAwesome name="close" size={50} color="#fff" />
            </TouchableOpacity>
            <Image style={styles.photo} source={{ uri: capturedPhoto }} />
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  )
}
