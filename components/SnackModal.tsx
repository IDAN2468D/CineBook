import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface SnackModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (snacks: any[]) => void;
}

export default function SnackModal({ visible, onClose, onConfirm }: SnackModalProps) {
    const [selectedSnacks, setSelectedSnacks] = useState<any[]>([]);

    const snacks = [
        { id: '1', name: 'Large Popcorn', price: 8, emoji: '🍿', desc: 'Buttery goodness' },
        { id: '2', name: 'Soda Combo', price: 12, emoji: '🥤', desc: 'Large Popcorn + 2 Drinks' },
        { id: '3', name: 'Nachos', price: 10, emoji: '🧀', desc: 'Cheesy jalapeño nachos' },
    ];

    const toggleSnack = (snack: any) => {
        if (selectedSnacks.find(s => s.id === snack.id)) {
            setSelectedSnacks(prev => prev.filter(s => s.id !== snack.id));
        } else {
            setSelectedSnacks(prev => [...prev, snack]);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedSnacks);
        onClose();
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/70">
                <View className="bg-[#0f172a] rounded-t-[30px] p-6 h-[60%] border-t border-slate-700">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-white text-xl font-bold">Quick Snack 🍿</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-slate-800 rounded-full">
                            <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-slate-400 mb-6">Skip the line and pick up your snacks at the counter.</Text>

                    {snacks.map(snack => {
                        const isSelected = selectedSnacks.find(s => s.id === snack.id);
                        return (
                            <TouchableOpacity
                                key={snack.id}
                                onPress={() => toggleSnack(snack)}
                                className={`flex-row items-center p-4 mb-3 rounded-2xl border ${isSelected ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-800 border-slate-700'}`}
                            >
                                <Text className="text-4xl mr-4">{snack.emoji}</Text>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-lg">{snack.name}</Text>
                                    <Text className="text-slate-400 text-xs">{snack.desc}</Text>
                                </View>
                                <Text className="text-blue-400 font-bold text-lg">${snack.price}</Text>
                                {isSelected && (
                                    <View className="ml-3 bg-blue-500 rounded-full p-1">
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}

                    <View className="flex-1" />

                    <TouchableOpacity
                        onPress={handleConfirm}
                        className="bg-blue-600 py-4 rounded-2xl shadow-lg shadow-blue-600/30"
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {selectedSnacks.length > 0 ? `Add Snacks (+$${selectedSnacks.reduce((a, b) => a + b.price, 0)})` : 'No Thanks, Just Tickets'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
