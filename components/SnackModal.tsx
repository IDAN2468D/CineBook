import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        { id: '4', name: 'Hot Dog', price: 9, emoji: '🌭', desc: 'Classic grilled hot dog' },
        { id: '5', name: 'Candy Box', price: 6, emoji: '🍬', desc: 'Sweet assortment' },
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

    const total = selectedSnacks.reduce((sum, item) => sum + item.price, 0);

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/80">
                {/* Modal Container */}
                <View className="bg-[#0f172a] rounded-t-[32px] border-t border-slate-700 h-[75%] overflow-hidden">

                    {/* Header */}
                    <View className="flex-row justify-between items-center p-6 pb-4 border-b border-slate-800">
                        <View>
                            <Text className="text-white text-2xl font-bold tracking-tight">Quick Snack 🍿</Text>
                            <Text className="text-slate-400 text-sm mt-1">Treat yourself before the show</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-slate-800 w-10 h-10 rounded-full items-center justify-center border border-slate-700"
                        >
                            <Ionicons name="close" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Snacks List */}
                    <ScrollView
                        className="flex-1 px-6"
                        contentContainerStyle={{ paddingVertical: 20 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {snacks.map(snack => {
                            const isSelected = selectedSnacks.find(s => s.id === snack.id);
                            return (
                                <TouchableOpacity
                                    key={snack.id}
                                    onPress={() => toggleSnack(snack)}
                                    activeOpacity={0.7}
                                    className={`flex-row items-center p-4 mb-3 rounded-2xl border transition-all ${isSelected
                                            ? 'bg-blue-600/10 border-blue-500'
                                            : 'bg-slate-800/50 border-slate-800'
                                        }`}
                                >
                                    <View className="w-12 h-12 bg-slate-900 rounded-full items-center justify-center mr-4 border border-slate-700">
                                        <Text className="text-2xl">{snack.emoji}</Text>
                                    </View>

                                    <View className="flex-1">
                                        <Text className={`font-bold text-lg mb-0.5 ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                                            {snack.name}
                                        </Text>
                                        <Text className="text-slate-500 text-xs">{snack.desc}</Text>
                                    </View>

                                    <View className="items-end">
                                        <Text className="text-white font-bold text-lg">${snack.price}</Text>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={20} color="#3b82f6" style={{ marginTop: 4 }} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Sticky Footer Button */}
                    <View className="p-6 pt-4 bg-[#0f172a] border-t border-slate-800 shadow-2xl">
                        <SafeAreaView edges={['bottom']}>
                            <TouchableOpacity
                                onPress={handleConfirm}
                                activeOpacity={0.8}
                                className={`py-4 px-6 rounded-2xl flex-row justify-center items-center shadow-lg ${selectedSnacks.length > 0
                                        ? 'bg-blue-600 shadow-blue-500/20'
                                        : 'bg-slate-800 border border-slate-700'
                                    }`}
                            >
                                <Text className={`font-bold text-xl mr-2 ${selectedSnacks.length > 0 ? 'text-white' : 'text-slate-300'
                                    }`}>
                                    {selectedSnacks.length > 0 ? 'Add Snacks' : 'No Thanks, Just Tickets'}
                                </Text>
                                {selectedSnacks.length > 0 && (
                                    <View className="bg-blue-500 px-3 py-1 rounded-full">
                                        <Text className="text-white font-bold text-sm">+${total}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </SafeAreaView>
                    </View>

                </View>
            </View>
        </Modal>
    );
}
