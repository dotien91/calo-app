import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, X, Check } from 'phosphor-react-native';
import useStore from '@services/zustand/store';
import { createStyles } from './add-meal.screen.style';
import { goBack } from '@helpers/navigation.helper';

const AddMealScreen = () => {
  const isLightMode = useStore((state) => state.isLightMode);
  const { COLORS, styles } = createStyles(isLightMode);

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleSave = async () => {
    // Validation
    if (!foodName.trim()) {
      Alert.alert('Error', 'Please enter food name');
      return;
    }

    const calValue = parseFloat(calories);

    if (isNaN(calValue) || calValue <= 0) {
      Alert.alert('Error', 'Please enter valid calories');
      return;
    }

    // TODO: Implement API call to save meal
    Alert.alert('Success', 'Meal added successfully!', [
      { text: 'OK', onPress: () => goBack() }
    ]);
  };

  const handleImagePick = () => {
    // TODO: Implement image picker
    Alert.alert('Info', 'Image picker coming soon!');
  };

  const removeImage = () => {
    setImageUri(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <X size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Add Meal
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Check size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Upload Section */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>
            Food Photo (Optional)
          </Text>
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                onPress={removeImage}
                style={styles.removeImageButton}
              >
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
              <Camera size={32} color={COLORS.subText} />
              <Text style={styles.imagePickerText}>
                Tap to add photo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Food Details Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Food Details</Text>

          {/* Food Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Food Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter food name"
              placeholderTextColor={COLORS.subText}
              value={foodName}
              onChangeText={setFoodName}
            />
          </View>

          {/* Calories */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Calories *
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="0"
              placeholderTextColor={COLORS.subText}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>

          {/* Macros */}
          <Text style={styles.subSectionTitle}>Macronutrients (per 100g)</Text>

          <View style={styles.macrosRow}>
            <View style={styles.macroInput}>
              <Text style={styles.inputLabel}>
                Protein (g)
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="0"
                placeholderTextColor={COLORS.subText}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.macroInput}>
              <Text style={styles.inputLabel}>
                Carbs (g)
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="0"
                placeholderTextColor={COLORS.subText}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.macroInput}>
              <Text style={styles.inputLabel}>
                Fat (g)
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="0"
                placeholderTextColor={COLORS.subText}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMealScreen;