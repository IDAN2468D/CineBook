import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { LayoutAnimation, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FAQS = [
    {
        question: "How do I book a movie ticket?",
        answer: "Simply browse the 'Now Playing' section, select a movie, choose a showtime, pick your seats, and complete the payment."
    },
    {
        question: "Can I cancel my booking?",
        answer: "Yes, you can cancel your booking up to 30 minutes before the showtime from the 'My Tickets' section. A refund will be processed to your original payment method."
    },
    {
        question: "Do you offer student discounts?",
        answer: "We offer special rates for students on weekdays. Please present a valid student ID at the cinema counter."
    },
    {
        question: "Is my payment information secure?",
        answer: "Absolutely. We use industry-standard encryption to protect your payment details and do not store sensitive card information."
    }
];

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View className="mb-3 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <TouchableOpacity onPress={toggleExpand} className="p-4 flex-row justify-between items-center">
                <Text className="text-white font-medium flex-1 mr-4">{question}</Text>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
            </TouchableOpacity>
            {expanded && (
                <View className="px-4 pb-4">
                    <Text className="text-slate-400 leading-5">{answer}</Text>
                </View>
            )}
        </View>
    );
};

export default function HelpCenterScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#050B26' }} edges={['top']}>
            <View className="flex-row items-center px-4 py-4 border-b border-slate-800">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center mr-4">
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Help Center</Text>
            </View>

            <ScrollView className="flex-1 p-5">
                <View className="bg-blue-600 rounded-2xl p-6 mb-8 items-center">
                    <Ionicons name="chatbubbles-outline" size={48} color="white" />
                    <Text className="text-white font-bold text-xl mt-3">How can we help you?</Text>
                    <Text className="text-blue-100 text-center mt-2">Our support team is available 24/7 to assist you with any issues.</Text>
                    <TouchableOpacity className="bg-white px-6 py-3 rounded-full mt-5">
                        <Text className="text-blue-600 font-bold">Contact Support</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-slate-500 font-bold mb-4 uppercase text-xs tracking-wider">Frequently Asked Questions</Text>

                {FAQS.map((faq, index) => (
                    <AccordionItem key={index} question={faq.question} answer={faq.answer} />
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}
