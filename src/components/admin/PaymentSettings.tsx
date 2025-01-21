import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, AlertCircle } from 'lucide-react';

interface PaymentSettings {
  paypal_client_id: string;
  paypal_client_secret: string;
  paypal_mode: 'sandbox' | 'live';
  currency: string;
}

export default function PaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>({
    paypal_client_id: '',
    paypal_client_secret: '',
    paypal_mode: 'sandbox',
    currency: 'USD'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load payment settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('payment_settings')
        .upsert(settings);

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Settings</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">PayPal Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Environment
                </label>
                <select
                  value={settings.paypal_mode}
                  onChange={e => setSettings({ ...settings, paypal_mode: e.target.value as 'sandbox' | 'live' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="live">Live (Production)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client ID
                </label>
                <input
                  type="text"
                  value={settings.paypal_client_id}
                  onChange={e => setSettings({ ...settings, paypal_client_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter PayPal Client ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={settings.paypal_client_secret}
                  onChange={e => setSettings({ ...settings, paypal_client_secret: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter PayPal Client Secret"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="NZD">NZD - New Zealand Dollar</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg">
              Settings saved successfully!
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}