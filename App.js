import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [cameraType, setCameraType] = useState(
    Platform.OS === 'web' ? null : Camera.Constants.Type.back
  );
  const [showCamera, setShowCamera] = useState(false); 

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
    alert(`QR Code detectado: ${data}`);
  };

  const toggleCameraType = () => {
    if (Platform.OS !== 'web') {
      setCameraType(current =>
        current === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    }
  };

  if (!showCamera) {
    return (
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>QReader</Text>
        <Text style={styles.title2}>Leitor de QR Code</Text>
        <Text style={styles.subtitle}>Seja Bem-vindo!</Text>
        <TouchableOpacity style={styles.button} onPress={() => setShowCamera(true)}>
          <Text style={styles.buttonText}>Abrir Leitor</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text>Solicitando permissão para acessar a câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>Permissão de câmera negada.</Text>
        <TouchableOpacity style={styles.button} onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={styles.buttonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' ? (
        <Camera
          style={styles.camera}
          type={cameraType}
          onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.frame} />
            <Text style={styles.helpText}>Posicione o QR code no quadro</Text>
          </View>
        </Camera>
      ) : (
        <View style={styles.centerContainer}>
          <Text style={{ color: 'black', fontSize: 16, padding: 20, textAlign: 'center' }}>
            A câmera não é suportada no navegador com expo-camera. Por favor, teste no celular com o app Expo Go. 
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Text style={styles.buttonText}>Virar Câmera</Text>
        </TouchableOpacity>

        {scannedData && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                try {
                  Linking.openURL(scannedData);
                } catch (e) {
                  alert('Não foi possível abrir o link');
                }
              }}
            >
              <Text style={styles.buttonText}>Abrir Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setScannedData(null)}
            >
              <Text style={styles.buttonText}>Novo Escaneamento</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#525252',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 0, 0.7)',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  helpText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'rgba(50, 50, 255, 0.7)',
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 150, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
