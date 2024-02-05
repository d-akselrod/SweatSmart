import React from 'react';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, Text, StyleSheet, View } from 'react-native';

export const AboutPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: 'Settings',
      title: 'About',
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.headerText}>About SweatSmart</Text>
          <Text style={styles.paragraph}>
            SweatSmart is a revolutionary fitness application designed to
            transform the way individuals approach health and wellness. Our
            mission is to empower users to achieve their fitness goals through
            personalized, AI-driven workout plans and nutritional guidance.
          </Text>
          <Text style={styles.paragraph}>
            Founded in 2023, our team consists of dedicated fitness enthusiasts,
            experienced developers, and health professionals, all united by a
            passion for accessible and effective fitness solutions. SweatSmart
            is more than just an app; it&apos;s a community dedicated to promoting a
            healthy lifestyle.
          </Text>
          <Text style={styles.headerText}>Our Vision</Text>
          <Text style={styles.paragraph}>
            We envision a world where everyone has the tools and support they
            need to lead a healthy and active life. SweatSmart aims to be at the
            forefront of this movement, continuously innovating and improving to
            meet the diverse needs of our users.
          </Text>
          <Text style={styles.headerText}>Contact Us</Text>
          <Text style={styles.paragraph}>
            For any inquiries or feedback, please reach out to us at
            support@sweatsmart.com. We&apos;re always here to help!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 10,
  },
});
