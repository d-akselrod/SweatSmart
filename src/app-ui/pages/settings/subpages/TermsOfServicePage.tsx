import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text, StyleSheet, ScrollView, View } from 'react-native';

export const TermsOfServicePage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: 'Settings',
      title: 'Terms of Service',
    });
  });

  interface ITermsOfServiceItem {
    title: string;
    content: string;
  }

  const termsOfService: ITermsOfServiceItem[] = [
    {
      title: '1. Acceptance of Terms',
      content:
        'By accessing and using the SweatSmart application, you agree to be bound by these Terms of Service and all other terms and policies that appear on the SweatSmart application. If you do not wish to be bound by any of these terms, you may not use the SweatSmart application.',
    },
    {
      title: '2. Description of Service',
      content:
        'SweatSmart is a fitness application that allows users to track their workouts, connect with friends, and discover new workouts.',
    },
    {
      title: '3. User Registration',
      content:
        'You must be 13 years or older to register for an account on SweatSmart. You agree to provide accurate and complete information when creating your account. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure. You must notify SweatSmart immediately of any breach of security or unauthorized use of your account. Although SweatSmart will not be liable for your losses caused by any unauthorized use of your account, you may be liable for the losses of SweatSmart or others due to such unauthorized use.',
    },
    {
      title: '4. Privacy Policy',
      content:
        'SweatSmart collects and uses personal information in accordance with its Privacy Policy. By using the SweatSmart application, you agree to the terms of the Privacy Policy.',
    },
    {
      title: '5. User Conduct',
      content:
        'You agree not to use the SweatSmart application to: (a) violate any local, state, national or international law; (b) stalk, harass or harm another individual; (c) collect or store personal data about other users; (d) impersonate any person or entity, or otherwise misrepresent your affiliation with a person or entity; (e) interfere with or disrupt the SweatSmart application or services or networks connected to the SweatSmart application, or disobey any requirements, procedures, policies or regulations of networks connected to the SweatSmart application or (f) upload or transmit any material that infringes any patent, trademark, trade secret, copyright or other proprietary rights.',
    },
    {
      title: '6. User Content',
      content:
        'You are solely responsible for the photos, profiles, messages, notes, text, information, music, video, advertisements, listings, and other content that you upload, publish or display (hereinafter, "post") on or through the SweatSmart application, or transmit to or share with other users (collectively the "User Content"). You may not post, transmit, or share User Content on the SweatSmart application that you did not create or that you do not have permission to post. You understand and agree that SweatSmart may, but is not obligated to, review the SweatSmart application and may delete or remove (without notice) any User Content in its sole discretion, for any reason or no reason, including User Content that in the sole judgment of SweatSmart violates this Agreement or the SweatSmart Code of Conduct, or which might be offensive, illegal, or that might violate the rights, harm, or threaten the safety of users or others.',
    },
    {
      title: '7. User Disputes',
      content:
        'You are solely responsible for your interactions with other SweatSmart users. SweatSmart reserves the right, but has no obligation, to monitor disputes between you and other users.',
    },
    {
      title: '8. Privacy',
      content:
        'Use of the SweatSmart application is also governed by our Privacy Policy, which is incorporated into this Agreement by this reference.',
    },
    {
      title: '9. Disclaimers',
      content:
        'SweatSmart is not responsible or liable in any manner for any User Content or Third Party Applications, Software or Content posted on the SweatSmart application or in connection with the SweatSmart services',
    },
    {
      title: '10. Limitation on Liability',
      content:
        'In no event shall SweatSmart be liable to you or any third party for any indirect, consequential, exemplary, incidental, special or punitive damages, including lost profit damages arising from your use of the services, even if SweatSmart has been advised of the possibility of such damages. Notwithstanding anything to the contrary contained herein, SweatSmart’s liability to you for any cause whatsoever and regardless of the form of the action, will at all times be limited to the amount paid, if any, by you to SweatSmart for the SweatSmart services during the term of membership.',
    },
    {
      title: '11. Termination',
      content:
        'SweatSmart may terminate or suspend any and all services and/or your SweatSmart account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination of your account, your right to use the services will immediately cease. If you wish to terminate your SweatSmart account, you may simply discontinue using the services. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.',
    },
    {
      title: '12. Governing Law',
      content:
        'These Terms shall be governed and construed in accordance with the laws of the United States of America, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our services, and supersede and replace any prior agreements we might have between us regarding the services.',
    },
    {
      title: '13. Changes to Terms',
      content:
        'SweatSmart reserves the right, in its sole discretion, to change the Terms under which SweatSmart is offered. The most current version of the Terms will supersede all previous versions. SweatSmart encourages you to periodically review the Terms to stay informed of our updates.',
    },
    {
      title: '14. Contact Us',
      content:
        'If you have any questions about these Terms, please contact us at',
    },
  ];

  interface ITermsItemRenderProps {
    item: ITermsOfServiceItem;
  }

  const TermsItemRender = (props: ITermsItemRenderProps) => {
    const { item } = props;
    return (
      <>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.writing}>
          {termsOfService.map((item, key) => (
            <TermsItemRender item={item} key={key} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  writing: {
    width: '95%',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    marginLeft: 20,
    marginBottom: 10,
  },
});
