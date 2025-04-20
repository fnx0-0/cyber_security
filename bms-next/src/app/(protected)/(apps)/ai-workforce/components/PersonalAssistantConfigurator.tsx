import React, { useState, useEffect } from 'react';
import { X, Volume2, Bell, Check } from 'lucide-react';
import type { PersonalAssistant, Voice, NotificationPreference, Agent } from '../types/agent';
import { MALE_AVATARS, FEMALE_AVATARS } from '../constants/avatars';

interface PersonalAssistantConfiguratorProps {
  agents: Agent[];
  existingAssistant?: PersonalAssistant | null;
  onSave: (assistant: PersonalAssistant) => void;
  onCancel: () => void;
}

const VOICE_OPTIONS: Voice[] = [
  { id: 'en-us-male-1', name: 'James', gender: 'male', language: 'en-US', accent: 'General American' },
  { id: 'en-us-male-2', name: 'Michael', gender: 'male', language: 'en-US', accent: 'General American' },
  { id: 'en-gb-male-1', name: 'William', gender: 'male', language: 'en-GB', accent: 'Received Pronunciation' },
  { id: 'en-us-female-1', name: 'Emma', gender: 'female', language: 'en-US', accent: 'General American' },
  { id: 'en-us-female-2', name: 'Sophia', gender: 'female', language: 'en-US', accent: 'General American' },
  { id: 'en-gb-female-1', name: 'Charlotte', gender: 'female', language: 'en-GB', accent: 'Received Pronunciation' },
];

const EVENT_TYPES = [
  'task.completed',
  'task.failed',
  'alert.security',
  'alert.performance',
  'system.update',
  'data.anomaly',
];

export function PersonalAssistantConfigurator({
  agents,
  existingAssistant,
  onSave,
  onCancel
}: PersonalAssistantConfiguratorProps) {
  const [step, setStep] = useState(1);
  const [assistant, setAssistant] = useState<Partial<PersonalAssistant>>({
    id: existingAssistant?.id || crypto.randomUUID(),
    name: existingAssistant?.name || '',
    gender: existingAssistant?.gender || 'male',
    avatar: existingAssistant?.avatar || '',
    voice: existingAssistant?.voice || undefined,
    notificationPreferences: existingAssistant?.notificationPreferences || [],
  });
  const [selectedAvatar, setSelectedAvatar] = useState(existingAssistant?.avatar || '');
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(existingAssistant?.voice || null);
  const [preferences, setPreferences] = useState<NotificationPreference[]>(
    existingAssistant?.notificationPreferences || []
  );

  useEffect(() => {
    if (existingAssistant) {
      setStep(2); // Skip to notification preferences if editing
    }
  }, [existingAssistant]);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setAssistant(prev => ({ ...prev, gender }));
    setSelectedAvatar('');
    setSelectedVoice(null);
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setAssistant(prev => ({ ...prev, avatar }));
  };

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice);
    setAssistant(prev => ({ ...prev, voice }));
  };

  const handlePreferenceChange = (agentId: string, field: keyof NotificationPreference, value: any) => {
    setPreferences(prev => {
      const existing = prev.find(p => p.agentId === agentId);
      if (existing) {
        return prev.map(p => 
          p.agentId === agentId ? { ...p, [field]: value } : p
        );
      }
      return [...prev, {
        agentId,
        events: [],
        priority: 'medium',
        notifyVia: ['message'],
        [field]: value,
      } as NotificationPreference];
    });
  };

  const handleSave = () => {
    if (!assistant.name || !assistant.avatar || !assistant.voice) return;

    onSave({
      ...assistant as Required<Omit<PersonalAssistant, 'notificationPreferences'>>,
      notificationPreferences: preferences,
    });
  };

  return (
    <div className="bg-[#1c1c1e] rounded-3xl border border-[#2c2c2e] p-6 w-[800px] max-w-full max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white/90">
          {existingAssistant ? 'Edit Personal Assistant' : 'Configure Personal Assistant'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl hover:bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Assistant Name</label>
              <input
                type="text"
                value={assistant.name || ''}
                onChange={e => setAssistant(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleGenderSelect('male')}
                  className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                    assistant.gender === 'male'
                      ? 'bg-blue-500 border-blue-600 text-white'
                      : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => handleGenderSelect('female')}
                  className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                    assistant.gender === 'female'
                      ? 'bg-blue-500 border-blue-600 text-white'
                      : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {assistant.gender && (
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Select Avatar</label>
                <div className="grid grid-cols-5 gap-4">
                  {(assistant.gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS).map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedAvatar === avatar
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-transparent hover:border-[#3c3c3e]'
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                      {selectedAvatar === avatar && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedAvatar && (
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Select Voice</label>
                <div className="space-y-3">
                  {VOICE_OPTIONS.filter(voice => voice.gender === assistant.gender).map(voice => (
                    <button
                      key={voice.id}
                      onClick={() => handleVoiceSelect(voice)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-colors ${
                        selectedVoice?.id === voice.id
                          ? 'bg-blue-500 border-blue-600 text-white'
                          : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
                      }`}
                    >
                      <div>
                        <h4 className="font-medium">{voice.name}</h4>
                        <p className="text-sm opacity-80">{voice.accent}</p>
                      </div>
                      <Volume2 className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedVoice && (
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="bg-blue-500 text-white rounded-xl px-6 py-2 hover:bg-blue-600 transition-colors"
                >
                  Next: Configure Notifications
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white/90 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {agents.map(agent => (
                  <div key={agent.id} className="bg-[#2c2c2e] rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-xl" />
                      <div>
                        <h4 className="font-medium text-white/90">{agent.name}</h4>
                        <p className="text-sm text-white/60">{agent.role}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Events to Monitor</label>
                      <div className="grid grid-cols-2 gap-2">
                        {EVENT_TYPES.map(event => (
                          <label key={event} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={preferences.find(p => p.agentId === agent.id)?.events.includes(event) || false}
                              onChange={e => {
                                const current = preferences.find(p => p.agentId === agent.id)?.events || [];
                                handlePreferenceChange(
                                  agent.id,
                                  'events',
                                  e.target.checked
                                    ? [...current, event]
                                    : current.filter(e => e !== event)
                                );
                              }}
                              className="rounded border-[#3c3c3e] bg-[#2c2c2e] text-blue-500 focus:ring-blue-500/20"
                            />
                            <span className="text-white/90">{event.split('.').join(' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Priority</label>
                      <div className="flex gap-3">
                        {['low', 'medium', 'high'].map(priority => (
                          <button
                            key={priority}
                            onClick={() => handlePreferenceChange(agent.id, 'priority', priority)}
                            className={`flex-1 p-2 rounded-xl border capitalize transition-colors ${
                              preferences.find(p => p.agentId === agent.id)?.priority === priority
                                ? 'bg-blue-500 border-blue-600 text-white'
                                : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
                            }`}
                          >
                            {priority}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Notification Method</label>
                      <div className="flex gap-3">
                        {[
                          { id: 'voice', icon: <Volume2 className="w-4 h-4" /> },
                          { id: 'message', icon: <Bell className="w-4 h-4" /> },
                        ].map(method => (
                          <button
                            key={method.id}
                            onClick={() => {
                              const current = preferences.find(p => p.agentId === agent.id)?.notifyVia || [];
                              handlePreferenceChange(
                                agent.id,
                                'notifyVia',
                                current.includes(method.id as any)
                                  ? current.filter(m => m !== method.id)
                                  : [...current, method.id]
                              );
                            }}
                            className={`flex-1 p-2 rounded-xl border flex items-center justify-center gap-2 capitalize transition-colors ${
                              preferences.find(p => p.agentId === agent.id)?.notifyVia?.includes(method.id as any)
                                ? 'bg-blue-500 border-blue-600 text-white'
                                : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
                            }`}
                          >
                            {method.icon}
                            {method.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-[#2c2c2e] text-white/90 rounded-xl px-6 py-2 hover:bg-[#3c3c3e] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white rounded-xl px-6 py-2 hover:bg-blue-600 transition-colors"
              >
                {existingAssistant ? 'Save Changes' : 'Create Personal Assistant'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}